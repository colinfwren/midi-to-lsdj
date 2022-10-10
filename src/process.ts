import {MidiEvent, MidiNoteOnEvent, MidiTimeSignatureEvent} from "midi-file";
import {NOTES_MAP} from "./constants";
import Phrase, { PhraseObj } from './models/phrase'

type TrackEvent = {
  tick: number,
  event: MidiEvent
}

type TrackEvents = {
  timeSignatures: TrackEvent[],
  endOfSong: TrackEvent,
  tempos: TrackEvent[],
  semiQuaver: number
}

type TrackNotes = {
  [key: number]: string[]
}

export function getTrackEvents(track: MidiEvent[], ticksPerBeat: number = 480): TrackEvents {
  const trackEvents = track.reduce((agg: { tick: number, events: TrackEvents }, midiEvent: MidiEvent) => {
    const tick = agg.tick + midiEvent.deltaTime
    switch(midiEvent.type) {
      case 'timeSignature':
        return {
          tick,
          events: {
            ...agg.events,
            timeSignatures: [
              ...agg.events.timeSignatures,
              {
                tick,
                event: midiEvent
              }
            ]
          }
        }
      case 'endOfTrack':
        return {
          tick,
          events: {
            ...agg.events,
            endOfSong: {
              tick,
              event: midiEvent
            }
          }
        }
      case 'setTempo':
        return {
          tick,
          events: {
            ...agg.events,
            tempos: [
              ...agg.events.tempos,
              {
                tick,
                event: midiEvent
              }
            ]
          }
        }
      default:
        return agg
    }
  }, {
    tick: 0,
    events: {
      timeSignatures: [],
      endOfSong: {} as any,
      tempos: [],
      semiQuaver: (ticksPerBeat / 2) / 2
    }
  })
  return trackEvents.events
}

export function getTrackNotes(track: MidiEvent[], trackEvents: TrackEvents): TrackNotes {
  // @ts-ignore
  const { tick: totalTicks, notes: noteOnEvents} : { tick: number, notes: TrackEvent[] } = track.reduce((agg, midiEvent) => {
    const tick = agg.tick + midiEvent.deltaTime
    if (midiEvent.type === 'noteOn' && !midiEvent.running) {
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
  }, { tick: 0, notes: []})
  const noteIndexes = totalTicks / trackEvents.semiQuaver
  const notesAtTick: TrackNotes = Array(noteIndexes)
    .fill(0)
    .map((_val, idx) => idx * trackEvents.semiQuaver)
    .reduce((agg, tick) => {
      agg[tick] = []
      return agg
    }, {} as TrackNotes)

  noteOnEvents.forEach(({ tick, event}, index) => {
    const nextNote = index != noteOnEvents.length -1 ? noteOnEvents[index + 1] : noteOnEvents[noteOnEvents.length - 1]
    const nextNoteDelta = nextNote.tick - tick
    // This doesn't work because unlike the python lib the JS version uses a delta between notes
    if (nextNoteDelta % trackEvents.semiQuaver === 0) {
      notesAtTick[tick].push(NOTES_MAP[(event as MidiNoteOnEvent).noteNumber])
    }
  })
  return notesAtTick
}

export function getTrackPhrases(notes: TrackNotes, trackEvents: TrackEvents): Phrase[] {
  // for each time signature go through
  return trackEvents.timeSignatures.reduce((phrases: Phrase[], timeSignature, index) => {
    const nextTimeSignature = index != trackEvents.timeSignatures.length - 1 ? trackEvents.timeSignatures[index + 1] : trackEvents.endOfSong
    const fractionResolution = 16 / (timeSignature.event as MidiTimeSignatureEvent).denominator
    const notesPerPhrase = (timeSignature.event as MidiTimeSignatureEvent).numerator * fractionResolution
    const timeSignatureLength = nextTimeSignature.tick - timeSignature.tick
    const timeSignatureBars = Math.ceil(timeSignatureLength / (notesPerPhrase * trackEvents.semiQuaver))
    Array(timeSignatureBars).fill(0).map((_val, phraseIndex) => {
      const startTick = timeSignature.tick + (phraseIndex * (notesPerPhrase * trackEvents.semiQuaver))
      const endTick = startTick + (notesPerPhrase * trackEvents.semiQuaver)
      const phraseCount = parseInt(Math.ceil(notesPerPhrase / 16) as any) + 1
      if (phraseCount > 1) {
        Array(phraseCount).fill(0).map((_val, offsetIndex) => {
          const endOffset = endTick - (( notesPerPhrase % 16 ) * trackEvents.semiQuaver)
          const newStartTick = offsetIndex === 0 ? startTick : endOffset
          const newEndTick = offsetIndex === 0 ? endOffset : endTick
          const noteCount = offsetIndex === 0 ? 16 : (notesPerPhrase % 16)
          const noteIndexes = (newEndTick - newStartTick) / trackEvents.semiQuaver
          const noteEvents = Array(noteIndexes)
            .fill(0)
            .map((_val, idx) => {
              const noteIndex = (idx * trackEvents.semiQuaver) + newStartTick
              return {
                notes: notes[noteIndex],
                command: ''
              }
            })
          const phrase = new Phrase(
            noteCount,
            newStartTick,
            newEndTick,
            `${(timeSignature.event as MidiTimeSignatureEvent).numerator}/${(timeSignature.event as MidiTimeSignatureEvent).denominator}`,
            noteEvents
          )
          phrases.push(phrase)
        })
      } else {
        const noteIndexes = (endTick - startTick) / trackEvents.semiQuaver
        const noteEvents = Array(noteIndexes)
          .fill(0)
          .map((_val, idx) => {
            const noteIndex = (idx * trackEvents.semiQuaver) + startTick
            return {
              notes: notes[noteIndex],
              command: ''
            }
          })
        const phrase = new Phrase(
          notesPerPhrase,
          startTick,
          endTick,
          `${(timeSignature.event as MidiTimeSignatureEvent).numerator}/${(timeSignature.event as MidiTimeSignatureEvent).denominator}`,
          noteEvents
        )
        phrases.push(phrase)
      }
    })
    return phrases
  }, [])
}
//
// export function dedupeTrackPhrases(phrases: Phrase[]): Phrase[] {
//
// }
//
// export function getTrackChains(phrases: Phrase[]): TrackChains {
//
// }