import {LSDJChain, LSDJPhrase} from "../types";
import {getChainKey, getTrackChains, getChainsAsMap} from "./getTrackChains";
import { createNote, createPhrase, HOP_NOTE, TEST_PHRASE_1, TEST_PHRASE_2 } from "../test/lsdj";

const phraseOne: LSDJPhrase = {
  ...TEST_PHRASE_1,
  key: '1'
}

const phraseTwo: LSDJPhrase = {
  ...TEST_PHRASE_2,
  key: '2'
}

const phraseThree = createPhrase(
  '3',
  [
    createNote(['C_3', 'E_3', 'G_3']),
    HOP_NOTE
  ]
)

const testPhrases = [
  phraseOne,
  phraseOne,
  phraseOne,
  phraseOne,
  phraseTwo,
  phraseTwo,
  phraseTwo,
  phraseTwo,
  phraseOne,
  phraseOne,
  phraseOne,
  phraseOne,
  phraseTwo,
  phraseTwo,
  phraseTwo,
  phraseTwo,
  phraseThree,
  phraseThree,
  phraseThree,
  phraseThree,
  phraseTwo,
  phraseTwo,
  phraseTwo,
  phraseTwo,
  phraseThree,
  phraseThree,
  phraseThree,
  phraseThree,
]

const chainOne = {
  key: '1',
  phrases: ['1', '1', '1', '1', '2', '2', '2', '2', '1', '1', '1', '1', '2', '2', '2', '2']
}

const chainTwo = {
  key: '2',
  phrases: ['3', '3', '3', '3', '2', '2', '2', '2', '3', '3', '3', '3']
}

const testChains = [
  chainOne,
  chainTwo,
  chainOne
]

describe('getChainKey', () => {
  it('creates a base64 string from the list of phrase keys in the chain', () => {
    const result = getChainKey(['1', '2', '3'])
    expect(result).toBe('MS0yLTM=')
  })
})

describe('getTrackChains', () => {
  it('creates an array of chains from the list of phrases', () => {
    const expectedResult: LSDJChain[] = [
      {
        key: 'MS0xLTEtMS0yLTItMi0yLTEtMS0xLTEtMi0yLTItMg==',
        phrases: ['1', '1', '1', '1', '2', '2', '2', '2', '1', '1', '1', '1', '2', '2', '2', '2']
      },
      {
        key: 'My0zLTMtMy0yLTItMi0yLTMtMy0zLTM=',
        phrases: ['3', '3', '3', '3', '2', '2', '2', '2', '3', '3', '3', '3']
      }
    ]
    const result = getTrackChains(testPhrases)
    expect(result).toMatchObject(expectedResult)
  })
})

describe('getChainsAsMap', () => {
  it('creates key value pair based on the base64 hash of the phrases in a chain', () => {
    const expectedResult = new Map<string, string[]>(
      [
        ['1', ['1', '1', '1', '1', '2', '2', '2', '2', '1', '1', '1', '1', '2', '2', '2', '2']],
        ['2', ['3', '3', '3', '3', '2', '2', '2', '2', '3', '3', '3', '3']]
      ]
    )
    const result = getChainsAsMap(testChains)
    expect(result).toMatchObject(expectedResult)
  })
})