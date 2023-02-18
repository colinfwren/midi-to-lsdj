import {Midi} from "@tonejs/midi";
import {convertToHex, pipe} from "../utils";
import {note as tonalNote} from "@tonaljs/core";
import { fromMidi } from "@tonaljs/note";
import {calculateNoteDelta} from "./getTrackPhrases";
import {NoteInfo, TrackPitchBend, TrackPitchBends} from "../types";



/**
 * Convert BPM to LSDJ compatible hex. LSDJ uses 28-FF to map BPM of 40-255 and 0-27 to map 256-295
 *
 * @param {number} bpm - The BPM of the tempo
 * @returns {string} Hex value representing the BPM mapped to LSDJ's rules
 */
export function convertTempoToHex(bpm: number): string {
  if (bpm < 40) {
    return convertToHex(40)
  }
  else if (bpm >= 40 && bpm <= 255) {
    return convertToHex(bpm)
  } else if (bpm > 255 && bpm < 295) {
    return convertToHex(bpm - 256)
  }
  return convertToHex(39)
}

/**
 * Search for a tempo event at the note's tick and if there is one then convert the new BPM to hex and set the T command
 *
 * @param {NoteInfo} noteInfo - Information about the note used to process the tempo command
 * @returns {NoteInfo} - new NoteInfo instance with tempo command or unaltered NoteInfo if no tempo set
 */
export function processTempoCommand(noteInfo: NoteInfo): NoteInfo {
  const { noteIndex, midiData } = noteInfo
  if (noteIndex === 0) return noteInfo
  const tempoAtTick = midiData.header.tempos.find((tempo) => tempo.ticks === noteIndex)
  if (tempoAtTick) {
    const tempoAsHex = convertTempoToHex(tempoAtTick.bpm)
    return {
      ...noteInfo,
      command: `T${tempoAsHex}`
    }
  }
  return noteInfo
}

/**
 * Calculate the delta between the notes in a chord and then using LSDJ's chord rules return the appropriate hex value
 * for use with the chord command
 *
 * @param {string[]} notes - Notes in the chord
 * @returns {string} - The hex value that represents the chord based on LSDJ's chord rules
 */
export function convertChordToHex(notes: string[]): string {
  const [baseNote, ...rest] = notes
    .map((note) => tonalNote(note).midi as number)
    .sort((a, b) => a-b)
    .map((midiNote) => fromMidi(midiNote))
  const arpNotes =  [...rest, baseNote]
  const deltas = [
    calculateNoteDelta(baseNote, arpNotes[0]),
    calculateNoteDelta(baseNote, arpNotes[1])
  ].map((delta) => delta > 15 ? 15 : delta)
  return `${convertToHex(deltas[0]).charAt(1)}${convertToHex(deltas[1]).charAt(1)}`
}

/**
 * Calculate the pitch value for a sweep based on the pitch bend's value
 *
 * @param {TrackPitchBend} pitchBend - Pitch bend value and duration
 * @returns {string} - hex value representing pitch increase/decrease for sweep
 */
export function getSweepPitchAsHex(pitchBend: TrackPitchBend): string {
  const pitchVals = [0, 0.3, 0.6, 0.9, 1.2, 1.5, 1.8, 2]
  const fullPitchVals = [...pitchVals, 'b', -2, -1.8, -1.5, -1.2, -0.9, -0.6, -0.3]
  const mappedPitchVal = pitchVals.reduce((prev, curr) => Math.abs(curr - Math.abs(pitchBend.value)) < Math.abs(prev - Math.abs(pitchBend.value)) ? curr : prev)
  const signedMappedPitchVal = pitchBend.value < 0 ? mappedPitchVal * -1 : mappedPitchVal
  const mappedPitchValIndex = fullPitchVals.indexOf(signedMappedPitchVal)
  return convertToHex(mappedPitchValIndex).charAt(1)
}

/**
 * Calculate the sweep speed based on the pitch bend's duration and the number of ticks in a crotchet
 *
 * @param {TrackPitchBend} pitchBend - Pitch bend value and duration
 * @param {number} ppq - number of ticks in a crotchet
 * @returns {string} - hex value representing speed of sweeo
 */
export function getSweepSpeedAsHex(pitchBend: TrackPitchBend, ppq: number): string {
  const noteTickLengths = [4, 2, 1, 0.5, 0.25, 0.125, 0.0625].map((duration) => ppq * duration)
  const mappedNoteDuration = noteTickLengths.reduce((prev, curr) => Math.abs(curr - pitchBend.duration) < Math.abs(prev - pitchBend.duration) ? curr : prev)
  const noteTickIndex = noteTickLengths.indexOf(mappedNoteDuration)
  return convertToHex((noteTickIndex  + 1)* 2).charAt(1)
}

/**
 * Map the pitchbend's value and duration to LSDJ's sweep command's time and pitch increase/decrease values
 *
 * @param {TrackPitchBend} pitchBend - Pitch bend value and duration
 * @param {number} ppq - number of ticks in a crotchet
 * @returns {string} - The hex value that represents the sweep based on LSDJ's sweep rules
 */
export function convertPitchBendToHex(pitchBend: TrackPitchBend, ppq: number): string {
  const pitchAsHex = getSweepPitchAsHex(pitchBend)
  const speedAsHex = getSweepSpeedAsHex(pitchBend, ppq)
  return `${speedAsHex}${pitchAsHex}`
}

/**
 * Add a chord command if there is more than one note and there's not alread a Hop, Tempo, Kill, Table, Delay, Retrigger
 * command on the note
 *
 * @param {NoteInfo} noteInfo - Information about the note used to process the chord command
 * @returns {NoteInfo} - new NoteInfo instance with chord command if applicable
 */
export function processChordCommand(noteInfo: NoteInfo): NoteInfo {
  const { notes, command, isPercussion } = noteInfo
  if (['H', 'T', 'K', 'A', 'D', 'R'].includes(command.charAt(0)) || notes.length < 2 || isPercussion) return noteInfo
  const chordAsHex = convertChordToHex(notes)
  return {
    ...noteInfo,
    command: `C${chordAsHex}`
  }
}

/**
 * Add a Sweep command if there is a pitch bend on the note and there's not already a Hop, Tempo, Kill, Table, Deplay,
 * Retrigger or Chord command on the note
 *
 * @param {NoteInfo} noteInfo - Information about the note used to process the sweep command
 * @returns {NoteInfo} - new NoteInfo instance with sweep command if applicable
 */
export function processSweepCommand(noteInfo: NoteInfo): NoteInfo {
  const { pitchBends, command, noteIndex, midiData } = noteInfo
  const pitchBend = pitchBends.get(noteIndex)
  if (['H', 'T', 'K', 'A', 'D', 'R', 'C'].includes(command.charAt(0)) || typeof pitchBend === 'undefined') return noteInfo
  const pitchBendAsHex = convertPitchBendToHex(pitchBend, midiData.header.ppq)
  return {
    ...noteInfo,
    command: `S${pitchBendAsHex}`
  }
}

// TODO: Add new command processors here, check value of NoteInfo.command before processing, add processor for table when get to lower priority processors

/**
 * Return the appropriate command for tempo change, chords or pitch bend events that fall on the tick for the note
 *
 * @param {number} noteIndex - The tick that the note falls on
 * @param {Midi} midiData - The data from the midi file
 * @param {string[]} notes - The notes on the tick
 * @param {boolean} hasTuplet - If the note has tuplet or not
 * @param {TrackPitchBends} pitchBends - Map of pitch bends in the track
 * @param {boolean} isPercussion - If the track the note belongs to is a percussion track
 * @returns {string} The appropriate command or empty string if no command to be set
 */
export function getNoteCommand(noteIndex: number, midiData: Midi, notes: string[], hasTuplet: boolean, pitchBends: TrackPitchBends, isPercussion: boolean): string {
  return pipe(
    processTempoCommand,
    processChordCommand,
    processSweepCommand
  )({
    noteIndex,
    midiData,
    notes,
    hasTuplet,
    pitchBends,
    isPercussion,
    command: ''
  }).command
}