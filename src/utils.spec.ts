import { getTripletKey } from "./utils";

describe('getTripletKey', () => {
  it('creates a base64 version of the notes in the triplet as a string', () => {
    const expectedResult = 'MS0y'
    const result = getTripletKey([1, 2])
    expect(result).toBe(expectedResult)
  })
})