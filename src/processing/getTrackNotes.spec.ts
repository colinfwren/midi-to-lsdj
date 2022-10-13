import {
  createNoteOnEvent,
  createNoteOffEvent,
  createTempoEvent,
  createTimeSignatureEvent,
  createEndOfTrackEvent
} from "../test/midiEvents";
import {getNoteOnEvents, getTrackNotes} from "./getTrackNotes";

const track = [
  createNoteOnEvent(0),
  createNoteOnEvent(0, 'E_3'),
  createNoteOffEvent(1),
  createNoteOffEvent(0, 'E_3'),
  createNoteOnEvent(0, 'D_3'),
  createNoteOffEvent(6, 'D_3'),
  createNoteOnEvent(0),
  createNoteOffEvent(1)
]

const trackEvents = {
  timeSignatures: [
    {
      tick: 0,
      event: createTimeSignatureEvent(0, [6, 8]),
    },
    {
      tick: 2,
      event: createTimeSignatureEvent(2, [4, 4]),
    }
  ],
  tempos: [
    {
      tick: 0,
      event: createTempoEvent(0, 120),
    }
  ],
  endOfSong: {
    tick: 8,
    event: createEndOfTrackEvent(0)
  },
  semiQuaver: 1
}

describe('Getting noteOn events in track', () => {
  it('returns noteOn events only', () => {
    const expectedResult = {
      tick: 8,
      notes: [
        {
          tick: 0,
          event: track[0]
        },
        {
          tick: 0,
          event: track[1]
        },
        {
          tick: 1,
          event: track[4]
        },
        {
          tick: 7,
          event: track[6]
        }
      ]
    }
    const result = getNoteOnEvents(track)
    expect(result).toMatchObject(expectedResult)
  })
})

describe('Getting absolute notes for track', () => {
  it('returns a key/value pair for notes at each 16th note in the track', () => {
    const expectedResult = {
      0: ['C_3', 'E_3'],
      1: ['D_3'],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: ['C_3']
    }
    const result = getTrackNotes(track, trackEvents)
    expect(result).toMatchObject(expectedResult)
  })
})