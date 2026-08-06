let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  audioContext ??= new AudioContext();
  return audioContext;
}

/**
 * A short generated tone — no binary asset to ship, and it only ever runs
 * after a user gesture has already unlocked audio (a scan only happens once
 * scanning has been started by the user).
 */
export function playBeep(frequency = 880, durationMs = 90): void {
  try {
    const context = getAudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.value = 0.15;

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + durationMs / 1000);
  } catch {
    // Audio isn't available in every environment (e.g. autoplay-restricted
    // contexts) — a missed beep should never break scanning.
  }
}

export function vibrateDevice(pattern: number | number[] = 60): void {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}
