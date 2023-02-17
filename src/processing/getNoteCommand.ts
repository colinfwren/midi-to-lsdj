import {Midi} from "@tonejs/midi";
import {convertToHex, pipe} from "../utils";
import {note as tonalNote} from "@tonaljs/core";
import { fromMidi } from "@tonaljs/note";
import {calculateNoteDelta} from "./getTrackPhrases";

export type NoteInfo = {
  noteIndex: number,
  midiData: Midi,
  notes: string[],
  hasTuplet: boolean,
  command: string
}

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
 * Add a chord command if there is more than one note and there's not alread a Hop, Tempo, Kill, Table, Delay, Retrigger
 * command on the note
 *
 * @param {NoteInfo} noteInfo - Information about the note used to process the chord command
 * @returns {NoteInfo} - new NoteInfo instance with chord command if applicable
 */
export function processChordCommand(noteInfo: NoteInfo): NoteInfo {
  const { notes, command } = noteInfo
  if (['H', 'T', 'K', 'A', 'D', 'R'].includes(command.charAt(0)) || notes.length < 2) return noteInfo
  const chordAsHex = convertChordToHex(notes)
  return {
    ...noteInfo,
    command: `C${chordAsHex}`
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
 * @returns {string} The appropriate command or empty string if no command to be set
 */
export function getNoteCommand(noteIndex: number, midiData: Midi, notes: string[], hasTuplet: boolean): string {
  return pipe(
    processTempoCommand,
    processChordCommand
  )({ noteIndex, midiData, notes, hasTuplet, command: ''}).command
}