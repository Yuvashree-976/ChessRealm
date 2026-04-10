// Web Audio API-based chess sound effects
const audioContext = () => {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return ctx;
};

let ctx: AudioContext | null = null;
const getCtx = () => {
  if (!ctx) ctx = audioContext();
  return ctx;
};

function playTone(freq: number, duration: number, type: OscillatorType = "sine", volume = 0.15) {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, c.currentTime);
  gain.gain.setValueAtTime(volume, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + duration);
}

export function playMoveSound() {
  playTone(600, 0.08, "sine", 0.12);
  setTimeout(() => playTone(800, 0.06, "sine", 0.08), 40);
}

export function playCaptureSound() {
  playTone(300, 0.12, "square", 0.1);
  setTimeout(() => playTone(200, 0.15, "square", 0.08), 60);
}

export function playCheckSound() {
  playTone(900, 0.1, "sawtooth", 0.1);
  setTimeout(() => playTone(1100, 0.15, "sawtooth", 0.08), 80);
  setTimeout(() => playTone(900, 0.1, "sawtooth", 0.06), 160);
}

export function playGameOverSound() {
  [0, 100, 200, 300].forEach((delay, i) => {
    setTimeout(() => playTone(400 + i * 100, 0.2, "sine", 0.1 - i * 0.02), delay);
  });
}
