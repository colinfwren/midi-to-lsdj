import {
  getPhrasesForSection,
  getPhrasesForTrack,
  getTrackSections,
  getPhrasesNotesAsBase64,
  calculateTripletDelta
} from './getTrackPhrases';
import {TrackEvents, TrackNotes, TrackPhrase, TrackSection, LSDJTrack} from '../types';
import {createEndOfTrackEvent, createTempoEvent, createTimeSignatureEvent} from '../test/midiEvents';

const trackEvents: TrackEvents = {
  timeSignatures: [
    {
      tick: 0,
      event: createTimeSignatureEvent(0, [6, 8])
    },
    {
      tick: 36,
      event: createTimeSignatureEvent(0, [4, 4])
    },
    {
      tick: 132,
      event: createTimeSignatureEvent(0, [9, 8])
    }
  ],
  tempos: [
    {
      tick: 0,
      event: createTempoEvent(0, 120)
    }
  ],
  endOfSong: {
    tick: 186,
    event: createEndOfTrackEvent(0)
  },
  semiQuaver: 3,
}

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
  tick: 0,
  event: {
    channel: 1,
    type: "noteOn",
    deltaTime: 0,
    noteNumber: 0,
    velocity: 1,
  },
  0: ['C3'],
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
    const result = getTrackSections(trackEvents)
    expect(result).toMatchObject(expectedResult)
  })
})

describe('getPhrasesForSection', () => {
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
  it('converts the list of notes and commands into a base64 string', () => {
    const testNotes = [
      {
        notes: ['C#3', 'C_3'],
        command: '',
        triplets: []
      },
      {
        notes: ['G_6'],
        command: '',
        triplets: []
      },
      {
        notes: [],
        command: 'H00',
        triplets: []
      }
    ]
    const result = getPhrasesNotesAsBase64(testNotes)
    expect(result).toBe('QyMzLUNfMy0tIC1HXzYtLSAtLUgwMC0g')
  })
})

describe('getPhrasesForTrack', () => {
  it('creates an array of LSDJ phrases for a track', () => {
    const expectedResult: LSDJTrack = {
      chains: [],
      tables: [],
      phrases: [
          {
            noteCount: 12,
            startTick: 0,
            endTick: 36,
            key: 'Q18zLS0gLS0tIC1DIzMtLSAtLS0gLURfMy0tIC0tLSAtRCMzLS0gMy0xMi0tLSAtRV8zLS0gLS0tIC1GXzMtLSAtLS0gLS1IMDAtIA==',
            notes: [
              {
                notes: ['C_3'],
                command: '',
                triplets: []
              },
              {
                notes: [],
                command: '',
                triplets: []
              },
              {
                notes: ['C#3'],
                command: '',
                triplets: []
              },
              {
                notes: [],
                command: '',
                triplets: []
              },
              {
                notes: ['D_3'],
                command: '',
                triplets: []
              },
              {
                notes: [],
                command: '',
                triplets: []
              },
              {
                notes: ['D#3'],
                command: '',
                triplets: [3, 12]
              },
              {
                notes: [],
                command: '',
                triplets: []
              },
              {
                notes: ['E_3'],
                command: '',
                triplets: []
              },
              {
                notes: [],
                command: '',
                triplets: []
              },
              {
                notes: ['F_3'],
                command: '',
                triplets: []
              },
              {
                notes: [],
                command: '',
                triplets: []
              },
              {
                notes: [],
                command: 'H00',
                triplets: []
              },
            ]
          },
        {
        noteCount: 16,
        startTick: 36,
        endTick: 84,
        key: 'RiMzLS0gLS0tIC1HXzMtLSAtLS0gLUcjMy0tIC0tLSAtQV8zLS0gLS0tIC1BIzMtLSAtLS0gLUJfMy0tIC0tLSAtQ180LS0gLS0tIC1DIzQtLSAtLS0g',
        notes: [
          {
            notes: ['F#3'],
            command: '',
            triplets: []
          },
          {
            notes: [],
            command: '',
            triplets: []
          },
          {
            notes: ['G_3'],
            command: '',
            triplets: []
          },
          {
            notes: [],
            command: '',
            triplets: []
          },
          {
            notes: ['G#3'],
            command: '',
            triplets: []
          },
          {
            notes: [],
            command: '',
            triplets: []
          },
          {
            notes: ['A_3'],
            command: '',
            triplets: []
          },
          {
            notes: [],
            command: '',
            triplets: []
          },
          {
            notes: ['A#3'],
            command: '',
            triplets: []
          },
          {
            notes: [],
            command: '',
            triplets: []
          },
          {
            notes: ['B_3'],
            command: '',
            triplets: []
          },
          {
            notes: [],
            command: '',
            triplets: []
          },
          {
            notes: ['C_4'],
            command: '',
            triplets: []
          },
          {
            notes: [],
            command: '',
            triplets: []
          },
          {
            notes: ['C#4'],
            command: '',
            triplets: []
          },
          {
            notes: [],
            command: '',
            triplets: []
          }
        ]
      },
      {
        noteCount: 16,
        startTick: 84,
        endTick: 132,
        key: 'RF80LS0gLS0tIC1EIzQtLSAtLS0gLUVfNC0tIC0tLSAtRl80LS0gLS0tIC1GIzQtLSAtLS0gLUdfNC0tIC0tLSAtRyM0LS0gLS0tIC1BXzQtLSAtLS0g',
        notes: [
          {
            notes: ['D_4'],
            command: '',
            triplets: []
          },
          {
            notes: [],
            command: '',
            triplets: []
          },
          {
            notes: ['D#4'],
            command: '',
            triplets: []
          },
          {
            notes: [],
            command: '',
            triplets: []
          },
          {
            notes: ['E_4'],
            command: '',
            triplets: []
          },
          {
            notes: [],
            command: '',
            triplets: []
          },
          {
            notes: ['F_4'],
            command: '',
            triplets: []
          },
          {
            notes: [],
            command: '',
            triplets: []
          },
          {
            notes: ['F#4'],
            command: '',
            triplets: []
          },
          {
            notes: [],
            command: '',
            triplets: []
          },
          {
            notes: ['G_4'],
            command: '',
            triplets: []
          },
          {
            notes: [],
            command: '',
            triplets: []
          },
          {
            notes: ['G#4'],
            command: '',
            triplets: []
          },
          {
            notes: [],
            command: '',
            triplets: []
          },
          {
            notes: ['A_4'],
            command: '',
            triplets: []
          },
          {
            notes: [],
            command: '',
            triplets: []
          }
        ]
      },
        {
        noteCount: 16,
        startTick: 132,
        endTick: 180,
        key: 'QSM0LS0gLS0tIC1CXzQtLSAtLS0gLUNfNS0tIC0tLSAtQyM1LS0gLS0tIC1EXzUtLSAtLS0gLUQjNS0tIC0tLSAtRV81LS0gLS0tIC1GXzUtLSAtLS0g',
        notes: [
          {
            notes: ['A#4'],
            command: '',
            triplets: []
          },
          {
            notes: [],
            command: '',
            triplets: []
          },
          {
            notes: ['B_4'],
            command: '',
            triplets: []
          },
          {
            notes: [],
            command: '',
            triplets: []
          },
          {
            notes: ['C_5'],
            command: '',
            triplets: []
          },
          {
            notes: [],
            command: '',
            triplets: []
          },
          {
            notes: ['C#5'],
            command: '',
            triplets: []
          },
          {
            notes: [],
            command: '',
            triplets: []
          },
          {
            notes: ['D_5'],
            command: '',
            triplets: []
          },
          {
            notes: [],
            command: '',
            triplets: []
          },
          {
            notes: ['D#5'],
            command: '',
            triplets: []
          },
          {
            notes: [],
            command: '',
            triplets: []
          },
          {
            notes: ['E_5'],
            command: '',
            triplets: []
          },
          {
            notes: [],
            command: '',
            triplets: []
          },
          {
            notes: ['F_5'],
            command: '',
            triplets: []
          },
          {
            notes: [],
            command: '',
            triplets: []
          }
        ]
      },
      {
        noteCount: 2,
        startTick: 180,
        endTick: 186,
        key: 'RiM1LS0gLS0tIC0tSDAwLSA=',
        notes: [
          {
            notes: ['F#5'],
            command: '',
            triplets: []
          },
          {
            notes: [],
            command: '',
            triplets: []
          },
          {
            notes: [],
            command: 'H00',
            triplets: []
          }
        ]
      }
      ]
    }
    const result = getPhrasesForTrack(trackNotes, trackEvents)
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
  it('returns the number of semi-tones between the root note and the triplet note', () => {
    const result = calculateTripletDelta('A#3', 'C#3')
    expect(result).toBe(-9)
  })
  it.each(deltaEdgescases)('compensates for the freq chart starting at F - ${name}', ({ triplet, root, delta}) => {
    expect(calculateTripletDelta(root, triplet)).toBe(delta)
  })
})