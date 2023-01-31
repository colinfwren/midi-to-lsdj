import {LSDJTrack} from "../types";
import {getPhrasesAsMap} from "./getPhrasesAsMap";
import {setChainPhraseHexKeys} from "./setChainHexKeys";
import {dedupePhrases} from "./dedupePhrases";

/**
 * De-duplicate the phrases in the track and update the chain array to point to the first instance if duplication occurs
 *
 * @param {LSDJTrack} track - The LSDJ Track
 */
export function processPhrases(track: LSDJTrack): LSDJTrack {
  const phraseMap = getPhrasesAsMap(track.phrases)
  const phraseMapKeys = [ ...phraseMap.keys() ]
  return {
    ...track,
    chains: setChainPhraseHexKeys(track.chains, phraseMapKeys),
    phrases: dedupePhrases(phraseMap)
  }
}