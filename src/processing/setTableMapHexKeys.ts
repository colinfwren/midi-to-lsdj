import {convertToHex} from "../utils";

export function setTableMapHexKeys(tableMap: Map<string, number[]>, tableMapKeys: string[]): Map<string, number[]> {
  const hexMap = tableMapKeys.map((key, index) => {
    const hexKey = convertToHex(index)
    return [hexKey, tableMap.get(key)]
  })
  // @ts-ignore
  return new Map<string, number[]>(hexMap)
}