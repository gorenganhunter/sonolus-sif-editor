import { EngineArchetypeDataName, type LevelDataEntity } from '@sonolus/core'
import type { NoteEntity } from '../../../state/entities/slides/note'
import type { Store } from '../../../state/store'

export const serializeSlidesToLevelDataEntities = (
    timeScaleGroupEntities: LevelDataEntity[],
    store: Store,
    getName: () => string,
) => {
    const entities: LevelDataEntity[] = []

    const noteEntities = new Map<NoteEntity, LevelDataEntity>()

    const getEntity = (note: NoteEntity) => {
        const entity = noteEntities.get(note)
        if (!entity) throw new Error('Unexpected missing entity')

        return entity
    }

    const allowSimLines = new Map<number, NoteEntity[]>()

    for (const infos of store.slides.info.values()) {
        let prev: LevelDataEntity | undefined
        let prevConnector: LevelDataEntity | undefined
        for (const [i, { note }] of infos.entries()) {
            const timeScaleGroup = timeScaleGroupEntities[note.group]
            if (!timeScaleGroup) throw new Error(`Unexpected missing group ${note.group}`)

            const entity: LevelDataEntity = {
                archetype: '',
                data: [
                    {
                        name: 'group',
                        ref: (timeScaleGroup.name ??= getName()),
                    },
                    {
                        name: EngineArchetypeDataName.Beat,
                        value: note.beat,
                    },
                    {
                        name: 'lane',
                        value: note.lane
                    },
                    // {
                    //     name: 'direction',
                    //     value: flickDirections[note.flickDirection],
                    // },
                    // {
                    //     name: 'isAttached',
                    //     value: +(i !== 0 && i !== infos.length - 1 && note.isAttached),
                    // },
                    // {
                    //     name: 'isSeparator',
                    //     value: +note.isConnectorSeparator,
                    // },
                    // {
                    //     name: 'connectorEase',
                    //     value: connectorEases[note.connectorEase],
                    // },
                    // {
                    //     name: 'segmentKind',
                    //     value:
                    //         note.connectorType === 'active'
                    //             ? note.connectorActiveIsFake
                    //                 ? note.connectorActiveIsCritical
                    //                     ? 52
                    //                     : 51
                    //                 : note.connectorActiveIsCritical
                    //                     ? 2
                    //                     : 1
                    //             : guideSegmentKinds[note.connectorGuideColor],
                    // },
                    // {
                    //     name: 'segmentAlpha',
                    //     value: note.connectorGuideAlpha,
                    // },
                    // {
                    //     name: 'segmentLayer',
                    //     value: segmentLayers[note.connectorLayer],
                    // },
                    // {
                    //     name: 'effectKind',
                    //     value: sfxs[note.sfx],
                    // },
                ],
            }
            entities.push(entity)
            noteEntities.set(note, entity)

            if (prev) {
                if (!prev.name) prev.name = getName()
                entity.name = getName()
            }
            // prev?.data.push({
            //     name: 'next',
            //     ref: (entity.name ??= getName()),
            // })
            prev = entity
        }

        let head: NoteEntity | undefined

        for (const [i, info] of infos.entries()) {
            const entity = getEntity(info.note)

            const isFirst = i === 0
            const isLast = i === infos.length - 1
            const isInActive = info.activeHead !== info.activeTail
            const isActiveHead = info.activeHead === info.note
            const isActiveTail = info.activeTail === info.note
            const isFlick = info.note.flickDirection !== "none"

            // entity.archetype = info.note.isFake ? 'Fake' : ''

            if (info.note.noteType === 'anchor') {
                entity.archetype += 'Ignored'
                /*else if (info.note.noteType === 'damage') {
                   entity.archetype += 'Accident'
               } else {*/
                // entity.archetype += info.note.isCritical ? 'Critical' : 'Normal'

                /*if (info.note.noteType === 'trace') {
                    if (isInActive)
                        entity.archetype += isActiveHead ? 'Head' : isActiveTail ? 'Tail' : ''
                    entity.archetype += isFlick ? 'TraceFlick' : 'Trace'
                } else if (info.note.noteType === 'forceTick') {
                    entity.archetype += 'Tick'*/
                // } else if (!isInActive) {
                //     entity.archetype += isFlick ? 'Flick' : 'Tap'
                // } else if (isActiveHead) {
                //     entity.archetype += isFlick ? 'HeadFlick' : 'HeadTap'
                // } else if (isActiveTail) {
                //     entity.archetype += isFlick ? 'TailFlick' : 'TailRelease'
            } else if (!isFirst && !isFlick) {
                entity.archetype += 'HoldTick'
            } else if (isFirst && !isLast) {
                entity.archetype += 'HoldStart'
            } else {
                entity.archetype += isFlick ? 'Flick' : 'Tap'
            }
            // }

            entity.archetype += 'Note'

            // const tick = Math.round(info.note.beat * beatToTicks)

            if (
                info.note.noteType === 'default' &&
                (isFirst || isFlick)
            ) {
                const notes = allowSimLines.get(info.note.beat)
                if (notes) {
                    notes.push(info.note)
                } else {
                    allowSimLines.set(info.note.beat, [info.note])
                }
            }

            if (isFlick) entity.data.push({
                name: 'direction',
                value: flickDirections[info.note.flickDirection]
            })

            if (info.note.shortenEarlyWindow !== 'none') entity.data.push({
                name: "shortenEarlyWindow",
                value: earlyWindows[info.note.shortenEarlyWindow]
            })

            // if (!isFirst && !isLast && info.note.isAttached) {
            //     entity.data.push(
            //         {
            //             name: 'attachHead',
            //             ref: (getEntity(info.attachHead).name ??= getName()),
            //         },
            //         {
            //             name: 'attachTail',
            //             ref: (getEntity(info.attachTail).name ??= getName()),
            //         },
            //     )
            // }
            //
            // if (isInActive && isActiveHead) {
            //     disallowHiddenTicks.add(tick)
            // }
            //
            // if (info.activeHead && isInActive && isActiveTail) {
            //     entity.data.push({
            //         name: 'activeHead',
            //         ref: (getEntity(info.activeHead).name ??= getName()),
            //     })
            // }

            if (head) {
                // if (
                //     info.segmentHead.connectorType === 'active' &&
                //     !info.segmentHead.connectorActiveIsFake
                // ) {
                //     const headTick = Math.round(head.beat * beatToTicks)
                //     for (
                //         let i = Math.ceil(headTick / ticksPerHidden) * ticksPerHidden;
                //         i < tick;
                //         i += ticksPerHidden
                //     ) {
                //         if (disallowHiddenTicks.has(i)) continue
                //
                //         entities.push({
                //             archetype: 'TransientHiddenTickNote',
                //             data: [
                //                 {
                //                     name: EngineArchetypeDataName.Beat,
                //                     value: i / beatToTicks,
                //                 },
                //                 {
                //                 
                //                     name: 'isAttached',
                //                     value: 1,
                //                 },
                //                 {
                //                     name: 'attachHead',
                //                     ref: (getEntity(info.attachHead).name ??= getName()),
                //                 },
                //                 {
                //                     name: 'attachTail',
                //                     ref: (getEntity(info.attachTail).name ??= getName()),
                //                 },
                //             ],
                //         })
                //     }
                // }

                const connector: LevelDataEntity = {
                    archetype: 'HoldConnector',
                    data: [
                        {
                            name: 'head',
                            ref: (getEntity(head).name ??= getName()),
                        },
                        {
                            name: 'tail',
                            ref: (entity.name ??= getName()),
                        },
                        // {
                        //     name: 'segmentHead',
                        //     ref: (getEntity(info.segmentHead).name ??= getName()),
                        // },
                        // {
                        //     name: 'segmentTail',
                        //     ref: (getEntity(info.segmentTail).name ??= getName()),
                        // },
                    ],
                }

                if (prevConnector) {
                    connector.data.push({
                        name: 'prev',
                        ref: prevConnector.name ??= getName()
                    })
                    prevConnector.data.push({
                        name: 'next',
                        ref: connector.name ??= getName()
                    })
                }

                // if (info.activeHead)
                //     connector.data.push({
                //         name: 'activeHead',
                //         ref: (getEntity(info.activeHead).name ??= getName()),
                //     })
                //
                // if (info.activeTail)
                //     connector.data.push({
                //         name: 'activeTail',
                //         ref: (getEntity(info.activeTail).name ??= getName()),
                //     })

                entities.push(connector)
                prevConnector = connector
            }

            head = info.note
        }
    }

    for (const notes of allowSimLines.values()) {
        if (notes.length < 2) continue

        notes.sort((a, b) => a.lane - b.lane)

        let prev: NoteEntity | undefined
        for (const note of notes) {
            if (prev) {
                entities.push({
                    archetype: 'SimLine',
                    data: [
                        {
                            name: 'l',
                            ref: (getEntity(prev).name ??= getName()),
                        },
                        {
                            name: 'r',
                            ref: (getEntity(note).name ??= getName()),
                        },
                    ],
                })
            }

            prev = note
        }
    }

    return entities
}

// const beatToTicks = 480
// const ticksPerHidden = beatToTicks / 2

const flickDirections = {
    none: 0,
    left: 0,
    right: 1,
    up: 2,
    down: 3
    // up: 0,
    // upLeft: 1,
    // upRight: 2,
    // down: 3,
    // downLeft: 4,
    // downRight: 5,
}

const earlyWindows = {
    none: 0,
    perfect: 1,
    great: 2,
    good: 3
}
//
// const sfxs = {
//     default: 0,
//     none: 1,
//     normalTap: 2,
//     criticalTap: 6,
//     normalFlick: 3,
//     criticalFlick: 7,
//     normalTrace: 4,
//     criticalTrace: 8,
//     normalTick: 5,
//     criticalTick: 9,
//     damage: 10,
// }
//
// const connectorEases = {
//     linear: 1,
//     in: 2,
//     out: 3,
//     inOut: 4,
//     outIn: 5,
//     none: 0,
// }
//
// const guideSegmentKinds = {
//     neutral: 101,
//     red: 102,
//     green: 103,
//     blue: 104,
//     yellow: 105,
//     purple: 106,
//     cyan: 107,
//     black: 108,
// }
//
// const segmentLayers = {
//     top: 0,
//     bottom: 1,
// }
