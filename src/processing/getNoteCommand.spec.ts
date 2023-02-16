import {Feature} from "../test/allure";
import {Midi} from "@tonejs/midi";
import {note} from "@tonaljs/core";
import {getNoteCommand, NoteInfo, processTempoCommand} from "./getNoteCommand";

const baseTrack = {
  header: {
    name: 'Test midi file',
    tempos: [
      {
        ticks: 0,
        bpm: 120
      }
    ],
    timeSignatures: [
      {
        ticks: 0,
        timeSignature: [4, 4]
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
          ticks: 36,
          durationTicks: 2,
          midi: note('F#3').midi as number,
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
}

const midi = new Midi()
midi.fromJSON(baseTrack)

const tempoChangeMidi = new Midi()
tempoChangeMidi.fromJSON({
  ...baseTrack,
  header: {
    ...baseTrack.header,
    tempos: [
      ...baseTrack.header.tempos,
      {
        ticks: 36,
        bpm: 180
      }
    ]
  }
})

describe('Setting tempo command for a note that falls on a tempo change', () => {

  beforeEach(() => {
    reporter
      .feature(Feature.CommandMapping)
      .story('Tempo Command')
      .description('Set Tempo Command on notes that have tempo change at that tick')
  })

  it("Sets tempo command for note when there's a tempo change at that tick", () => {
    const input: NoteInfo = {
      noteIndex: 36,
      midiData: tempoChangeMidi,
      notes: ['F#3'],
      hasTuplet: false,
      command: ''
    }
    const expectedResult: NoteInfo = {
      ...input,
      command: 'TB4'
    }
    expect(processTempoCommand(input)).toMatchObject(expectedResult)
  })

  it("Doesn't set a tempo command for note if the note index is 0 as this is the song's initial tempo", () => {
    const input: NoteInfo = {
      noteIndex: 0,
      midiData: midi,
      notes: ['F#3'],
      hasTuplet: false,
      command: ''
    }
    expect(processTempoCommand(input)).toMatchObject(input)
  })

  it("Doesn't set a tempo command for note when there isn't a tempo change at that tick", () => {
    const input: NoteInfo = {
      noteIndex: 36,
      midiData: midi,
      notes: ['F#3'],
      hasTuplet: false,
      command: ''
    }
    expect(processTempoCommand(input)).toMatchObject(input)
  })
})

describe('Getting command for note at tick', () => {
  it('Returns tempo command if tempo change happens at note tick', () => {
    expect(getNoteCommand(36, tempoChangeMidi, ['F#3'], false)).toBe('TB4')
  })
  it('Returns empty string if no events happen at note tick', () => {
    expect(getNoteCommand(36, midi, ['F#3'], false)).toBe('')
  })
})