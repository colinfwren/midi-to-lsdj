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
  return Array.from({ length: Math.ceil(arr.length / size)}, (_value, index) => {
    arr.slice(index * size, index * size + size)
  })
}

export function getTimeSignatureinSemiQuavers(timeSignature: MidiTimeSignatureEvent): TimeSignatureValues {
  const { numerator, denominator } = timeSignature
  const deltaFromSemiQuaver = 4 - denominator
  if (deltaFromSemiQuaver > 0) {
    return Array(deltaFromSemiQuaver).fill(0).reduce((agg) => {
      return {
        numerator: agg.numerator * 2,
        denominator: agg.denominator * 2
      }
    }, { numerator, denominator: 2**denominator })
  } else if (deltaFromSemiQuaver < 0) {
    return Array(Math.abs(deltaFromSemiQuaver)).fill(0).reduce((agg) => {
      return {
        numerator: agg.numerator / 2,
        denominator: agg.denominator / 2
      }
    }, { numerator, denominator: 2**denominator })
  }
  return {
    numerator,
    denominator
  }
}