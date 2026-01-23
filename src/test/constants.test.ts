/**
 * Unit tests for Constants
 */
import { describe, it, expect } from 'vitest';
import {
    STORAGE_KEYS,
    APP_CONFIG,
    MOTIVATIONAL_LINES,
    DATE_CONFIG,
    VALIDATION,
    API_CONFIG
} from '@/lib/constants';

describe('Constants', () => {
    describe('STORAGE_KEYS', () => {
        it('should have all required storage keys', () => {
            expect(STORAGE_KEYS.WINS).toBeDefined();
            expect(STORAGE_KEYS.REFLECTIONS).toBeDefined();
            expect(STORAGE_KEYS.USER_PREFERENCES).toBeDefined();
        });

        it('should have unique values', () => {
            const values = Object.values(STORAGE_KEYS);
            const uniqueValues = new Set(values);
            expect(values.length).toBe(uniqueValues.size);
        });
    });

    describe('APP_CONFIG', () => {
        it('should have required app configuration', () => {
            expect(APP_CONFIG.APP_NAME).toBe('ImpactLog');
            expect(APP_CONFIG.APP_TAGLINE).toBeDefined();
            expect(typeof APP_CONFIG.MAX_WINS_PER_PAGE).toBe('number');
        });
    });

    describe('MOTIVATIONAL_LINES', () => {
        it('should have at least 5 motivational lines', () => {
            expect(MOTIVATIONAL_LINES.length).toBeGreaterThanOrEqual(5);
        });

        it('should contain non-empty strings', () => {
            MOTIVATIONAL_LINES.forEach(line => {
                expect(typeof line).toBe('string');
                expect(line.length).toBeGreaterThan(0);
            });
        });
    });

    describe('DATE_CONFIG', () => {
        it('should have valid week start configuration', () => {
            expect(DATE_CONFIG.WEEK_STARTS_ON).toBeGreaterThanOrEqual(0);
            expect(DATE_CONFIG.WEEK_STARTS_ON).toBeLessThanOrEqual(6);
        });

        it('should have date format strings', () => {
            expect(DATE_CONFIG.DEFAULT_DATE_FORMAT).toBeDefined();
            expect(DATE_CONFIG.FULL_DATE_FORMAT).toBeDefined();
        });
    });

    describe('VALIDATION', () => {
        it('should have positive min/max values', () => {
            expect(VALIDATION.MIN_SITUATION_LENGTH).toBeGreaterThan(0);
            expect(VALIDATION.MAX_SITUATION_LENGTH).toBeGreaterThan(VALIDATION.MIN_SITUATION_LENGTH);
        });
    });

    describe('API_CONFIG', () => {
        it('should have Firestore collection names', () => {
            expect(API_CONFIG.FIRESTORE_COLLECTIONS.USERS).toBeDefined();
            expect(API_CONFIG.FIRESTORE_COLLECTIONS.WINS).toBeDefined();
            expect(API_CONFIG.FIRESTORE_COLLECTIONS.REFLECTIONS).toBeDefined();
        });
    });
});
