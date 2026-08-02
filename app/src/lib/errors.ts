import { isAxiosError } from "axios";

export function getErrorMessage(error: unknown): string {
  if (isAxiosError<{ message?: string; errors?: Record<string, string[]> }>(error)) {
    const errors = error.response?.data?.errors;
    if (errors) {
      const firstField = Object.values(errors)[0];
      if (firstField?.[0]) {
        return firstField[0];
      }
    }

    if (error.response?.data?.message) {
      return error.response.data.message;
    }
  }

  return "Something went wrong. Please try again.";
}
