import {MidiEvent} from "midi-file";

export type TrackEvent = {
  tick: number,
  event: MidiEvent
}

export type TrackEvents = {
  timeSignatures: TrackEvent[],
  endOfSong: TrackEvent,
  tempos: TrackEvent[],
  semiQuaver: number
}

export type TrackNotes = { // Map<number, string[]>
  [key: number]: string[]
}

export type TrackNoteEvents = {
  tick: number,
  notes: TrackNotes[]
}

export type TrackSection = {
  notesPerPhrase: number,
  bars: number,
  tick: number,
  timeSignature: string
}

export type TimeSignatureValues = {
  numerator: number,
  denominator: number
}

export type TrackPhrase = {
  noteCount: number,
  startTick: number,
  endTick: number,
  noteIndexes: number[]
}

export type LSDJNote = {
  notes: string[]
  command: string
  triplets: number[],
  tableId?: string,
}

export type LSDJPhrase = {
  noteCount: number,
  startTick: number,
  endTick: number,
  notes: LSDJNote[],
  key: string,
}

export type LSDJChain = {
  key: string,
  phrases: string[]
}

export type LSDJTrack = {
  chains: LSDJChain[],
  phrases: LSDJPhrase[],
  tables: Map<string, number[]>
}