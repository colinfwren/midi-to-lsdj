import {LSDJPhrase} from "../types";
import {convertToHex} from "../utils";

export function setPhraseHexKeys(phrases: LSDJPhrase[], phraseMapKeys: string[]): LSDJPhrase[] {
  return phrases.map((phrase) => {
    return {
      ...phrase,
      key: convertToHex(phraseMapKeys.indexOf(phrase.key))
    }
  })
}