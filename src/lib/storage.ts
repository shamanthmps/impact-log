/**
 * Storage Service
 * Abstracts localStorage operations with error handling and type safety
 */

import { logger } from './logger';
import { STORAGE_KEYS } from './constants';

type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

/**
 * Generic storage service for type-safe localStorage operations
 */
export const storageService = {
    /**
     * Get an item from localStorage with JSON parsing
     */
    get<T>(key: StorageKey): T | null {
        try {
            const item = localStorage.getItem(key);
            if (!item) {
                return null;
            }
            return JSON.parse(item) as T;
        } catch (error) {
            logger.error(`Failed to get item from storage: ${key}`, 'StorageService', error);
            return null;
        }
    },

    /**
     * Set an item in localStorage with JSON stringification
     */
    set<T>(key: StorageKey, value: T): boolean {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            logger.error(`Failed to set item in storage: ${key}`, 'StorageService', error);
            return false;
        }
    },

    /**
     * Remove an item from localStorage
     */
    remove(key: StorageKey): boolean {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            logger.error(`Failed to remove item from storage: ${key}`, 'StorageService', error);
            return false;
        }
    },

    /**
     * Clear all app-specific items from localStorage
     */
    clearAll(): boolean {
        try {
            Object.values(STORAGE_KEYS).forEach((key) => {
                localStorage.removeItem(key);
            });
            return true;
        } catch (error) {
            logger.error('Failed to clear storage', 'StorageService', error);
            return false;
        }
    },

    /**
     * Check if localStorage is available
     */
    isAvailable(): boolean {
        try {
            const testKey = '__storage_test__';
            localStorage.setItem(testKey, testKey);
            localStorage.removeItem(testKey);
            return true;
        } catch {
            return false;
        }
    },
};

export default storageService;
