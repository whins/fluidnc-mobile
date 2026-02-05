export type MachineState =
    | 'Idle'
    | 'Run'
    | 'Hold'
    | 'Alarm'
    | 'Door'
    | 'Home'
    | 'Jog'

export interface FluidStatus {
    state: MachineState
    mpos: [number, number, number]
    wpos: [number, number, number]
    feed: number
    spindle: number
}
