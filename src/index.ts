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

export function readMidiFile(file: string): MidiData {
  const data = readFileSync(file)
  return parseMidi(data)
}

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