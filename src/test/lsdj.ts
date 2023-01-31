import {LSDJNote, LSDJPhrase} from "../types";

export function createPhrase(key: string, notes: LSDJNote[] = []): LSDJPhrase {
  return {
    noteCount: 1,
    startTick: 0,
    endTick: 1,
    key,
    notes
  }
}

export function createNote(note: string): LSDJNote {
  return {
    notes: [note],
    command: '---',
    triplets: [],
  }
}