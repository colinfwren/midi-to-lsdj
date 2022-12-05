import {LSDJTable, LSDJTableStep} from "../types";
import {
  blankStep,
  getDeltaAsHex,
  getTableArray,
  getTableSteps,
  hopStep
} from "./getTableArray";

const tableMap = new Map<string, number[]>([
  ['00', [12]]
])

describe('getDeltaAsHex', () => {
  it('returns a positive delta as that delta added to 0 in hex', () => {
    expect(getDeltaAsHex(12)).toBe('0C')
  })
  it('returns a negative delta as that delta subtracted from 256 in hex', () => {
    expect(getDeltaAsHex(-12)).toBe('F4')
  })
})

describe('getTableSteps', () => {
  it('converts a triplet (1 note) into a note every 8 steps', () => {
    const expectedResult: LSDJTableStep[] = [
      blankStep,
      blankStep,
      blankStep,
      blankStep,
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
      blankStep,
      blankStep,
      blankStep,
      blankStep,
      hopStep
    ]
    const result = getTableSteps([1])
    expect(result).toMatchObject(expectedResult)
  })
  it('converts a sextuplet (3 notes) into a note every 4 steps', () => {
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
      {
        vol: '00',
        transpose: '03',
        command1: '---',
        command2: '---'
      },
      blankStep,
      blankStep,
      blankStep,
      hopStep
    ]
    const result = getTableSteps([1, 2, 3])
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
          blankStep,
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
          blankStep,
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