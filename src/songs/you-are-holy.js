import * as Tone from "tone";

/**
 * YOU ARE HOLY - Christian Worship Song
 * Key: C Major | Tempo: 75 BPM | Time: 4/4
 * Created by Promise Nwhator
 */

// Song metadata
export const metadata = {
  title: "You Are Holy",
  genre: "Christian Worship",
  key: "C Major",
  tempo: 75,
  duration: "~4:30",
  description: "A powerful worship anthem celebrating God's holiness and majesty"
};

// Global state
let isPlaying = false;
let scheduledEvents = [];

// Chord progressions
const chords = {
  intro: ["C", "G", "Am", "F", "C", "G", "F", "G"],
  verse: ["C", "G", "Am", "F", "C", "G", "F", "G"],
  chorus: ["Am", "F", "C", "G"],
  bridge: ["F", "G", "Am", "G", "F", "G", "C"],
  outro: ["C", "G", "Am", "F", "C", "G", "F", "C"]
};

// Note mappings for chords
const chordNotes = {
  C: ["C3", "E3", "G3", "C4"],
  G: ["G2", "B3", "D4", "G4"],
  Am: ["A2", "C3", "E3", "A3"],
  F: ["F2", "A3", "C4", "F4"]
};

// Flute melody for chorus (in scale degrees)
const fluteMelody = {
  Am: ["A4", "C5", "E5", "G5", "A5"],
  F: ["F4", "G4", "A4", "G4", "F4"],
  C: ["G4", "E4", "D4", "C4", "D4"],
  G: ["D4", "E4", "G4", "F4", "G4"]
};

// Initialize instruments
let instruments = null;

function createInstruments() {
  // Piano with reverb
  const pianoReverb = new Tone.Reverb({
    decay: 2.5,
    wet: 0.3
  }).toDestination();

  const piano = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sine" },
    envelope: {
      attack: 0.005,
      decay: 0.3,
      sustain: 0.4,
      release: 1.2
    }
  }).connect(pianoReverb);

  // Pad synth for atmosphere
  const padReverb = new Tone.Reverb({
    decay: 4,
    wet: 0.5
  }).toDestination();

  const pad = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sine" },
    envelope: {
      attack: 2,
      decay: 1,
      sustain: 0.8,
      release: 3
    }
  }).connect(padReverb);

  // Acoustic guitar simulation
  const guitarDelay = new Tone.FeedbackDelay({
    delayTime: "8n",
    feedback: 0.2,
    wet: 0.3
  }).toDestination();

  const guitar = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "triangle" },
    envelope: {
      attack: 0.01,
      decay: 0.2,
      sustain: 0.3,
      release: 0.8
    }
  }).connect(guitarDelay);

  // Bass synth
  const bass = new Tone.MonoSynth({
    oscillator: { type: "sine" },
    envelope: {
      attack: 0.01,
      decay: 0.2,
      sustain: 0.6,
      release: 0.8
    },
    filterEnvelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.5,
      release: 0.5,
      baseFrequency: 200,
      octaves: 2
    }
  }).toDestination();

  // Flute lead (sine wave for pure tone)
  const fluteReverb = new Tone.Reverb({
    decay: 2,
    wet: 0.4
  }).toDestination();

  const flute = new Tone.Synth({
    oscillator: { type: "sine" },
    envelope: {
      attack: 0.02,
      decay: 0.1,
      sustain: 0.7,
      release: 0.5
    }
  }).connect(fluteReverb);

  // Electric guitar with delay
  const electricDelay = new Tone.PingPongDelay({
    delayTime: "8n.",
    feedback: 0.4,
    wet: 0.5
  }).toDestination();

  const electricGuitar = new Tone.Synth({
    oscillator: { type: "sawtooth" },
    envelope: {
      attack: 0.05,
      decay: 0.2,
      sustain: 0.6,
      release: 1.5
    }
  }).connect(electricDelay);

  // Strings pad
  const strings = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sawtooth" },
    envelope: {
      attack: 1.5,
      decay: 0.5,
      sustain: 0.9,
      release: 2
    }
  }).toDestination();

  // Drums
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

  const snare = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: {
      attack: 0.001,
      decay: 0.2,
      sustain: 0
    }
  }).toDestination();

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

  const cymbal = new Tone.MetalSynth({
    frequency: 250,
    envelope: {
      attack: 0.001,
      decay: 1.4,
      release: 0.3
    },
    harmonicity: 3.1,
    modulationIndex: 16,
    resonance: 3000,
    octaves: 1.5
  }).toDestination();

  return {
    piano,
    pad,
    guitar,
    bass,
    flute,
    electricGuitar,
    strings,
    kick,
    snare,
    hihat,
    cymbal
  };
}

// Helper function to play a chord progression
function playChordProgression(instrument, chordProgression, startTime, duration, volume = -12) {
  instrument.volume.value = volume;
  chordProgression.forEach((chord, index) => {
    const time = startTime + index * duration;
    const notes = chordNotes[chord];
    if (notes && Array.isArray(notes)) {
      // Schedule each note in the chord
      notes.forEach(note => {
        try {
          instrument.triggerAttackRelease(note, duration * 0.9, time);
        } catch (e) {
          console.error('Error playing note:', note, e);
        }
      });
    }
  });
}

// Helper function to play bass line
function playBassLine(bass, chordProgression, startTime, duration) {
  bass.volume.value = -10;
  chordProgression.forEach((chord, index) => {
    const time = startTime + index * duration;
    const bassNote = chordNotes[chord][0]; // Root note
    const id = bass.triggerAttackRelease(bassNote, duration * 0.8, time);
    scheduledEvents.push({ instrument: bass, time, id });
  });
}

// Helper function to play flute melody
function playFluteMelody(flute, chordProgression, startTime, chordDuration, octave = 0) {
  flute.volume.value = -8;
  chordProgression.forEach((chord, chordIndex) => {
    const melody = fluteMelody[chord];
    if (melody) {
      melody.forEach((note, noteIndex) => {
        const time = startTime + chordIndex * chordDuration + noteIndex * (chordDuration / melody.length);
        const adjustedNote = octave !== 0 ? note.replace(/\d/, (match) => parseInt(match) + octave) : note;
        const id = flute.triggerAttackRelease(adjustedNote, chordDuration / melody.length * 0.8, time);
        scheduledEvents.push({ instrument: flute, time, id });
      });
    }
  });
}

// Drum patterns
function playDrums(drums, startTime, measures, pattern = "basic") {
  const { kick, snare, hihat, cymbal } = drums;
  const beatDuration = 60 / 75; // 75 BPM = 0.8s per beat
  const measureDuration = beatDuration * 4;

  for (let m = 0; m < measures; m++) {
    const measureStart = startTime + m * measureDuration;

    if (pattern === "light" || pattern === "basic" || pattern === "full") {
      // Kick on 1 and 3
      kick.triggerAttackRelease("C1", "8n", measureStart);
      kick.triggerAttackRelease("C1", "8n", measureStart + beatDuration * 2);
    }

    if (pattern === "basic" || pattern === "full") {
      // Snare on 2 and 4
      snare.triggerAttackRelease("8n", measureStart + beatDuration);
      snare.triggerAttackRelease("8n", measureStart + beatDuration * 3);
    }

    if (pattern === "full") {
      // Hi-hat every beat
      for (let beat = 0; beat < 4; beat++) {
        hihat.triggerAttackRelease("32n", measureStart + beat * beatDuration);
      }
    }

    if (pattern === "light" && m % 4 === 0) {
      // Cymbal shimmer occasionally
      cymbal.triggerAttackRelease("8n", measureStart);
    }
  }
}

// Main song structure
async function playSong() {
  if (isPlaying) return;
  
  await Tone.start();
  isPlaying = true;
  
  // Create instruments
  instruments = createInstruments();
  
  // Set tempo
  Tone.getTransport().bpm.value = 75;
  
  const beatDuration = 60 / 75; // 0.8 seconds per beat
  const barDuration = beatDuration * 4; // 3.2 seconds per bar
  
  let currentTime = Tone.now() + 0.1;

  // INTRO (2× - 8 bars total) - Intensity 1️⃣
  console.log("🎵 Playing Intro...");
  playChordProgression(instruments.pad, chords.intro, currentTime, barDuration, -18);
  playChordProgression(instruments.piano, chords.intro, currentTime + 0.1, barDuration, -14);
  playDrums(instruments, currentTime, 8, "light");
  currentTime += barDuration * 8;

  // VERSE 1 (8 bars) - Intensity 2️⃣
  console.log("🕊️ Playing Verse 1...");
  playChordProgression(instruments.piano, chords.verse, currentTime, barDuration, -12);
  playChordProgression(instruments.pad, chords.verse, currentTime, barDuration, -18);
  playDrums(instruments, currentTime, 8, "basic");
  currentTime += barDuration * 8;

  // VERSE 2 (8 bars) - Intensity 3️⃣
  console.log("🙏🏽 Playing Verse 2...");
  playChordProgression(instruments.piano, chords.verse, currentTime, barDuration, -12);
  playChordProgression(instruments.pad, chords.verse, currentTime, barDuration, -18);
  playChordProgression(instruments.guitar, chords.verse, currentTime + 0.05, barDuration, -16);
  playDrums(instruments, currentTime, 8, "full");
  currentTime += barDuration * 8;

  // CHORUS 1 (Soft - 4 bars × 4 chords = 16 bars) - Intensity 4️⃣
  console.log("🎵 Playing Chorus 1...");
  const chorusProg = [...chords.chorus, ...chords.chorus, ...chords.chorus, ...chords.chorus];
  playChordProgression(instruments.piano, chorusProg, currentTime, barDuration, -12);
  playChordProgression(instruments.pad, chorusProg, currentTime, barDuration, -16);
  playBassLine(instruments.bass, chorusProg, currentTime, barDuration);
  playFluteMelody(instruments.flute, chorusProg, currentTime, barDuration);
  playDrums(instruments, currentTime, 16, "full");
  currentTime += barDuration * 16;

  // INSTRUMENTAL BREAK (8 bars) - Intensity 4️⃣
  console.log("🎶 Playing Instrumental Break...");
  playChordProgression(instruments.piano, chords.intro, currentTime, barDuration, -12);
  playChordProgression(instruments.pad, chords.intro, currentTime, barDuration, -16);
  playChordProgression(instruments.electricGuitar, chords.intro, currentTime + 0.08, barDuration, -14);
  playBassLine(instruments.bass, chords.intro, currentTime, barDuration);
  playDrums(instruments, currentTime, 8, "full");
  currentTime += barDuration * 8;

  // VERSE 3 (8 bars) - Intensity 4️⃣
  console.log("✨ Playing Verse 3...");
  playChordProgression(instruments.piano, chords.verse, currentTime, barDuration, -10);
  playChordProgression(instruments.pad, chords.verse, currentTime, barDuration, -16);
  playBassLine(instruments.bass, chords.verse, currentTime, barDuration);
  playDrums(instruments, currentTime, 8, "full");
  currentTime += barDuration * 8;

  // CHORUS 2 (Stronger - 16 bars) - Intensity 5️⃣
  console.log("🔥 Playing Chorus 2...");
  playChordProgression(instruments.piano, chorusProg, currentTime, barDuration, -10);
  playChordProgression(instruments.pad, chorusProg, currentTime, barDuration, -14);
  playChordProgression(instruments.strings, chorusProg, currentTime + 0.2, barDuration, -16);
  playBassLine(instruments.bass, chorusProg, currentTime, barDuration);
  playFluteMelody(instruments.flute, chorusProg, currentTime, barDuration);
  playDrums(instruments, currentTime, 16, "full");
  currentTime += barDuration * 16;

  // BRIDGE 1 (Soft - 7 bars) - Intensity 5️⃣
  console.log("🌌 Playing Bridge (soft)...");
  playChordProgression(instruments.piano, chords.bridge, currentTime, barDuration, -12);
  playChordProgression(instruments.pad, chords.bridge, currentTime, barDuration, -14);
  playChordProgression(instruments.strings, chords.bridge, currentTime + 0.2, barDuration, -18);
  playDrums(instruments, currentTime, 7, "full");
  currentTime += barDuration * 7;

  // BRIDGE 2 (Powerful - 7 bars) - Intensity 6️⃣
  console.log("🌌 Playing Bridge (powerful)...");
  playChordProgression(instruments.piano, chords.bridge, currentTime, barDuration, -8);
  playChordProgression(instruments.pad, chords.bridge, currentTime, barDuration, -12);
  playChordProgression(instruments.strings, chords.bridge, currentTime + 0.2, barDuration, -10);
  playChordProgression(instruments.electricGuitar, chords.bridge, currentTime + 0.1, barDuration, -12);
  playBassLine(instruments.bass, chords.bridge, currentTime, barDuration);
  playDrums(instruments, currentTime, 7, "full");
  currentTime += barDuration * 7;

  // FINAL CHORUS (Big Finish - 16 bars) - Intensity 6️⃣
  console.log("🎵 Playing Final Chorus...");
  playChordProgression(instruments.piano, chorusProg, currentTime, barDuration, -8);
  playChordProgression(instruments.pad, chorusProg, currentTime, barDuration, -12);
  playChordProgression(instruments.strings, chorusProg, currentTime + 0.2, barDuration, -10);
  playChordProgression(instruments.guitar, chorusProg, currentTime + 0.05, barDuration, -14);
  playChordProgression(instruments.electricGuitar, chorusProg, currentTime + 0.1, barDuration, -12);
  playBassLine(instruments.bass, chorusProg, currentTime, barDuration);
  playFluteMelody(instruments.flute, chorusProg, currentTime, barDuration, 1); // Octave higher
  playDrums(instruments, currentTime, 16, "full");
  currentTime += barDuration * 16;

  // OUTRO (Fade - 8 bars) - Intensity 1️⃣
  console.log("🌠 Playing Outro...");
  playChordProgression(instruments.piano, chords.outro, currentTime, barDuration, -14);
  playChordProgression(instruments.pad, chords.outro, currentTime, barDuration, -16);
  currentTime += barDuration * 8;

  console.log("✨ Song complete! Total duration: ~" + Math.round(currentTime - Tone.now()) + " seconds");
  
  // Return stop function
  return stopSong;
}

// Stop function
function stopSong() {
  if (!isPlaying) return;
  
  console.log("⏹️ Stopping song...");
  
  // Cancel all scheduled events
  Tone.getTransport().cancel();
  
  // Release all notes and dispose instruments
  if (instruments) {
    Object.values(instruments).forEach(instrument => {
      try {
        if (instrument.releaseAll) {
          instrument.releaseAll();
        }
        if (instrument.dispose) {
          instrument.dispose();
        }
      } catch (e) {
        // Ignore disposal errors
      }
    });
  }
  
  // Clear scheduled events
  scheduledEvents = [];
  instruments = null;
  isPlaying = false;
}

// Export play and stop functions
export const playYouAreHoly = playSong;
export const stopYouAreHoly = stopSong;
export const getIsPlaying = () => isPlaying;
