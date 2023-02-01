import { MidiEvent } from "midi-file";
import { TrackEvents } from "../types";

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