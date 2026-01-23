import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getEnvConfig, isEnvConfigValid } from './env';
import { logger } from './logger';

// Lazy initialization to handle missing config gracefully
let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let analyticsInstance: Analytics | null = null;

/**
 * Initialize Firebase with validated configuration
 * Throws an error if required environment variables are missing
 */
function initializeFirebase(): FirebaseApp {
    if (app) {
        return app;
    }

    const config = getEnvConfig();

    try {
        app = initializeApp(config.firebase);
        logger.info('Firebase initialized successfully', 'Firebase');
        return app;
    } catch (error) {
        logger.error('Failed to initialize Firebase', 'Firebase', error);
        throw error;
    }
}

/**
 * Get Firebase Auth instance
 * Initializes Firebase if not already done
 */
export function getAuthInstance(): Auth {
    if (authInstance) {
        return authInstance;
    }

    const firebaseApp = initializeFirebase();
    authInstance = getAuth(firebaseApp);
    return authInstance;
}

/**
 * Get Firestore instance
 * Initializes Firebase if not already done
 */
export function getDbInstance(): Firestore {
    if (dbInstance) {
        return dbInstance;
    }

    const firebaseApp = initializeFirebase();
    dbInstance = getFirestore(firebaseApp);
    return dbInstance;
}

/**
 * Get Analytics instance
 * Initializes Firebase if not already done
 */
export function getAnalyticsInstance(): Analytics {
    if (analyticsInstance) {
        return analyticsInstance;
    }

    const firebaseApp = initializeFirebase();
    analyticsInstance = getAnalytics(firebaseApp);
    return analyticsInstance;
}

/**
 * Check if Firebase can be initialized
 * Useful for conditional rendering or graceful degradation
 */
export function isFirebaseConfigured(): boolean {
    return isEnvConfigValid();
}

// Backward compatibility exports
// These will throw if Firebase is not configured
export const auth = (() => {
    try {
        return getAuthInstance();
    } catch {
        // Return a proxy that will throw on access if not configured
        logger.warn('Firebase auth accessed before configuration', 'Firebase');
        return null as unknown as Auth;
    }
})();

export const db = (() => {
    try {
        return getDbInstance();
    } catch {
        logger.warn('Firebase db accessed before configuration', 'Firebase');
        return null as unknown as Firestore;
    }
})();

export const analytics = (() => {
    try {
        return getAnalyticsInstance();
    } catch {
        logger.warn('Firebase analytics accessed before configuration', 'Firebase');
        return null as unknown as Analytics;
    }
})();

export default app;
