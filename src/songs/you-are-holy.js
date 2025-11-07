import * as Tone from "tone";

/**
 * YOU ARE HOLY - Christian Worship Song
 * Key: C Major | Tempo: 100 BPM | Time: 4/4
 * Created by Promise Nwhator
 */

// Song metadata
export const metadata = {
  title: "You Are Holy",
  genre: "Christian Worship",
  key: "C Major",
  tempo: 100,
  duration: "~2:30",
  description: "A worship anthem celebrating God's holiness"
};

// Global state
let isPlaying = false;
let instruments = null;

// Chord progressions for each section
const sections = {
  intro: ["C", "G", "Am", "F"],
  verse: ["C", "G", "Am", "F", "C", "G", "F", "G"],
  chorus: ["Am", "F", "C", "G", "Am", "F", "C", "G"],
  bridge: ["F", "G", "Am", "G", "F", "G", "C"]
};

// Chord notes (root, third, fifth, octave)
const chordNotes = {
  C: ["C3", "E3", "G3", "C4"],
  G: ["G2", "B2", "D3", "G3"],
  Am: ["A2", "C3", "E3", "A3"],
  F: ["F2", "A2", "C3", "F3"]
};

// Simple melody notes for chorus
const melodyNotes = {
  Am: ["A4", "C5", "E5"],
  F: ["F4", "A4", "C5"],
  C: ["G4", "E4", "C4"],
  G: ["D4", "G4", "B4"]
};

// Create instruments
function createInstruments() {
  // 1. Drums (Kick, Snare, Hi-hat)
  const kick = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 4,
    oscillator: { type: "sine" },
    envelope: {
      attack: 0.001,
      decay: 0.4,
      sustain: 0.01,
      release: 1.4
    }
  }).toDestination();
  kick.volume.value = -10;

  const snare = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: {
      attack: 0.001,
      decay: 0.2,
      sustain: 0
    }
  }).toDestination();
  snare.volume.value = -15;

  const hihat = new Tone.MetalSynth({
    frequency: 200,
    envelope: {
      attack: 0.001,
      decay: 0.1,
      release: 0.01
    },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 4000,
    octaves: 1.5
  }).toDestination();
  hihat.volume.value = -20;

  // 2. Piano (for chords)
  const piano = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sine" },
    envelope: {
      attack: 0.005,
      decay: 0.3,
      sustain: 0.4,
      release: 1.2
    }
  }).toDestination();
  piano.volume.value = -6;

  // 3. Pad (atmospheric background)
  const pad = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sine" },
    envelope: {
      attack: 1.5,
      decay: 1,
      sustain: 0.8,
      release: 2
    }
  }).toDestination();
  pad.volume.value = -12;

  // 4. Lead synth for melody
  const lead = new Tone.Synth({
    oscillator: { type: "sine" },
    envelope: {
      attack: 0.02,
      decay: 0.1,
      sustain: 0.7,
      release: 0.5
    }
  }).toDestination();
  lead.volume.value = -14;

  return { kick, snare, hihat, piano, pad, lead };
}

// Play drums pattern
function playDrums(drums, startTime, bars) {
  const { kick, snare, hihat } = drums;
  const beatDuration = 60 / 100; // 100 BPM = 0.6s per beat
  const barDuration = beatDuration * 4;

  for (let bar = 0; bar < bars; bar++) {
    const barStart = startTime + bar * barDuration;

    // Kick on beats 1 and 3
    kick.triggerAttackRelease("C1", "8n", barStart);
    kick.triggerAttackRelease("C1", "8n", barStart + beatDuration * 2);

    // Snare on beats 2 and 4
    snare.triggerAttackRelease("8n", barStart + beatDuration);
    snare.triggerAttackRelease("8n", barStart + beatDuration * 3);

    // Hi-hat on every beat
    for (let beat = 0; beat < 4; beat++) {
      hihat.triggerAttackRelease("32n", barStart + beat * beatDuration);
    }
  }
}

// Play chord progression
function playChords(instrument, progression, startTime, barDuration) {
  progression.forEach((chord, index) => {
    const time = startTime + index * barDuration;
    const notes = chordNotes[chord];
    
    if (notes) {
      // Play each note of the chord with tiny offset to avoid timing conflicts
      notes.forEach((note, noteIndex) => {
        instrument.triggerAttackRelease(note, barDuration * 0.9, time + noteIndex * 0.001);
      });
    }
  });
}

// Play simple melody
function playMelody(lead, progression, startTime, barDuration) {
  progression.forEach((chord, chordIndex) => {
    const melody = melodyNotes[chord];
    if (melody) {
      const noteTime = barDuration / melody.length;
      melody.forEach((note, noteIndex) => {
        const time = startTime + chordIndex * barDuration + noteIndex * noteTime;
        lead.triggerAttackRelease(note, noteTime * 0.8, time + 0.001);
      });
    }
  });
}

// Main play function
async function playSong() {
  if (isPlaying) return;

  await Tone.start();
  isPlaying = true;

  // Create instruments
  instruments = createInstruments();

  const beatDuration = 60 / 100; // 0.6s per beat
  const barDuration = beatDuration * 4; // 2.4s per bar
  let currentTime = Tone.now() + 1; // 1 second delay to ensure audio context is ready

  console.log("🎵 Starting You Are Holy...");

  // DRUMS INTRO (4 bars) - Drums only
  console.log(" Drums intro...");
  playDrums(instruments, currentTime, 4);
  currentTime += barDuration * 4;

  // INTRO (4 bars) - Drums + Piano
  console.log(" Intro with chords...");
  playDrums(instruments, currentTime, 4);
  playChords(instruments.piano, sections.intro, currentTime, barDuration);
  currentTime += barDuration * 4;

  // VERSE 1 (8 bars) - Drums + Piano + Pad + Melody
  console.log("🎤 Verse 1...");
  playDrums(instruments, currentTime, 8);
  playChords(instruments.piano, sections.verse, currentTime, barDuration);
  playChords(instruments.pad, sections.verse, currentTime, barDuration);
  playMelody(instruments.lead, sections.verse, currentTime, barDuration);
  currentTime += barDuration * 8;

  // CHORUS 1 (8 bars) - All instruments + Melody
  console.log("✨ Chorus 1...");
  playDrums(instruments, currentTime, 8);
  playChords(instruments.piano, sections.chorus, currentTime, barDuration);
  playChords(instruments.pad, sections.chorus, currentTime, barDuration);
  playMelody(instruments.lead, sections.chorus, currentTime, barDuration);
  currentTime += barDuration * 8;

  // VERSE 2 (8 bars)
  console.log("🎤 Verse 2...");
  playDrums(instruments, currentTime, 8);
  playChords(instruments.piano, sections.verse, currentTime, barDuration);
  playChords(instruments.pad, sections.verse, currentTime, barDuration);
  playMelody(instruments.lead, sections.verse, currentTime, barDuration);
  currentTime += barDuration * 8;

  // CHORUS 2 (8 bars)
  console.log("✨ Chorus 2...");
  playDrums(instruments, currentTime, 8);
  playChords(instruments.piano, sections.chorus, currentTime, barDuration);
  playChords(instruments.pad, sections.chorus, currentTime, barDuration);
  playMelody(instruments.lead, sections.chorus, currentTime, barDuration);
  currentTime += barDuration * 8;

  // VERSE 3 (8 bars)
  console.log("🎤 Verse 3...");
  playDrums(instruments, currentTime, 8);
  playChords(instruments.piano, sections.verse, currentTime, barDuration);
  playChords(instruments.pad, sections.verse, currentTime, barDuration);
  playMelody(instruments.lead, sections.verse, currentTime, barDuration);
  currentTime += barDuration * 8;

  // CHORUS 3 (8 bars)
  console.log("✨ Chorus 3...");
  playDrums(instruments, currentTime, 8);
  playChords(instruments.piano, sections.chorus, currentTime, barDuration);
  playChords(instruments.pad, sections.chorus, currentTime, barDuration);
  playMelody(instruments.lead, sections.chorus, currentTime, barDuration);
  currentTime += barDuration * 8;

  // BRIDGE (7 bars)
  console.log("🌉 Bridge...");
  playDrums(instruments, currentTime, 7);
  playChords(instruments.piano, sections.bridge, currentTime, barDuration);
  playChords(instruments.pad, sections.bridge, currentTime, barDuration);
  playMelody(instruments.lead, sections.bridge, currentTime, barDuration);
  currentTime += barDuration * 7;

  // FINAL CHORUS (8 bars)
  console.log("✨ Final Chorus...");
  playDrums(instruments, currentTime, 8);
  playChords(instruments.piano, sections.chorus, currentTime, barDuration);
  playChords(instruments.pad, sections.chorus, currentTime, barDuration);
  playMelody(instruments.lead, sections.chorus, currentTime, barDuration);
  currentTime += barDuration * 8;

  const totalDuration = currentTime - Tone.now();
  console.log(`✅ Song complete! Duration: ${Math.round(totalDuration)}s`);

  // Return stop function
  return stopSong;
}

// Stop function
function stopSong() {
  if (!isPlaying) return;

  console.log("⏹️ Stopping song...");

  // Dispose all instruments
  if (instruments) {
    Object.values(instruments).forEach(instrument => {
      try {
        if (instrument.releaseAll) instrument.releaseAll();
        if (instrument.dispose) instrument.dispose();
      } catch (e) {
        // Ignore errors
      }
    });
  }

  instruments = null;
  isPlaying = false;
}

// Exports
export const playYouAreHoly = playSong;
export const stopYouAreHoly = stopSong;
export const getIsPlaying = () => isPlaying;
