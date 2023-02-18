import {formatLSDJNoteName, getTripletKey} from "./utils";
import {Feature} from "./test/allure";
import {DRUM_MAP} from "./constants";

describe('getTripletKey', () => {

  beforeEach(() => {
    reporter
      .feature(Feature.TableMapping)
      .story('Create a hash representation of a tuplet so can spot duplicate tuplets')
  })

  it('creates a base64 version of the notes in the triplet as a string', () => {
    const expectedResult = 'MS0y'
    const result = getTripletKey([1, 2])
    expect(result).toBe(expectedResult)
  })
})

describe('formatLSDJNoteName', () => {

  beforeEach(() => {
    reporter
      .feature(Feature.PhraseMapping)
      .story('Formats the MIDI note as LSDJ note for drums and synth')
  })

  it('Returns non-percussion sharp notes unaltered', () => {
    expect(formatLSDJNoteName('C#5')).toBe('C#5')
  })
  it('Returns non-percussion non-sharp notes with underscore', () => {
    expect(formatLSDJNoteName('C5')).toBe('C_5')
  })
  it.each(
    [...DRUM_MAP.entries()].map(([key, value]) => ({ note: key, drum: value}))
  )('Returns percussion note $note as $drum', ({note, drum}) => {
    expect(formatLSDJNoteName(note, true)).toBe(drum)
  })
  it('Returns percussion note not in drum map as ---', () => {
    expect(formatLSDJNoteName('D7', true)).toBe('---')
  })
})