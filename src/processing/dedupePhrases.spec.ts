import { LSDJNote } from "../types";
import { dedupePhrases } from "./dedupePhrases";
import { TEST_PHRASE_1, TEST_PHRASE_2 } from "../test/lsdj";

const phraseMap = new Map<string, LSDJNote[]>(
  [
  [TEST_PHRASE_1.key, TEST_PHRASE_1.notes],
  [TEST_PHRASE_2.key, TEST_PHRASE_2.notes]
])

describe('dedupePhrases', () => {
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