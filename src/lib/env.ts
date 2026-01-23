/**
 * Environment Configuration & Validation
 * Validates required environment variables at runtime
 */

import { logger } from './logger';

interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId?: string;
}

interface EnvConfig {
    firebase: FirebaseConfig;
    isDevelopment: boolean;
    isProduction: boolean;
}

function getRequiredEnvVar(key: string): string {
    const value = import.meta.env[key];
    if (!value || value === 'undefined' || value === '') {
        const errorMessage = `Missing required environment variable: ${key}`;
        logger.error(errorMessage, 'EnvConfig');
        throw new Error(errorMessage);
    }
    return value;
}

function getOptionalEnvVar(key: string): string | undefined {
    const value = import.meta.env[key];
    if (!value || value === 'undefined' || value === '') {
        return undefined;
    }
    return value;
}

function validateFirebaseConfig(): FirebaseConfig {
    return {
        apiKey: getRequiredEnvVar('VITE_FIREBASE_API_KEY'),
        authDomain: getRequiredEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
        projectId: getRequiredEnvVar('VITE_FIREBASE_PROJECT_ID'),
        storageBucket: getRequiredEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
        messagingSenderId: getRequiredEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
        appId: getRequiredEnvVar('VITE_FIREBASE_APP_ID'),
        measurementId: getOptionalEnvVar('VITE_FIREBASE_MEASUREMENT_ID'),
    };
}

let cachedConfig: EnvConfig | null = null;

export function getEnvConfig(): EnvConfig {
    if (cachedConfig) {
        return cachedConfig;
    }

    cachedConfig = {
        firebase: validateFirebaseConfig(),
        isDevelopment: import.meta.env.DEV,
        isProduction: import.meta.env.PROD,
    };

    logger.info('Environment configuration loaded successfully', 'EnvConfig');
    return cachedConfig;
}

// For checking individual vars without crashing the app
export function isEnvConfigValid(): boolean {
    try {
        getEnvConfig();
        return true;
    } catch {
        return false;
    }
}

// Export types
export type { FirebaseConfig, EnvConfig };
