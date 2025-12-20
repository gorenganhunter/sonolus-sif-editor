import type { SlideId } from '.'
import type { BaseEntity } from '..'
import type {
    // ConnectorEase,
    // ConnectorGuideColor,
    // ConnectorLayer,
    // ConnectorType,
    FlickDirection,
    NoteObject,
    // NoteSfx,
    NoteType,
    ShortenEarlyWindow,
} from '../../../chart'

export type NoteEntity = BaseEntity & {
    type: 'note'
    hitbox: object

    slideId: SlideId
    group: number
    noteType: NoteType
    lane: number
    // spawnLane: number
    // isAttached: boolean
    flickDirection: FlickDirection
    shortenEarlyWindow: ShortenEarlyWindow
    // isFake: boolean
    // sfx: NoteSfx
    // isConnectorSeparator: boolean
    // connectorType: ConnectorType
    // connectorEase: ConnectorEase
    // connectorLayer: ConnectorLayer
    // connectorActiveIsCritical: boolean
    // connectorActiveIsFake: boolean
    // connectorGuideColor: ConnectorGuideColor
    // connectorGuideAlpha: number

    useInfoOf?: NoteEntity
}

export const toNoteEntity = (
    slideId: SlideId,
    object: NoteObject,
    useInfoOf?: NoteEntity,
): NoteEntity => ({
    type: 'note',
    hitbox: {
        lane: object.lane,
        beat: object.beat,
        w: 1 / 2,
        h: 0.4,
    },

    slideId,
    group: object.group,
    beat: object.beat,
    noteType: object.noteType,
    // isAttached: object.isAttached,
    lane: object.lane,
    // spawnLane: object.spawnLane,
    flickDirection: object.flickDirection,
    shortenEarlyWindow: object.shortenEarlyWindow,
    // isFake: object.isFake,

    useInfoOf,
})
