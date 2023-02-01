import {LSDJTrack} from "../types";
import {getTablesForPhraseTriplets} from "./getTablesForPhraseTriplets";
import {setTableMapHexKeys} from "./setTableMapHexKeys";
import {setPhraseNoteTableId} from "./setPhraseNoteTableId";
import {getTableArray} from "./getTableArray";

/**
 * Process the triplets across all phrases and built up a table map, then use that map to set the commands on notes in
 * phrases and create the tables array for LSDJ
 *
 * @param {LSDJTrack} track - The LSDJ Track
 * @returns {LSDJTrack} - The updated LSDJ Track
 */
export function processTables(track: LSDJTrack): LSDJTrack {
  const tableMap = getTablesForPhraseTriplets(track.phrases)
  const tableMapKeys = [ ...tableMap.keys() ]
  const tableMapWithHexKeys = setTableMapHexKeys(tableMap)
  return {
    ...track,
    phrases: setPhraseNoteTableId(track.phrases, tableMapKeys),
    tables: getTableArray(tableMapWithHexKeys)
  }
}