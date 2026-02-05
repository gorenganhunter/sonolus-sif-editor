import type { LevelData } from '@sonolus/core'
import type { Store } from '../state/store'
import { serializeToLevelDataEntities } from './entities/serialize'
import { beatToTime } from '../state/integrals/bpms'
import { bpms } from '../history/bpms'
import { state } from '../history'

export type SIFNoteData = {
  timing_sec: number
  notes_attribute: number
  notes_level: number
  effect: number
  effect_value: number
  position: number
  speed?: number
  vanish?: 0 | 1 | 2
}

export type SIFChart = SIFNoteData[]

export const serializeToSIFChart = (
  bgmOffset: number,
  store: Store,
  // groupCount: number,
): SIFChart => Array.from(store.slides.note.entries()).filter(([sid, notes]) => notes.length).flatMap(([sid, notes]) => notes.filter((n, i) => (notes.length === 1 || (notes.length > 1 && (notes[notes.length - 1]!.lane !== notes[notes.length - 2]!.lane || n.beat !== notes[notes.length - 1]!.beat)))).map((n): SIFNoteData => ({
  timing_sec: beatToTime(bpms.value, n.beat) + bgmOffset,
  effect:
    notes.length < 2 ?
      n.isStar ?
        4 :
        1 :
      (notes[notes.length - 1]!.lane === notes[notes.length - 2]!.lane) && (n.beat === notes[notes.length - 2]!.beat) ?
        notes.length > 2 ?
          13 :
          3 :
        n.isStar ?
          14 :
          11,
  effect_value: notes.length > 1 && (notes[notes.length - 1]!.lane === notes[notes.length - 2]!.lane) && (n.beat === notes[notes.length - 2]!.beat) ? beatToTime(bpms.value, notes[notes.length - 1]!.beat) - beatToTime(bpms.value, notes[notes.length - 2]!.beat) : 2,
  notes_attribute: state.value.attr || 2,
  notes_level: sid.id,
  position: n.lane + 5
}))).sort((a, b) => a.timing_sec - b.timing_sec)
