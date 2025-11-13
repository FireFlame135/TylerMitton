// src/lib/utils.ts
/**
 * Utility functions for className merging.
 * Author: Tyler Mitton
 * Combines clsx and tailwind-merge for optimal Tailwind class handling.
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Merge classNames with Tailwind CSS conflict resolution
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
