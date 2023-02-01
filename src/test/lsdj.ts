import {LSDJNote, LSDJPhrase} from "../types";

/**
 * Create a LSDJ phrase object to use in testing
 *
 * @param {string} key - Key for the phrase in the phrase map
 * @param {LSDJNote[]} notes - Array of notes in the phrase
 * @returns {LSDJPhrase} - Phrase for test
 */
export function createPhrase(key: string, notes: LSDJNote[] = []): LSDJPhrase {
  return {
    noteCount: 1,
    startTick: 0,
    endTick: 1,
    key,
    notes
  }
}

/**
 * Create a LSDJ note object to use in testing
 *
 * @param {string} note - Note value
 * @returns {LSDJNote} - Note for test
 */
export function createNote(note: string): LSDJNote {
  return {
    notes: [note],
    command: '---',
    triplets: [],
  }
}