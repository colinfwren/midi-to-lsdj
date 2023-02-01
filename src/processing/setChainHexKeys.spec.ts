import {LSDJChain, LSDJPhrase} from "../types";
import { setChainHexKeys, setChainPhraseHexKeys } from "./setChainHexKeys";

const phrase1: LSDJPhrase = {
  key: 'a',
  startTick: 0,
  endTick: 1,
  noteCount: 1,
  notes: [
    {
      notes: ['D_3'],
      command: '',
      triplets: []
    }
  ]
}

const phrase2: LSDJPhrase = {
  key: 'b',
  startTick: 1,
  endTick: 2,
  noteCount: 1,
  notes: [
    {
      notes: ['D#_3'],
      command: '',
      triplets: []
    }
  ]
}

const phrase3: LSDJPhrase = {
  key: 'c',
  startTick: 2,
  endTick: 3,
  noteCount: 1,
  notes: [
    {
      notes: ['E_3'],
      command: '',
      triplets: []
    }
  ]
}

const chain1: LSDJChain = {
  key: '1',
  phrases: [phrase1.key, phrase2.key]
}

const chain2: LSDJChain = {
  key: '2',
  phrases: [phrase2.key, phrase3.key]
}

const chainMap = new Map<string, string[]>([
  [chain1.key, chain1.phrases],
  [chain2.key, chain2.phrases]
])

const phraseMapKeys = [
  phrase1.key,
  phrase2.key,
  phrase3.key
]

const chains = [
  chain1,
  chain2,
  chain1,
  chain1
]

describe('setChainHexKeys', () => {
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