# MIDI to LSDJ
A library to parse a Midi file using [`@tonejs/midi`](https://www.npmjs.com/package/@tonejs/midi) and convert a track 
from that file into an array of chains, phrases and notes for use with LSDJ.

Uses [`@tonaljs/note`](https://www.npmjs.com/package/@tonaljs/note) convert MIDI note values to notes and 
[`@tonaljs/core`](https://www.npmjs.com/package/@tonaljs/core) to calculate intervals between notes

## Usage

```js
import { readMidiFile, processTrack, processProject } from 'midi-to-lsdj';

function exampleUsage() {
  const midiData = readMidiFile('super-amazing-song.mid')
  const trackOneChains = processTrack(midiData.tracks[0], midiData.header.ticksPerBeat)
  const projectConfig = processProject(midiData)
  console.log(trackOneChains, projectConfig)
}
```

## Features
The library offers the following features:

- [x] Time Signatures changes (adds a `H00` command if numerator doesn't resolve to 16/16)
- [x] Triplets (Adds a table with delta between root note and the triplet notes)
- [x] De-duplication of Tables, Phrases and Chains
- [x] Tempo changes
- [x] Chords
- [x] Sweeps when notes are pitch-bent in file

## Roadmap
- [ ] De-duplication across multiple tracks
- [ ] Drums
- [ ] Advanced de-duplication of Phrases making use of transpose
- [ ] LSDJ save file creation (so you don't need to enter it all by hand)
- [ ] Validation of Midi file to ensure that no more than 256 Tables, Phrases and Chains across the song