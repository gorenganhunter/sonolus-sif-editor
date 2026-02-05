<script setup lang="ts">
import type { NoteEntity } from '../../../state/entities/slides/note'
import { arrowComponents } from './arrow'
import { bodyComponents } from './body'
import { fakeMarkerComponent } from './fakeMarker'

defineProps<{
    // entity: NoteEntity
    // isHighlighted: boolean
}>()
</script>

<template>
    <circle :cx="0" :cy="0" :r="0.5"
        class="scale-stroke" stroke-width="0.05" stroke="#ffffff55" fill="#ffffff55" />
</template>
