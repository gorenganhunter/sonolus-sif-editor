<script setup lang="ts">
import type { NoteEntity } from '../../../state/entities/slides/note'
import { arrowComponents } from './arrow'
import { bodyComponents } from './body'
import { fakeMarkerComponent } from './fakeMarker'

defineProps<{
    entity: NoteEntity
    isHighlighted: boolean
}>()

const colors = {
    none: "blue",
    left: "red",
    right: "orange",
    up: "pink",
    down: "purple"
}

</script>

<template>
    <component
        :is="
            bodyComponents.single[
                colors[entity.flickDirection]
                /*entity.isCritical ? 'yellow' : entity.flickDirection !== 'none' ? 'red' : 'cyan'*/
            ]
        "
        :isStar="entity.isStar"
    />
    <!--component
        :is="arrowComponents[entity.isCritical ? 'yellow' : 'red'][entity.flickDirection]"
        v-if="entity.flickDirection !== 'none'"
        :size="1"
    />
    <component :is="fakeMarkerComponent" v-if="entity.isFake" :size="entity.size" /-->
</template>
