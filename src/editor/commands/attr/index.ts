import type { Command } from '..'
import { pushState, state } from '../../../history'
import { i18n } from '../../../i18n'
import { showModal } from '../../../modals'
import { notify } from '../../notification'
import TextIcon from '../TextIcon.vue'
import AttrModal from './AttrModal.vue'

export const attr: Command = {
    title: () => i18n.value.commands.attr.title,
    icon: {
        is: TextIcon,
        props: {
            title: 'ATTR',
            class: 'text-[#00f]',
        },
    },

    async execute() {
        const newAttr = await showModal(AttrModal, {
            attr: state.value.attr,
        })
        if (!newAttr) return

        pushState(() => i18n.value.commands.attr.changed, {
            ...state.value,
            attr: newAttr,
        })

        notify(() => i18n.value.commands.attr.changed)
    },
}
