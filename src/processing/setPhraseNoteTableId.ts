import {LSDJPhrase} from "../types";
import {convertToHex, getTripletKey} from "../utils";

/**
 * Update the notes for the phrases in the LSDJ track with references to the table that holds the command for
 * its triplet/sextuplets if applicable.
 *
 * @param {LSDJPhrase[]} phrases - Array of phrases in the LSDJ track
 * @param {string[]} tableMapKeys - List of keys in the de-duplicated table map
 * @returns {LSDJPhrase[]} - Updated list of phrases with the table information set
 */
export function setPhraseNoteTableId(phrases: LSDJPhrase[], tableMapKeys: string[]): LSDJPhrase[] {
  return phrases.map((phrase) => {
    return {
      ...phrase,
      notes: phrase.notes.map((note) => {
        const tableId = tableMapKeys.indexOf(getTripletKey(note.triplets))
        const tableHex = tableId > -1 ? convertToHex(tableId) : ''
        return {
          ...note,
          tableId: tableHex,
          command: tableHex === '' ? note.command : `A${tableHex}`
        }
      })
    }
  }, new Map<string, number[]>())
}