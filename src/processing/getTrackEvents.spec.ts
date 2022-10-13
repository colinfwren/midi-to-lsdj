import { getTrackEvents } from "./getTrackEvents";
import {
  createTempoEvent,
  createEndOfTrackEvent,
  createTimeSignatureEvent,
} from "../test/midiEvents";
import {TrackEvents} from "../types";

const testTrack = [
  createTempoEvent(0, 120),
  createTimeSignatureEvent(0, [6, 8]),
  createTimeSignatureEvent(1, [4, 4]),
  createTimeSignatureEvent(666, [6, 8]),
  createTimeSignatureEvent(1337, [3, 2]),
  createTempoEvent(666, 160),
  createEndOfTrackEvent(0)
]


describe('getTrackEvents', () => {
  it('counts up the ticks for each event so they can be plotted in absolute time', () => {
    const expectedResult: TrackEvents = {
      timeSignatures: [
        {
          tick: 0,
          event: testTrack[1]
        },
        {
          tick: 1,
          event: testTrack[2]
        },
        {
          tick: 667,
          event: testTrack[3]
        },
        {
          tick: 2004,
          event: testTrack[4]
        }
      ],
      endOfSong: {
        tick: 2670,
        event: testTrack[6]
      },
      tempos: [
        {
          tick: 0,
          event: testTrack[0]
        },
        {
          tick: 2670,
          event: testTrack[5]
        }
      ],
      semiQuaver: 120
    }
    const result = getTrackEvents(testTrack)
    expect(result).toMatchObject(expectedResult)
  })
  it('calculates the value of an eighth note based on the ticksPerBeat from track header data', () => {
    const result = getTrackEvents(testTrack, 960)
    expect(result.semiQuaver).toBe(240)
  })
  it('defaults the value of an eighth note to 120', () => {
    const result = getTrackEvents(testTrack)
    expect(result.semiQuaver).toBe(120)
  })
})