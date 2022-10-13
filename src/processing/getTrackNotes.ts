import {MidiEvent, MidiNoteOnEvent} from "midi-file";
import {TrackEvents, TrackNotes, TrackNoteEvents } from "../types";
import {NOTES_MAP} from "../constants";

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
  // @ts-ignore
  const { tick: totalTicks, notes: noteOnEvents} = getNoteOnEvents(track)
  const noteIndexes = totalTicks / trackEvents.semiQuaver
  const notesAtTick: TrackNotes = Array(noteIndexes)
    .fill(0)
    .map((_val, idx) => idx * trackEvents.semiQuaver)
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
    if (nextNoteDelta % trackEvents.semiQuaver === 0 && typeof notesAtTick[tick] !== 'undefined') {
      notesAtTick[tick].push(NOTES_MAP[(event as MidiNoteOnEvent).noteNumber])
    }
  })
  return notesAtTick
}