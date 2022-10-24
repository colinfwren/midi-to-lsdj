import {LSDJTable, LSDJTableStep} from "../types";
import {blankStep, getTableArray, getTableSteps, hopStep} from "./getTableArray";

const tableMap = new Map<string, number[]>([
  ['00', [12, 1]]
])

describe('getTableSteps', () => {
  it('converts a triplet (2 notes) into a note every 4 steps', () => {
    const expectedResult: LSDJTableStep[] = [
      blankStep,
      blankStep,
      blankStep,
      {
        vol: '00',
        transpose: '01',
        command1: '---',
        command2: '---'
      },
      blankStep,
      blankStep,
      blankStep,
      {
        vol: '00',
        transpose: '02',
        command1: '---',
        command2: '---'
      },
      blankStep,
      blankStep,
      blankStep,
      hopStep
    ]
    const result = getTableSteps([1, 2])
    expect(result).toMatchObject(expectedResult)
  })
  it('converts a sextuplet (5 notes) into a note every 2 steps', () => {
    const expectedResult: LSDJTableStep[] = [
      blankStep,
      {
        vol: '00',
        transpose: '01',
        command1: '---',
        command2: '---'
      },
      blankStep,
      {
        vol: '00',
        transpose: '02',
        command1: '---',
        command2: '---'
      },
      blankStep,
      {
        vol: '00',
        transpose: '03',
        command1: '---',
        command2: '---'
      },
      blankStep,
      {
        vol: '00',
        transpose: '04',
        command1: '---',
        command2: '---'
      },
      blankStep,
      {
        vol: '00',
        transpose: '05',
        command1: '---',
        command2: '---'
      },
      blankStep,
      hopStep
    ]
    const result = getTableSteps([1, 2, 3, 4, 5])
    expect(result).toMatchObject(expectedResult)
  })
})

describe('getTableArray', () => {
  it('creates an array of table objects from the table map', () => {
    const expectedResult: LSDJTable[] = [
      {
        key: '00',
        steps: [
          blankStep,
          blankStep,
          blankStep,
          {
            vol: '00',
            transpose: '0C',
            command1: '---',
            command2: '---'
          },
          blankStep,
          blankStep,
          blankStep,
          {
            vol: '00',
            transpose: '01',
            command1: '---',
            command2: '---'
          },
          blankStep,
          blankStep,
          blankStep,
          hopStep
        ]
      }
    ]
    const result = getTableArray(tableMap)
    expect(result).toMatchObject(expectedResult)
  })
})