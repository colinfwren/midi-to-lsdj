import { setPhraseNoteTableId } from "./setPhraseNoteTableId";
import {createNote, createPhrase, HOP_NOTE, TEST_PHRASE_6, TEST_PHRASE_7} from "../test/lsdj";

const phrases = [
  TEST_PHRASE_6,
  TEST_PHRASE_7
]

const HOP_NOTE_WITH_TABLE = {
  ...HOP_NOTE,
  tableId: ''
}

const trackTablesKeys = [
  'MS0z',
  'My01'
]

describe('setPhraseNoteTableId', () => {
  it('sets the Phrase note table id based on the note delta values in the triplets', () => {
    const expectedResult = [
      createPhrase(
        '1',
        [
          createNote(['C_3']),
          createNote(['D#_3'], 'A01', [3, 5], '01'),
          HOP_NOTE_WITH_TABLE
        ]
      ),
      createPhrase(
        '2',
        [
          createNote(['C_3'], 'A00', [1, 3], '00'),
          createNote(['D#_3'], 'A01', [3, 5], '01'),
          HOP_NOTE_WITH_TABLE
        ],
        6
      )
    ]
    const result = setPhraseNoteTableId(phrases, trackTablesKeys)
    expect(result).toMatchObject(expectedResult)
  })
})