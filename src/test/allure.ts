import {Reporter} from "jest-allure/dist/Reporter";

export enum Feature {
  MidiParsing= 'MIDI Parsing',
  TrackStructure = 'Track Structure',
  TableMapping = 'Table Mapping',
  PhraseMapping = 'Phrase Mapping',
  ChainMapping = 'Chain Mapping',
}

declare global {
  let reporter: Reporter
}