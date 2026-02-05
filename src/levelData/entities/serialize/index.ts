import type { Store } from '../../../state/store'
import { serializeBpmsToLevelDataEntities } from './bpm'
import { serializeSlidesToLevelDataEntities } from './slide'
// import {
//     serializeTimeScaleChangesToLevelDataEntities,
//     serializeTimeScaleGroupsToLevelDataEntities,
// } from './timeScale'

export const serializeToLevelDataEntities = (store: Store) => {
    let id = 0
    const getName = () => (id++).toString(16)

    const bpmEntities = serializeBpmsToLevelDataEntities(store)
    //
    // const timeScaleGroupEntities = serializeTimeScaleGroupsToLevelDataEntities(groupCount)
    // const timeScaleChangeEntities = serializeTimeScaleChangesToLevelDataEntities(
    //     timeScaleGroupEntities,
    //     store,
    //     getName,
    // )

    const slideEntities = serializeSlidesToLevelDataEntities(store, getName)

    return [...bpmEntities, ...slideEntities]
}

export const getStoreEntities = <T>(map: Map<number, Set<T>>) => {
    const entities = new Set<T>()

    for (const set of map.values()) {
        for (const entity of set) {
            entities.add(entity)
        }
    }

    return entities
}
