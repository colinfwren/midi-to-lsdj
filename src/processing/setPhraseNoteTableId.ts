import {LSDJPhrase} from "../types";
import { getTripletKey } from "../utils";

export function setPhraseNoteTableId(phrases: LSDJPhrase[], tableMap: Map<string, number[]>): LSDJPhrase[] {
  return phrases.map((phrase) => {
    return {
      ...phrase,
      notes: phrase.notes.map((note) => {
        return {
          ...note,
          tableId:  getTripletKey(note.triplets)
        }
      })
    }
  }, new Map<string, number[]>())
}