import {LSDJNote, LSDJPhrase} from "../types";
import {setPhraseHexKeys} from "./setPhraseHexKeys";

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

const phrases = [
  phrase1,
  phrase2,
  phrase3,
  phrase1,
]

const phraseMap = new Map<string, LSDJNote[]>([
  [phrase1.key, phrase1.notes],
  [phrase2.key, phrase2.notes],
  [phrase3.key, phrase3.notes]
])

const phraseMapKeys = [...phraseMap.keys()]

describe('setPhraseHexKeys', () => {
  it('updates the phrase key with the hexadecimal index of the phrase in the phrase map', () => {
    const expectedResult = [
      {
        ...phrase1,
        key: '00'
      },
      {
        ...phrase2,
        key: '01'
      },
      {
        ...phrase3,
        key: '02'
      },
      {
        ...phrase1,
        key: '00'
      }
    ]
    const result = setPhraseHexKeys(phrases, phraseMapKeys)
    expect(result).toMatchObject(expectedResult)
  })
})