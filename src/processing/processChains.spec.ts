import { processChains } from "./processChains";
import { LSDJTrack } from "../types";
import { createPhrase } from "../test/lsdj";
import {Feature} from "../test/allure";

const track: LSDJTrack = {
  chains: [],
  phrases: Array(18).fill(0).map((_, ind) => createPhrase(`${ind}`)),
  tables: []
}

const expectedTrack: LSDJTrack = {
  ...track,
  chains: [
    {
      key: '00',
      phrases: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']
    },
    {
      key: '01',
      phrases: ['16', '17']
    }
  ]
}

describe('processChains', () => {

  beforeEach(() => {
    reporter
      .feature(Feature.ChainMapping)
      .story('Create chains from array of phrases')
  })

  it('Creates an array of the chains in the track', () => {
    expect(processChains(track)).toMatchObject(expectedTrack)
  })
})