import {MidiTimeSignatureEvent} from "midi-file";
import {LSDJPhrase, TimeSignatureValues} from "./types";

/**
 * Reduce an array pf phrases into an array of sized arrays (i.e. chunks)
 *
 * @param {LSDJPhrase[]} arr - Array of phrases to chunk
 * @param {number} size - Size of the chunks
 * @returns {LSDJPhrase[][]} - Array of arrays containing a maximum of 'size' values
 */
export function getChunksOfSize(arr: LSDJPhrase[], size: number): LSDJPhrase[][] {
  const noOfChunks = Math.ceil(arr.length / size)
  return Array(noOfChunks).fill(0).map((_val, index) => {
    return arr.slice(index * size, index * size + size)
  })
}

/**
 * Convert a MIDI time signature event into a numerator and denominator at a semiquaver (16th note) resolution.
 *
 * @example
 * // returns { numerator: 18, denominator: 16 }
 * getTimeSignatureInSemiQuavers({ numerator: 9, denominator: 8 })
 * @param {MidiTimeSignatureEvent} timeSignature - Time Signature event from MIDI track
 * @returns {TimeSignatureValues} - Object containing the adjusted time signature information
 */
export function getTimeSignatureinSemiQuavers(timeSignature: MidiTimeSignatureEvent): TimeSignatureValues {
  const { numerator, denominator } = timeSignature
  switch (denominator) {
    case 8:
      return {
        numerator: numerator * 2,
        denominator: 16
      }
    case 4:
      return {
        numerator: numerator ** 2,
        denominator: 16
      }
    case 2:
      return {
        numerator: numerator ** 4,
        denominator: 16
      }
    case 32:
      return {
        numerator: numerator / 2,
        denominator: 16
      }
    default:
      return {
        numerator,
        denominator: 16
      }
  }
}

/**
 * Generator to create a stepped range (similar to Python's range implementation). Used to create the keys for the map
 * of ticks in the track and the notes played at that tick
 *
 * @param {number} start - Number to range starts at
 * @param {number} stop - Number the range goes up to
 * @param {number} step - Interval of the values in the range
 * @yields {number} - The numbers at the given interval between the start and stop
 */
export function* range(start: number, stop: number, step = 1): Generator<number> {
    if (stop == null) {
        // one param defined
        stop = start;
        start = 0;
    }

    for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
        yield i;
    }
}

/**
 * Create a base64 representation of the notes in a triplet. Used when de-duplicating the track's tables as triplets
 * played on different notes but with the same delta are only needed once
 *
 * @param {number[]} notes - The deltas between triplet notes and the root note
 * @returns {string} - Base64 representation of the notes in the triplet
 */
export function getTripletKey(notes: number[]): string {
  const noteString = notes.join('-')
  const buffer = Buffer.from(noteString, 'utf-8')
  return buffer.toString('base64')
}

/**
 * Convert a number to hexadecimal and pad it with a '0' as that's the format that LSDJ uses for it's keys
 *
 * @example
 * // returns "45"
 * convertToHex(69)
 * @param {number|string} number - The number to convert to hexadecimal
 * @returns {string} - The padded hexadecimal value for that number
 */
export function convertToHex(number: number | string): string {
  return ("0" + parseInt(number.toString(), 10).toString(16).toUpperCase()).slice(-2);
}

/**
 * Format the notes as LSDJ displays them. TonalJS which is being used to convert MIDI values to note names uses two
 * character strings for non-sharp notes (i.e. C3) and LSDJ uses consistent 3 character strings (i.e. C_3)
 *
 * @param {string} note - Note string to format
 * @returns {string} - Note string formatted to fit 3 characters
 */
export function formatLSDJNoteName(note: string): string {
  if (note.indexOf('#') > -1) return note
  return `${note[0]}_${note[1]}`
}

/**
 * Pipe that can be used to compose functions together. Used for processing the track
 *
 * @param {Function[]} functions - Array of functions to call with the value
 * @returns {Function} - Reduction of the functions against the value
 */
export function pipe<T>(...functions: Array<(arg: T) => T>) {
  return function (value: T) {
    return functions.reduce((acc, fn) => fn(acc), value)
  }
}