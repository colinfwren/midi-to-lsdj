import {LSDJNote, LSDJPhrase} from "../types";

/**
 * Reduce the LSDJPhrase array into a map of a hash of the notes in the phrase to the notes in that phrase, this means
 * that for duplicate phrases there is only one entry which can be used to create a unique phrase array later
 *
 * @param {LSDJPhrase[]} phrases - Array of phrases to create Map from
 * @returns {Map<string, LSDJNote[]>} - Map of phrase key to notes
 */
export function getPhrasesAsMap(phrases: LSDJPhrase[]): Map<string, LSDJNote[]> {
  return phrases.reduce((phraseMap, phrase) => {
    if (!phraseMap.has(phrase.key)) {
      phraseMap.set(phrase.key, phrase.notes)
    }
    return phraseMap
  }, new Map<string, LSDJNote[]>)
}
