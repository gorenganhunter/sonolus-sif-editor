import type { Chart } from '../chart'
import type { Bgm } from './bgm'
import type { Entity } from './entities'
import { createBpms, type BpmIntegral } from './integrals/bpms'
// import { createTimeScales, type TimeScaleIntegral } from './integrals/timeScales'
import type { Store } from './store'
import { createStore } from './store/creates'

export type State = {
    filename?: string

    bgm: Bgm
    attr: number
    store: Store
    bpms: BpmIntegral[]
    // timeScales: TimeScaleIntegral[]
    // groupCount: number

    selectedEntities: Entity[]
}

export const createState = (chart: Chart, offset: number, filename?: string): State => {
    // const bpms = createBpms(chart)
    return {
        filename,

        bgm: { offset },
        attr: chart.attr,
        store: createStore(chart),
        bpms: createBpms(chart),
        // timeScales: createTimeScales(chart, bpms),
        // groupCount: chart.groupCount,

        selectedEntities: [],
    }
}
