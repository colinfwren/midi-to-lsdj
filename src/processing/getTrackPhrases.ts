import {TrackEvents, TrackNotes, TrackSection, TrackPhrase, LSDJNote, LSDJTrack} from "../types";
import {MidiTimeSignatureEvent} from "midi-file";
import {distance, interval} from '@tonaljs/core'
import {getTimeSignatureinSemiQuavers, range, formatLSDJNoteName} from "../utils";

/**
 * Create an array of sections in the track based on the time signature changes in the track. Time signatures are used
 * as this will determine the number of notes in a bar and as LSDJ support a maximum of 16 semiquavers per bar there
 * may have to be special processing for 'interesting' time stamps
 *
 * @param {TrackEvents} trackEvents - Object containing the time signature changes in absolute tick resolution
 * @returns {TrackSection} - Array of objects detailing when each time signature begins, notes per phrase and duration
 */
export function getTrackSections(trackEvents: TrackEvents): TrackSection[] {
  return trackEvents.timeSignatures.map((timeSignature, index) => {
    const { numerator, denominator } = getTimeSignatureinSemiQuavers(timeSignature.event as MidiTimeSignatureEvent)
    const nextTimeSignature = index != trackEvents.timeSignatures.length - 1 ? trackEvents.timeSignatures[index + 1] : trackEvents.endOfSong
    const timeSignatureLength = nextTimeSignature.tick - timeSignature.tick
    return {
      tick: timeSignature.tick,
      timeSignature: `${numerator}/${denominator}`,
      notesPerBar: numerator,
      bars: Math.ceil(timeSignatureLength / (numerator * trackEvents.semiQuaver))
    }
  })
}

/**
 * Get the LSDJ phrases for the section of the track. Using the time signature's semiquaver resolution to determine if
 * there's more than 16 semiquavers in a bar, if there are then two or more phrases will need to be created
 *
 * @param {TrackSection} trackSection - The track section information
 * @param {number} trackSection.bars - The number of bars for the track section
 * @param {number} trackSection.tick - The tick that section starts at
 * @param {number} trackSection.notesPerBar - The number of semiquavers per bar in the time signature
 * @param {number} semiQuaver - The number of ticks in a semiquaver in the MIDI track
 * @returns {TrackPhrase[]} - An array of when a phrase stops and starts as the notes that fall within it
 */
export function getPhrasesForSection({ bars, tick, notesPerBar } : TrackSection, semiQuaver: number): TrackPhrase[] {
  return Array(bars).fill(0).map((_val, index) => {
    const startTick = tick + (index * (notesPerBar * semiQuaver))
    const endTick = startTick + (notesPerBar * semiQuaver)
    const phraseCount = parseInt(Math.ceil(notesPerBar / 16).toString())
    if (phraseCount === 1) {
      return [
        {
          noteCount: notesPerBar,
          startTick,
          endTick,
          noteIndexes: [...range(startTick, endTick, semiQuaver)]
        }
      ]
    } else {
      return Array(phraseCount).fill(0).map((_val, offsetIndex) => {
        const endOffset = endTick - (( notesPerBar % 16 ) * semiQuaver)
        const newStartTick = offsetIndex === 0 ? startTick : endOffset
        const newEndTick = offsetIndex === 0 ? endOffset : endTick
        const noteCount = offsetIndex === 0 ? 16 : (notesPerBar % 16)
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

/**
 * Create a base64 representation of the notes, commands and triplets that occur in a phrase. Used to determine if a
 * phrase is a duplicate later on
 *
 * @param {LSDJNote[]} notes - Array of notes in a phrase
 * @returns {string} - Base64 representation of the notes, commands and triplets in the phrase
 */
export function getPhrasesNotesAsBase64(notes: LSDJNote[]): string {
  const noteString = notes.map(note => `${note.notes.join('-')}-${note.command}- ${note.triplets.join('-')}`).join('-')
  const buffer = Buffer.from(noteString, 'utf-8')
  return buffer.toString('base64')
}

/**
 * Use the TonalJS distance function to determine the distance between a root (the note that falls on the
 * semiquaver tick) note to the triplet (the note that falls between the semiquaver tick) note in order to build
 * a delta that can then be used to create a 'transpose' value in a table command for the note
 *
 * @param {string} root - The note value of root note
 * @param {string} triplet - The note value of the triplet note
 * @returns {number} - The distance between the two notes
 */
export function calculateTripletDelta(root: string, triplet: string): number {
  const intervalName = distance(root, triplet)
  const intervalObj = interval(intervalName)
  return intervalObj.empty ? 0 : intervalObj.semitones
}

/**
 * Create an array of the phrases that make up the track using the time signature as a means to resolve the number of
 * LSDJ phrases needed for each bar. For each phrase create a list of notes that will be played on the 16th note
 * intervals and if there are triplets/sextuplets then create a transpose delta so tables can be created to handle this
 *
 * @param {TrackNotes} trackNotes - Map of the ticks in the track to the notes played on that tick
 * @param {TrackEvents} trackEvents - Track information such as time signature changes and semiquaver tick duration
 * @returns {LSDJTrack} - Track for LSDJ containing the phrases that make up the track
 */
export function getPhrasesForTrack(trackNotes: TrackNotes, trackEvents: TrackEvents): LSDJTrack {
  const sextuplet = trackEvents.semiQuaver / 3
  const trackSections = getTrackSections(trackEvents)
  return {
    chains: [],
    phrases: trackSections.map((section) => {
      return getPhrasesForSection(section, trackEvents.semiQuaver).map((trackPhrase) => {
        const notes = trackPhrase.noteIndexes.map((noteIndex) => {
          const tripletIndexes = [noteIndex + sextuplet, noteIndex + (sextuplet * 2)]
          const triplets = tripletIndexes.map((tripletIndex) => {
            const triplet = trackNotes[tripletIndex]
            if (triplet.length > 0) {
              return calculateTripletDelta(trackNotes[noteIndex][0], triplet[0])
            }
            return []
          }).flat()
          return {
            notes: trackNotes[noteIndex].map(formatLSDJNoteName),
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
    }).flat(),
    tables: []
  }
}