import { getTripletKey } from "./utils";
import {Feature} from "./test/allure";

describe('getTripletKey', () => {

  beforeEach(() => {
    reporter
      .feature(Feature.TableMapping)
      .story('Create a hash representation of a tuplet so can spot duplicate tuplets')
  })

  it('creates a base64 version of the notes in the triplet as a string', () => {
    const expectedResult = 'MS0y'
    const result = getTripletKey([1, 2])
    expect(result).toBe(expectedResult)
  })
})