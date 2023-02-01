
import {setPhraseHexKeys} from "./setPhraseHexKeys";
import { TEST_PHRASE_3, TEST_PHRASE_4, TEST_PHRASE_5} from "../test/lsdj";

const phrases = [
  TEST_PHRASE_3,
  TEST_PHRASE_4,
  TEST_PHRASE_5,
  TEST_PHRASE_3
]


const phraseMapKeys = [
  TEST_PHRASE_3.key,
  TEST_PHRASE_4.key,
  TEST_PHRASE_5.key
]

describe('setPhraseHexKeys', () => {
  it('updates the phrase key with the hexadecimal index of the phrase in the phrase map', () => {
    const expectedResult = [
      {
        ...TEST_PHRASE_3,
        key: '00'
      },
      {
        ...TEST_PHRASE_4,
        key: '01'
      },
      {
        ...TEST_PHRASE_5,
        key: '02'
      },
      {
        ...TEST_PHRASE_3,
        key: '00'
      }
    ]
    const result = setPhraseHexKeys(phrases, phraseMapKeys)
    expect(result).toMatchObject(expectedResult)
  })
})