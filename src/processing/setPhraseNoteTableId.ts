import {LSDJPhrase} from "../types";
import {convertToHex, getTripletKey} from "../utils";

export function setPhraseNoteTableId(phrases: LSDJPhrase[], tableMapKeys: string[]): LSDJPhrase[] {
  return phrases.map((phrase) => {
    return {
      ...phrase,
      notes: phrase.notes.map((note) => {
        return {
          ...note,
          tableId: convertToHex(tableMapKeys.indexOf(getTripletKey(note.triplets)))
        }
      })
    }
  }, new Map<string, number[]>())
}