import { Type } from '@sinclair/typebox'
import type { LevelDataEntity } from '@sonolus/core'
import { getOptionalValue } from '.'
import type { Chart } from '../..'

export const parseInitializationToChart = (chart: Chart, [entity]: LevelDataEntity[]) => {
    if (entity?.archetype !== 'Initialization') return

    chart.attr = getOptionalValue(entity, 'color', initialLifeSchema) ?? 1
}

const initialLifeSchema = Type.Number({ minimum: 1, multipleOf: 1 })
