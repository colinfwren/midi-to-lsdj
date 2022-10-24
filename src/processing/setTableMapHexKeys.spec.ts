import {setTableMapHexKeys} from "./setTableMapHexKeys";

const tableMap = new Map<string, number[]>([
  ['a', [1, 2]],
  ['b', [2, 1]]
])

const tableMapKeys = [ ...tableMap.keys() ]

describe('setTableMapHexKeys', () => {
  it('updates the table map to use hexadecimal keys based on the index of the table in the table map', () => {
    const expectedResult = new Map<string, number[]>([
      ['00', [1, 2]],
      ['01', [2, 1]]
    ])
    const result = setTableMapHexKeys(tableMap, tableMapKeys)
    expect(result).toMatchObject(expectedResult)
  })
})