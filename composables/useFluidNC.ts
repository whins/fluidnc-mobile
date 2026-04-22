/**
 * useFluidNC — core composable for FluidNC communication
 *
 * Architecture:
 *  - WebSocket (ws://[IP]:81)  → receive machine status stream only
 *  - HTTP GET /command?plain=  → send all commands (jog, home, run, etc.)
 *  - HTTP GET /upload?path=/   → list SD files
 *  - HTTP POST /upload         → upload file to SD
 *  - HTTP GET /upload?...action=delete → delete SD file
 */

import { useWebSocket } from "@vueuse/core";
import { computed, nextTick, onMounted, onUnmounted, readonly, ref, watch } from "vue";
import { useSettings } from "./useSettings";

// ─── Types ────────────────────────────────────────────────────────────────────

export type MachineState =
  | "Idle"
  | "Run"
  | "Hold"
  | "Jog"
  | "Alarm"
  | "Door"
  | "Check"
  | "Home"
  | "Sleep"
  | "Unknown";

export interface MachineStatus {
  state: MachineState;
  wpos: { x: number; y: number; z: number };
  mpos: { x: number; y: number; z: number };
  feedRate: number;
  spindleSpeed: number;
  sdPercent: number | null; // null = no SD job running
  /** Raw status string from FluidNC */
  raw: string;
}

export interface SDFile {
  name: string;
  size: number;
  path: string;
}

// ─── Status parser ────────────────────────────────────────────────────────────

/**
 * Parse FluidNC status string like:
 * <Run|WPos:10.000,20.000,0.000|Bf:15,128|FS:1500.000,0.000|SD:45.5>
 */
function parseStatus(raw: string): MachineStatus | null {
  const match = raw.match(/^<([^|>]+)(.*)>$/);
  if (!match) return null;

  const statePart = match[1]!;
  const rest = match[2]!;

  // State may include sub-state like "Hold:0"
  const state = (statePart ?? "Unknown").split(":")[0] as MachineState;

  const wpos = { x: 0, y: 0, z: 0 };
  const mpos = { x: 0, y: 0, z: 0 };
  let feedRate = 0;
  let spindleSpeed = 0;
  let sdPercent: number | null = null;

  const wposMatch = rest.match(/WPos:([-\d.]+),([-\d.]+),([-\d.]+)/);
  if (wposMatch) {
    wpos.x = parseFloat(wposMatch[1]!);
    wpos.y = parseFloat(wposMatch[2]!);
    wpos.z = parseFloat(wposMatch[3]!);
  }

  const mposMatch = rest.match(/MPos:([-\d.]+),([-\d.]+),([-\d.]+)/);
  if (mposMatch) {
    mpos.x = parseFloat(mposMatch[1]!);
    mpos.y = parseFloat(mposMatch[2]!);
    mpos.z = parseFloat(mposMatch[3]!);
  }

  // FS:feedrate,spindleSpeed
  const fsMatch = rest.match(/FS:([\d.]+),([\d.]+)/);
  if (fsMatch) {
    feedRate = parseFloat(fsMatch[1]!);
    spindleSpeed = parseFloat(fsMatch[2]!);
  }

  // SD:percent
  const sdMatch = rest.match(/SD:([\d.]+)/);
  if (sdMatch) {
    sdPercent = parseFloat(sdMatch[1]!);
  }

  return { state, wpos, mpos, feedRate, spindleSpeed, sdPercent, raw };
}

// ─── Parse SD file list ───────────────────────────────────────────────────────

/**
 * Parse FluidNC SD file listing response:
 * [FILE: test.nc|SIZE:1234]
 * [DIR: subfolder]
 */
function parseSDFileList(text: string): SDFile[] {
  const files: SDFile[] = [];
  const regex = /\[FILE:\s*([^|]+)\|SIZE:(\d+)\]/g;
  let m;
  while ((m = regex.exec(text)) !== null) {
    const name = m[1]!.trim();
    files.push({
      name,
      size: parseInt(m[2]!),
      path: name.startsWith("/") ? name : `/${name}`,
    });
  }
  return files;
}

// ─── Composable ───────────────────────────────────────────────────────────────

export function useFluidNC() {
  const settings = useSettings();

  // ── Reactive state ──────────────────────────────────────────────────────────
  const status = ref<MachineStatus>({
    state: "Unknown",
    wpos: { x: 0, y: 0, z: 0 },
    mpos: { x: 0, y: 0, z: 0 },
    feedRate: 0,
    spindleSpeed: 0,
    sdPercent: null,
    raw: "",
  });

  const connected = ref(false);
  const wsError = ref<string | null>(null);
  const commandLog = ref<string[]>([]);

  // ── WebSocket (status stream only) ──────────────────────────────────────────
  const wsUrl = computed(() => {
    const ip = settings.controllerIp.value;
    if (!ip) return null;
    // FluidNC WS port = HTTP port + 1 (default 81)
    return `ws://${ip}:82`;
  });

  let ws: ReturnType<typeof useWebSocket> | null = null;

  function connectWS() {
    const url = wsUrl.value;
    if (!url) {
      return;
    }

    debugger

    ws = useWebSocket(url, {
      autoReconnect: {
        retries: Infinity,
        delay: 3000,
        onFailed() {
          wsError.value = "WebSocket reconnect failed";
        },
      },
      heartbeat: {
        // FluidNC needs periodic pings to keep WS alive
        message: "?",
        interval: 2000,
        pongTimeout: 5000,
      },
      onConnected() {
        connected.value = true;
        wsError.value = null;
      },
      onDisconnected() {
        connected.value = false;
        status.value.state = "Unknown";
      },
      onError(_, event) {
        wsError.value = `WebSocket error: ${event.type}`;
      },
      onMessage(_, event) {
        const line: string =
          typeof event.data === "string" ? event.data.trim() : "";

        if (!line) return;

        // Status report lines start with '<'
        if (line.startsWith("<")) {
          const parsed = parseStatus(line);
          if (parsed) {
            status.value = parsed;
          }
          return;
        }

        // Log other messages (ok, error, [MSG:...])
        if (line !== "ok") {
          commandLog.value.unshift(line);
          if (commandLog.value.length > 100) commandLog.value.pop();
        }
      },
    });
  }

  function disconnectWS() {
    ws?.close();
    connected.value = false;
  }

  // Watch IP changes → reconnect
  watch(
    () => settings.controllerIp.value,
    (newIp) => {
      disconnectWS();
      if (newIp) {
        nextTick(() => connectWS());
      }
    },
  );

  // ── HTTP helpers ─────────────────────────────────────────────────────────────

  const baseUrl = computed(() => {
    const ip = settings.controllerIp.value;
    return ip ? `http://${ip}` : null;
  });

  /**
   * Send a command via HTTP GET /command?plain=CMD
   * Returns the response text or throws on error.
   */
  async function sendCommand(cmd: string): Promise<string> {
    const base = baseUrl.value;
    if (!base) throw new Error("No controller IP configured");

    const url = `${base}/command?plain=${encodeURIComponent(cmd)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });

    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    const text = await res.text();

    commandLog.value.unshift(`> ${cmd}`);
    if (commandLog.value.length > 100) commandLog.value.pop();

    return text;
  }

  /**
   * Check connectivity with a simple status query
   */
  async function ping(): Promise<boolean> {
    try {
      await sendCommand("?");
      return true;
    } catch {
      return false;
    }
  }

  // ── Machine commands ─────────────────────────────────────────────────────────

  /** Jog X/Y relatively. distance in mm, feedrate in mm/min */
  async function jog(axis: "X" | "Y", distance: number, feedrate = 2000) {
    // $J= uses G91 (relative), G21 (mm)
    await sendCommand(`$J=G91 G21 ${axis}${distance} F${feedrate}`);
  }

  /** Cancel current jog (realtime command 0x85) */
  async function jogCancel() {
    // realtime char - send as plain command byte via the /command endpoint
    await sendCommand("\x85");
  }

  /** Home all axes */
  async function homeAll() {
    await sendCommand("$H");
  }

  /** Home single axis */
  async function homeAxis(axis: "X" | "Y" | "Z") {
    await sendCommand(`$H${axis}`);
  }

  /** Feed Hold (pause) */
  async function feedHold() {
    await sendCommand("!");
  }

  /** Cycle Start / Resume */
  async function cycleStart() {
    await sendCommand("~");
  }

  /** Soft reset (Ctrl+X) */
  async function softReset() {
    await sendCommand("\x18");
  }

  /**
   * Set feedrate override percentage (10–200%)
   * FluidNC accepts: $O/F=percent  (override command)
   */
  async function setFeedrateOverride(percent: number) {
    const clamped = Math.max(10, Math.min(200, Math.round(percent)));
    await sendCommand(`$O/F=${clamped}`);
  }

  /**
   * Set laser (spindle) power override percentage (0–100%)
   * FluidNC: $O/S=percent
   */
  async function setLaserOverride(percent: number) {
    const clamped = Math.max(0, Math.min(100, Math.round(percent)));
    await sendCommand(`$O/S=${clamped}`);
  }

  // ── SD Card operations ───────────────────────────────────────────────────────

  /**
   * List files on SD card.
   * Uses /command?plain=$SD/List which returns file listing via WebSocket,
   * but also returns partial response via HTTP.
   * We use the dedicated /upload?path=/ GET endpoint for a synchronous list.
   */
  async function listSDFiles(): Promise<SDFile[]> {
    const base = baseUrl.value;
    if (!base) throw new Error("No controller IP configured");

    // /upload?path=/ returns JSON-ish or text listing of SD files
    const res = await fetch(`${base}/upload?path=/`, {
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();

    // Try JSON format (newer FluidNC versions)
    try {
      const json = JSON.parse(text);
      // Format: { files: [{name, size}], ...}
      if (json.files) {
        return json.files
          .filter(
            (f: { name: string; size: number }) => !f.name.startsWith("."),
          )
          .map((f: { name: string; size: number }) => ({
            name: f.name,
            size: f.size,
            path: f.name.startsWith("/") ? f.name : `/${f.name}`,
          }));
      }
    } catch {
      // Fall back to text parsing
    }

    return parseSDFileList(text);
  }

  /**
   * Run a G-code file from SD card
   */
  async function runSDFile(filename: string) {
    // Ensure leading slash
    const path = filename.startsWith("/") ? filename : `/${filename}`;
    await sendCommand(`$SD/Run=${path}`);
  }

  /**
   * Delete a file from SD card
   */
  async function deleteSDFile(filename: string) {
    const base = baseUrl.value;
    if (!base) throw new Error("No controller IP configured");

    const name = filename.startsWith("/") ? filename.slice(1) : filename;
    const url = `${base}/upload?path=/&filename=${encodeURIComponent(name)}&action=delete`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  }

  /**
   * Upload a file to SD card
   * @param file - File object from <input type="file">
   * @param onProgress - optional progress callback (0–100)
   */
  async function uploadSDFile(
    file: File,
    onProgress?: (percent: number) => void,
  ): Promise<void> {
    const base = baseUrl.value;
    if (!base) throw new Error("No controller IP configured");

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append("file", file, `/${file.name}`);

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve();
        else reject(new Error(`Upload failed: HTTP ${xhr.status}`));
      });

      xhr.addEventListener("error", () =>
        reject(new Error("Upload network error")),
      );
      xhr.addEventListener("abort", () => reject(new Error("Upload aborted")));

      xhr.open("POST", `${base}/upload`);
      xhr.send(formData);
    });
  }

  // ── Lifecycle ────────────────────────────────────────────────────────────────

  onMounted(() => {
    debugger
    if (settings.controllerIp.value) {
      connectWS();
    }
  });

  onUnmounted(() => {
    disconnectWS();
  });

  return {
    // State
    status: readonly(status),
    connected: readonly(connected),
    wsError: readonly(wsError),
    commandLog: readonly(commandLog),

    // Connection
    connectWS,
    disconnectWS,
    ping,

    // Commands
    sendCommand,
    jog,
    jogCancel,
    homeAll,
    homeAxis,
    feedHold,
    cycleStart,
    softReset,
    setFeedrateOverride,
    setLaserOverride,

    // SD Card
    listSDFiles,
    runSDFile,
    deleteSDFile,
    uploadSDFile,
  };
}
