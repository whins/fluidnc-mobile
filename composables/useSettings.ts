import { useLocalStorage } from "@vueuse/core";

/**
 * useSettings — persistent app settings via localStorage
 */
export function useSettings() {
  const config = useRuntimeConfig();
  const defaultIp = config.public.defaultIp as string || "";

  const controllerIp = useLocalStorage<string>("fluidnc:ip", defaultIp);
  if (!controllerIp.value && defaultIp) {
    controllerIp.value = defaultIp;
  }
  const locale = useLocalStorage<"en" | "uk">("fluidnc:locale", "en");
  const jogFeedrate = useLocalStorage<number>("fluidnc:jog-feedrate", 2000);
  const jobControls = useLocalStorage<boolean>("fluidnc:job-controls", true);
  const moreHomeBtns = useLocalStorage<boolean>(
    "fluidnc:more-home-btns",
    false,
  );
  const colorMode = useLocalStorage<"light" | "dark" | "auto">(
    "fluidnc:theme",
    "auto",
  );
  
  const simulationEnabled = useLocalStorage<boolean>("fluidnc:sim-enabled", false);
  const simulatedConnected = useLocalStorage<boolean>("fluidnc:sim-connected", false);
  const simulatedState = useLocalStorage<string>("fluidnc:sim-state", "Idle");

  return {
    controllerIp,
    locale,
    colorMode,
    jogFeedrate,
    jobControls,
    moreHomeBtns,
    simulationEnabled,
    simulatedConnected,
    simulatedState,
  };
}
