import type { UsbScannerOptions } from "@/lib/scanner/types";

const DEFAULT_OPTIONS: Required<UsbScannerOptions> = {
  minLength: 3,
  maxInterKeyDelayMs: 50,
  scanTimeoutMs: 150,
  endKey: "Enter",
};

/**
 * HID barcode scanners type real keystrokes — the only reliable way to tell
 * a scan apart from a human typing is speed + shape. A key is part of the
 * current burst only if it arrives within `maxInterKeyDelayMs` of the last
 * one; anything slower resets the buffer, which is what keeps normal typing
 * from ever accumulating into a false scan without special-casing focus.
 */
export class UsbScannerEngine {
  private readonly options: Required<UsbScannerOptions>;
  private buffer: string[] = [];
  private lastKeyTime = 0;
  private timeoutId: ReturnType<typeof setTimeout> | null = null;
  private listening = false;
  private callback: ((code: string) => void) | null = null;

  constructor(options: UsbScannerOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  onScan(callback: (code: string) => void): void {
    this.callback = callback;
  }

  start(): void {
    if (this.listening) {
      return;
    }

    this.listening = true;
    document.addEventListener("keydown", this.handleKeyDown, true);
  }

  stop(): void {
    if (!this.listening) {
      return;
    }

    this.listening = false;
    document.removeEventListener("keydown", this.handleKeyDown, true);
    this.reset();
  }

  private reset(): void {
    this.buffer = [];

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  private flush(): void {
    const code = this.buffer.join("");
    this.reset();

    if (code.length >= this.options.minLength) {
      this.callback?.(code);
    }
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    const now = performance.now();
    const delta = now - this.lastKeyTime;
    this.lastKeyTime = now;

    if (event.key === this.options.endKey) {
      if (this.buffer.length > 0 && delta <= this.options.maxInterKeyDelayMs) {
        event.preventDefault();
        this.flush();
      } else {
        this.reset();
      }
      return;
    }

    if (event.key.length !== 1) {
      return;
    }

    if (this.buffer.length > 0 && delta > this.options.maxInterKeyDelayMs) {
      this.reset();
    }

    this.buffer.push(event.key);

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      if (this.buffer.length >= this.options.minLength) {
        this.flush();
      } else {
        this.reset();
      }
    }, this.options.scanTimeoutMs);
  };
}
