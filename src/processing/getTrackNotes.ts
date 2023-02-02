import { Midi } from '@tonejs/midi'
import { fromMidiSharps } from "@tonaljs/note";
import { TrackNotes } from "../types";
import { range } from '../utils'

/**
 * Create a map of the notes played at a resolution of a semiquaver sextuplet using the tick as the key and notes played
 * at that tick as the value
 *
 * @param {Midi} data - Midi instance
 * @param {number} trackIndex - Index of the track in the Midi instance to process
 * @returns {TrackNotes} - Map of absolute tick at semiquaver sextuplet resolution to notes played at that tick
 */
export function getTrackNotes(data: Midi, trackIndex: number): TrackNotes {
  const semiquaver = (data.header.ppq / 2) / 2
  const sextuplet =  semiquaver / 3
  const triplet = sextuplet * 2
  const notesAtTick = [...range(0, data.durationTicks, sextuplet)]
    .reduce((agg, tick) => {
      agg[tick] = []
      return agg
    }, {} as TrackNotes)
  const track = data.tracks[trackIndex]
  track.notes.forEach(({ ticks, midi}, index) => {
    const nextNote = index != track.notes.length -1 ? track.notes[index + 1] : track.notes[track.notes.length - 1]
    const nextNoteDelta = nextNote.ticks ? nextNote.ticks - ticks : 0
    // This doesn't work because unlike the python lib the JS version uses a delta between notes
    if ([0, sextuplet].includes(nextNoteDelta % triplet) && typeof notesAtTick[ticks] !== 'undefined') {
      notesAtTick[ticks].push(fromMidiSharps(midi))
    }
  })
  return notesAtTick
}