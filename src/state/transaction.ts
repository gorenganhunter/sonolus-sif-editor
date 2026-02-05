import type { State } from '.'
import { view } from '../editor/view'
import type { Entity } from './entities'
import type { SlideId } from './entities/slides'
import { calculateBpms, type BpmIntegral } from './integrals/bpms'
// import { calculateTimeScales, type TimeScaleIntegral } from './integrals/timeScales'
import { rebuildSlide } from './mutations/slides'

export type Transaction = ReturnType<typeof createTransaction>

export const createTransaction = (state: State) => {
    const grid = createMapObjectTransaction(state.store.grid)
    const slides = createMapObjectTransaction(state.store.slides)
    const dirtySlideIds = new Set<SlideId>()
    // state.store.slides.note.get(0)[0]?.
    // let groupCount = state.groupCount

    let bpms: BpmIntegral[] | undefined
    // let timeScales: TimeScaleIntegral[] | undefined

    return {
        store: {
            grid: grid.accessor,
            slides: slides.accessor,

            markDirty(slideId: SlideId) {
                dirtySlideIds.add(slideId)
            },
        },

        // addToGroup: (group: number) => {
        //     groupCount = Math.max(groupCount, group + 2)
        // },

        get bpms() {
            return (bpms ??= [...state.bpms])
        },
        // get timeScales() {
        //     return (timeScales ??= [...state.timeScales])
        // },

        commit(selectedEntities: Entity[]): State {
            if (bpms) bpms = calculateBpms(bpms)
            // if (bpms || timeScales)
            //     timeScales = calculateTimeScales(bpms ?? state.bpms, timeScales ?? [...state.timeScales.filter(({ group }) => group === view.group)])

            for (const slideId of dirtySlideIds) {
                rebuildSlide(this.store, slideId, selectedEntities)
            }

            return {
                bgm: state.bgm,
                attr: state.attr,
                store: {
                    grid: {
                        ...state.store.grid,
                        ...grid.value,
                    },
                    slides: {
                        ...state.store.slides,
                        ...slides.value,
                    },
                },
                bpms: bpms ?? state.bpms,
                // timeScales: timeScales ?? state.timeScales,
                // groupCount,

                selectedEntities,
            }
        },
    }
}

const createMapObjectTransaction = <T extends Record<string, Map<unknown, unknown>>>(object: T) => {
    const value: Record<string, Map<unknown, unknown>> = {}

    return {
        accessor: Object.defineProperties(
            {},
            Object.fromEntries(
                Object.entries(object).map(([k, v]) => [
                    k,
                    {
                        get: () => (value[k] ??= new Map(v)),
                    },
                ]),
            ),
        ) as T,

        value: value as Partial<T>,
    }
}
