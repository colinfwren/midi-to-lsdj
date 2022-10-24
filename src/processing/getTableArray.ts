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

function createTransposeStep(delta: number): LSDJTableStep {
  return {
    vol: '00',
    transpose: convertToHex(delta),
    command1: '---',
    command2: '---'
  }
}

export function getTableSteps(noteDeltas: number[]): LSDJTableStep[] {
  switch(noteDeltas.length) {
    case 2:
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
        hopStep
      ]
    case 5:
      return [
        blankStep,
        createTransposeStep(noteDeltas[0]),
        blankStep,
        createTransposeStep(noteDeltas[1]),
        blankStep,
        createTransposeStep(noteDeltas[2]),
        blankStep,
        createTransposeStep(noteDeltas[3]),
        blankStep,
        createTransposeStep(noteDeltas[4]),
        blankStep,
        hopStep,
      ]
    default:
      return []
  }
}

export function getTableArray(tableMap: Map<string, number[]>): LSDJTable[] {
  return [ ...tableMap.keys()].map((key, index) => {
    return {
      key: convertToHex(index),
      steps: getTableSteps(tableMap.get(key) as number[])
    }
  })
}