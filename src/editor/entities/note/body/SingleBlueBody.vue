<script setup lang="ts">
defineProps<{
    isStar: boolean
}>()
</script>

<template>
    <circle :cx="0" :cy="0" :r="0.5" class="scale-stroke" stroke-width="0.05" stroke="#fff" />
    <text :x="0" :y="0" v-if="isStar" text-anchor="middle" dominant-baseline="middle" fill="#ffff5555" font-size="1">☆</text>
    <!--rect x="0" y="0" :width="size" height="0.8" rx="0.1" ry="0.1" fill="#aabfff" />
    <rect x="0.1" y="0.1" :width="size - 0.2" height="0.6" rx="0.1" ry="0.1" fill="#e6edff" />
    <rect x="0.1" y="0.3" width="0.2" height="0.2" fill="#0f0" />
    <rect :x="size - 0.3" y="0.3" width="0.2" height="0.2" fill="#0f0" /-->
</template>
