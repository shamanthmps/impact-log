/**
 * Unit tests for Storage Service
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] ?? null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        }),
        key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
        get length() {
            return Object.keys(store).length;
        },
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Import after mocking
import { storageService } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/constants';

describe('Storage Service', () => {
    beforeEach(() => {
        localStorageMock.clear();
        vi.clearAllMocks();
    });

    describe('get', () => {
        it('should return null for non-existent key', () => {
            const result = storageService.get(STORAGE_KEYS.WINS);
            expect(result).toBeNull();
        });

        it('should parse and return stored JSON data', () => {
            const testData = [{ id: '1', name: 'Test' }];
            localStorageMock.setItem(STORAGE_KEYS.WINS, JSON.stringify(testData));

            const result = storageService.get(STORAGE_KEYS.WINS);
            expect(result).toEqual(testData);
        });

        it('should return null on parse error', () => {
            localStorageMock.setItem(STORAGE_KEYS.WINS, 'invalid-json');

            const result = storageService.get(STORAGE_KEYS.WINS);
            expect(result).toBeNull();
        });
    });

    describe('set', () => {
        it('should store data as JSON', () => {
            const testData = { test: 'value' };
            const result = storageService.set(STORAGE_KEYS.WINS, testData);

            expect(result).toBe(true);
            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                STORAGE_KEYS.WINS,
                JSON.stringify(testData)
            );
        });
    });

    describe('remove', () => {
        it('should remove item from storage', () => {
            localStorageMock.setItem(STORAGE_KEYS.WINS, 'test');

            const result = storageService.remove(STORAGE_KEYS.WINS);

            expect(result).toBe(true);
            expect(localStorageMock.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.WINS);
        });
    });

    describe('isAvailable', () => {
        it('should return true when localStorage is available', () => {
            expect(storageService.isAvailable()).toBe(true);
        });
    });
});
