type PhraseObj = {
  notes: string[],
  command: string
}

export default class Phrase {
  noteCount: number
  startTick: number
  endTick: number
  label: string
  notes: PhraseObj[]

  constructor(noteCount: number, startTick: number, endTick: number, label: string) {
    this.noteCount = noteCount
    this.startTick = startTick
    this.endTick = endTick
    this.label = label
    this.notes = []
  }
}