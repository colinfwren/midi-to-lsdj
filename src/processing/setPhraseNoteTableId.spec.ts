import { setPhraseNoteTableId } from "./setPhraseNoteTableId";
import {
  createNote,
  createPhrase,
  HOP_NOTE, KILL_NOTE,
  TEST_PHRASE_6,
  TEST_PHRASE_7,
  TEST_PHRASE_8,
  TEST_PHRASE_9
} from "../test/lsdj";
import {Feature} from "../test/allure";

const phrases = [
  TEST_PHRASE_6,
  TEST_PHRASE_7
]

const phrasesWithTempo = [
  TEST_PHRASE_8,
  TEST_PHRASE_7
]

const phrasesWithKillNote = [
  TEST_PHRASE_9,
  TEST_PHRASE_7
]

const HOP_NOTE_WITH_TABLE = {
  ...HOP_NOTE,
  tableId: ''
}

const KILL_NOTE_WITH_TABLE = {
  ...KILL_NOTE,
  tableId: ''
}

const trackTablesKeys = [
  'MS0z',
  'My01'
]

describe('setPhraseNoteTableId', () => {

  beforeEach(() => {
    reporter
      .feature(Feature.TableMapping)
      .story('Phrases are updated to reference tables using hexadecimal key/index inline with LSDJ')
  })

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
    expect(setPhraseNoteTableId(phrases, trackTablesKeys)).toMatchObject(expectedResult)
  })

  it("Doesn't set the phrase note table id if a tempo command is already set", () => {
    const expectedResult = [
      createPhrase(
        '1',
        [
          createNote(['C_3']),
          createNote(['D#_3'], 'TB4', [3, 5], '01'),
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
    expect(setPhraseNoteTableId(phrasesWithTempo, trackTablesKeys)).toMatchObject(expectedResult)
  })
  it("Doesn't set the phrase note table id if a kill note command is already set", () => {
    const expectedResult = [
      createPhrase(
        '1',
        [
          createNote(['C_3']),
          KILL_NOTE_WITH_TABLE,
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
    expect(setPhraseNoteTableId(phrasesWithKillNote, trackTablesKeys)).toMatchObject(expectedResult)
  })
})