<script setup lang="ts">
import { ref, shallowReactive } from 'vue'
import { i18n } from '../../../i18n'
import FormModal from '../../../modals/form/FormModal.vue'
import NumberField from '../../../modals/form/NumberField.vue'
import { view } from '../../view'
import { state } from '../../../history'

// const props = defineProps<{
//     attr: number
// }>()

defineEmits<{
    close: [attr?: number]
}>()

const model = ref(state.value.attr)
</script>

<template>
    <FormModal
        :title="i18n.commands.attr.modal.title"
        @close="$emit('close')"
        @submit="$emit('close', model)"
    >
        <NumberField
            v-model="model"
            :label="i18n.commands.attr.modal.title"
            :min="1"
            :step="1"
        />
    </FormModal>
</template>
