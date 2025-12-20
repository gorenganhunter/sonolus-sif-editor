import type { LevelData } from '@sonolus/core'
import type { Store } from '../state/store'
import { serializeToLevelDataEntities } from './entities/serialize'
import { beatToTime } from '../state/integrals/bpms'
import { bpms } from '../history/bpms'

export const serializeToLevelData = (
    bgmOffset: number,
    store: Store,
    groupCount: number,
): LevelData => {
    let firstBeat = Infinity
    let lastBeat = -Infinity
    let duration = 0
    for (const note of store.grid.note.values()) {
        note.forEach(n => {
            if (n.beat < firstBeat) firstBeat = n.beat
            if (n.beat > lastBeat) lastBeat = n.beat
        })
    }
    if (firstBeat !== Infinity && lastBeat !== -Infinity) {
        duration = beatToTime(bpms.value, lastBeat) - beatToTime(bpms.value, firstBeat)
    }
    const data = {
        bgmOffset,
        entities: [
            {
                archetype: 'Initialization',
                data: [
                    {
                        name: 'life',
                        value: Math.floor(duration / 6) + 1
                    }
                ],
            },
            {
                archetype: 'Stage',
                data: []
            },
            ...serializeToLevelDataEntities(store, groupCount),
        ],
    }
    // console.log(store, data)
    return data
}
