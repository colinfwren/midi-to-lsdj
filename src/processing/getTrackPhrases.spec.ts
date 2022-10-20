import {
  getPhrasesForSection,
  getPhrasesForTrack,
  getTrackSections,
  getPhrasesNotesAsBase64,
  calculateTripletDelta
} from './getTrackPhrases';
import {LSDJPhrase, TrackEvents, TrackNotes, TrackPhrase, TrackSection} from '../types';
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
    notesPerPhrase: 12,
    bars: 2,
    tick: 0,
    timeSignature: '12/16' // 6/8
  },
  {
    notesPerPhrase: 16,
    bars: 2,
    tick: 0,
    timeSignature: '16/16' // 4/4
  },
  {
    notesPerPhrase: 24,
    bars: 2,
    tick: 0,
    timeSignature: '24/16' // 12/8
  }
]

const trackNotes: TrackNotes = {
  0: ['C_3'],
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: ['C#_3'],
  7: [],
  8: [],
  9: [],
  10: [],
  11: [],
  12: ['D_3'],
  13: [],
  14: [],
  15: [],
  16: [],
  17: [],
  18: ['D#_3'],
  19: ['F#_3'],
  20: ['D#_4'],
  21: [],
  22: [],
  23: [],
  24: ['E_3'],
  25: [],
  26: [],
  27: [],
  28: [],
  29: [],
  30: ['F_3'],
  31: [],
  32: [],
  33: [],
  34: [],
  35: [],
  36: ['F#_3'],
  37: [],
  38: [],
  39: [],
  40: [],
  41: [],
  42: ['G_3'],
  43: [],
  44: [],
  45: [],
  46: [],
  47: [],
  48: ['G#_3'],
  49: [],
  50: [],
  51: [],
  52: [],
  53: [],
  54: ['A_3'],
  55: [],
  56: [],
  57: [],
  58: [],
  59: [],
  60: ['A#_3'],
  61: [],
  62: [],
  63: [],
  64: [],
  65: [],
  66: ['B_3'],
  67: [],
  68: [],
  69: [],
  70: [],
  71: [],
  72: ['C_4'],
  73: [],
  74: [],
  75: [],
  76: [],
  77: [],
  78: ['C#_4'],
  79: [],
  80: [],
  81: [],
  82: [],
  83: [],
  84: ['D_4'],
  85: [],
  86: [],
  87: [],
  88: [],
  89: [],
  90: ['D#_4'],
  91: [],
  92: [],
  93: [],
  94: [],
  95: [],
  96: ['E_4'],
  97: [],
  98: [],
  99: [],
  100: [],
  101: [],
  102: ['F_4'],
  103: [],
  104: [],
  105: [],
  106: [],
  107: [],
  108: ['F#_4'],
  109: [],
  110: [],
  111: [],
  112: [],
  113: [],
  114: ['G_4'],
  115: [],
  116: [],
  117: [],
  118: [],
  119: [],
  120: ['G#_4'],
  121: [],
  122: [],
  123: [],
  124: [],
  125: [],
  126: ['A_4'],
  127: [],
  128: [],
  129: [],
  130: [],
  131: [],
  132: ['A#_4'],
  133: [],
  134: [],
  135: [],
  136: [],
  137: [],
  138: ['B_4'],
  139: [],
  140: [],
  141: [],
  142: [],
  143: [],
  144: ['C_5'],
  145: [],
  146: [],
  147: [],
  148: [],
  149: [],
  150: ['C#_5'],
  151: [],
  152: [],
  153: [],
  154: [],
  155: [],
  156: ['D_5'],
  157: [],
  158: [],
  159: [],
  160: [],
  161: [],
  162: ['D#_5'],
  163: [],
  164: [],
  165: [],
  166: [],
  167: [],
  168: ['E_5'],
  169: [],
  170: [],
  171: [],
  172: [],
  173: [],
  174: ['F_5'],
  175: [],
  176: [],
  177: [],
  178: [],
  179: [],
  180: ['F#_5'],
  181: [],
  182: [],
  183: [],
  184: [],
  185: [],
  186: ['G_5'],
}

describe('getTrackSections', () => {
  it('creates an array of sections for each time signature in the track', () => {
    const expectedResult: TrackSection[] = [
      {
        notesPerPhrase: 12,
        bars: 1,
        tick: 0,
        timeSignature: '12/16'
      },
      {
        notesPerPhrase: 16,
        bars: 2,
        tick: 36,
        timeSignature: '16/16'
      },
      {
        notesPerPhrase: 18,
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
        notes: ['C#_3', 'C_3'],
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
    expect(result).toBe('QyNfMy1DXzMtLSAtR182LS0gLS1IMDAtIA==')
  })
})

describe('getPhrasesForTrack', () => {
  it('creates an array of LSDJ phrases for a track', () => {
    const expectedResult: LSDJPhrase[] = [
      {
        noteCount: 12,
        startTick: 0,
        endTick: 36,
        key: 'Q18zLS0gLS0tIC1DI18zLS0gLS0tIC1EXzMtLSAtLS0gLUQjXzMtLSAzLTEyLS0tIC1FXzMtLSAtLS0gLUZfMy0tIC0tLSAtLUgwMC0g',
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
            notes: ['C#_3'],
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
            notes: ['D#_3'],
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
        key: 'RiNfMy0tIC0tLSAtR18zLS0gLS0tIC1HI18zLS0gLS0tIC1BXzMtLSAtLS0gLUEjXzMtLSAtLS0gLUJfMy0tIC0tLSAtQ180LS0gLS0tIC1DI180LS0gLS0tIA==',
        notes: [
          {
            notes: ['F#_3'],
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
            notes: ['G#_3'],
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
            notes: ['A#_3'],
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
            notes: ['C#_4'],
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
        key: 'RF80LS0gLS0tIC1EI180LS0gLS0tIC1FXzQtLSAtLS0gLUZfNC0tIC0tLSAtRiNfNC0tIC0tLSAtR180LS0gLS0tIC1HI180LS0gLS0tIC1BXzQtLSAtLS0g',
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
            notes: ['D#_4'],
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
            notes: ['F#_4'],
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
            notes: ['G#_4'],
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
        key: 'QSNfNC0tIC0tLSAtQl80LS0gLS0tIC1DXzUtLSAtLS0gLUMjXzUtLSAtLS0gLURfNS0tIC0tLSAtRCNfNS0tIC0tLSAtRV81LS0gLS0tIC1GXzUtLSAtLS0g',
        notes: [
          {
            notes: ['A#_4'],
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
            notes: ['C#_5'],
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
            notes: ['D#_5'],
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
        key: 'RiNfNS0tIC0tLSAtLUgwMC0g',
        notes: [
          {
            notes: ['F#_5'],
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
    const result = getPhrasesForTrack(trackNotes, trackEvents)
    expect(result).toMatchObject(expectedResult)
  })
})

const deltaEdgescases = [
  {
    name: 'F_3 -> F#_3',
    triplet: ['F#_3'],
    root: ['F_3'],
    delta: 1
  },
  {
    name: 'F_3 -> G_3',
    triplet: ['G_3'],
    root: ['F_3'],
    delta: 2
  },
  {
    name: 'G_5 -> F_4',
    triplet: ['F_4'],
    root: ['G_5'],
    delta: -14
  },
  {
    name: 'G_4 -> F_4',
    triplet: ['F_4'],
    root: ['G_4'],
    delta: -2
  }
]

describe('calculateTripletDelta', () => {
  it('returns the number of semi-tones between the root note and the triplet note', () => {
    const result = calculateTripletDelta(['A#_3'], ['C#_3'])
    expect(result).toBe(3)
  })
  it.each(deltaEdgescases)('compensates for the freq chart starting at F - ${name}', ({ triplet, root, delta}) => {
    expect(calculateTripletDelta(root, triplet)).toBe(delta)
  })
})