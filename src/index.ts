import { readFileSync } from 'fs'
import { parseMidi } from "midi-file";
import {
  getTrackEvents,
  getTrackNotes,
  getTrackPhrases,
  dedupeTrackPhrases,
  getTrackChains
} from "./process";

async function example(file: string): Promise<void> {
  const data = readFileSync(file)
  const midi = parseMidi(data)
  // Get track information TODO: sort out time sig changes properly with ticks
  const trackEvents = getTrackEvents(midi.tracks[0], midi.header.ticksPerBeat)
  // Get the notes for track
  const trackOneNotes = getTrackNotes(midi.tracks[1], trackEvents)
  // Create Phrases from track
  const trackOnePhrases = getTrackPhrases(trackOneNotes, trackEvents)
  // Deduplicate the Phrases
  const dedupedTrackOnePhrases = dedupeTrackPhrases(trackOnePhrases)
  // Create Chains for Phrases
  const trackOneChains = getTrackChains(dedupedTrackOnePhrases)

  console.log(trackEvents)
}

example('./src/cic.mid')