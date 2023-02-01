import {LSDJChain} from "../types";
import { setChainHexKeys, setChainPhraseHexKeys } from "./setChainHexKeys";
import {TEST_PHRASE_3, TEST_PHRASE_4, TEST_PHRASE_5} from "../test/lsdj";
import {Feature} from "../test/allure";

const chain1: LSDJChain = {
  key: '1',
  phrases: [TEST_PHRASE_3.key, TEST_PHRASE_4.key]
}

const chain2: LSDJChain = {
  key: '2',
  phrases: [TEST_PHRASE_4.key, TEST_PHRASE_5.key]
}

const chainMap = new Map<string, string[]>([
  [chain1.key, chain1.phrases],
  [chain2.key, chain2.phrases]
])

const phraseMapKeys = [
  TEST_PHRASE_3.key,
  TEST_PHRASE_4.key,
  TEST_PHRASE_5.key
]

const chains = [
  chain1,
  chain2,
  chain1,
  chain1
]

describe('setChainHexKeys', () => {

  beforeEach(() => {
    reporter
      .feature(Feature.ChainMapping)
      .story('Chains use hexadecimal keys/index in line with LSDJ')
  })

  it('Updates the chains with a hexadecimal value representing the index in the chain map', () => {
    const updatedChain1 = {
      ...chain1,
      key: '00'
    }
    const updatedChain2 = {
      ...chain2,
      key: '01'
    }
    const expectedResult = [
      updatedChain1,
      updatedChain2,
      updatedChain1,
      updatedChain1
    ]
    const result = setChainHexKeys(chains, chainMap)
    expect(result).toMatchObject(expectedResult)
  })
})

describe('setChainPhraseHexKeys', () => {

  beforeEach(() => {
    reporter
      .feature(Feature.PhraseMapping)
      .story('Chains reference phrases using hexademical keys/index in line with LSDJ')
  })

  it('updates the chains with the hexadecimal value representing the index of the phrase in the phrase map', () => {
    const updatedChain1 = {
      ...chain1,
      phrases: ['00', '01']
    }
    const updatedChain2 = {
      ...chain2,
      phrases: ['01', '02']
    }
    const expectedResult = [
      updatedChain1,
      updatedChain2,
      updatedChain1,
      updatedChain1
    ]
    const result = setChainPhraseHexKeys(chains, phraseMapKeys)
    expect(result).toMatchObject(expectedResult)
  })
})