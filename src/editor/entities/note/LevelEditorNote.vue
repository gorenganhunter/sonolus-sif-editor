<script setup lang="ts">
import { computed } from 'vue'
import { noteComponents } from '.'
import { bpms } from '../../../history/bpms'
import { store } from '../../../history/store'
import type { NoteEntity } from '../../../state/entities/slides/note'
import { beatToTime } from '../../../state/integrals/bpms'
import { isViewRecentlyActive, ups } from '../../view'

const props = defineProps<{
    entity: NoteEntity
    isHighlighted: boolean
}>()

const time = computed(() => beatToTime(bpms.value, props.entity.beat))

const infos = computed(() => store.value.slides.info.get(props.entity.slideId))

const type = computed(() => {
    const { entity } = props

    if (entity.noteType === 'anchor') return 'anchor'

    // if (entity.noteType === 'damage') return 'damage'
    //
    // if (entity.noteType === 'trace') return 'trace'
    //
    // if (entity.noteType === 'forceTick') return 'tick'
    if (entity.flickDirection !== "none") return 'single'

    if (!infos.value) return 'single'

    const infoEntity = entity.useInfoOf ?? entity
    const info = infos.value.find((info) => info.note === infoEntity)
    if (info) {
        // console.log(entity, info)
        if (info.segmentHead === info.segmentTail) return 'single'

        if (info.segmentHead === infoEntity) return 'head'
        //
        // if (info.segmentTail === infoEntity) return 'tail'

        if (infoEntity.noteType === 'default') return 'tick'

        return 'single'
    }

    if (!infos.value.length) return 'single'

    let isActive = true
    let i = 0
    // for (; i < infos.value.length; i++) {
    //     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    //     const { note } = infos.value[i]!
    //
    //     if (entity.beat < note.beat) break
    //
    //     if (i === 0/* || note.isConnectorSeparator*/) {
    //         isActive = note.connectorType === 'active'
    //     }
    // }

    if (isActive) {
        // if (!infos.value[i]) return 'tick'
        //
        // if (entity.isConnectorSeparator && entity.connectorType === 'guide') return 'tail'

        return 'tick'
    } else if (!infos.value[i - 1]) {
        // if (entity.connectorType === 'guide') return 'single'

        return 'head'
    } else {
        if (!infos.value[i]) return 'single'

/*        if (entity.isConnectorSeparator && entity.connectorType === 'active')*/ return 'head'

        return 'single'
    }
})
</script>

<template>
    <g :transform="`translate(${entity.lane}, ${time * ups})`">
        <component :is="noteComponents[type]" :entity :is-highlighted="isHighlighted" />
        <text
            v-if="entity.group && (isHighlighted || isViewRecentlyActive)"
            :x="1"
            y="0.4"
            font-size="0.4"
            text-anchor="middle"
            dominant-baseline="middle"
            fill="#0aa"
        >
            #{{ entity.group }}
        </text>
        <text
            v-if="entity.shortenEarlyWindow !== 'none'"
            :x="0.6"
            y="-0.4"
            font-size="0.4"
            text-anchor="start"
            dominant-baseline="middle"
            fill="#b00"
        >
            -{{ entity.shortenEarlyWindow }}
        </text>
    </g>
</template>
