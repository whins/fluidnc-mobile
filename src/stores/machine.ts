import { defineStore } from 'pinia'
import type { FluidStatus } from '@/types/fluidnc'

export const useMachineStore = defineStore('machine', {
    state: (): FluidStatus => ({
        state: 'Idle',
        mpos: [0, 0, 0],
        wpos: [0, 0, 0],
        feed: 0,
        spindle: 0,
    }),

    actions: {
        update(status: FluidStatus) {
            Object.assign(this, status)
        },
    },
})
