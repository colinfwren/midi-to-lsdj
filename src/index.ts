import { readFileSync } from 'fs'
import {MidiData, parseMidi, MidiEvent} from "midi-file";
import {
  getTrackEvents,
  getTrackNotes,
  getPhrasesForTrack,
  getTrackChains,
  getTablesForPhraseTriplets,
  setPhraseNoteTableId,
  getChainsAsMap,
  setChainHexKeys,
  getPhrasesAsMap,
  setChainPhraseHexKeys,
  setTableMapHexKeys,
  dedupePhrases,
  getTableArray
} from "./processing";
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
  // Create Phrases from track
  const phrases = getPhrasesForTrack(notes, events)
  // Create Tables from track
  const tableMap = getTablesForPhraseTriplets(phrases)
  const tableMapKeys = [ ...tableMap.keys() ]
  const tableMapWithHexKeys = setTableMapHexKeys(tableMap, tableMapKeys)
  const tables = getTableArray(tableMapWithHexKeys)
  // Update Phrase notes with table ID
  const phrasesWithTableIds = setPhraseNoteTableId(phrases, tableMapKeys)
  // Create Chains for Phrases
  const chains = getTrackChains(phrasesWithTableIds)
  // Create Chain map so can generate IDs
  const chainMap = getChainsAsMap(chains)
  // Set Chain hex keys
  const chainsWithHexKeys = setChainHexKeys(chains, chainMap)
  // create Phrase map so can generate IDs
  const phraseMap = getPhrasesAsMap(phrasesWithTableIds)
  const phraseMapKeys = [ ...phraseMap.keys() ]
  // set Phrase hex keys on Chains
  const chainsWithPhraseHexKeys = setChainPhraseHexKeys(chainsWithHexKeys, phraseMapKeys)
  // Set Phrase hex keys on Phrases
  const dedupedPhrasesWithHexKeys = dedupePhrases(phraseMap)
  return {
    chains: chainsWithPhraseHexKeys,
    phrases: dedupedPhrasesWithHexKeys,
    tables: tables
  }
}
