<script setup lang="ts">
import { i18n } from '../../../i18n'
// import OptionalConnectorActiveIsStarField from '../../../modals/form/OptionalConnectorActiveIsStarField.vue'
// import OptionalConnectorActiveIsFakeField from '../../../modals/form/OptionalConnectorActiveIsFakeField.vue'
// import OptionalConnectorEaseField from '../../../modals/form/OptionalConnectorEaseField.vue'
// import OptionalConnectorGuideAlphaField from '../../../modals/form/OptionalConnectorGuideAlphaField.vue'
// import OptionalConnectorGuideColorField from '../../../modals/form/OptionalConnectorGuideColorField.vue'
// import OptionalConnectorLayerField from '../../../modals/form/OptionalConnectorLayerField.vue'
// import OptionalConnectorTypeField from '../../../modals/form/OptionalConnectorTypeField.vue'
// import OptionalFlickDirectionField from '../../../modals/form/OptionalFlickDirectionField.vue'
// import OptionalIsAttachedField from '../../../modals/form/OptionalIsAttachedField.vue'
// import OptionalIsConnectorSeparatorField from '../../../modals/form/OptionalIsConnectorSeparatorField.vue'
import OptionalIsStarField from '../../../modals/form/OptionalIsStarField.vue'
// import OptionalIsFakeField from '../../../modals/form/OptionalIsFakeField.vue'
// import OptionalNoteTypeField from '../../../modals/form/OptionalNoteTypeField.vue'
// import OptionalSfxField from '../../../modals/form/OptionalSfxField.vue'
// import OptionalSizeField from '../../../modals/form/OptionalSizeField.vue'
import PresetField from '../../../modals/form/PresetField.vue'
import PropertiesModal from '../../../modals/form/PropertiesModal.vue'
import { settings } from '../../../settings'
import {
    defaultNoteProperties,
    defaultNotePropertiesPresetIndex,
    setDefaultNotePropertiesPreset,
} from '../../tools/note'
import { useProperties } from '../../utils/properties'

const createModel = useProperties(() => defaultNoteProperties.value, setDefaultNotePropertiesPreset)

// const noteType = createModel('noteType')
// const isAttached = createModel('isAttached')
// const size = createModel('size')
const isStar = createModel('isStar')
// const flickDirection = createModel('flickDirection')
// const isFake = createModel('isFake')
// const sfx = createModel('sfx')
// const isConnectorSeparator = createModel('isConnectorSeparator')
// const connectorType = createModel('connectorType')
// const connectorEase = createModel('connectorEase')
// const connectorActiveIsStar = createModel('connectorActiveIsStar')
// const connectorActiveIsFake = createModel('connectorActiveIsFake')
// const connectorGuideColor = createModel('connectorGuideColor')
// const connectorGuideAlpha = createModel('connectorGuideAlpha')
// const connectorLayer = createModel('connectorLayer')
</script>

<template>
    <PropertiesModal :title="i18n.commands.note.modal.title">
        <!--PresetField
            v-model="defaultNotePropertiesPresetIndex"
            :count="settings.defaultNotePropertiesPresets.length"
        />
        <OptionalNoteTypeField v-model="noteType" />
        <OptionalIsAttachedField v-model="isAttached" />
        <OptionalSizeField v-model="size" /-->
        <OptionalIsStarField v-model="isStar" />
        <!--OptionalFlickDirectionField v-model="flickDirection" />
        <OptionalIsFakeField v-model="isFake" />
        <OptionalSfxField v-model="sfx" />
        <OptionalIsConnectorSeparatorField v-model="isConnectorSeparator" />
        <OptionalConnectorTypeField v-model="connectorType" />
        <OptionalConnectorEaseField v-model="connectorEase" />
        <OptionalConnectorActiveIsStarField v-model="connectorActiveIsStar" />
        <OptionalConnectorActiveIsFakeField v-model="connectorActiveIsFake" />
        <OptionalConnectorGuideColorField v-model="connectorGuideColor" />
        <OptionalConnectorGuideAlphaField v-model="connectorGuideAlpha" />
        <OptionalConnectorLayerField v-model="connectorLayer" /-->
    </PropertiesModal>
</template>
