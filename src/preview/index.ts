import { computed } from 'vue'
import { view } from '../editor/view'
import { bpms } from '../history/bpms'
import { timeScales } from '../history/timeScales'
import { timeToBeat } from '../state/integrals/bpms'
import { beatToKey } from '../state/store/grid'
import { computedRange } from '../utils/range'
import { noteDuration } from './note'

export const scaledTimes = computed(() => {
    return {
        min: view.cursorTime,
        max: view.cursorTime + noteDuration.value,
    }
})

export const times = computed(() => ({
    min: view.cursorTime,
    max: scaledTimes.value.max,
}))

export const beats = computed(() => ({
    min: timeToBeat(bpms.value, times.value.min),
    max: timeToBeat(bpms.value, times.value.max),
}))

export const keys = computedRange(() => ({
    min: Math.floor(beats.value.min),
    max: Math.ceil(beats.value.max - 1),
}))
