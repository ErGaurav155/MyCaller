import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { connectToDatabase } from "./database/mongoose";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const handleError = (error: unknown) => {
  if (error instanceof Error) {
    // This is a native JavaScript error (e.g., TypeError, RangeError)
    throw new Error(`Error: ${error.message}`);
  } else if (typeof error === "string") {
    // This is a string error message
    throw new Error(`Error: ${error}`);
  } else {
    // This is an unknown type of error
    throw new Error(`Unknown error: ${JSON.stringify(error)}`);
  }
};
