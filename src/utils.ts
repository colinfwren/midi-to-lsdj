import {DRUM_MAP, NOTES_MAP} from "./constants";

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