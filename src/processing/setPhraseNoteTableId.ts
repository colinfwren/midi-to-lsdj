import {LSDJPhrase} from "../types";
import {convertToHex, getTripletKey} from "../utils";

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