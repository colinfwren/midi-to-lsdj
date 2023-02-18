import {Feature} from "../test/allure";
import {Midi} from "@tonejs/midi";
import {note} from "@tonaljs/core";
import {
  convertChordToHex, convertPitchBendToHex,
  convertTempoToHex,
  getNoteCommand, getSweepPitchAsHex, getSweepSpeedAsHex,
  processChordCommand, processSweepCommand,
  processTempoCommand
} from "./getNoteCommand";
import {NoteInfo, TrackPitchBend} from "../types";

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

const pitchBendMidi = new Midi()
pitchBendMidi.fromJSON(baseTrack)
pitchBendMidi.tracks[0].addPitchBend({
  ticks: 36,
  value: -2
})

const emptyPitchBends = new Map<number, TrackPitchBend>()

const pitchBends = new Map<number, TrackPitchBend>([
  [36, { duration: 3, value: -2 }]
])

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
      pitchBends: emptyPitchBends,
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
      pitchBends: emptyPitchBends,
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
      pitchBends: emptyPitchBends,
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
      pitchBends: emptyPitchBends,
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
      pitchBends: emptyPitchBends,
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
  ])('Returns $commandName command when set', ({ command }) => {
    const input: NoteInfo = {
      noteIndex: 0,
      midiData: midi,
      notes: ['C3', 'D#3', 'G3'],
      hasTuplet: false,
      pitchBends: emptyPitchBends,
      command
    }
    expect(processChordCommand(input)).toMatchObject(input)
  })
})

describe('Setting sweep command for notes affected by pitch bends', () => {

  beforeEach(() => {
    reporter
      .feature(Feature.CommandMapping)
      .story('Sweep Command')
      .description('Set Sweep Command on notes that have a pitch bend at that tick')
  })

  it('Returns a sweep command when note has a pitch bend and there are no higher priority commands', () => {
    const input: NoteInfo = {
      noteIndex: 36,
      midiData: pitchBendMidi,
      notes: ['C3'],
      hasTuplet: false,
      pitchBends,
      command: ''
    }
    const expected = {
      ...input,
      command: 'SA9'
    }
    expect(processSweepCommand(input)).toMatchObject(expected)
  })

  it('Returns no command if no pitch bend at that tick and there are no higher priority commands', () => {
    const input: NoteInfo = {
      noteIndex: 0,
      midiData: pitchBendMidi,
      notes: ['C3'],
      hasTuplet: false,
      pitchBends,
      command: ''
    }
    expect(processSweepCommand(input)).toMatchObject(input)
  })

  it.each([
    { command: 'H00', commandName: 'Hop'},
    { command: 'T28', commandName: 'Tempo'},
    { command: 'K00', commandName: 'Kill Note'},
    { command: 'A00', commandName: 'Table'},
    { command: 'D01', commandName: 'Delay'},
    { command: 'R00', commandName: 'Retrigger'},
    { command: 'C37', commandName: 'Chord'}
  ])('Returns $commandName command when set', ({ command }) => {
    const input: NoteInfo = {
      noteIndex: 36,
      midiData: pitchBendMidi,
      notes: ['C3', 'D#3', 'G3'],
      hasTuplet: false,
      pitchBends,
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
    expect(getNoteCommand(36, tempoChangeMidi, ['F#3'], false, emptyPitchBends)).toBe('TB4')
  })
  it('Returns chord command if more than one note at note tick', () => {
    expect(getNoteCommand(0, midi, ['C3', 'D#3', 'G3'], false, emptyPitchBends)).toBe('C37')
  })

  it('Returns sweep command if pitch bend affects note at note tick', () => {
    expect(getNoteCommand(36, pitchBendMidi, ['F#3'], false, pitchBends)).toBe('SA9')
  })
  it('Returns empty string if no events happen at note tick', () => {
    expect(getNoteCommand(36, midi, ['F#3'], false, emptyPitchBends)).toBe('')
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
  ])('Returns hex value for BPM falling between 40-255 range $bpm', ({ bpm, hex}) => {
    expect(convertTempoToHex(bpm)).toBe(hex)
  })

  it.each([
    { bpm: 256, hex: '00'},
    { bpm: 295, hex: '27'}
  ])('Returns hex value for BPM falling between 256-295 range $bpm', ({ bpm, hex}) => {
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

describe('Converting MIDI pitch bend to LSDJ sweep hex', () => {
  beforeEach(() => {
    reporter
      .feature(Feature.CommandMapping)
      .story('Sweep Hex Value')
      .description("Mapping a pitch bend's value & duration to a sweep command hex")
  })

  it('converts a long deep negative bend into a long decreasing sweep', () => {
    expect(convertPitchBendToHex({ duration: 1920, value: -2}, 480)).toBe('29')
  })

  it('converts a short positive bend into a short increasing sweep', () => {
    expect(convertPitchBendToHex({ duration: 120, value: 1}, 480)).toBe('A3')
  })

})

describe('Converting pitch bend value to hex', () => {
  beforeEach(() => {
    reporter
      .feature(Feature.CommandMapping)
      .story('Sweep Pitch Hex Value')
      .description("Mapping a pitch bend's value to a sweep's pitch increase/decrease value")
  })

  it.each([
    { bendVal: -2, hexVal: '9'},
    { bendVal: -1.8, hexVal: 'A'},
    { bendVal: -1.5, hexVal: 'B'},
    { bendVal: -1.2, hexVal: 'C'},
    { bendVal: -0.9, hexVal: 'D'},
    { bendVal: -0.6, hexVal: 'E'},
    { bendVal: -0.3, hexVal: 'F'},
    { bendVal: 0, hexVal: '0'},
    { bendVal: 0.3, hexVal: '1'},
    { bendVal: 0.6, hexVal: '2'},
    { bendVal: 0.9, hexVal: '3'},
    { bendVal: 1.2, hexVal: '4'},
    { bendVal: 1.5, hexVal: '5'},
    { bendVal: 1.8, hexVal: '6'},
    { bendVal: 2, hexVal: '7'},
  ])('Maps $bendVal octave pitch bend to $hexVal hex', ({ bendVal, hexVal }) => {
    expect(getSweepPitchAsHex({ value: bendVal, duration: 0 })).toBe(hexVal)
  })
})

describe('Converting pitch bend duration to hex', () => {

  beforeEach(() => {
    reporter
      .feature(Feature.CommandMapping)
      .story('Sweep Speed Hex Value')
      .description("Mapping a pitch bend's duration to a sweep's speed value")
  })

  it.each([
    { durationName: 'hemidemisemiquaver', duration: 30, hexVal: 'E'},
    { durationName: 'demisemiquaver', duration: 60, hexVal: 'C'},
    { durationName: 'semiquaver', duration: 120, hexVal: 'A'},
    { durationName: 'quaver', duration: 240, hexVal: '8'},
    { durationName: 'crotchet', duration: 480, hexVal: '6'},
    { durationName: 'minim', duration: 960, hexVal: '4'},
    { durationName: 'semibreve', duration: 1920, hexVal: '2'},
  ])('Maps pitch bend with duration of $durationName to $hexVal hex', ({ duration, hexVal }) => {
    expect(getSweepSpeedAsHex({ value: -2, duration }, 480)).toBe(hexVal)
  })

})