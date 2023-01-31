import { processPhrases } from "./processPhrases";
import {LSDJNote, LSDJTrack} from "../types";
import {createNote, createPhrase} from "../test/lsdj";
import {getPhrasesNotesAsBase64} from "./getTrackPhrases";

const notes1: LSDJNote[] = [
  createNote('G_3'),
  createNote('---'),
  createNote('G_3'),
  createNote('E_4'),
  createNote('G_3'),
  createNote('---'),
  createNote('G_3'),
  createNote('E_4'),
  createNote('G_3'),
  createNote('---'),
  createNote('G_3'),
  createNote('E_4'),
  createNote('G_3'),
  createNote('---'),
  createNote('G_3'),
  createNote('E_4'),
]

const notes2: LSDJNote[] = [
  createNote('G_3'),
  createNote('---'),
  createNote('G_3'),
  createNote('E_4'),
  createNote('G_3'),
  createNote('---'),
  createNote('G_3'),
  createNote('E_4'),
  createNote('G_3'),
  createNote('---'),
  createNote('G_3'),
  createNote('E_4'),
  createNote('G_3'),
  createNote('---'),
  createNote('G_3'),
  createNote('F_4'),
]

const notes = [notes1, notes2]
const phraseKeys = [
  getPhrasesNotesAsBase64(notes1),
  getPhrasesNotesAsBase64(notes2)
]

const track: LSDJTrack = {
  tables: [],
  phrases: Array(18).fill(0).map((_, ind) => {
    const key = ind % 2
    return createPhrase(phraseKeys[key], notes[key])
  }),
  chains: [
    {
      key: '00',
      phrases: [
        phraseKeys[0],
        phraseKeys[1],
        phraseKeys[0],
        phraseKeys[1],
        phraseKeys[0],
        phraseKeys[1],
        phraseKeys[0],
        phraseKeys[1],
        phraseKeys[0],
        phraseKeys[1],
        phraseKeys[0],
        phraseKeys[1],
        phraseKeys[0],
        phraseKeys[1],
        phraseKeys[0],
        phraseKeys[1],
      ]
    },
    {
      key: '01',
      phrases: [
        phraseKeys[0],
        phraseKeys[1],
      ]
    }
  ]
}

const expectedTrack: LSDJTrack = {
  ...track,
  chains: [
    {
      key: '00',
      phrases: ['00', '01', '00', '01', '00', '01', '00', '01', '00', '01', '00', '01', '00', '01', '00', '01']
    },
    {
      key: '01',
      phrases: ['00', '01']
    }
  ],
  phrases: [
    {
      key: '00',
      notes: notes1
    },
    {
      key: '01',
      notes: notes2
    }
  ]
}

describe('processPhrases', () => {
  it('Removes duplicate phrases and updates the chain map to point duplicates to the first instance', () => {
    expect(processPhrases(track)).toMatchObject(expectedTrack)
  })
})