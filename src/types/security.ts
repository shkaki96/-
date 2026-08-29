/**
 * Security and Data Sanitization Types
 */

export interface StoragePolicy {
  allowLocalStorage: boolean;
  prefix: string;
}

export type AllowedStorageKey = 
  | 'user_language'
  | 'user_theme'
  | 'recent_experiments'
  | 'favorite_experiments';

export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark' | 'system';
  favorites: string[];
  recentExperiments: string[];
}
