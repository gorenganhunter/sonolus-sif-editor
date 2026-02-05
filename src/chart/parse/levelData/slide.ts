import { Type } from '@sinclair/typebox'
import { EngineArchetypeDataName, type LevelDataEntity } from '@sonolus/core'
import {
    // getGroup,
    getOptionalRef,
    getOptionalValue,
    getRef,
    getValue,
    type ParseToChart,
    type TimeScaleNames,
} from '.'
import type { Chart, NoteObject } from '../..'
import { beatSchema } from './schemas'

export const parseSlidesToChart: ParseToChart = (chart, entities) => {
    const refs = new Map<string, NoteEntity>()
    const slides = new Map<number, NoteEntity[]>()
    const holdPrev = new Map<string, NoteEntity>()

    for (const entity of entities) {
        if (!isNoteEntity(entity)) continue
        if (entity.name) refs.set(entity.name, entity)

        if (entity.archetype === "TapNote") {
            if (!entity.name) {
                chart.slides.push([toNoteObject(chart, entity)])
                continue
            }
        }

        if (entity.archetype === "HoldNote") {
            holdPrev.set(entity.name!, refs.get(getRef(entity, "prev"))!)
            continue
        }

        const sid = getOptionalValue(entity, "slide", Type.Number())
        if (sid) {
            const slide = slides.get(sid)
            slides.set(sid, slide ? [...slide, entity] : [entity])
        }

        // let slide = slides.get(entity.name)
        // if (!slide) {
        //     slides.set(entity.name, (slide = [entity.name]))
        // }
        //
        // const nextName = getOptionalRef(entity, 'next')
        // if (nextName === undefined) continue
        //
        // const nextSlide = slides.get(nextName)
        // if (nextSlide) {
        //     slide.push(...nextSlide)
        //
        //     for (const name of nextSlide) {
        //         slides.set(name, slide)
        //     }
        // } else {
        //     slide.push(nextName)
        //     slides.set(nextName, slide)
        // }
    }

    for (const [endName, head] of new Set(holdPrev.entries())) {
        const end = refs.get(endName)!
        if (head.archetype === "SwingNote") {
            const sid = getOptionalValue(head, "slide", Type.Number())
            if (!sid) continue
            const slide = slides.get(sid)!
            slides.set(sid, [...slide, end])
            continue
        } else {
            chart.slides.push([toNoteObject(chart, head), toNoteObject(chart, end, head)])
        }
    }

    const swings: NoteObject[][] = []

    for (const entity of entities) {
        if (!isNoteEntity(entity) || entity.archetype !== "SwingNote" || getOptionalValue(entity, "slide", Type.Number())) continue
        const n = toNoteObject(chart, entity)
        let honk = false

        swings.forEach((s, i) => {
            if (honk) return
            if (!s.length) return
            const ln = s[s.length - 1]!
            if ((n.lane - ln.lane) === d[ln.flickDirection] && (n.beat - ln.beat) <= 0.5) {
                swings[i]!.push(n)
                honk = true
            }
        })

        if (honk) continue

        swings.push([n])
    }

    for (const [endName, head] of new Set(holdPrev.entries())) {
        const end = refs.get(endName)!
        if (!isNoteEntity(head) || head.archetype !== "SwingNote" || getOptionalValue(head, "slide", Type.Number())) continue

        const n = toNoteObject(chart, head)

        for (const [i, s] of Object.entries(swings)) {
            if (!s.length) return
            const ln = s[s.length - 1]!

            if (ln.beat === n.beat && ln.lane === n.lane) {
                swings[parseInt(i)]!.push(toNoteObject(chart, end, head))
                break
            }
        }

        // } else {
        //     chart.slides.push([toNoteObject(chart, head), toNoteObject(chart, end, head)])
        // }
    }

    chart.slides.push(...swings)

    // for (const entity of entities) {
    //     if (!isNoteEntity(entity)) continue
    //     if (!entity.name) continue
    //
    //     const prev = getOptionalRef(entity, "prev")
    //     if (prev) continue
    //
    //     let slide: string[] = []
    //     let note: LevelDataEntity | undefined = entity
    //     // used.push(slide[0]!)
    //
    //     while (true) {
    //         slide.push(note!.name!)
    //         used.push(note!.name!)
    //         const nextRef = getOptionalRef(note!, "next")
    //         if (!nextRef) break
    //         note = refs.get(nextRef)
    //     }
    //
    //     slides.set(slide[0]!, slide)
    // }
    //
    // for (const entity of entities) {
    //     if (!isNoteEntity(entity)) continue
    //     if (!entity.name) continue
    //     if (used.includes(entity.name)) continue
    //
    //     chart.slides.push([toNoteObject(chart, entity)])
    // }

    for (const slide of new Set(slides.values())) {
        // let prevActiveHead: NoteObject | undefined
        chart.slides.push(
            slide
                .map((entity) => {
                    return {
                        entity,
                        beat: getValue(entity, EngineArchetypeDataName.Beat, beatSchema),
                    }
                })
                .sort(({ beat: a }, { beat: b }) => a - b)
                .map(({ entity }, i) => {
                    const object = toNoteObject(
                        chart,
                        // timeScaleNames,
                        entity
                    )

                    // if (i === 0 || object.isConnectorSeparator) {
                    //     if (object.connectorType === 'active') {
                    //         prevActiveHead ??= object
                    //     } else {
                    // prevActiveHead = undefined
                    //     }
                    // }

                    return object
                }),
        )
    }
}

const noteArchetypeNames = [
    'TapNote',
    'SwingNote',
    'HoldNote',
] as const

type NoteArchetypeName = (typeof noteArchetypeNames)[number]

type NoteEntity = LevelDataEntity & { archetype: NoteArchetypeName }

const isNoteEntity = (entity: LevelDataEntity): entity is NoteEntity =>
    noteArchetypeNames.includes(entity.archetype as never)

const isAttachedSchema = Type.Number()

const laneSchema = Type.Number({ minimum: -4, maximum: 4 })

// const sizeSchema = Type.Number({ minimum: 0 })

const directionSchema = Type.Union([
    Type.Literal(-1),
    Type.Literal(1),
    // Type.Literal(2),
    // Type.Literal(3),
])

const directions = {
    [-1]: 'left',
    1: 'right',
    // 2: 'up',
    // 3: 'down'
    // 0: 'up',
    // 1: 'upLeft',
    // 2: 'upRight',
    // 3: 'down',
    // 4: 'downLeft',
    // 5: 'downRight',
} as const

const d = {
    left: -1,
    right: 1,
    none: 0
} as const

// const sfxSchema = Type.Union([
//     Type.Literal(0),
//     Type.Literal(1),
//     Type.Literal(2),
//     Type.Literal(3),
//     Type.Literal(4),
//     Type.Literal(5),
//     Type.Literal(6),
//     Type.Literal(7),
//     Type.Literal(8),
//     Type.Literal(9),
//     Type.Literal(10),
// ])
//
// const sfxs = {
//     0: 'default',
//     1: 'none',
//     2: 'normalTap',
//     3: 'normalFlick',
//     4: 'normalTrace',
//     5: 'normalTick',
//     6: 'criticalTap',
//     7: 'criticalFlick',
//     8: 'criticalTrace',
//     9: 'criticalTick',
//     10: 'damage',
// } as const
//
// const isSeparatorSchema = Type.Number()
//
// const segmentKindSchema = Type.Union([
//     Type.Literal(1),
//     Type.Literal(2),
//     Type.Literal(51),
//     Type.Literal(52),
//     Type.Literal(101),
//     Type.Literal(102),
//     Type.Literal(103),
//     Type.Literal(104),
//     Type.Literal(105),
//     Type.Literal(106),
//     Type.Literal(107),
//     Type.Literal(108),
// ])
//
// const segmentKinds = {
//     1: {
//         connectorType: 'active',
//         connectorActiveIsCritical: false,
//         connectorActiveIsFake: false,
//         connectorGuideColor: 'green',
//     },
//     2: {
//         connectorType: 'active',
//         connectorActiveIsCritical: true,
//         connectorActiveIsFake: false,
//         connectorGuideColor: 'yellow',
//     },
//     51: {
//         connectorType: 'active',
//         connectorActiveIsCritical: false,
//         connectorActiveIsFake: true,
//         connectorGuideColor: 'green',
//     },
//     52: {
//         connectorType: 'active',
//         connectorActiveIsCritical: true,
//         connectorActiveIsFake: true,
//         connectorGuideColor: 'yellow',
//     },
//     101: {
//         connectorType: 'guide',
//         connectorActiveIsCritical: false,
//         connectorActiveIsFake: false,
//         connectorGuideColor: 'neutral',
//     },
//     102: {
//         connectorType: 'guide',
//         connectorActiveIsCritical: false,
//         connectorActiveIsFake: false,
//         connectorGuideColor: 'red',
//     },
//     103: {
//         connectorType: 'guide',
//         connectorActiveIsCritical: false,
//         connectorActiveIsFake: false,
//         connectorGuideColor: 'green',
//     },
//     104: {
//         connectorType: 'guide',
//         connectorActiveIsCritical: false,
//         connectorActiveIsFake: false,
//         connectorGuideColor: 'blue',
//     },
//     105: {
//         connectorType: 'guide',
//         connectorActiveIsCritical: false,
//         connectorActiveIsFake: false,
//         connectorGuideColor: 'yellow',
//     },
//     106: {
//         connectorType: 'guide',
//         connectorActiveIsCritical: false,
//         connectorActiveIsFake: false,
//         connectorGuideColor: 'purple',
//     },
//     107: {
//         connectorType: 'guide',
//         connectorActiveIsCritical: false,
//         connectorActiveIsFake: false,
//         connectorGuideColor: 'cyan',
//     },
//     108: {
//         connectorType: 'guide',
//         connectorActiveIsCritical: false,
//         connectorActiveIsFake: false,
//         connectorGuideColor: 'black',
//     },
// } as const
//
// const connectorEaseSchema = Type.Union([
//     Type.Literal(0),
//     Type.Literal(1),
//     Type.Literal(2),
//     Type.Literal(3),
//     Type.Literal(4),
//     Type.Literal(5),
// ])
//
// const connectorEases = {
//     0: 'none',
//     1: 'linear',
//     2: 'in',
//     3: 'out',
//     4: 'inOut',
//     5: 'outIn',
// } as const
//
// const segmentAlphaSchema = Type.Number({ minimum: 0, maximum: 1 })
//
// const segmentLayerSchema = Type.Union([Type.Literal(0), Type.Literal(1)])
//
// const connectorLayers = {
//     0: 'top',
//     1: 'bottom',
// } as const

// const shortenEarlyWindowSchema = Type.Union([
//     Type.Literal(0),
//     Type.Literal(1),
//     Type.Literal(2),
//     Type.Literal(3)
// ])
//
// const earlyWindows = {
//     0: 'none',
//     1: 'perfect',
//     2: 'great',
//     3: 'good'
// } as const

// const trimStart = <T extends string, U extends string>(
//     name: T,
//     prefix: U,
// ): T extends `${U}${infer R}` ? R : T =>
//     (name.startsWith(prefix) ? name.slice(prefix.length) : name) as never
//
// const startsWith = <T extends string, U extends string>(
//     name: T,
//     prefix: U,
// ): T extends `${U}${infer R}` ? [true, R] : [false, T] =>
//     (name.startsWith(prefix) ? [true, name.slice(prefix.length)] : [false, name]) as never

const toNoteObject = (
    chart: Chart,
    // timeScaleNames: TimeScaleNames,
    entity: NoteEntity,
    prev?: NoteEntity
) => {
    const lane = getValue(prev ? prev : entity, 'lane', laneSchema)
    const direction = getOptionalValue(entity, 'direction', directionSchema)
    // const earlyCut = getOptionalValue(entity, 'shortenEarlyWindow', shortenEarlyWindowSchema)

    const object: NoteObject = {
        // group: getGroup(chart, timeScaleNames, entity),
        beat: getValue(entity, EngineArchetypeDataName.Beat, beatSchema),
        // noteType: 'default',
        lane,
        isStar: !!getOptionalValue(entity, "star", Type.Number()),
        flickDirection: direction === undefined ? "none" : directions[direction],
        // shortenEarlyWindow: earlyCut === undefined ? 'none' : earlyWindows[earlyCut]
    }

    // const [isFake, archetype1] = startsWith(entity.archetype, 'Fake')
    // object.isFake = isFake

    // if (entity.archetype === 'IgnoredNote') {
    //     object.noteType = 'anchor'
    // } else if (entity.archetype === "HoldTickNote") {
    //     object.noteType = 'default'
    // }
    /* else if (archetype1 === 'AccidentNote') {
    object.noteType = 'damage'
    object.flickDirection = 'none'

    return object
}*/

    // const archetype2 = trimStart(archetype1, 'Normal')
    // const [isCritical, archetype3] = startsWith(archetype2, 'Critical')
    // object.isCritical = isCritical

    // const [isTrace, archetype4] = startsWith(
    //     trimStart(trimStart(archetype3, 'Head'), 'Tail'),
    //     'Trace',
    // )
    // if (isTrace) {
    //     object.noteType = 'trace'
    //     if (archetype4 !== 'FlickNote') object.flickDirection = 'none'
    //
    //     return object
    // }

    // if (
    //     !prevActiveHead ||
    //     isLast ||
    //     (object.isConnectorSeparator && object.connectorType !== 'active')
    // ) {
    //     if (archetype4 === 'TickNote') object.noteType = 'forceTick'
    // } else {
    //     if (archetype4 !== 'TickNote') object.noteType = 'forceNonTick'
    // }

    if (entity.archetype !== 'SwingNote') object.flickDirection = 'none'

    return object
}
