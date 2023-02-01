import {LSDJNote} from "../types";
import {getPhrasesAsMap} from "./getPhrasesAsMap";
import { TEST_PHRASE_1, TEST_PHRASE_2 } from "../test/lsdj";
import {Feature} from "../test/allure";

const testPhrases = [
  TEST_PHRASE_1,
  TEST_PHRASE_2,
  TEST_PHRASE_1
]

describe('getPhraseAsMap', () => {

  beforeEach(() => {
    reporter
      .feature(Feature.PhraseMapping)
      .story('Phrase Deduplication')
      .description('Create a map of phrases so can reduce list down to unique phrases')
  })

  it('creates a key value pair based on the base64 hash of notes in the phrase', () => {
    const expectedResult = new Map<string, LSDJNote[]>(
      [
      [TEST_PHRASE_1.key, TEST_PHRASE_1.notes],
      [TEST_PHRASE_2.key, TEST_PHRASE_2.notes]
    ])
    const result = getPhrasesAsMap(testPhrases)
    expect(result).toMatchObject(expectedResult)
  })
})