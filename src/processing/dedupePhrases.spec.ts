import { LSDJNote } from "../types";
import { dedupePhrases } from "./dedupePhrases";
import { TEST_PHRASE_1, TEST_PHRASE_2 } from "../test/lsdj";
import {Feature} from "../test/allure";

const phraseMap = new Map<string, LSDJNote[]>(
  [
  [TEST_PHRASE_1.key, TEST_PHRASE_1.notes],
  [TEST_PHRASE_2.key, TEST_PHRASE_2.notes]
])

describe('dedupePhrases', () => {

  beforeEach(() => {
    reporter
      .feature(Feature.PhraseMapping)
      .story('Phrase Deduplication')
      .description('Remove duplicate phrases from the phrase list and replace with pointer to existing phrase to save space and time inputting notes')
  })

  it('uses the phrase map to build up an array of phrases and uses the hexadecimal value of the index for the key', () => {
    const expectedResult = [
      {
        key: '00',
        notes: TEST_PHRASE_1.notes
      },
      {
        key: '01',
        notes: TEST_PHRASE_2.notes
      }
    ]
    const result = dedupePhrases(phraseMap)
    expect(result).toMatchObject(expectedResult)
  })
})