import {LSDJTrack} from "../types";
import {getChainsAsMap, getTrackChains} from "./getTrackChains";
import {setChainHexKeys} from "./setChainHexKeys";

/**
 * Reduce the track's phrases into an array of phrase chains that contain 16 or lower phrases
 *
 * @param {LSDJTrack} track - The LSDJ Track
 * @returns {LSDJTrack} - The updated LSDJ Track
 */
export function processChains(track: LSDJTrack): LSDJTrack {
  const chains = getTrackChains(track.phrases)
  const chainMap = getChainsAsMap(chains)
  return {
    ...track,
    chains: setChainHexKeys(chains, chainMap)
  }
}