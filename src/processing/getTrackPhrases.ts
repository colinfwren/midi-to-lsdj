import {TrackEvents, TrackNotes, TrackSection, TrackPhrase, LSDJPhrase} from "../types";
import {MidiTimeSignatureEvent} from "midi-file";
import {getTimeSignatureinSemiQuavers} from "../utils";

export function getTrackSections(trackEvents: TrackEvents): TrackSection[] {
  return trackEvents.timeSignatures.map((timeSignature, index) => {
    const { numerator, denominator } = getTimeSignatureinSemiQuavers(timeSignature.event as MidiTimeSignatureEvent)
    const nextTimeSignature = index != trackEvents.timeSignatures.length - 1 ? trackEvents.timeSignatures[index + 1] : trackEvents.endOfSong
    const timeSignatureLength = nextTimeSignature.tick - timeSignature.tick
    return {
      tick: timeSignature.tick,
      timeSignature: `${numerator}/${denominator}`,
      notesPerPhrase: numerator,
      bars: Math.ceil(timeSignatureLength / (numerator * trackEvents.semiQuaver))
    }
  })
}

export function getPhrasesForSection({ bars, tick, notesPerPhrase } : TrackSection, semiQuaver: number): TrackPhrase[] {
  return Array(bars).fill(0).map((val, index) => {
    const startTick = tick + (index * (notesPerPhrase * semiQuaver))
    const endTick = startTick + (notesPerPhrase * semiQuaver)
    const phraseCount = parseInt(Math.ceil(notesPerPhrase / 16) as any)
    if (phraseCount === 1) {
      return [
        {
          noteCount: notesPerPhrase,
          startTick,
          endTick,
          noteIndexes: Array((endTick - startTick) / semiQuaver)
            .fill(0)
            .map((_val, idx) => (idx * semiQuaver) + startTick)
        }
      ]
    } else {
      return Array(phraseCount).fill(0).map((_val, offsetIndex) => {
        const endOffset = endTick - (( notesPerPhrase % 16 ) * semiQuaver)
        const newStartTick = offsetIndex === 0 ? startTick : endOffset
        const newEndTick = offsetIndex === 0 ? endOffset : endTick
        const noteCount = offsetIndex === 0 ? 16 : (notesPerPhrase % 16)
        return {
          noteCount,
          startTick: newStartTick,
          endTick: newEndTick,
          noteIndexes: Array((newEndTick - newStartTick) / semiQuaver)
            .fill(0)
            .map((_val, idx) => (idx * semiQuaver) + newStartTick)
        }
      })
    }
  }).flat()
}

export function getPhrasesForTrack(trackNotes: TrackNotes, trackEvents: TrackEvents): LSDJPhrase[] {
  // Go through each time signature and break the song into phrases based on the number of notes per phrase
  const trackSections = getTrackSections(trackEvents)
  return trackSections.map((section) => {
    return getPhrasesForSection(section, trackEvents.semiQuaver).map((trackPhrase) => {
      const notes = trackPhrase.noteIndexes.map((noteIndex) => ({
        notes: trackNotes[noteIndex],
        command: ''
      }))
      return {
        ...trackPhrase,
        noteIndexes: undefined,
        notes: trackPhrase.noteCount < 16 ? [ ...notes, { notes: [], command: 'H00' }] : notes
      }
    })
  }).flat()
}