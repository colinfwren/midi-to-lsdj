import {formatLSDJNoteName, getTripletKey} from "./utils";
import {Feature} from "./test/allure";

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
  it.each([
      { note: 'C3', drum: 'BD-' },
      { note: 'B3', drum: 'MT-' },
      { note: 'A3', drum: 'MT-' },
      { note: 'G3', drum: 'LT-' },
      { note: 'G#3', drum: 'CHH' },
      { note: 'D3', drum: 'SD-' },
      { note: 'C#4', drum: 'CYM' },
      { note: 'C4', drum: 'HT-' },
      { note: 'D#4', drum: 'RCY' },
      { note: 'D4', drum: 'HT-' },
      { note: 'E4', drum: 'RCY' }
  ])('Returns percussion note $note as $drum', ({note, drum}) => {
    expect(formatLSDJNoteName(note, true)).toBe(drum)
  })
  it('Returns percussion note not in drum map as ---', () => {
    expect(formatLSDJNoteName('D7', true)).toBe('---')
  })
})