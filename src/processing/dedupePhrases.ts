import {LSDJNote, LSDJPhrase} from "../types";
import {convertToHex} from "../utils";

/**
 * Recreate the LSDJTrack's phrases using a map of LSDJNotes in order to duplicate phrases (the map keys are a hash of
 * the LSDJPhrase's notes so phrases with same notes will have one entry in Map)
 *
 * @param {Map<string, LSDJNote[]>} phraseMap - Map of hash of phrase notes to array of notes
 * @returns {LSDJPhrase[]} - Array of unique phrases in Track with key in hex
 */
export function dedupePhrases(phraseMap: Map<string, LSDJNote[]>): LSDJPhrase[] {
  return [ ...phraseMap.entries() ].map((entry, index) => {
    const notes = entry[1]
    return {
      key: convertToHex(index),
      notes: notes ? notes : []
    }
  })
}