import {getTablesForPhraseTriplets} from "./getTablesForPhraseTriplets";
import {createNote, createPhrase, HOP_NOTE, TEST_PHRASE_6, TEST_PHRASE_7} from "../test/lsdj";
import {Feature} from "../test/allure";

const phrases = [
  TEST_PHRASE_6,
  TEST_PHRASE_7
]

const tripletPhrases = [
  createPhrase(
    '1',
    [
      createNote(['C_3']),
      HOP_NOTE
    ]
  )
]

describe('getTablesForPhraseTriplets', () => {

  beforeEach(() => {
    reporter
      .feature(Feature.TableMapping)
      .story('Map Table to Phrases')
      .description('Creates a map of tables for triplets/sextuplets across phrases in track')
  })

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
