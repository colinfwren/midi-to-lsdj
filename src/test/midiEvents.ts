import {
  MidiEndOfTrackEvent,
  MidiNoteOffEvent,
  MidiNoteOnEvent,
  MidiSetTempoEvent,
  MidiTimeSignatureEvent
} from "midi-file";
import { midi }  from "@tonaljs/note";

export function createTempoEvent(deltaTime = 0, bpm = 120): MidiSetTempoEvent {
  return {
    deltaTime,
    meta: true,
    type: 'setTempo',
    microsecondsPerBeat: parseInt((60000 / bpm).toString())
  }
}

export function createTimeSignatureEvent(deltaTime = 0, timeSignature: number[] = [4, 4]): MidiTimeSignatureEvent {
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

export function createEndOfTrackEvent(deltaTime = 0): MidiEndOfTrackEvent {
  return {
    deltaTime,
    meta: true,
    type: 'endOfTrack'
  }
}

export function createNoteOnEvent(deltaTime = 0, note = 'C3'): MidiNoteOnEvent {
  return {
    deltaTime,
    channel: 0,
    type: 'noteOn',
    noteNumber: midi(note) ?? 127,
    velocity: 48
  }
}

export function createNoteOffEvent(deltaTime = 0, note = 'C3'): MidiNoteOffEvent {
  return {
    deltaTime,
    channel: 0,
    type: 'noteOff',
    noteNumber: midi(note) ?? 127,
    velocity: 48
  }
}