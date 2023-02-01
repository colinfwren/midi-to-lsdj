import {convertToHex} from "../utils";

export function setTableMapHexKeys(tableMap: Map<string, number[]>, tableMapKeys: string[]): Map<string, number[]> {
  return new Map<string, number[]>(
    tableMapKeys.map((key, index) => {
      const hexKey = convertToHex(index)
      const table = tableMap.get(key)
      if (typeof table !== "undefined") {
        return [hexKey, table]
      }
      return [hexKey, []]
    })
  )
}