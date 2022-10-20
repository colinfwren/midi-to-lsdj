import {
  MidiEndOfTrackEvent,
  MidiNoteOffEvent,
  MidiNoteOnEvent,
  MidiSetTempoEvent,
  MidiTimeSignatureEvent
} from "midi-file";
import {NOTE_TO_FREQ_MAP} from "../constants";

export function createTempoEvent(deltaTime:number = 0, bpm: number = 120): MidiSetTempoEvent {
  return {
    deltaTime,
    meta: true,
    type: 'setTempo',
    microsecondsPerBeat: parseInt((60000 / bpm) as any)
  }
}

function getDenominator(denominator: number): number {
  switch (denominator) {
    case 2:
      return 1
    case 4:
      return 2
    case 8:
      return 3
    case 16:
      return 4
    case 32:
      return 5
    case 64:
      return 6
    default:
      return 0
  }
}

export function createTimeSignatureEvent(deltaTime: number = 0, timeSignature: number[] = [4, 4]): MidiTimeSignatureEvent {
  return {
    deltaTime,
    meta: true,
    type: 'timeSignature',
    numerator: timeSignature[0],
    // denominator in MIDI is reverse power of 2
    // denominator: getDenominator(timeSignature[1]),
    denominator: timeSignature[1],
    // This will be 1 click every quarter note which will be incorrect for some time signatures but we don't use this value
    metronome: 24,
    thirtyseconds: 8
  }
}

export function createEndOfTrackEvent(deltaTime: number = 0): MidiEndOfTrackEvent {
  return {
    deltaTime,
    meta: true,
    type: 'endOfTrack'
  }
}

export function createNoteOnEvent(deltaTime: number = 0, note: string = 'C_3'): MidiNoteOnEvent {
  return {
    deltaTime,
    channel: 0,
    type: 'noteOn',
    noteNumber: NOTE_TO_FREQ_MAP[note],
    velocity: 48
  }
}

export function createNoteOffEvent(deltaTime: number = 0, note: string = 'C_3'): MidiNoteOffEvent {
  return {
    deltaTime,
    channel: 0,
    type: 'noteOff',
    noteNumber: NOTE_TO_FREQ_MAP[note],
    velocity: 48
  }
}