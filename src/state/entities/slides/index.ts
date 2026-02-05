import type { ConnectorEntity } from './connector'
import type { NoteEntity } from './note'

export type SlideEntity = NoteEntity | ConnectorEntity

declare const idBrand: unique symbol

export type SlideId = { [idBrand]: never, id: number }

let id = 0

export const createSlideId = () => ({ id: ++id }) as SlideId
