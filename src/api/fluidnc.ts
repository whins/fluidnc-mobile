import type { FluidStatus } from "@/types/fluidnc"

type StatusCallback = (status: FluidStatus) => void
type LogCallback = (line: string) => void


class FluidNCClient {
    private ws?: WebSocket
    private statusCb?: StatusCallback
    private url!: string

    constructor(host = 'fluidnc.local') {
        this.url = `ws://${host}/ws`
    }

    setUrl(wsUrl: string) {
        this.disconnect()
        this.url = wsUrl
        this.connect()
    }

    connect() {
        if (this.ws) return

        this.ws = new WebSocket(this.url)

        this.ws.onopen = () => {
            console.log('[FluidNC] connected')
        }

        this.ws.onclose = () => {
            console.log('[FluidNC] disconnected')
            this.ws = undefined
            setTimeout(() => this.connect(), 2000)
        }

        this.ws.onerror = (e) => {
            console.error('[FluidNC] ws error', e)
        }

        this.ws.onmessage = (event) => {
            this.handleMessage(event.data)
        }
    }

    disconnect() {
        this.ws?.close()
        this.ws = undefined
    }

    onStatus(cb: StatusCallback) {
        this.statusCb = cb
    }

    send(cmd: string) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) { return }
        this.ws.send(JSON.stringify({ cmd }))
    }

    private handleMessage(data: string) {
        try {
            const msg = JSON.parse(data)

            if (msg?.status) {
                const s = msg.status
                this.statusCb?.({
                    state: s.state,
                    mpos: s.mpos,
                    wpos: s.wpos,
                    feed: s.feed,
                    spindle: s.spindle,
                })
                return
            }

            // інші JSON повідомлення
            this.logCb?.(JSON.stringify(msg))
        } catch {
            // plain text → в лог
            this.logCb?.(data)
        }
    }


    reset() {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) { return }
        this.ws.send('\x18')
    }

    async listFiles(): Promise<string[]> {
        const res = await fetch('/files')
        const data = await res.json()
        return data.files ?? []
    }

    async uploadFile(file: File) {
        const form = new FormData()
        form.append('file', file)

        await fetch('/upload', {
            method: 'POST',
            body: form,
        })
    }

    runFile(name: string) {
        this.send(`$SD/Run=${name}`)
    }

    pause() {
        this.send('!')
    }

    resume() {
        this.send('~')
    }

    stop() {
        this.reset()
    }

    private logCb?: LogCallback

    onLog(cb: LogCallback) {
        this.logCb = cb
    }

}

export const fluidnc = new FluidNCClient()
