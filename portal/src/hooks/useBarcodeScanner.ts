import { useCallback, useEffect, useRef, useState } from "react";
import { CameraScannerEngine } from "@/lib/scanner/cameraScanner";
import { UsbScannerEngine } from "@/lib/scanner/usbScanner";
import { playBeep, vibrateDevice } from "@/lib/scanner/beep";
import { defaultBarcodeValidator } from "@/lib/scanner/validateBarcode";
import type { ScanHandler, ScannerMode, UseBarcodeScannerOptions } from "@/lib/scanner/types";

const DEFAULT_DUPLICATE_INTERVAL_MS = 1500;

export function useBarcodeScanner(options: UseBarcodeScannerOptions = {}) {
  const {
    mode: initialMode = "usb",
    usb: usbOptions,
    camera: cameraOptions,
    duplicateIntervalMs = DEFAULT_DUPLICATE_INTERVAL_MS,
    beepOnScan = true,
    vibrateOnScan = true,
    validate = defaultBarcodeValidator,
  } = options;

  const [mode, setModeState] = useState<ScannerMode>(initialMode);
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastScan, setLastScan] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const usbEngineRef = useRef<UsbScannerEngine | null>(null);
  const cameraEngineRef = useRef<CameraScannerEngine | null>(null);
  const handlersRef = useRef<Set<ScanHandler>>(new Set());
  const lastAcceptedRef = useRef<{ code: string; timestamp: number } | null>(null);
  const processingRef = useRef(false);

  usbEngineRef.current ??= new UsbScannerEngine(usbOptions);
  cameraEngineRef.current ??= new CameraScannerEngine(cameraOptions);

  const handleRawScan = useCallback(
    (rawCode: string) => {
      if (processingRef.current) {
        return;
      }

      const code = rawCode.trim();
      const now = Date.now();
      const lastAccepted = lastAcceptedRef.current;

      if (
        lastAccepted &&
        lastAccepted.code === code &&
        now - lastAccepted.timestamp < duplicateIntervalMs
      ) {
        return;
      }

      const validationResult = validate(code);
      if (validationResult !== true) {
        setLastError(validationResult);
        return;
      }

      lastAcceptedRef.current = { code, timestamp: now };
      setLastError(null);
      setLastScan(code);

      if (beepOnScan) {
        playBeep();
      }
      if (vibrateOnScan) {
        vibrateDevice();
      }

      processingRef.current = true;
      setIsProcessing(true);

      Promise.all(Array.from(handlersRef.current).map((handler) => handler(code)))
        .catch((error: unknown) => {
          setLastError(error instanceof Error ? error.message : "Failed to process scan.");
        })
        .finally(() => {
          processingRef.current = false;
          setIsProcessing(false);
        });
    },
    [duplicateIntervalMs, validate, beepOnScan, vibrateOnScan],
  );

  useEffect(() => {
    usbEngineRef.current?.onScan(handleRawScan);
  }, [handleRawScan]);

  useEffect(() => {
    cameraEngineRef.current?.onScan(handleRawScan);
    cameraEngineRef.current?.onError(setLastError);
  }, [handleRawScan]);

  useEffect(() => {
    return () => {
      usbEngineRef.current?.stop();
      cameraEngineRef.current?.stop();
    };
  }, []);

  const start = useCallback(() => {
    setLastError(null);

    if (mode === "usb") {
      usbEngineRef.current?.start();
      setIsScanning(true);
      return;
    }

    const videoElement = videoRef.current;
    if (!videoElement) {
      setLastError("Camera preview is not ready yet.");
      return;
    }

    cameraEngineRef.current
      ?.start(videoElement)
      .then(() => setIsScanning(true))
      .catch((error: unknown) => {
        setLastError(error instanceof Error ? error.message : "Unable to access the camera.");
      });
  }, [mode]);

  const stop = useCallback(() => {
    usbEngineRef.current?.stop();
    cameraEngineRef.current?.stop();
    setIsScanning(false);
  }, []);

  /**
   * Switching mode always stops any active scan rather than trying to
   * silently re-start in the new mode — camera start is async and can fail
   * (permission denial, no device), so the caller stays in control of
   * calling `start()` again rather than that failure being hidden inside an
   * implicit auto-restart.
   */
  const setMode = useCallback((nextMode: ScannerMode) => {
    setModeState((current) => {
      if (current === nextMode) {
        return current;
      }

      usbEngineRef.current?.stop();
      cameraEngineRef.current?.stop();
      setIsScanning(false);

      return nextMode;
    });
  }, []);

  const onScan = useCallback((handler: ScanHandler) => {
    handlersRef.current.add(handler);
    return () => {
      handlersRef.current.delete(handler);
    };
  }, []);

  return {
    mode,
    setMode,
    isScanning,
    isProcessing,
    lastScan,
    lastError,
    videoRef,
    start,
    stop,
    onScan,
  };
}
