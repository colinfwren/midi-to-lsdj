import {convertToHex} from "../utils";

/**
 * Update the table map keys with hexadecimal values based on the index of the table in the table map
 *
 * @param {Map<string, number[]>} tableMap - Table map to be updated
 * @returns {Map<string, number[]>} - Updated table map
 */
export function setTableMapHexKeys(tableMap: Map<string, number[]>): Map<string, number[]> {
  return new Map<string, number[]>(
    [ ...tableMap.entries() ].map((entry, index) => {
      const hexKey = convertToHex(index)
      return [hexKey, entry[1]]
    })
  )
}