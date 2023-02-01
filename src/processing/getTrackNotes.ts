import {MidiEvent, MidiNoteOnEvent} from "midi-file";
import { fromMidiSharps } from "@tonaljs/note";
import {TrackEvents, TrackNotes, TrackNoteEvents } from "../types";
import { range } from '../utils'

/**
 * Get the absolute time resolution for when a note is played in the MIDI track
 *
 * @param {MidiEvent[]} track - Array of MIDI track events
 * @returns {TrackNoteEvents} - object containing note on events only
 */
export function getNoteOnEvents(track: MidiEvent[]): TrackNoteEvents {
  const trackNotesEvents: TrackNoteEvents = {
    tick: 0,
    notes: []
  }
  return track.reduce((agg, midiEvent) => {
    const tick = agg.tick + midiEvent.deltaTime
    if (midiEvent.type === 'noteOn') {
      return {
        tick,
        notes: [
          ...agg.notes,
          {
            tick,
            event: midiEvent
          }
        ]
      }
    }
    return {
      ...agg,
      tick
    }
  }, trackNotesEvents)
}

/**
 * Create a map of the notes played at a resolution of a semiquaver sextuplet using the tick as the key and notes played
 * at that tick as the value
 *
 * @param {MidiEvent[]} track - Array of events in the MIDI track
 * @param {TrackEvents} trackEvents - Object containing track information such as semiquaver duration and last tick in song
 * @returns {TrackNotes} - Map of absolute tick at semiquaver sextuplet resolution to notes played at that tick
 */
export function getTrackNotes(track: MidiEvent[], trackEvents: TrackEvents): TrackNotes {
  const { notes: noteOnEvents} = getNoteOnEvents(track)
  const sextuplet = trackEvents.semiQuaver / 3
  const triplet = sextuplet * 2
  const notesAtTick = [...range(0, trackEvents.endOfSong.tick, sextuplet)]
    .reduce((agg, tick) => {
      agg[tick] = []
      return agg
    }, {} as TrackNotes)

  noteOnEvents.forEach(({ tick, event}, index) => {
    const nextNote = index != noteOnEvents.length -1 ? noteOnEvents[index + 1] : noteOnEvents[noteOnEvents.length - 1]
    const nextNoteDelta = nextNote.tick ? nextNote.tick - tick : 0
    // This doesn't work because unlike the python lib the JS version uses a delta between notes
    if ([0, sextuplet].includes(nextNoteDelta % triplet) && typeof notesAtTick[tick] !== 'undefined') {
      notesAtTick[tick].push(fromMidiSharps((event as MidiNoteOnEvent).noteNumber))
    }
  })
  return notesAtTick
}