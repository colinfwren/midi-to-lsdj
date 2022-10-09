import { MidiEvent, MidiNoteOnEvent} from "midi-file";
import {NOTES_MAP} from "./constants";
import Phrase from './models/phrase'

type TrackEvents = {
  timeSignatures: MidiEvent[],
  endOfSong: MidiEvent,
  tempos: MidiEvent[],
  semiQuaver: number
}

type TrackNotes = {
  [key: number]: string[]
}

export function getTrackEvents(track: MidiEvent[], ticksPerBeat: number = 480): TrackEvents {
  const semiQuaver = (ticksPerBeat / 2) / 2
  const timeSignatures: MidiEvent[] = []
  const endOfSongs: MidiEvent[] = []
  const tempos: MidiEvent[] = []
  track.forEach((midiEvent: MidiEvent) => {
    switch(midiEvent.type) {
      case 'timeSignature':
        timeSignatures.push(midiEvent)
        break;
      case 'endOfTrack':
        endOfSongs.push(midiEvent)
        break;
      case 'setTempo':
        tempos.push(midiEvent)
        break;
      default:
        break;
    }
  })
  return {
    timeSignatures,
    endOfSong: endOfSongs[0],
    tempos,
    semiQuaver
  }
}

export function getTrackNotes(track: MidiEvent[], trackEvents: TrackEvents): TrackNotes {
  // @ts-ignore
  const { tick: totalTicks, notes: noteOnEvents} : { tick: number, notes: [ { tick: number, note: MidiEvent }] } = track.reduce((agg, midiEvent) => {
    const tick = agg.tick + midiEvent.deltaTime
    if (midiEvent.type === 'noteOn' && !midiEvent.running) {
      return {
        tick,
        notes: [
          ...agg.notes,
          {
            tick,
            note: midiEvent
          }
        ]
      }
    }
    return {
      ...agg,
      tick
    }
  }, { tick: 0, notes: []})

  const notesAtTick: TrackNotes = Array(totalTicks / trackEvents.semiQuaver)
    .fill(0)
    .map((_val, idx) => idx * trackEvents.semiQuaver)
    .reduce((agg, tick) => {
      agg[tick] = []
      return agg
    }, {} as TrackNotes)

  noteOnEvents.forEach(({ tick, note}, index) => {
    const nextNote = index != noteOnEvents.length -1 ? noteOnEvents[index + 1] : noteOnEvents[noteOnEvents.length - 1]
    const nextNoteDelta = nextNote.tick - tick
    // This doesn't work because unlike the python lib the JS version uses a delta between notes
    if (nextNoteDelta % trackEvents.semiQuaver === 0) {
      notesAtTick[tick].push(NOTES_MAP[(note as MidiNoteOnEvent).noteNumber])
    }
  })
  return notesAtTick
}

export function getTrackPhrases(notes: TrackNotes, trackEvents: TrackEvents): Phrase[] {
  // for each time signature go through
}

export function dedupeTrackPhrases(phrases: Phrase[]): Phrase[] {

}

export function getTrackChains(phrases: Phrase[]): TrackChains {

}