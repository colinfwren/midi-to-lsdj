import {
  getPhrasesForSection,
  getPhrasesForTrack,
  getTrackSections,
  getPhrasesNotesAsBase64,
  calculateNoteDelta
} from './getTrackPhrases';
import {TrackNotes, TrackPhrase, TrackSection, LSDJTrack, TrackPitchBend} from '../types';
import {createNote, createPhrase, HOP_NOTE} from "../test/lsdj";
import {Feature} from "../test/allure";
import {Midi} from "@tonejs/midi";
import {note} from "@tonaljs/core";

const midi = new Midi()
midi.fromJSON({
  header: {
    name: 'Test midi file',
    tempos: [{
      ticks: 0,
      bpm: 120
    }],
    timeSignatures: [
      {
        ticks: 0,
        timeSignature: [6, 8]
      },
      {
        ticks: 36,
        timeSignature: [4, 4]
      },
      {
        ticks: 132,
        timeSignature: [9, 8]
      }
    ],
    keySignatures: [],
    meta: [],
    ppq: 12,
  },
  tracks: [
    {
      name: 'Test Track',
      instrument: {
        family: 'woodwind',
        name: 'flute',
        number: 1
      },
      notes: [
        {
          ticks: 0,
          durationTicks: 2,
          midi: note('C3').midi as number,
          velocity: 0,
          time: 0,
          name: '',
          duration: 0,
        },
        {
          ticks: 6,
          durationTicks: 2,
          midi: note('C#3').midi as number,
          velocity: 0,
          time: 0,
          name: '',
          duration: 0,
        },
        {
          ticks: 12,
          durationTicks: 2,
          midi: note('D3').midi as number,
          velocity: 0,
          time: 0,
          name: '',
          duration: 0,
        },
        {
          ticks: 18,
          durationTicks: 2,
          midi: note('D#3').midi as number,
          velocity: 0,
          time: 0,
          name: '',
          duration: 0,
        },
        {
          ticks: 19,
          durationTicks: 2,
          midi: note('F#3').midi as number,
          velocity: 0,
          time: 0,
          name: '',
          duration: 0,
        },
        {
          ticks: 20,
          durationTicks: 2,
          midi: note('D#4').midi as number,
          velocity: 0,
          time: 0,
          name: '',
          duration: 0,
        },
        {
          ticks: 24,
          durationTicks: 2,
          midi: note('E3').midi as number,
          velocity: 0,
          time: 0,
          name: '',
          duration: 0,
        },
        {
          ticks: 30,
          durationTicks: 2,
          midi: note('F3').midi as number,
          velocity: 0,
          time: 0,
          name: '',
          duration: 0,
        },
        {
          ticks: 36,
          durationTicks: 2,
          midi: note('F#3').midi as number,
          velocity: 0,
          time: 0,
          name: '',
          duration: 0,
        },
        {
          ticks: 42,
          durationTicks: 2,
          midi: note('G3').midi as number,
          velocity: 0,
          time: 0,
          name: '',
          duration: 0,
        },
        {
          ticks: 48,
          durationTicks: 2,
          midi: note('G#3').midi as number,
          velocity: 0,
          time: 0,
          name: '',
          duration: 0,
        },
        {
          ticks: 54,
          durationTicks: 2,
          midi: note('A3').midi as number,
          velocity: 0,
          time: 0,
          name: '',
          duration: 0,
        },
        {
          ticks: 60,
          durationTicks: 2,
          midi: note('A#3').midi as number,
          velocity: 0,
          time: 0,
          name: '',
          duration: 0,
        },
        {
          ticks: 66,
          durationTicks: 2,
          midi: note('B3').midi as number,
          velocity: 0,
          time: 0,
          name: '',
          duration: 0,
        },
        {
          ticks: 72,
          durationTicks: 2,
          midi: note('C4').midi as number,
          velocity: 0,
          time: 0,
          name: '',
          duration: 0,
        },
        {
          ticks: 78,
          durationTicks: 2,
          midi: note('C#4').midi as number,
          velocity: 0,
          time: 0,
          name: '',
          duration: 0,
        },
        {
          ticks: 84,
          durationTicks: 2,
          midi: note('D4').midi as number,
          velocity: 0,
          time: 0,
          name: '',
          duration: 0,
        },
        {
          ticks: 90,
          durationTicks: 2,
          midi: note('D#4').midi as number,
          velocity: 0,
          time: 0,
          name: '',
          duration: 0,
        },
        {
          ticks: 96,
          durationTicks: 2,
          midi: note('E4').midi as number,
          velocity: 0,
          time: 0,
          name: '',
          duration: 0,
        },
        {
          ticks: 102,
          durationTicks: 2,
          midi: note('F4').midi as number,
          velocity: 0,
          time: 0,
          name: '',
          duration: 0,
        },
        {
          ticks: 108,
          durationTicks: 2,
          midi: note('F#4').midi as number,
          velocity: 0,
          time: 0,
          name: '',
          duration: 0,
        },
        {
          ticks: 114,
          durationTicks: 2,
          midi: note('G4').midi as number,
          velocity: 0,
          time: 0,
          name: '',
          duration: 0,
        },
        {
          ticks: 120,
          durationTicks: 2,
          midi: note('G#4').midi as number,
          velocity: 0,
          time: 0,
          name: '',
          duration: 0,
        },
        {
          ticks: 126,
          durationTicks: 2,
          midi: note('A4').midi as number,
          velocity: 0,
          time: 0,
          name: '',
          duration: 0,
        },
        {
          ticks: 132,
          durationTicks: 2,
          midi: note('A#4').midi as number,
          velocity: 0,
          time: 0,
          name: '',
          duration: 0,
        },
        {
          ticks: 138,
          durationTicks: 2,
          midi: note('B4').midi as number,
          velocity: 0,
          time: 0,
          name: '',
          duration: 0,
        },
        {
          ticks: 144,
          durationTicks: 2,
          midi: note('C5').midi as number,
          velocity: 0,
          time: 0,
          name: '',
          duration: 0,
        },
        {
          ticks: 150,
          durationTicks: 2,
          midi: note('C#5').midi as number,
          velocity: 0,
          time: 0,
          name: '',
          duration: 0,
        },
        {
          ticks: 156,
          durationTicks: 2,
          midi: note('D5').midi as number,
          velocity: 0,
          time: 0,
          name: '',
          duration: 0,
        },
        {
          ticks: 162,
          durationTicks: 2,
          midi: note('D#5').midi as number,
          velocity: 0,
          time: 0,
          name: '',
          duration: 0,
        },
        {
          ticks: 168,
          durationTicks: 2,
          midi: note('E5').midi as number,
          velocity: 0,
          time: 0,
          name: '',
          duration: 0,
        },
        {
          ticks: 174,
          durationTicks: 2,
          midi: note('F5').midi as number,
          velocity: 0,
          time: 0,
          name: '',
          duration: 0,
        },
        {
          ticks: 180,
          durationTicks: 2,
          midi: note('F#5').midi as number,
          velocity: 0,
          time: 0,
          name: '',
          duration: 0,
        },
        {
          ticks: 186,
          durationTicks: 0,
          midi: note('G5').midi as number,
          velocity: 0,
          time: 0,
          name: '',
          duration: 0,
        },
      ],
      channel: 1,
      controlChanges: {},
      pitchBends: [],
      endOfTrackTicks: 186
    }
  ]
})

const trackSections: TrackSection[] = [
  {
    notesPerBar: 12,
    bars: 2,
    tick: 0,
    timeSignature: '12/16' // 6/8
  },
  {
    notesPerBar: 16,
    bars: 2,
    tick: 0,
    timeSignature: '16/16' // 4/4
  },
  {
    notesPerBar: 24,
    bars: 2,
    tick: 0,
    timeSignature: '24/16' // 12/8
  }
]

const trackNotes: TrackNotes = {
  0: ['C3', 'D#3', 'G3'],
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: ['C#3'],
  7: [],
  8: [],
  9: [],
  10: [],
  11: [],
  12: ['D3'],
  13: [],
  14: [],
  15: [],
  16: [],
  17: [],
  18: ['D#3'],
  19: ['F#3'],
  20: ['D#4'],
  21: [],
  22: [],
  23: [],
  24: ['E3'],
  25: [],
  26: [],
  27: [],
  28: [],
  29: [],
  30: ['F3'],
  31: [],
  32: [],
  33: [],
  34: [],
  35: [],
  36: ['F#3'],
  37: [],
  38: [],
  39: [],
  40: [],
  41: [],
  42: ['G3'],
  43: [],
  44: [],
  45: [],
  46: [],
  47: [],
  48: ['G#3'],
  49: [],
  50: [],
  51: [],
  52: [],
  53: [],
  54: ['A3'],
  55: [],
  56: [],
  57: [],
  58: [],
  59: [],
  60: ['A#3'],
  61: [],
  62: [],
  63: [],
  64: [],
  65: [],
  66: ['B3'],
  67: [],
  68: [],
  69: [],
  70: [],
  71: [],
  72: ['C4'],
  73: [],
  74: [],
  75: [],
  76: [],
  77: [],
  78: ['C#4'],
  79: [],
  80: [],
  81: [],
  82: [],
  83: [],
  84: ['D4'],
  85: [],
  86: [],
  87: [],
  88: [],
  89: [],
  90: ['D#4'],
  91: [],
  92: [],
  93: [],
  94: [],
  95: [],
  96: ['E4'],
  97: [],
  98: [],
  99: [],
  100: [],
  101: [],
  102: ['F4'],
  103: [],
  104: [],
  105: [],
  106: [],
  107: [],
  108: ['F#4'],
  109: [],
  110: [],
  111: [],
  112: [],
  113: [],
  114: ['G4'],
  115: [],
  116: [],
  117: [],
  118: [],
  119: [],
  120: ['G#4'],
  121: [],
  122: [],
  123: [],
  124: [],
  125: [],
  126: ['A4'],
  127: [],
  128: [],
  129: [],
  130: [],
  131: [],
  132: ['A#4'],
  133: [],
  134: [],
  135: [],
  136: [],
  137: [],
  138: ['B4'],
  139: [],
  140: [],
  141: [],
  142: [],
  143: [],
  144: ['C5'],
  145: [],
  146: [],
  147: [],
  148: [],
  149: [],
  150: ['C#5'],
  151: [],
  152: [],
  153: [],
  154: [],
  155: [],
  156: ['D5'],
  157: [],
  158: [],
  159: [],
  160: [],
  161: [],
  162: ['D#5'],
  163: [],
  164: [],
  165: [],
  166: [],
  167: [],
  168: ['E5'],
  169: [],
  170: [],
  171: [],
  172: [],
  173: [],
  174: ['F5'],
  175: [],
  176: [],
  177: [],
  178: [],
  179: [],
  180: ['F#5'],
  181: [],
  182: [],
  183: [],
  184: [],
  185: [],
  186: ['G5'],
}

describe('getTrackSections', () => {

  beforeEach(() => {
    reporter
      .feature(Feature.MidiParsing)
      .story('Create a list of sections in the track based on the time signature changes so can create phrase array')
  })

  it('creates an array of sections for each time signature in the track', () => {
    const expectedResult: TrackSection[] = [
      {
        notesPerBar: 12,
        bars: 1,
        tick: 0,
        timeSignature: '12/16'
      },
      {
        notesPerBar: 16,
        bars: 2,
        tick: 36,
        timeSignature: '16/16'
      },
      {
        notesPerBar: 18,
        bars: 1,
        tick: 132,
        timeSignature: '18/16'
      }
    ]
    const result = getTrackSections(midi)
    expect(result).toMatchObject(expectedResult)
  })
})

describe('getPhrasesForSection', () => {

  beforeEach(() => {
    reporter
      .feature(Feature.PhraseMapping)
      .story('Create phrase array based on number of 16th notes per bar as defined by time signature')
  })

  it('creates an array of phrases for a 6/8 time signature', () => {
    const expectedResult: TrackPhrase[] = [
      {
        noteCount: 12,
        startTick: 0,
        endTick: 12,
        noteIndexes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
      },
      {
        noteCount: 12,
        startTick: 12,
        endTick: 24,
        noteIndexes: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
      }
    ]
    const result = getPhrasesForSection(trackSections[0], 1)
    expect(result).toMatchObject(expectedResult)
  })
  it('creates an array of phrases for a 4/4 time signature', () => {
    const expectedResult: TrackPhrase[] = [
      {
        noteCount: 16,
        startTick: 0,
        endTick: 16,
        noteIndexes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
      },
      {
        noteCount: 16,
        startTick: 16,
        endTick: 32,
        noteIndexes: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
      }
    ]
    const result = getPhrasesForSection(trackSections[1], 1)
    expect(result).toMatchObject(expectedResult)
  })
  it('creates an array of phrases for a 12/8 time signature', () => {
    const expectedResult: TrackPhrase[] = [
      {
        noteCount: 16,
        startTick: 0,
        endTick: 16,
        noteIndexes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
      },
      {
        noteCount: 8,
        startTick: 16,
        endTick: 24,
        noteIndexes: [16, 17, 18, 19, 20, 21, 22, 23]
      },
      {
        noteCount: 16,
        startTick: 24,
        endTick: 40,
        noteIndexes: [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39]
      },
      {
        noteCount: 8,
        startTick: 40,
        endTick: 48,
        noteIndexes: [40, 41, 42, 43, 44, 45, 46, 47]
      }
    ]
    const result = getPhrasesForSection(trackSections[2], 1)
    expect(result).toMatchObject(expectedResult)
  })
})

describe('getPhrasesNotesAsBase64', () => {

  beforeEach(() => {
    reporter
      .feature(Feature.PhraseMapping)
      .story('Create hash for a phrase based on the notes, triplets and tables in the phrase so can identify duplicate phrases')
  })

  it('converts the list of notes and commands into a base64 string', () => {
    const testNotes = [
      createNote(['C#3', 'C_3']),
      createNote(['G_6']),
      HOP_NOTE
    ]
    const result = getPhrasesNotesAsBase64(testNotes)
    expect(result).toBe('QyMzLUNfMy0tIC1HXzYtLSAtLUgwMC0g')
  })
})

describe('getPhrasesForTrack', () => {

  beforeEach(() => {
    reporter
      .feature(Feature.TrackStructure)
      .story('Creates a new LSDJ Track object with initial phrases')
  })

  it('creates an array of LSDJ phrases for a track', () => {
    const expectedResult: LSDJTrack = {
      chains: [],
      tables: [],
      phrases: [
        createPhrase(
          'Q18zLUQjMy1HXzMtQzM3LSAtLS0gLUMjMy0tIC0tLSAtRF8zLS0gLS0tIC1EIzMtLSAzLTEyLS0tIC1FXzMtLSAtLS0gLUZfMy0tIC0tLSAtLUgwMC0g',
          [
              createNote(['C_3', 'D#3', 'G_3'], 'C37'),
              createNote(),
              createNote(['C#3']),
              createNote(),
              createNote(['D_3']),
              createNote(),
              createNote(['D#3'], '', [3, 12]),
              createNote(),
              createNote(['E_3']),
              createNote(),
              createNote(['F_3']),
              createNote(),
              HOP_NOTE
            ]
        ),
        createPhrase(
          'RiMzLS0gLS0tIC1HXzMtLSAtLS0gLUcjMy0tIC0tLSAtQV8zLS0gLS0tIC1BIzMtLSAtLS0gLUJfMy0tIC0tLSAtQ180LS0gLS0tIC1DIzQtLSAtLS0g',
          [
            createNote(['F#3']),
            createNote(),
            createNote(['G_3']),
            createNote(),
            createNote(['G#3']),
            createNote(),
            createNote(['A_3']),
            createNote(),
            createNote(['A#3']),
            createNote(),
            createNote(['B_3']),
            createNote(),
            createNote(['C_4']),
            createNote(),
            createNote(['C#4']),
            createNote()
          ],
          36
        ),
        createPhrase(
          'RF80LS0gLS0tIC1EIzQtLSAtLS0gLUVfNC0tIC0tLSAtRl80LS0gLS0tIC1GIzQtLSAtLS0gLUdfNC0tIC0tLSAtRyM0LS0gLS0tIC1BXzQtLSAtLS0g',
          [
            createNote(['D_4']),
            createNote(),
            createNote(['D#4']),
            createNote(),
            createNote(['E_4']),
            createNote(),
            createNote(['F_4']),
            createNote(),
            createNote(['F#4']),
            createNote(),
            createNote(['G_4']),
            createNote(),
            createNote(['G#4']),
            createNote(),
            createNote(['A_4']),
            createNote()
          ],
          84
        ),
        createPhrase(
          'QSM0LS0gLS0tIC1CXzQtLSAtLS0gLUNfNS0tIC0tLSAtQyM1LS0gLS0tIC1EXzUtLSAtLS0gLUQjNS0tIC0tLSAtRV81LS0gLS0tIC1GXzUtLSAtLS0g',
          [
            createNote(['A#4']),
            createNote(),
            createNote(['B_4']),
            createNote(),
            createNote(['C_5']),
            createNote(),
            createNote(['C#5']),
            createNote(),
            createNote(['D_5']),
            createNote(),
            createNote(['D#5']),
            createNote(),
            createNote(['E_5']),
            createNote(),
            createNote(['F_5']),
            createNote()
          ],
          132
        ),
        createPhrase(
           'RiM1LS0gLS0tIC0tSDAwLSA=',
          [
            createNote(['F#5']),
            createNote(),
            HOP_NOTE
          ],
          180
        )
      ]
    }
    const result = getPhrasesForTrack(trackNotes, midi, new Map<number, TrackPitchBend>(), false)
    expect(result).toMatchObject(expectedResult)
  })
})

const deltaEdgescases = [
  {
    name: 'F_3 -> F#3',
    triplet: 'F#3',
    root: 'F3',
    delta: 1
  },
  {
    name: 'F_3 -> G_3',
    triplet: 'G3',
    root: 'F3',
    delta: 2
  },
  {
    name: 'G_5 -> F_4',
    triplet: 'F4',
    root: 'G5',
    delta: -14
  },
  {
    name: 'G_4 -> F_4',
    triplet: 'F4',
    root: 'G4',
    delta: -2
  }
]

describe('calculateTripletDelta', () => {

  beforeEach(() => {
    reporter
      .feature(Feature.TableMapping)
      .story('Calculate the delta between notes in a tuplet so can convert into transpose command in table')
  })

  it('returns the number of semi-tones between the root note and the triplet note', () => {
    const result = calculateNoteDelta('A#3', 'C#3')
    expect(result).toBe(-9)
  })
  it.each(deltaEdgescases)('compensates for the freq chart starting at F - ${name}', ({ triplet, root, delta}) => {
    expect(calculateNoteDelta(root, triplet)).toBe(delta)
  })
})

// 0 - 36 = 6, 8
// 36 - 132 = 4, 4
// 132 = 9, 8

// 0 - eB = 0 / 1 (0), eM = 0 / 6 / 2 (0), m = 0 + 0
// 1 - eB = 36 / 1 (36), eM = 36 / 6 / 2 (3), m = 3 + 0
// 2 - eB = 96 / 1 (96), eM = 96 / 4 / 1 (24), m = 24 + 3