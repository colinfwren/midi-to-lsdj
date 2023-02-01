import { MidiEvent } from "midi-file";
import { TrackEvents } from "../types";

/**
 * Iterate over the MidiEvent array for the track and create an absolute time version of the track events.
 * We need absolute time as the MIDI events are in relative time which makes it hard to translate note events into
 * the rigid LSDJ structure.
 *
 * @param {MidiEvent[]} track - The MIDI events in the track
 * @param {number} ticksPerBeat - The number of ticks in a quarter note
 * @returns {TrackEvents} - An object containing the absolute time position MIDI events in the track
 */
export function getTrackEvents(track: MidiEvent[], ticksPerBeat = 480): TrackEvents {
  const trackEvents = track.reduce((agg: { tick: number, events: TrackEvents }, midiEvent: MidiEvent) => {
    const tick = agg.tick + midiEvent.deltaTime
    switch(midiEvent.type) {
      case 'timeSignature':
        return {
          tick,
          events: {
            ...agg.events,
            timeSignatures: [
              ...agg.events.timeSignatures,
              {
                tick,
                event: midiEvent
              }
            ]
          }
        }
      case 'endOfTrack':
        return {
          tick,
          events: {
            ...agg.events,
            endOfSong: {
              tick,
              event: midiEvent
            }
          }
        }
      case 'setTempo':
        return {
          tick,
          events: {
            ...agg.events,
            tempos: [
              ...agg.events.tempos,
              {
                tick,
                event: midiEvent
              }
            ]
          }
        }
      default:
        return {
          ...agg,
          tick
        }
    }
  }, {
    tick: 0,
    events: {
      timeSignatures: [],
      endOfSong: {
        tick: 0,
        event: {
          type: 'endOfTrack',
          deltaTime: 0,
        },
      },
      tempos: [],
      semiQuaver: (ticksPerBeat / 2) / 2
    }
  })
  return trackEvents.events
}