import {LSDJPhrase} from "../types";
import {convertToHex} from "../utils";

/**
 * Update the key of the phrase based on the index of the phrase's key within the de-duplicated phrase map. This ensures
 * the postiion of the phrase is kept but now duplicate phrases are just pointers to a single instance
 *
 * @param {LSDJPhrase[]} phrases - Array of phrases in the track
 * @param {string[]} phraseMapKeys - Array of unique phrase keys
 * @returns {LSDJPhrase[]} - Update array of phrases
 */
export function setPhraseHexKeys(phrases: LSDJPhrase[], phraseMapKeys: string[]): LSDJPhrase[] {
  return phrases.map((phrase) => {
    return {
      ...phrase,
      key: convertToHex(phraseMapKeys.indexOf(phrase.key))
    }
  })
}