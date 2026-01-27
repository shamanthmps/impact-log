/**
 * Unit tests for validation schemas
 */
import { describe, it, expect } from 'vitest';
import {
    winFormSchema,
    weeklyReflectionFormSchema,
    validateWin,
    getFieldError
} from '@/lib/validations';

describe('Win Form Validation', () => {
    const validWinData = {
        date: new Date(),
        category: 'delivery' as const,
        situation: 'This is a valid situation with more than 10 characters',
        action: 'This is a valid action with more than 10 characters',
        impact: 'This is a valid impact with more than 10 characters',
        impactType: 'time-saved' as const,
        evidence: '',
    };

    it('should validate a correct win form', () => {
        const result = winFormSchema.safeParse(validWinData);
        expect(result.success).toBe(true);
    });

    it('should reject a win with short situation', () => {
        const result = winFormSchema.safeParse({
            ...validWinData,
            situation: 'Short',
        });
        expect(result.success).toBe(false);
    });

    it('should reject a win with missing required fields', () => {
        const result = winFormSchema.safeParse({
            date: new Date(),
            category: 'delivery',
        });
        expect(result.success).toBe(false);
    });

    it('should accept optional evidence field', () => {
        const result = winFormSchema.safeParse({
            ...validWinData,
            evidence: undefined,
        });
        expect(result.success).toBe(true);
    });

    it('should validate category enum values', () => {
        const validCategories = ['delivery', 'stakeholder', 'leadership', 'process', 'ai', 'risk'];

        validCategories.forEach(category => {
            const result = winFormSchema.safeParse({
                ...validWinData,
                category,
            });
            expect(result.success).toBe(true);
        });
    });

    it('should reject invalid category', () => {
        const result = winFormSchema.safeParse({
            ...validWinData,
            category: 'invalid-category',
        });
        expect(result.success).toBe(false);
    });
});

describe('Weekly Reflection Validation', () => {
    const validReflectionData = {
        weekStartDate: new Date(),
        wentWell: 'This is what went well during the week, with enough detail',
        unblocked: 'This is what I unblocked during the week, with enough detail',
        proudOf: 'This is what I am proud of during the week, with detail',
    };

    it('should validate a correct reflection form', () => {
        const result = weeklyReflectionFormSchema.safeParse(validReflectionData);
        expect(result.success).toBe(true);
    });

    it('should reject short reflection fields', () => {
        const result = weeklyReflectionFormSchema.safeParse({
            ...validReflectionData,
            wentWell: 'Short',
        });
        expect(result.success).toBe(false);
    });
});

describe('Validation Helper Functions', () => {
    it('validateWin should return success with valid data', () => {
        const result = validateWin({
            date: new Date(),
            category: 'delivery',
            situation: 'This is a valid situation with more than 10 characters',
            action: 'This is a valid action with more than 10 characters',
            impact: 'This is a valid impact with more than 10 characters',
            impactType: 'time-saved',
        });
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
    });

    it('validateWin should return errors with invalid data', () => {
        const result = validateWin({
            date: 'invalid-date',
        });
        expect(result.success).toBe(false);
        expect(result.errors).toBeDefined();
    });

    it('getFieldError should extract error message for specific field', () => {
        const result = validateWin({
            date: new Date(),
            category: 'delivery',
            situation: 'Short',
            action: 'This is valid action text',
            impact: 'This is valid impact text',
            impactType: 'time-saved',
        });

        if (!result.success && result.errors) {
            const error = getFieldError(result.errors, 'situation');
            expect(error).toBeDefined();
            expect(typeof error).toBe('string');
        }
    });
});
