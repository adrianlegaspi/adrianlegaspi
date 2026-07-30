let audioCtx;

/**
 * Synthesized Win9x-style UI click: a short filtered noise burst rather
 * than a shipped audio file, so there's no asset to load or license.
 */
export default function playClickSound() {
  if (typeof window === 'undefined') return;

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = audioCtx || new AudioContextClass();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const duration = 0.02;
    const sampleRate = audioCtx.sampleRate;
    const bufferSize = Math.floor(sampleRate * duration);
    const buffer = audioCtx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const source = audioCtx.createBufferSource();
    source.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2500;

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.35, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    source.start();
  } catch {
    // Autoplay restrictions or missing Web Audio support -- the sound is
    // decorative, so failing silently beats breaking the click itself.
  }
}
