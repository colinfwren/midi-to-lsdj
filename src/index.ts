import { readFileSync} from 'fs'
import { Midi } from '@tonejs/midi'
import {
  getTrackNotes,
  getPhrasesForTrack,
  processTables,
  processChains,
  processPhrases,
  getTrackPitchBends
} from "./processing";
import { pipe } from "./utils";
import {LSDJTrack, LSDJProject} from "./types";

/**
 * Load file from file system and convert it into a Midi instance
 *
 * @param {string} filePath - Path to the file to load
 * @returns {Midi} - Data from parsed Midi file
 */
export function readMidiFile(filePath: string): Midi {
  const data = readFileSync(filePath)
  return new Midi(data)
}

/**
 * Convert a Midi Track into a LSDJ track that can be used to program that track's notes into LSDJ
 *
 * @param {Midi} data - Midi instance
 * @param {number} trackIndex - Index of the track in the Midi instance to process
 * @returns {LSDJTrack} - Chains, Phrases and Tables to program into LSDJ
 */
export function processTrack(data: Midi, trackIndex: number): LSDJTrack {
  const notes = getTrackNotes(data, trackIndex)
  const pitchBends = getTrackPitchBends(data, trackIndex)
  const isPercussion = data.tracks[trackIndex].instrument.percussion
  return pipe<LSDJTrack>(
    processTables,
    processChains,
    processPhrases
  )(getPhrasesForTrack(notes, data, pitchBends, isPercussion))
}

/**
 * Convert a MIDI file into a LSDJ project, that can be used to configure the project in LSDJ
 *
 * @param {Midi} data - Midi instance
 * @returns {LSDJProject} - Project information to program into LSDJ
 */
export function processProject(data: Midi): LSDJProject {
  return {
    tempo: data.header.tempos[0].bpm
  }
}
