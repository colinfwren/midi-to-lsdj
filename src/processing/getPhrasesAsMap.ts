import {LSDJNote, LSDJPhrase} from "../types";

export function getPhrasesAsMap(phrases: LSDJPhrase[]): Map<string, LSDJNote[]> {
  return phrases.reduce((phraseMap, phrase) => {
    if (!phraseMap.has(phrase.key)) {
      phraseMap.set(phrase.key, phrase.notes)
    }
    return phraseMap
  }, new Map<string, LSDJNote[]>)
}
