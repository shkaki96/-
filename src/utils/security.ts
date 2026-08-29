import { AllowedStorageKey } from '../types/security';

/**
 * Security Utility Module
 * 
 * Enforces client-side security policies:
 * - Sanitizes user inputs against HTML injection / XSS attacks.
 * - Protects numerical calculations against NaN/Infinity parameter corruption.
 * - Restricts localStorage usage strictly to non-sensitive user preferences.
 */

const STORAGE_PREFIX = 'taq_lab_';

/**
 * Sanitizes input text to prevent XSS / script injection.
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validates and clamps numerical parameter inputs to prevent physics calculation crashes.
 */
export function validateNumericInput(
  val: unknown,
  min: number,
  max: number,
  fallback: number
): number {
  if (typeof val !== 'number' || !Number.isFinite(val) || Number.isNaN(val)) {
    return fallback;
  }
  return Math.min(Math.max(val, min), max);
}

/**
 * Safe client-side storage wrapper.
 * Strictly whitelist-controlled for non-sensitive data (language preferences, theme settings).
 */
export const SafeStorage = {
  getItem(key: AllowedStorageKey): string | null {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return null;
      return window.localStorage.getItem(STORAGE_PREFIX + key);
    } catch {
      // Handle private browsing or disabled storage gracefully
      return null;
    }
  },

  setItem(key: AllowedStorageKey, value: string): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return false;
      window.localStorage.setItem(STORAGE_PREFIX + key, value);
      return true;
    } catch {
      return false;
    }
  },

  removeItem(key: AllowedStorageKey): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      window.localStorage.removeItem(STORAGE_PREFIX + key);
    } catch {
      // Ignore storage errors
    }
  },
};
