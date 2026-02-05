import type { LevelData } from '@sonolus/core'
import type { Store } from '../state/store'
import { serializeToLevelDataEntities } from './entities/serialize'
import { beatToTime } from '../state/integrals/bpms'
import { bpms } from '../history/bpms'
import { state } from '../history'

export const serializeToLevelData = (
    bgmOffset: number,
    store: Store,
    // groupCount: number,
): LevelData => {
    const data = {
        bgmOffset,
        entities: [
            {
                archetype: 'Initialization',
                data: [
                    {
                        name: 'color',
                        value: state.value.attr
                    }
                ],
            },
            {
                archetype: 'Stage',
                data: []
            },
            ...serializeToLevelDataEntities(store/*, groupCount*/),
        ],
    }
    // console.log(store, data)
    return data
}
