<script setup lang="ts">
import type { ShortenEarlyWindow } from '../../chart'
import { i18n } from '../../i18n'
import MultiSelectField from './MultiSelectField.vue'

const modelValue = defineModel<ShortenEarlyWindow | undefined>({ required: true })
</script>

<template>
    <MultiSelectField
        v-model="modelValue"
        :label="i18n.modals.form.shortenEarlyWindow.label"
        :options="[
            [i18n.modals.form.shortenEarlyWindow.none, 'none'],
            [i18n.modals.form.shortenEarlyWindow.perfect, 'perfect'],
            [i18n.modals.form.shortenEarlyWindow.great, 'great'],
            [i18n.modals.form.shortenEarlyWindow.good, 'good']
        ]"
    />
</template>
