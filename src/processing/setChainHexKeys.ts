import { LSDJChain } from "../types";
import { convertToHex } from "../utils";

/**
 * Update key of the LSDJ track's chains based on the index of the chain in the de-duplicated chain map as hexadecimal
 *
 * @param {LSDJChain[]} chains - Array of the chains in the LSDJ track
 * @param {Map<string, string[]>} chainMap - Map of the unique chain keys to the phrases in the chain
 * @returns {LSDJChain[]} - Updated chain array with the hexadecimal keys
 */
export function setChainHexKeys(chains: LSDJChain[], chainMap: Map<string, string[]>): LSDJChain[] {
  const chainMapKeys = [...chainMap.keys()]
  return chains.map((chain) => {
    return {
      ...chain,
      key: convertToHex(chainMapKeys.indexOf(chain.key))
    }
  })
}

/**
 * Update key of the phrases in the LSDJ track's chains based on the index of the phrase in the de-duplicated phrase map
 * as hexademical
 *
 * @param {LSDJChain[]} chains - Array of the chains in the LSDJ track
 * @param {string[]} phraseMapKeys - Array of the de-duplicated phrase keys
 * @returns {LSDJChain[]} - Updated chain array with the hexadecimal keys for the phrases
 */
export function setChainPhraseHexKeys(chains: LSDJChain[], phraseMapKeys: string[]): LSDJChain[] {
  return chains.map((chain) => {
    return {
      ...chain,
      phrases: chain.phrases.map((phrase) => {
        return convertToHex(phraseMapKeys.indexOf(phrase))
      })
    }
  })
}