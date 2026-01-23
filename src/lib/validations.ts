/**
 * Form Validation Schemas using Zod
 * Centralizes validation logic for reusability and consistency
 */

import { z } from 'zod';
import { VALIDATION } from '@/lib/constants';

// Win Category Schema
export const winCategorySchema = z.enum([
    'delivery',
    'stakeholder',
    'leadership',
    'process',
    'ai',
    'risk',
]);

// Impact Type Schema
export const impactTypeSchema = z.enum([
    'time-saved',
    'cost-avoided',
    'risk-reduced',
    'quality-improved',
    'customer-satisfaction',
]);

// Win Form Schema
export const winFormSchema = z.object({
    date: z.date({
        required_error: 'Please select a date',
        invalid_type_error: 'Invalid date',
    }),
    category: winCategorySchema,
    situation: z
        .string()
        .min(VALIDATION.MIN_SITUATION_LENGTH, {
            message: `Situation must be at least ${VALIDATION.MIN_SITUATION_LENGTH} characters`,
        })
        .max(VALIDATION.MAX_SITUATION_LENGTH, {
            message: `Situation must be less than ${VALIDATION.MAX_SITUATION_LENGTH} characters`,
        })
        .trim(),
    action: z
        .string()
        .min(VALIDATION.MIN_ACTION_LENGTH, {
            message: `Action must be at least ${VALIDATION.MIN_ACTION_LENGTH} characters`,
        })
        .max(VALIDATION.MAX_ACTION_LENGTH, {
            message: `Action must be less than ${VALIDATION.MAX_ACTION_LENGTH} characters`,
        })
        .trim(),
    impact: z
        .string()
        .min(VALIDATION.MIN_IMPACT_LENGTH, {
            message: `Impact must be at least ${VALIDATION.MIN_IMPACT_LENGTH} characters`,
        })
        .max(VALIDATION.MAX_IMPACT_LENGTH, {
            message: `Impact must be less than ${VALIDATION.MAX_IMPACT_LENGTH} characters`,
        })
        .trim(),
    impactType: impactTypeSchema,
    evidence: z
        .string()
        .max(VALIDATION.MAX_EVIDENCE_LENGTH, {
            message: `Evidence must be less than ${VALIDATION.MAX_EVIDENCE_LENGTH} characters`,
        })
        .trim()
        .optional()
        .or(z.literal('')),
});

// Weekly Reflection Form Schema
export const weeklyReflectionFormSchema = z.object({
    weekStartDate: z.date({
        required_error: 'Week start date is required',
        invalid_type_error: 'Invalid date',
    }),
    wentWell: z
        .string()
        .min(VALIDATION.MIN_REFLECTION_FIELD_LENGTH, {
            message: `Please provide at least ${VALIDATION.MIN_REFLECTION_FIELD_LENGTH} characters`,
        })
        .max(VALIDATION.MAX_REFLECTION_FIELD_LENGTH, {
            message: `Please keep it under ${VALIDATION.MAX_REFLECTION_FIELD_LENGTH} characters`,
        })
        .trim(),
    unblocked: z
        .string()
        .min(VALIDATION.MIN_REFLECTION_FIELD_LENGTH, {
            message: `Please provide at least ${VALIDATION.MIN_REFLECTION_FIELD_LENGTH} characters`,
        })
        .max(VALIDATION.MAX_REFLECTION_FIELD_LENGTH, {
            message: `Please keep it under ${VALIDATION.MAX_REFLECTION_FIELD_LENGTH} characters`,
        })
        .trim(),
    proudOf: z
        .string()
        .min(VALIDATION.MIN_REFLECTION_FIELD_LENGTH, {
            message: `Please provide at least ${VALIDATION.MIN_REFLECTION_FIELD_LENGTH} characters`,
        })
        .max(VALIDATION.MAX_REFLECTION_FIELD_LENGTH, {
            message: `Please keep it under ${VALIDATION.MAX_REFLECTION_FIELD_LENGTH} characters`,
        })
        .trim(),
});

// Infer types from schemas
export type WinFormData = z.infer<typeof winFormSchema>;
export type WeeklyReflectionFormData = z.infer<typeof weeklyReflectionFormSchema>;
export type WinCategory = z.infer<typeof winCategorySchema>;
export type ImpactType = z.infer<typeof impactTypeSchema>;

// Validation helper functions
export function validateWin(data: unknown): { success: boolean; data?: WinFormData; errors?: z.ZodError } {
    const result = winFormSchema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    return { success: false, errors: result.error };
}

export function validateReflection(data: unknown): { success: boolean; data?: WeeklyReflectionFormData; errors?: z.ZodError } {
    const result = weeklyReflectionFormSchema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    return { success: false, errors: result.error };
}

// Get first error message for a specific field
export function getFieldError(errors: z.ZodError, field: string): string | undefined {
    const fieldError = errors.errors.find((err) => err.path.includes(field));
    return fieldError?.message;
}
