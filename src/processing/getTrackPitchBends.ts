import {Midi} from "@tonejs/midi";
import {TrackPitchBend, TrackPitchBends} from "../types";

/**
 * Create a map of midi tick to pitch bend value from the array of pitch bends in the midi track
 *
 * @param {Midi} data - Data from MIDI file
 * @param {number} trackIndex - Index of the track to process in the MIDI file
 * @returns {TrackPitchBends} - A map of tick and pitch bend value
 */
export function getTrackPitchBends(data: Midi, trackIndex: number): TrackPitchBends {
  const track = data.tracks[trackIndex]
  const pitchBendMap = new Map<number, TrackPitchBend>()
  track.pitchBends.forEach(({ ticks, value }) => {
    const nearestNote = track.notes.reduce((prev, curr) => Math.abs(curr.ticks - ticks) < Math.abs(prev.ticks - ticks) ? curr : prev)
    if (value !== 0) {
      pitchBendMap.set(nearestNote.ticks, { value, duration: nearestNote.durationTicks})
    }
  })
  return pitchBendMap
}