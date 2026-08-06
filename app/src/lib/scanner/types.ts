export type ScannerMode = "usb" | "camera";

export interface ScanResult {
  code: string;
  mode: ScannerMode;
  timestamp: number;
}

export interface UsbScannerOptions {
  minLength?: number;
  maxInterKeyDelayMs?: number;
  scanTimeoutMs?: number;
  endKey?: string;
}

export interface CameraScannerOptions {
  preferredDeviceId?: string;
  stopOnSuccess?: boolean;
}

export type BarcodeValidator = (code: string) => true | string;

export interface UseBarcodeScannerOptions {
  mode?: ScannerMode;
  usb?: UsbScannerOptions;
  camera?: CameraScannerOptions;
  duplicateIntervalMs?: number;
  beepOnScan?: boolean;
  vibrateOnScan?: boolean;
  validate?: BarcodeValidator;
}

export type ScanHandler = (code: string) => void | Promise<void>;
