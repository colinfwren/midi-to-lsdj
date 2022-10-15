import { readFileSync } from 'fs'
import { parseMidi } from "midi-file";
import {
  getTrackEvents,
  getTrackNotes,
  getPhrasesForTrack,
  getTrackChains
} from "./processing";

async function example(file: string): Promise<void> {
  const data = readFileSync(file)
  const midi = parseMidi(data)
  // Get track information TODO: sort out time sig changes properly with ticks
  const trackEvents = getTrackEvents(midi.tracks[0], midi.header.ticksPerBeat)
  // Get the notes for track
  const trackOneNotes = getTrackNotes(midi.tracks[0], trackEvents)
  // Create Phrases from track
  const trackOnePhrases = getPhrasesForTrack(trackOneNotes, trackEvents)
  // // Create Chains for Phrases
  const trackOneChains = getTrackChains(trackOnePhrases)

  console.log(trackOnePhrases)
}

example('./src/p1.mid')