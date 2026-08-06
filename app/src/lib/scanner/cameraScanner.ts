import { BrowserMultiFormatReader } from "@zxing/browser";
import type { CameraScannerOptions } from "@/lib/scanner/types";

const DEFAULT_OPTIONS: Required<CameraScannerOptions> = {
  preferredDeviceId: "",
  stopOnSuccess: true,
};

const NATIVE_POLL_INTERVAL_MS = 200;

export function isNativeBarcodeDetectorSupported(): boolean {
  return typeof window !== "undefined" && "BarcodeDetector" in window;
}

/**
 * Native `BarcodeDetector` where the browser supports it, `@zxing/browser`
 * (wraps `@zxing/library`) everywhere else — Firefox and Safari don't ship
 * the native API yet.
 */
export class CameraScannerEngine {
  private readonly options: Required<CameraScannerOptions>;
  private callback: ((code: string) => void) | null = null;
  private errorCallback: ((message: string) => void) | null = null;
  private stopZXing: (() => void) | null = null;
  private nativeIntervalId: ReturnType<typeof setInterval> | null = null;
  private stream: MediaStream | null = null;
  private videoElement: HTMLVideoElement | null = null;

  constructor(options: CameraScannerOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  onScan(callback: (code: string) => void): void {
    this.callback = callback;
  }

  onError(callback: (message: string) => void): void {
    this.errorCallback = callback;
  }

  async start(videoElement: HTMLVideoElement): Promise<void> {
    this.videoElement = videoElement;

    if (isNativeBarcodeDetectorSupported()) {
      await this.startNative(videoElement);
    } else {
      await this.startZXing(videoElement);
    }
  }

  stop(): void {
    if (this.nativeIntervalId) {
      clearInterval(this.nativeIntervalId);
      this.nativeIntervalId = null;
    }

    this.stopZXing?.();
    this.stopZXing = null;

    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;

    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
  }

  private async startNative(videoElement: HTMLVideoElement): Promise<void> {
    const BarcodeDetectorCtor = window.BarcodeDetector;

    if (!BarcodeDetectorCtor) {
      throw new Error("BarcodeDetector is not available in this browser.");
    }

    const constraints: MediaStreamConstraints = {
      video: this.options.preferredDeviceId
        ? { deviceId: { exact: this.options.preferredDeviceId } }
        : { facingMode: "environment" },
    };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    this.stream = stream;
    videoElement.srcObject = stream;
    await videoElement.play();

    const detector = new BarcodeDetectorCtor();

    this.nativeIntervalId = setInterval(() => {
      detector
        .detect(videoElement)
        .then((barcodes) => {
          const [barcode] = barcodes;
          if (!barcode) {
            return;
          }

          const code = barcode.rawValue;

          if (this.options.stopOnSuccess) {
            this.stop();
          }

          this.callback?.(code);
        })
        .catch((error: unknown) => {
          this.errorCallback?.(
            error instanceof Error ? error.message : "Camera scan failed.",
          );
        });
    }, NATIVE_POLL_INTERVAL_MS);
  }

  private async startZXing(videoElement: HTMLVideoElement): Promise<void> {
    const reader = new BrowserMultiFormatReader();

    const controls = await reader.decodeFromVideoDevice(
      this.options.preferredDeviceId || undefined,
      videoElement,
      (result, error) => {
        if (result) {
          const code = result.getText();

          if (this.options.stopOnSuccess) {
            this.stop();
          }

          this.callback?.(code);
        } else if (error && error.name !== "NotFoundException") {
          this.errorCallback?.(error.message || "Camera scan failed.");
        }
      },
    );

    this.stopZXing = () => controls.stop();
  }
}
