const OCTAVE_MAX_VALUE = 12

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const NOTES_PER_OCTAVE = NOTE_NAMES.length

function getNoteValue(noteName: string, octaveIndex: string): string {
  if (noteName.indexOf('#') > -1) {
    return `${noteName}${octaveIndex}`
  }
  return `${noteName}_${octaveIndex}`
}

export const NOTES_MAP = Array(128).fill(0).map((value, index) => {
  const noteIndex = index % NOTES_PER_OCTAVE
  const octaveIndex = (index / OCTAVE_MAX_VALUE).toFixed(0)
  const noteName = NOTE_NAMES[noteIndex]
  return getNoteValue(noteName, octaveIndex)
})

export const NOTE_TO_FREQ_MAP = Array(128).fill(0).reduce((freqMap, value, index) => {
  const noteIndex = index % NOTES_PER_OCTAVE
  const octaveIndex = (index / OCTAVE_MAX_VALUE).toFixed(0)
  const noteName = NOTE_NAMES[noteIndex]
  freqMap[getNoteValue(noteName, octaveIndex)] = index
  return freqMap
}, {})

export const DRUM_MAP = {
  'C_3': 'BD-',
  'B_3': 'MT-',
  'A_3': 'MT-',
  'G_3': 'LT-',
  'G#3': 'CHH',
  'D_3': 'SD-',
  'C#4': 'CYM',
  'C_4': 'HT-',
  'D#4': 'RCY',
  'D_4': 'HT-',
  'E_4': 'RCY'
}