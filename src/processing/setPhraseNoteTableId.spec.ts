import {LSDJPhrase} from "../types";
import { setPhraseNoteTableId } from "./setPhraseNoteTableId";

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

const trackTables = new Map<string, number[]>([
  ['MS0z', [1, 3]],
  ['My01', [3, 5]]
])

const trackTablesKeys = [ ...trackTables.keys() ]

describe('setPhraseNoteTableId', () => {
  it('sets the Phrase note table id based on the note delta values in the triplets', () => {
    const expectedResult = [
      {
        noteCount: 2,
        startTick: 0,
        endTick: 6,
        key: '1',
        notes: [
          {
            notes: ['C_3'],
            command: '',
            triplets: [],
            tableId: ''
          },
          {
            notes: ['D#_3'],
            command: 'A01',
            triplets: [3, 5],
            tableId: '01'
          },
          {
            notes: [],
            command: 'H00',
            triplets: [],
            tableId: '',
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
            command: 'A00',
            triplets: [1, 3],
            tableId: '00'
          },
          {
            notes: ['D#_3'],
            command: 'A01',
            triplets: [3, 5],
            tableId: '01'
          },
          {
            notes: [],
            command: 'H00',
            triplets: [],
            tableId: ''
          }
        ]
      }
    ]
    const result = setPhraseNoteTableId(phrases, trackTablesKeys)
    expect(result).toMatchObject(expectedResult)
  })
})