import { readFileSync} from 'fs'
import {MidiData, parseMidi, MidiEvent} from "midi-file";
import {
  getTrackEvents,
  getTrackNotes,
  getPhrasesForTrack,
  processTables,
  processChains,
  processPhrases
} from "./processing";
import { pipe } from "./utils";
import {LSDJTrack} from "./types";

/**
 * Load file from file system and convert it into a MIDIData object
 *
 * @param {string} filePath - Path to the file to load
 * @returns {MidiData} - Data from parsed Midi file
 */
export function readMidiFile(filePath: string): MidiData {
  const data = readFileSync(filePath)
  return parseMidi(data)
}

/**
 * Convert a track of MidiEvents into a LSDJ track that can be used to program that track's notes into LSDJ
 *
 * @param {MidiEvent[]} track - Track from MIDI file
 * @param {number} ticksPerBeat - Number of ticks per quarter note in MIDI file
 * @returns {LSDJTrack} - Chains, Phrases and Tables to program into LSDJ
 */
export function processTrack(track: MidiEvent[], ticksPerBeat: number): LSDJTrack {
  // Get track information TODO: sort out time sig changes properly with ticks
  const events = getTrackEvents(track, ticksPerBeat)
  // Get the notes for track
  const notes = getTrackNotes(track, events)
  return pipe<LSDJTrack>(
    processTables,
    processChains,
    processPhrases
  )(getPhrasesForTrack(notes, events))
}