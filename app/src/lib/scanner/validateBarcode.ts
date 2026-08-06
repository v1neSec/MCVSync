import type { BarcodeValidator } from "@/lib/scanner/types";

const MIN_LENGTH = 3;
const MAX_LENGTH = 64;

/**
 * Deliberately generic — real symbology/business rules (does this barcode
 * exist as an item, does it match an expected format for this module) are
 * out of scope for the scanning foundation. Consumers override via the
 * `validate` option.
 */
export const defaultBarcodeValidator: BarcodeValidator = (rawCode) => {
  const code = rawCode.trim();

  if (code.length === 0) {
    return "Scanned barcode is empty.";
  }

  if (code.length < MIN_LENGTH) {
    return `Scanned barcode is too short (minimum ${MIN_LENGTH} characters).`;
  }

  if (code.length > MAX_LENGTH) {
    return `Scanned barcode is too long (maximum ${MAX_LENGTH} characters).`;
  }

  return true;
};
