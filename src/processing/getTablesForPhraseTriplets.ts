import {LSDJPhrase} from "../types";
import { getTripletKey } from "../utils";

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