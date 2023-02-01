import {
  createNoteOnEvent,
  createNoteOffEvent,
  createTempoEvent,
  createTimeSignatureEvent,
  createEndOfTrackEvent
} from "../test/midiEvents";
import {getNoteOnEvents, getTrackNotes} from "./getTrackNotes";
import {Feature} from "../test/allure";

const track = [
  createNoteOnEvent(0),
  createNoteOnEvent(0, 'E3'),
  createNoteOffEvent(2),
  createNoteOffEvent(0, 'E3'),
  createNoteOnEvent(0, 'D#3'),
  createNoteOffEvent(6, 'D#3'),
  createNoteOnEvent(0),
  createNoteOffEvent(2)
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

  beforeEach(() => {
    reporter
      .feature(Feature.MidiParsing)
      .story('Create an array of when notes are played at absolute tick resolution')
  })

  it('returns noteOn events only', () => {
    const expectedResult = {
      tick: 10,
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
          tick: 2,
          event: track[4]
        },
        {
          tick: 8,
          event: track[6]
        }
      ]
    }
    const result = getNoteOnEvents(track)
    expect(result).toMatchObject(expectedResult)
  })
})

describe('Getting absolute notes for track', () => {

  beforeEach(() => {
    reporter
      .feature(Feature.MidiParsing)
      .story('Create a map of ticks -> notes played at tick')
  })

  it('returns a key/value pair for notes at each 16th note in the track', () => {
    const expectedResult = {
      0: ['C3', 'E3'],
      2: ['D#3'],
      4: [],
      6: [],
      8: ['C3'],
      10: [],
    }
    const result = getTrackNotes(track, {
      ...trackEvents,
      semiQuaver: 6,
      endOfSong: {
        ...trackEvents.endOfSong,
        tick: 12
      }
    })
    expect(result).toMatchObject(expectedResult)
  })
})