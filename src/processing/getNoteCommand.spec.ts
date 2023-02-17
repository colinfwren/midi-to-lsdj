import {Feature} from "../test/allure";
import {Midi} from "@tonejs/midi";
import {note} from "@tonaljs/core";
import {
  convertChordToHex,
  convertTempoToHex,
  getNoteCommand,
  NoteInfo,
  processChordCommand,
  processTempoCommand
} from "./getNoteCommand";

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

describe('Setting chord command for notes that have more than one note and no higher priority commands', () => {

  beforeEach(() => {
    reporter
      .feature(Feature.CommandMapping)
      .story('Chord Command')
      .description('Set Chord Command on notes that have more than one note at that tick')
  })

  it('Returns a chord command when there is more than one note and no higher priority commands', () => {
    const input: NoteInfo = {
      noteIndex: 0,
      midiData: midi,
      notes: ['C3', 'D#3', 'G3'],
      hasTuplet: false,
      command: ''
    }
    const expected = {
      ...input,
      command: 'C37'
    }
    expect(processChordCommand(input)).toMatchObject(expected)
  })
  it('Returns an empty command when one note and no higher priority commands', () => {
    const input: NoteInfo = {
      noteIndex: 0,
      midiData: midi,
      notes: ['C3'],
      hasTuplet: false,
      command: ''
    }
    expect(processChordCommand(input)).toMatchObject(input)
  })
  it.each([
    { command: 'H00', commandName: 'Hop'},
    { command: 'T28', commandName: 'Tempo'},
    { command: 'K00', commandName: 'Kill Note'},
    { command: 'A00', commandName: 'Table'},
    { command: 'D01', commandName: 'Delay'},
    { command: 'R00', commandName: 'Retrigger'}
  ])('Returns ${commandName} command when set', ({ command }) => {
    const input: NoteInfo = {
      noteIndex: 0,
      midiData: midi,
      notes: ['C3', 'D#3', 'G3'],
      hasTuplet: false,
      command
    }
    expect(processChordCommand(input)).toMatchObject(input)
  })
})

describe('Getting command for note at tick', () => {

  beforeEach(() => {
    reporter
      .feature(Feature.CommandMapping)
      .story('Note Commands')
      .description('Set command for notes based on if there is a track event at that tick')
  })

  it('Returns tempo command if tempo change happens at note tick', () => {
    expect(getNoteCommand(36, tempoChangeMidi, ['F#3'], false)).toBe('TB4')
  })
  it('Returns chord command if more than one note at note tick', () => {
    expect(getNoteCommand(0, midi, ['C3', 'D#3', 'G3'], false)).toBe('C37')
  })
  it('Returns empty string if no events happen at note tick', () => {
    expect(getNoteCommand(36, midi, ['F#3'], false)).toBe('')
  })
})

describe('Converting MIDI Tempo BPM to LSDJ Tempo Hex value', () => {

  beforeEach(() => {
    reporter
      .feature(Feature.CommandMapping)
      .story('Tempo Hex Value')
      .description("Set Tempo Hex value based on LSDJ's BPM rules")
  })

  it.each([
    { bpm: 40, hex: '28'},
    { bpm: 255, hex: 'FF'}
  ])('Returns hex value for BPM falling between 40-255 range ${bpm}', ({ bpm, hex}) => {
    expect(convertTempoToHex(bpm)).toBe(hex)
  })

  it.each([
    { bpm: 256, hex: '00'},
    { bpm: 295, hex: '27'}
  ])('Returns hex value for BPM falling between 256-295 range ${bpm}', ({ bpm, hex}) => {
    expect(convertTempoToHex(bpm)).toBe(hex)
  })

  it('Returns hex value of 28 for BPM lower than 40', () => {
    expect(convertTempoToHex(1)).toBe('28')
  })

  it('Returns hex value of 27 for BPM higher than 295', () => {
    expect(convertTempoToHex(9001)).toBe('27')
  })
})

describe('Converting array of notes into a LSDJ chord hex', () => {

  beforeEach(() => {
    reporter
      .feature(Feature.CommandMapping)
      .story('Chord Hex Value')
      .description("Set Chord Hex value based on LSDJ's chord rules")
  })

  it('Only returns a hex value for three note chords', () => {
    expect(convertChordToHex(['C3', 'D#3', 'G3', 'A#3'])).toBe('37')
  })
  it('Pads a two note chord with the base note', () => {
    expect(convertChordToHex(['C3', 'D#3'])).toBe('30')
  })
  it('Caps chord range at 15 semitones (F in hex)', () => {
    expect(convertChordToHex(['C3', 'C4', 'C5'])).toBe('CF')
  })
})