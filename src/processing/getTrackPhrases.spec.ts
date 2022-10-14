import {getPhrasesForSection, getPhrasesForTrack, getTrackSections, getPhrasesNotesAsBase64 } from './getTrackPhrases';
import {LSDJPhrase, TrackEvents, TrackNotes, TrackPhrase, TrackSection} from '../types';
import {createEndOfTrackEvent, createTempoEvent, createTimeSignatureEvent} from '../test/midiEvents';

const trackEvents: TrackEvents = {
  timeSignatures: [
    {
      tick: 0,
      event: createTimeSignatureEvent(0, [6, 8])
    },
    {
      tick: 12,
      event: createTimeSignatureEvent(0, [4, 4])
    },
    {
      tick: 44,
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
    tick: 62,
    event: createEndOfTrackEvent(0)
  },
  semiQuaver: 1,
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
  2: ['C#_3'],
  3: [],
  4: ['D_3'],
  5: [],
  6: ['D#_3'],
  7: [],
  8: ['E_3'],
  9: [],
  10: ['F_3'],
  11: [],
  12: ['F#_3'],
  13: [],
  14: ['G_3'],
  15: [],
  16: ['G#_3'],
  17: [],
  18: ['A_3'],
  19: [],
  20: ['A#_3'],
  21: [],
  22: ['B_3'],
  23: [],
  24: ['C_4'],
  25: [],
  26: ['C#_4'],
  27: [],
  28: ['D_4'],
  29: [],
  30: ['D#_4'],
  31: [],
  32: ['E_4'],
  33: [],
  34: ['F_4'],
  35: [],
  36: ['F#_4'],
  37: [],
  38: ['G_4'],
  39: [],
  40: ['G#_4'],
  41: [],
  42: ['A_4'],
  43: [],
  44: ['A#_4'],
  45: [],
  46: ['B_4'],
  47: [],
  48: ['C_5'],
  49: [],
  50: ['C#_5'],
  51: [],
  52: ['D_5'],
  53: [],
  54: ['D#_5'],
  55: [],
  56: ['E_5'],
  57: [],
  58: ['F_5'],
  59: [],
  60: ['F#_5'],
  61: [],
  62: ['G_5'],
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
        tick: 12,
        timeSignature: '16/16'
      },
      {
        notesPerPhrase: 18,
        bars: 1,
        tick: 44,
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
        command: ''
      },
      {
        notes: ['G_6'],
        command: ''
      },
      {
        notes: [],
        command: 'H00'
      }
    ]
    const result = getPhrasesNotesAsBase64(testNotes)
    expect(result).toBe('QyNfMy1DXzMtLUdfNi0tLUgwMA==')
  })
})

describe('getPhrasesForTrack', () => {
  it('creates an array of LSDJ phrases for a track', () => {
    const expectedResult: LSDJPhrase[] = [
      {
        noteCount: 12,
        startTick: 0,
        endTick: 12,
        key: 'Q18zLS0tLUMjXzMtLS0tRF8zLS0tLUQjXzMtLS0tRV8zLS0tLUZfMy0tLS0tSDAw',
        notes: [
          {
            notes: ['C_3'],
            command: ''
          },
          {
            notes: [],
            command: ''
          },
          {
            notes: ['C#_3'],
            command: ''
          },
          {
            notes: [],
            command: ''
          },
          {
            notes: ['D_3'],
            command: ''
          },
          {
            notes: [],
            command: ''
          },
          {
            notes: ['D#_3'],
            command: ''
          },
          {
            notes: [],
            command: ''
          },
          {
            notes: ['E_3'],
            command: ''
          },
          {
            notes: [],
            command: ''
          },
          {
            notes: ['F_3'],
            command: ''
          },
          {
            notes: [],
            command: ''
          },
          {
            notes: [],
            command: 'H00'
          },
        ]
      },
      {
        noteCount: 16,
        startTick: 12,
        endTick: 28,
        key: 'RiNfMy0tLS1HXzMtLS0tRyNfMy0tLS1BXzMtLS0tQSNfMy0tLS1CXzMtLS0tQ180LS0tLUMjXzQtLS0=',
        notes: [
          {
            notes: ['F#_3'],
            command: ''
          },
          {
            notes: [],
            command: ''
          },
          {
            notes: ['G_3'],
            command: ''
          },
          {
            notes: [],
            command: ''
          },
          {
            notes: ['G#_3'],
            command: ''
          },
          {
            notes: [],
            command: ''
          },
          {
            notes: ['A_3'],
            command: ''
          },
          {
            notes: [],
            command: ''
          },
          {
            notes: ['A#_3'],
            command: ''
          },
          {
            notes: [],
            command: ''
          },
          {
            notes: ['B_3'],
            command: ''
          },
          {
            notes: [],
            command: ''
          },
          {
            notes: ['C_4'],
            command: ''
          },
          {
            notes: [],
            command: ''
          },
          {
            notes: ['C#_4'],
            command: ''
          },
          {
            notes: [],
            command: ''
          }
        ]
      },
      {
        noteCount: 16,
        startTick: 28,
        endTick: 44,
        key: 'RF80LS0tLUQjXzQtLS0tRV80LS0tLUZfNC0tLS1GI180LS0tLUdfNC0tLS1HI180LS0tLUFfNC0tLQ==',
        notes: [
          {
            notes: ['D_4'],
            command: ''
          },
          {
            notes: [],
            command: ''
          },
          {
            notes: ['D#_4'],
            command: ''
          },
          {
            notes: [],
            command: ''
          },
          {
            notes: ['E_4'],
            command: ''
          },
          {
            notes: [],
            command: ''
          },
          {
            notes: ['F_4'],
            command: ''
          },
          {
            notes: [],
            command: ''
          },
          {
            notes: ['F#_4'],
            command: ''
          },
          {
            notes: [],
            command: ''
          },
          {
            notes: ['G_4'],
            command: ''
          },
          {
            notes: [],
            command: ''
          },
          {
            notes: ['G#_4'],
            command: ''
          },
          {
            notes: [],
            command: ''
          },
          {
            notes: ['A_4'],
            command: ''
          },
          {
            notes: [],
            command: ''
          }
        ]
      },
      {
        noteCount: 16,
        startTick: 44,
        endTick: 60,
        key: 'QSNfNC0tLS1CXzQtLS0tQ181LS0tLUMjXzUtLS0tRF81LS0tLUQjXzUtLS0tRV81LS0tLUZfNS0tLQ==',
        notes: [
          {
            notes: ['A#_4'],
            command: ''
          },
          {
            notes: [],
            command: ''
          },
          {
            notes: ['B_4'],
            command: ''
          },
          {
            notes: [],
            command: ''
          },
          {
            notes: ['C_5'],
            command: ''
          },
          {
            notes: [],
            command: ''
          },
          {
            notes: ['C#_5'],
            command: ''
          },
          {
            notes: [],
            command: ''
          },
          {
            notes: ['D_5'],
            command: ''
          },
          {
            notes: [],
            command: ''
          },
          {
            notes: ['D#_5'],
            command: ''
          },
          {
            notes: [],
            command: ''
          },
          {
            notes: ['E_5'],
            command: ''
          },
          {
            notes: [],
            command: ''
          },
          {
            notes: ['F_5'],
            command: ''
          },
          {
            notes: [],
            command: ''
          }
        ]
      },
      {
        noteCount: 2,
        startTick: 60,
        endTick: 62,
        key: 'RiNfNS0tLS0tSDAw',
        notes: [
          {
            notes: ['F#_5'],
            command: ''
          },
          {
            notes: [],
            command: ''
          },
          {
            notes: [],
            command: 'H00'
          }
        ]
      }
    ]
    const result = getPhrasesForTrack(trackNotes, trackEvents)
    expect(result).toMatchObject(expectedResult)
  })
})