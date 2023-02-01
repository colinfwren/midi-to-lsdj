import {LSDJPhrase} from "../types";
import { getTripletKey } from "../utils";

/**
 * Create a map of tables used for triplets/sextuplets across the track's phrases. This makes it easy to remove
 * duplicate tables that are used across different notes in the phrases but have the same transpose delta.
 *
 * @param {LSDJPhrase[]} phrases - Array of phrases in the track
 * @returns {Map<string, number[]>} - Map of triplets/sextuplet note hash to note delta values
 */
export function getTablesForPhraseTriplets(phrases: LSDJPhrase[]): Map<string, number[]> {
  return phrases.reduce((tripletMap, phrase) => {
    phrase.notes.forEach((note) => {
      if (note.triplets.length > 0) {
        const tripletKey = getTripletKey(note.triplets)
        if (!tripletMap.has(tripletKey)) {
          tripletMap.set(tripletKey, note.triplets)
        }
      }
    })
    return tripletMap
  }, new Map<string, number[]>())
}