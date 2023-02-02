import {getTrackNotes} from "./getTrackNotes";
import {Feature} from "../test/allure";
import {Midi} from "@tonejs/midi";
import { note } from '@tonaljs/core'

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
        ticks: 2,
        timeSignature: [4, 4]
      }
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
          ticks: 0,
          durationTicks: 2,
          midi: note('E3').midi as number,
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
      pitchBends: [],
      endOfTrackTicks: 10
    }
  ]
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
      8: ['C3']
    }
    const result = getTrackNotes(midi, 0)
    expect(result).toMatchObject(expectedResult)
  })
})