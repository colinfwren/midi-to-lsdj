import {TrackEvents, TrackNotes, TrackSection, TrackPhrase, LSDJPhrase, LSDJNote} from "../types";
import {MidiTimeSignatureEvent} from "midi-file";
import {getTimeSignatureinSemiQuavers, range} from "../utils";
import { NOTES_MAP } from "../constants";

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
  return Array(bars).fill(0).map((_val, index) => {
    const startTick = tick + (index * (notesPerPhrase * semiQuaver))
    const endTick = startTick + (notesPerPhrase * semiQuaver)
    const phraseCount = parseInt(Math.ceil(notesPerPhrase / 16) as any)
    if (phraseCount === 1) {
      return [
        {
          noteCount: notesPerPhrase,
          startTick,
          endTick,
          noteIndexes: [...range(startTick, endTick, semiQuaver)]
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
          noteIndexes: [...range(newStartTick, newEndTick, semiQuaver)]
        }
      })
    }
  }).flat()
}

export function getPhrasesNotesAsBase64(notes: LSDJNote[]): string {
  const noteString = notes.map(note => `${note.notes.join('-')}-${note.command}- ${note.triplets.join('-')}`).join('-')
  const buffer = Buffer.from(noteString, 'utf-8')
  return buffer.toString('base64')
}

export function calculateTripletDelta(root: string[], triplet: string[]): number {
  if (root.length > 0 && triplet.length > 0) {
    const rootNote = root[0]
    const tripletNote = triplet[0]
    if ((tripletNote.indexOf('F') > -1 || tripletNote.indexOf('G') > -1) && (rootNote.indexOf('F') < 0 || rootNote.indexOf('G') < 0)) {
      return NOTES_MAP.indexOf(tripletNote) + 12 - NOTES_MAP.indexOf(rootNote)
    }
    return NOTES_MAP.indexOf(tripletNote) - NOTES_MAP.indexOf(rootNote)
  }
  return 0
}

export function getPhrasesForTrack(trackNotes: TrackNotes, trackEvents: TrackEvents): LSDJPhrase[] {
  // Go through each time signature and break the song into phrases based on the number of notes per phrase
  const sextuplet = trackEvents.semiQuaver / 3
  const trackSections = getTrackSections(trackEvents)
  return trackSections.map((section) => {
    return getPhrasesForSection(section, trackEvents.semiQuaver).map((trackPhrase) => {
      const notes = trackPhrase.noteIndexes.map((noteIndex) => {
        const tripletIndexes = [noteIndex + sextuplet, noteIndex + (sextuplet * 2)]
        const triplets = tripletIndexes.map((tripletIndex) => {
          const triplet = trackNotes[tripletIndex]
          if (triplet.length > 0) {
            return calculateTripletDelta(trackNotes[noteIndex], triplet)
          }
          return []
        }).flat()
        return {
          notes: trackNotes[noteIndex],
          command: '',
          triplets
        }
      })
      const paddedNotes = trackPhrase.noteCount < 16 ? [ ...notes, { notes: [], command: 'H00', triplets: [] }] : notes
      return {
        ...trackPhrase,
        noteIndexes: undefined,
        notes: paddedNotes,
        key: getPhrasesNotesAsBase64(paddedNotes)
      }
    })
  }).flat()
}