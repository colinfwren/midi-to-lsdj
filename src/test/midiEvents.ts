import {
  MidiEndOfTrackEvent,
  MidiSetTempoEvent,
  MidiTimeSignatureEvent
} from "midi-file";

/**
 * Create a Midi Tempo Event for use in testing
 *
 * @param {number} deltaTime - delta relative to last Midi Event
 * @param {number} bpm - BPM of tempo
 * @returns {MidiTimeSignatureEvent} - Midi Tempo Event for test
 */
export function createTempoEvent(deltaTime = 0, bpm = 120): MidiSetTempoEvent {
  return {
    deltaTime,
    meta: true,
    type: 'setTempo',
    microsecondsPerBeat: parseInt((60000 / bpm).toString())
  }
}

/**
 * Create a Midi Time Signature event for use in testing
 *
 * @param {number} deltaTime - delta relative to last Midi Event
 * @param {number[]} timeSignature - Array of numerator and denominator for time signature
 * @returns {MidiTimeSignatureEvent} - Midi Time Signature event for test
 */
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

/**
 * Create Midi Track End event for use in testing
 *
 * @param {number} deltaTime - delta relative to last Midi Event
 * @returns {MidiEndOfTrackEvent} - Midi Track End event for test
 */
export function createEndOfTrackEvent(deltaTime = 0): MidiEndOfTrackEvent {
  return {
    deltaTime,
    meta: true,
    type: 'endOfTrack'
  }
}