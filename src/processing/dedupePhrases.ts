import {LSDJNote, LSDJPhrase} from "../types";
import {convertToHex} from "../utils";

export function dedupePhrases(phraseMap: Map<string, LSDJNote[]>): LSDJPhrase[] {
  const mapKeys = [ ...phraseMap.keys() ]
  return mapKeys.map((mapKey, index) => {
    const notes = phraseMap.get(mapKey)
    return {
      key: convertToHex(index),
      notes: notes ? notes : []
    }
  })
}