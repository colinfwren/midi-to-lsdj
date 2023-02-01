import {LSDJNote, LSDJPhrase} from "../types";

/**
 * Create a LSDJ phrase object to use in testing
 *
 * @param {string} key - Key for the phrase in the phrase map
 * @param {LSDJNote[]} notes - Array of notes in the phrase
 * @param {number} startTick - Start tick for the phrase
 * @param {number} endTick - End tick for the phrase, set to startTick + number of notes if not defined
 * @returns {LSDJPhrase} - Phrase for test
 */
export function createPhrase(key: string, notes: LSDJNote[] = [], startTick = 0, endTick?: number): LSDJPhrase {
  const nonHopNoteCount = notes.filter(x => x.command !== 'H00').length
  return {
    noteCount: nonHopNoteCount,
    startTick,
    endTick: endTick ? endTick : startTick + (nonHopNoteCount * 3),
    key,
    notes
  }
}

/**
 * Create a LSDJ note object to use in testing
 *
 * @param {string} notes - Note array value
 * @param {string} command - Command value
 * @param {number[]} triplets - Triplets command
 * @param {string} tableId - ID of table
 * @returns {LSDJNote} - Note for test
 */
export function createNote(notes: string[] = [], command = '', triplets: number[] = [], tableId?: string): LSDJNote {
  if (tableId) {
    return {
      notes,
      command,
      triplets,
      tableId
    }
  }
  return {
    notes,
    command,
    triplets
  }
}

export const HOP_NOTE = createNote([], 'H00')

export const TEST_PHRASE_1 = createPhrase(
  'QyNfMy1DXzMtLUdfNi0tLUgwMA==',
  [
    createNote(['C#_3', 'C_3']),
    createNote(['G_6']),
    HOP_NOTE
  ]
)

export const TEST_PHRASE_2 = createPhrase(
  'Rl80LS0tSDAw',
  [
    createNote(['F_4']),
    HOP_NOTE
  ]
)

export const TEST_PHRASE_3 = createPhrase(
  'a',
  [
    createNote(['D_3'])
  ]
)

export const TEST_PHRASE_4 = createPhrase(
  'b',
  [
    createNote(['D#3'])
  ],
  1
)

export const TEST_PHRASE_5 = createPhrase(
  'c',
  [
    createNote(['E_3'])
  ],
  2
)

export const TEST_PHRASE_6 = createPhrase(
  '1',
  [
    createNote(['C_3']),
    createNote(['D#_3'], '', [3, 5]),
    HOP_NOTE
  ]
)

export const TEST_PHRASE_7 = createPhrase(
  '2',
  [
    createNote(['C_3'], '', [1, 3]),
    createNote(['D#_3'], '', [3, 5]),
    HOP_NOTE
  ],
  6
)