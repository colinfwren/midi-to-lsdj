import { processTables } from "./processTables";
import {LSDJPhrase, LSDJTable, LSDJTrack} from "../types";
import {getTableSteps} from "./getTableArray";

const track: LSDJTrack = {
  chains: [],
  tables: [],
  phrases: [
    {
      noteCount: 2,
      startTick: 0,
      endTick: 2,
      key: '01',
      notes: [
        {
          notes: ['G_3'],
          command: '',
          triplets: [1]
        },
        {
          notes: ['G_3'],
          command: '',
          triplets: [1, 2, 3]
        }
      ]
    }
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
  it('Creates a table array for triplets in the track phrases and sets the commands on the phrases', () => {
    expect(processTables(track)).toMatchObject(expectedTrack)
  })
})