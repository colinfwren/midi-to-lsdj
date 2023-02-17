import {Midi} from "@tonejs/midi";
import { convertToHex } from "../utils";

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
  // TODO: When add more processors add pipe()
  return processTempoCommand({ noteIndex, midiData, notes, hasTuplet, command: ''}).command
}