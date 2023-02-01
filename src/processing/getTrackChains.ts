import {LSDJChain, LSDJPhrase} from "../types";
import {getChunksOfSize} from "../utils";

/**
 * Create a base64 representation of the phrases in a chain
 *
 * @param {string[]} phraseKeys - Keys of the phrases in the chain
 * @returns {string} - Base64 representation of the phrase keys
 */
export function getChainKey(phraseKeys: string[]): string {
  const buffer = Buffer.from(phraseKeys.join('-'), 'utf-8')
  return buffer.toString('base64')
}

/**
 * Create an array of chains from the track's phrases. Each chain can have a maximum of 16 phrases in it so the phrase
 * array needs to be split into chunks of this size
 *
 * @param {LSDJPhrase[]} phrases - Array of the phrases in the track
 * @returns {LSDJChain[]} - Array of chains in the track
 */
export function getTrackChains(phrases: LSDJPhrase[]): LSDJChain[] {
  const chunkedPhrases: LSDJPhrase[][] = getChunksOfSize(phrases, 16)
  return chunkedPhrases.map((chainPhrases) => {
    const phraseKeys = chainPhrases.map((phrase) => phrase.key)
    return {
      key: getChainKey(phraseKeys),
      phrases: phraseKeys
    }
  })
}

/**
 * Create a map of the chains in the track, this is used to create to deduplicate the chains later on
 *
 * @param {LSDJChain[]} chains - Array of chains in the track
 * @returns {Map<string, string[]>} - Map of the chains key to the chain's phrases
 */
export function getChainsAsMap(chains: LSDJChain[]): Map<string, string[]> {
  return chains.reduce((chainsMap, chain) => {
    if (!chainsMap.has(chain.key)) {
      chainsMap.set(chain.key, chain.phrases)
    }
    return chainsMap
  }, new Map<string, string[]>)
}