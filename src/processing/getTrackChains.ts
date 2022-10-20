import {LSDJChain, LSDJNote, LSDJPhrase} from "../types";
import {getChunksOfSize} from "../utils";

export function getChainKey(phraseKeys: string[]): string {
  const buffer = Buffer.from(phraseKeys.join('-'), 'utf-8')
  return buffer.toString('base64')
}

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

export function getChainsAsMap(chains: LSDJChain[]): Map<string, string[]> {
  return chains.reduce((chainsMap, chain) => {
    if (!chainsMap.has(chain.key)) {
      chainsMap.set(chain.key, chain.phrases)
    }
    return chainsMap
  }, new Map<string, string[]>)
}