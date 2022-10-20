import { readFileSync } from 'fs'
import {MidiData, parseMidi, MidiEvent} from "midi-file";
import {
  getTrackEvents,
  getTrackNotes,
  getPhrasesForTrack,
  getTrackChains,
  getTablesForPhraseTriplets,
  setPhraseNoteTableId
} from "./processing";
import {LSDJChain} from "./types";

export function readMidiFile(file: string): MidiData {
  const data = readFileSync(file)
  return parseMidi(data)
}

export function processTrack(track: MidiEvent[], ticksPerBeat: number): LSDJChain[] {
  // Get track information TODO: sort out time sig changes properly with ticks
  const trackEvents = getTrackEvents(track, ticksPerBeat)
  // Get the notes for track
  const trackOneNotes = getTrackNotes(track, trackEvents)
  // Create Phrases from track
  const trackOnePhrases = getPhrasesForTrack(trackOneNotes, trackEvents)
  // Create Tables from track
  const trackOneTableMap = getTablesForPhraseTriplets(trackOnePhrases)
  // Update Phrase notes with table ID
  const updatedPhrases = setPhraseNoteTableId(trackOnePhrases, trackOneTableMap)
  // // Create Chains for Phrases
  return getTrackChains(updatedPhrases)
}
