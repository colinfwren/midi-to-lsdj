import { LSDJChain } from "../types";
import { convertToHex } from "../utils";

export function setChainHexKeys(chains: LSDJChain[], chainMap: Map<string, string[]>): LSDJChain[] {
  const chainMapKeys = [...chainMap.keys()]
  return chains.map((chain) => {
    return {
      ...chain,
      key: convertToHex(chainMapKeys.indexOf(chain.key))
    }
  })
}

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