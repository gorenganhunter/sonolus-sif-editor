<script setup lang="ts">
import { computed, ref, useTemplateRef, watch, type Ref } from 'vue'
import { time } from '../time'
// import { zoom } from './events'
import LevelPreviewStage from './LevelPreviewStage.vue'
import LevelPreviewNotes from './LevelPreviewNotes.vue'
import LevelPreviewConnectors from './LevelPreviewConnectors.vue'
// import LevelPreviewHoldNotes from './LevelPreviewHoldNotes.vue'
// import LevelPreviewDragNotes from './LevelPreviewDragNotes.vue'
// import LevelPreviewFlickNotes from './LevelPreviewFlickNotes.vue'
import { getTransform } from './projection'

const minAspectRatio = 433 / 250

const container: Ref<Element | null> = useTemplateRef('container')

const aspectRatio = ref(minAspectRatio)
        
const t = 0.5
const b = -0.75

watch(time, () => {
    if (!container.value) return

    const rect = container.value.getBoundingClientRect()
    aspectRatio.value = Math.max(minAspectRatio, rect.width / rect.height)
})

//const transform = computed(() => `scale(1, -1) ${getTransform(zoom.value)}`)
</script>

<template>
    <svg
        ref="container"
        class="size-full"
        :viewBox="`${-aspectRatio} -1 ${aspectRatio * 2} 2`"
        font-size="0.15"
        stroke="none"
        stroke-width="0.01"
        fill="none"
    >
        <g mask="url(#screen)">
            <mask id="screen">
                <rect x="-5" y="-5" width="10" height="10" fill="#fff" fill-opacity="0.25" />
                <rect
                    :x="-minAspectRatio"
                    y="-1"
                    :width="minAspectRatio * 2"
                    height="2"
                    fill="#fff"
                />
            </mask>

            <g transform="scale(1.25, 1.25) translate(0, -0.5)">
                <LevelPreviewStage />
                <LevelPreviewConnectors />
                <LevelPreviewNotes />
                <!--LevelPreviewHoldNotes />
                <LevelPreviewDragNotes />
                <LevelPreviewFlickNotes /-->
            </g>
        </g>

        <rect
            :x="-minAspectRatio"
            y="-1"
            :width="minAspectRatio * 2"
            height="2"
            stroke="#fff"
            stroke-opacity="0.55"
        />
    </svg>
</template>

<style scoped>
.preview {
    background: url('./bg.png') center / cover;
}
</style>
