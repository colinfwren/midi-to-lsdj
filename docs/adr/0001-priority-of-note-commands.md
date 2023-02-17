# 1. Priority of note commands

Date: 2023-02-16

## Status

2023-02-16 accepted

## Context

Version 1.2.0 introduces tempo change commands to phrases. Due to the way that tuplets are implemented using tables
there is a potential that there will be a note in a phrase where both the tempo being changed and there's a tuplet.

In future versions there will also be chords and pitch bends which will also use the command value so there could be
multiple clashes per note.

## Decision

Based on the commands listed in LSDJ's documentation, the following priority makes sense:

1. **Hop note** - This must take priority as this changes the structure of the song
2. **Tempo Change** - This must take priority because the tempo changes the speed of the song and it's unlikely that 
   a __Hop__ will happen on the same note
3. **Kill note** - This has a high priority because this changes the note length which is important for songs with 
   stop and starts, should look to move to next note if clashes with __Hop__ or __Tempo__ commands
4. **Table command** - This has a high priority because this is used to add tuplet notes, while they can be skipped for
   any of the above commands they should be prioritised as they make for a more accurate transcription of the track
5. **Delay command** - This has a high priority because this is used to delay notes from being run and this makes for a
    more accurate transcription
6. **Retrig command** - This is somewhat important because it makes the drums more accurate but it's less likely to
   clash with the other commands as they'd likely to be defined on another channel / could break out to another channel
   to avoid clash if song is just a drum track
7. **Chord command** - This is somewhat important because of it makes for a more accurate transcription but chords in 
    LSDJ could be done better by playing two pulse waves together rather than the arpeggio
8. **Pitch/Sweep** - This isn't that important because the note will just play without the bend

## Consequences

Based on the priority above there's a few consequences:

- Tuplets might not play if a tempo change happens on the same note
- Delayed notes might play too early if there's a clash with higher priority commands
- Retriggered drum notes might not play if there's a clash with higher priority commands
- Chords will play as single root notes if there's a clash with higher priority commands
- Pitch bends/sweeps won't happen if there's a clash with higher priority commands

I think this is an OK trade-off as it ensures that the overall song structure remains and the note ornamentations degrade
gracefully into root notes.
