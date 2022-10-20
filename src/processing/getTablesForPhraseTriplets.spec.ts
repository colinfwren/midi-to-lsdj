import {LSDJPhrase} from "../types";
import {getTablesForPhraseTriplets} from "./getTablesForPhraseTriplets";

const phrases: LSDJPhrase[] = [
  {
    noteCount: 2,
    startTick: 0,
    endTick: 6,
    key: '1',
    notes: [
      {
        notes: ['C_3'],
        command: '',
        triplets: []
      },
      {
        notes: ['D#_3'],
        command: '',
        triplets: [3, 5]
      },
      {
        notes: [],
        command: 'H00',
        triplets: []
      },
    ]
  },
  {
    noteCount: 2,
    startTick: 6,
    endTick: 12,
    key: '2',
    notes: [
      {
        notes: ['C_3'],
        command: '',
        triplets: [1, 3]
      },
      {
        notes: ['D#_3'],
        command: '',
        triplets: [3, 5]
      },
      {
        notes: [],
        command: 'H00',
        triplets: []
      }
    ]
  }
]

const tripletPhrases: LSDJPhrase[] = [
  {
    noteCount: 1,
    startTick: 0,
    endTick: 3,
    key: '1',
    notes: [
      {
        notes: ['C_3'],
        command: '',
        triplets: []
      },
      {
        notes: [],
        command: 'H00',
        triplets: []
      },
    ]
  },
]

describe('getTablesForPhraseTriplets', () => {
  it('extracts a map of tables from the triplets in the phrase notes', () => {
    const expectedResult = new Map<string, number[]>([
      ['MS0z', [1, 3]],
      ['My01', [3, 5]]
    ])
    const result = getTablesForPhraseTriplets(phrases)
    expect(result).toMatchObject(expectedResult)
  })
  it('does not add an entry if no triplets in track', () => {
    const expectedResult = new Map<string, number[]>([])
    const result = getTablesForPhraseTriplets(tripletPhrases)
    expect(result).toMatchObject(expectedResult)
  })
})