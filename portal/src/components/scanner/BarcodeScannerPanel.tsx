import { useEffect } from "react";
import { Camera, CheckCircle2, Keyboard, Loader2, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";
import type { ScanHandler, UseBarcodeScannerOptions } from "@/lib/scanner/types";

interface BarcodeScannerPanelProps {
  options?: UseBarcodeScannerOptions;
  onScan: ScanHandler;
}

export function BarcodeScannerPanel({ options, onScan }: BarcodeScannerPanelProps) {
  const scanner = useBarcodeScanner(options);
  const subscribe = scanner.onScan;

  useEffect(() => {
    return subscribe(onScan);
  }, [subscribe, onScan]);

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-1">
          <Button
            type="button"
            size="sm"
            variant={scanner.mode === "usb" ? "default" : "outline"}
            onClick={() => scanner.setMode("usb")}
          >
            <Keyboard />
            USB Scanner
          </Button>
          <Button
            type="button"
            size="sm"
            variant={scanner.mode === "camera" ? "default" : "outline"}
            onClick={() => scanner.setMode("camera")}
          >
            <Camera />
            Camera
          </Button>
        </div>

        <Badge variant={scanner.isScanning ? "default" : "outline"}>
          {scanner.isScanning ? "Scanning" : "Idle"}
        </Badge>
      </div>

      {scanner.mode === "camera" && (
        <video
          ref={scanner.videoRef}
          className="aspect-video w-full rounded-md bg-black object-cover"
          muted
          playsInline
        />
      )}

      <div className="flex items-center gap-2">
        {scanner.isScanning ? (
          <Button type="button" size="sm" variant="outline" onClick={scanner.stop}>
            Stop
          </Button>
        ) : (
          <Button type="button" size="sm" onClick={scanner.start}>
            Start Scanning
          </Button>
        )}

        {scanner.isProcessing && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin" />
            Processing...
          </span>
        )}
      </div>

      {scanner.lastError && (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertDescription>{scanner.lastError}</AlertDescription>
        </Alert>
      )}

      {scanner.lastScan && !scanner.lastError && (
        <Alert>
          <CheckCircle2 />
          <AlertDescription>Scanned: {scanner.lastScan}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
