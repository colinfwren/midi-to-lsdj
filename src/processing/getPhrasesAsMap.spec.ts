import {LSDJNote, LSDJPhrase} from "../types";
import {getPhrasesAsMap} from "./getPhrasesAsMap";

const testPhrase: LSDJPhrase = {
  noteCount: 2,
  startTick: 0,
  endTick: 2,
  key: 'QyNfMy1DXzMtLUdfNi0tLUgwMA==',
  notes: [
    {
      notes: ['C#_3', 'C_3'],
      command: '',
      triplets: []
    },
    {
      notes: ['G_6'],
      command: '',
      triplets: []
    },
    {
      notes: [],
      command: 'H00',
      triplets: []
    }
  ]
}

const otherTestPhrase: LSDJPhrase = {
  noteCount: 1,
  startTick: 0,
  endTick: 2,
  key: 'Rl80LS0tSDAw',
  notes: [
    {
      notes: ['F_4'],
      command: '',
      triplets: []
    },
    {
      notes: [],
      command: 'H00',
      triplets: []
    }
  ]
}

const testPhrases = [
  testPhrase,
  otherTestPhrase,
  testPhrase
]

describe('getPhraseAsMap', () => {
  it('creates a key value pair based on the base64 hash of notes in the phrase', () => {
    const expectedResult = new Map<string, LSDJNote[]>(
      [
      [testPhrase.key, testPhrase.notes],
      [otherTestPhrase.key, otherTestPhrase.notes]
    ])
    const result = getPhrasesAsMap(testPhrases)
    expect(result).toMatchObject(expectedResult)
  })
})