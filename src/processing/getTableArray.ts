import {LSDJTable, LSDJTableStep} from "../types";
import {convertToHex} from "../utils";

export const blankStep: LSDJTableStep = {
  vol: '00',
  transpose: '00',
  command1: '---',
  command2: '---'
}

export const hopStep: LSDJTableStep = {
  vol: '00',
  transpose: '00',
  command1: 'H00',
  command2: '---'
}

/**
 * Convert the delta between notes as a hexadecimal value. If the delta is negative then subtract that from 256 as
 * LSDJ uses FF for negative transposition
 *
 * @param {number} delta - The delta between the root note and the transpose
 * @returns {string} - The delta as a hexadecimal value
 */
export function getDeltaAsHex(delta: number): string {
  if (delta < 0) {
    return convertToHex(256 - Math.abs(delta))
  }
  return convertToHex(delta)
}

/**
 * Create the table step for transposing a note based on the supplied delta
 *
 * @param {number} delta - The delta between the root note and the transpose
 * @returns {LSDJTableStep} - Table step definition
 */
function createTransposeStep(delta: number): LSDJTableStep {
  return {
    vol: '00',
    transpose: getDeltaAsHex(delta),
    command1: '---',
    command2: '---'
  }
}

/**
 * Create an array of table steps based on the number of notes in the triplet/sextuplet. If there's 1 note then it's a
 * triplet, if there's 3 then it's a sextuplet.
 *
 * @param {number[]} noteDeltas - An array of deltas between the root note and the triplet/sextuplet notes
 * @returns {LSDJTableStep[]} - An array of steps to use in a LSDJ table to play the triplet/sextuplet as a command
 */
export function getTableSteps(noteDeltas: number[]): LSDJTableStep[] {
  switch(noteDeltas.length) {
    case 1:
      return [
        blankStep,
        blankStep,
        blankStep,
        blankStep,
        blankStep,
        blankStep,
        blankStep,
        createTransposeStep(noteDeltas[0]),
        blankStep,
        blankStep,
        blankStep,
        blankStep,
        blankStep,
        blankStep,
        blankStep,
        hopStep
      ]
    case 3:
      return [
        blankStep,
        blankStep,
        blankStep,
        createTransposeStep(noteDeltas[0]),
        blankStep,
        blankStep,
        blankStep,
        createTransposeStep(noteDeltas[1]),
        blankStep,
        blankStep,
        blankStep,
        createTransposeStep(noteDeltas[2]),
        blankStep,
        blankStep,
        blankStep,
        hopStep,
      ]
    default:
      return []
  }
}

/**
 * Create an array of LSDJTables from a map of table hash to note deltas. The table has a hexadecimal key, so it matches
 * what the user sees in LSDJ
 *
 * @param {Map<string, number[]>} tableMap - Map of a hash of the notes in the table to the delta between notes
 * @returns {LSDJTable[]} - Array of tables to use in LSDJ
 */
export function getTableArray(tableMap: Map<string, number[]>): LSDJTable[] {
  return [ ...tableMap.entries() ].map((entry, index) => {
    return {
      key: convertToHex(index),
      steps: getTableSteps(entry[1])
    }
  })
}