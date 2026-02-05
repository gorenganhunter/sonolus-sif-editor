<script setup lang="ts">
import { computed, useId } from 'vue'
import { bpms } from '../../../history/bpms'
import type { ConnectorEntity } from '../../../state/entities/slides/connector'
import { beatToTime } from '../../../state/integrals/bpms'
import { remap } from '../../../utils/math'
import { ups } from '../../view'
import { getColor } from './color'
import ConnectorFakeMarker from './ConnectorFakeMarker.vue'
import ConnectorGradient from './ConnectorGradient.vue'

const props = defineProps<{
    entity: ConnectorEntity
}>()

const id = useId()

const graphic = computed(() => {
    const { /*attachHead, attachTail,*/ head, tail/*, segmentHead, segmentTail*/ } = props.entity

    // const tAttachHead = beatToTime(bpms.value, attachHead.beat)
    // const tAttachTail = beatToTime(bpms.value, attachTail.beat)
// console.log(1, head, tail)
    const tHead = beatToTime(bpms.value, head.beat)
    const tTail = beatToTime(bpms.value, tail.beat)
// console.log(2, tHead, tTail)
    // const lHead = remap(tAttachHead, tAttachTail, attachHead.left, attachTail.left, tHead)
    // const lTail = remap(tAttachHead, tAttachTail, attachHead.left, attachTail.left, tTail)
    //
    // const sHead = remap(tAttachHead, tAttachTail, attachHead.size, attachTail.size, tHead)
    // const sTail = remap(tAttachHead, tAttachTail, attachHead.size, attachTail.size, tTail)

    const xHead = head.lane
    const yHead = tHead * ups.value

    const xTail = tail.lane
    const yTail = tTail * ups.value

    // const { fill, gradient } = getColor(id, segmentHead, segmentTail, tHead, tTail)
    const fill = xHead === xTail ? "#ffffff55" : "#00ffff55"
    const w = xHead === xTail ? 0.5 : 0.05

    return {
        polygon: {
            points: `${xHead - w},${yHead} ${xTail - w},${yTail} ${xTail + w},${yTail} ${xHead + w},${yHead}`,
            fill,
        },
        // gradient,
    }
})
</script>

<template>
    <!--ConnectorGradient v-if="graphic.gradient" v-bind="graphic.gradient" /-->
    <polygon v-bind="graphic.polygon" />
    <!--ConnectorFakeMarker :entity /-->
</template>
