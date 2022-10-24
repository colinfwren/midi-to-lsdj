import {LSDJNote, LSDJPhrase} from "../types";
import {dedupePhrases} from "./dedupePhrases";

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

const phraseMap = new Map<string, LSDJNote[]>(
  [
  [testPhrase.key, testPhrase.notes],
  [otherTestPhrase.key, otherTestPhrase.notes]
])

describe('dedupePhrases', () => {
  it('uses the phrase map to build up an array of phrases and uses the hexadecimal value of the index for the key', () => {
    const expectedResult = [
      {
        key: '00',
        notes: testPhrase.notes
      },
      {
        key: '01',
        notes: otherTestPhrase.notes
      }
    ]
    const result = dedupePhrases(phraseMap)
    expect(result).toMatchObject(expectedResult)
  })
})