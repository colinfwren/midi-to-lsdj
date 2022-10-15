import {DRUM_MAP, NOTES_MAP} from "./constants";
import {MidiTimeSignatureEvent} from "midi-file";
import {TimeSignatureValues} from "./types";

export function getNoteName(noteNumber: number): string {
  const noteName = NOTES_MAP[noteNumber]
  return typeof noteNumber !== 'undefined' ? noteName : '---'
}

export function getDrumName(noteNumber: number): string {
  const noteName = NOTES_MAP[noteNumber]
  // @ts-ignore
  const drumName = DRUM_MAP[noteName]
  return typeof  drumName !== 'undefined' ? drumName : '---'
}

export function getChunksOfSize(arr: any[], size: number): any[] {
  const noOfChunks = Math.ceil(arr.length / size)
  return Array(noOfChunks).fill(0).map((_val, index) => {
    return arr.slice(index * size, index * size + size)
  })
}

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
  // if (deltaFromSemiQuaver > 0) {
  //   return Array(deltaFromSemiQuaver).fill(0).reduce((agg) => {
  //     return {
  //       numerator: agg.numerator * 2,
  //       denominator: agg.denominator * 2
  //     }
  //   }, { numerator, denominator: 2**denominator })
  // } else if (deltaFromSemiQuaver < 0) {
  //   return Array(Math.abs(deltaFromSemiQuaver)).fill(0).reduce((agg) => {
  //     return {
  //       numerator: agg.numerator / 2,
  //       denominator: agg.denominator / 2
  //     }
  //   }, { numerator, denominator: 2**denominator })
  // }
}

export function* range(start: number, stop: number, step: number = 1): Generator<number> {
    if (stop == null) {
        // one param defined
        stop = start;
        start = 0;
    }

    for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
        yield i;
    }
}