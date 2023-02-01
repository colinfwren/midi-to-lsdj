import { processTables } from "./processTables";
import {LSDJTrack} from "../types";
import {getTableSteps} from "./getTableArray";
import {createNote, createPhrase} from "../test/lsdj";
import {Feature} from "../test/allure";

const track: LSDJTrack = {
  chains: [],
  tables: [],
  phrases: [
    createPhrase(
      '01',
      [
        createNote(['G_3'], '', [1]),
        createNote(['G_3'], '', [1, 2, 3])
      ]
    )
  ]
}

const expectedTrack: LSDJTrack = {
  ...track,
  tables: [
    {
      key: '00',
      steps: getTableSteps([1])
    },
    {
      key: '01',
      steps: getTableSteps([1, 2, 3])
    }
  ],
  phrases: [
    {
      ...track.phrases[0],
      notes: [
        {
          ...track.phrases[0].notes[0],
          tableId: '00',
          command: 'A00'
        },
        {
          ...track.phrases[0].notes[1],
          tableId: '01',
          command: 'A01'
        }
      ]
    }
  ]
}

describe('processTables', () => {

  beforeEach(() => {
    reporter
      .feature(Feature.TableMapping)
      .story('Creates an array of tables in the track and updates phrases to call the appropriate table for tuplet notes in phrase')
  })

  it('Creates a table array for triplets in the track phrases and sets the commands on the phrases', () => {
    expect(processTables(track)).toMatchObject(expectedTrack)
  })
})