import {MidiEvent, MidiNoteOnEvent} from "midi-file";
import { fromMidiSharps } from "@tonaljs/note";
import {TrackEvents, TrackNotes, TrackNoteEvents } from "../types";
import { range } from '../utils'

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

export function getTrackNotes(track: MidiEvent[], trackEvents: TrackEvents): TrackNotes {
  const { notes: noteOnEvents} = getNoteOnEvents(track)
  const sextuplet = trackEvents.semiQuaver / 3
  const triplet = sextuplet * 2
  const notesAtTick = [...range(0, trackEvents.endOfSong.tick, sextuplet)]
    .reduce((agg, tick) => {
      agg[tick] = []
      return agg
    }, {} as TrackNotes)

  // @ts-ignore
  noteOnEvents.forEach(({ tick, event}, index) => {
    const nextNote = index != noteOnEvents.length -1 ? noteOnEvents[index + 1] : noteOnEvents[noteOnEvents.length - 1]
    // @ts-ignore
    const nextNoteDelta = nextNote.tick - tick
    // This doesn't work because unlike the python lib the JS version uses a delta between notes
    if ([0, sextuplet].includes(nextNoteDelta % triplet) && typeof notesAtTick[tick] !== 'undefined') {
      notesAtTick[tick].push(fromMidiSharps((event as MidiNoteOnEvent).noteNumber))
    }
  })
  return notesAtTick
}