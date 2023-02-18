import {Feature} from "../test/allure";
import {Midi} from "@tonejs/midi";
import { note } from '@tonaljs/core'
import { getTrackPitchBends } from "./getTrackPitchBends";
import {TrackPitchBend} from "../types";

const PITCH_BEND = 0.015625

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
    ],
    keySignatures: [],
    meta: [],
    ppq: 24,
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
          ticks: 2,
          durationTicks: 6,
          midi: note('D#3').midi as number,
          velocity: 0,
          time: 0,
          name: '',
          duration: 0,
        },
        {
          ticks: 8,
          durationTicks: 2,
          midi: note('C3').midi as number,
          velocity: 0,
          time: 0,
          name: '',
          duration: 0,
        }
      ],
      channel: 1,
      controlChanges: {},
      pitchBends: [
        {
          ticks: 3,
          value: PITCH_BEND,
          time: 0
        }
      ],
      endOfTrackTicks: 10
    }
  ]
})
// Need to add as fromJSON doesn't seem to add pitch bends to track
midi.tracks[0].addPitchBend({
  ticks: 3,
  value: PITCH_BEND
}).addPitchBend({
  ticks: 4,
  value: 0
})

describe('Getting map of pitch bends at tick for track', () => {

  beforeEach(() => {
    reporter
      .feature(Feature.MidiParsing)
      .story('Create a map of ticks -> pitch bends at tick')
  })

  it('returns a Map for non-zero pitch bends at note tick', () => {
    const expectedResult = new Map<number, TrackPitchBend>([
      [2, {value: PITCH_BEND, duration: 6}]
    ])
    const result = getTrackPitchBends(midi, 0)
    expect(result).toMatchObject(expectedResult)
  })
})