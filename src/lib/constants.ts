/**
 * Application-wide constants
 * Centralizes magic strings and configuration values for maintainability
 */

// Storage Keys
export const STORAGE_KEYS = {
    WINS: 'impactlog-wins',
    REFLECTIONS: 'impactlog-reflections',
    USER_PREFERENCES: 'impactlog-preferences',
    PROFILE: 'impactlog-profile',
} as const;

// Application Configuration
export const APP_CONFIG = {
    APP_NAME: 'ImpactLog',
    APP_TAGLINE: 'Your personal impact operating system',
    MAX_WINS_PER_PAGE: 20,
    ANIMATION_DURATION_MS: 300,
} as const;

// Motivational Lines for Dashboard
export const MOTIVATIONAL_LINES = [
    "Small wins compound into big impact.",
    "Your work matters. Document it.",
    "Evidence beats memory. Every time.",
    "Great leaders track their impact.",
    "Build your narrative, one win at a time.",
    "Capture today's wins for tomorrow's success.",
    "Every impact documented is a story waiting to be told.",
    "Clarity today creates confidence tomorrow.",
    "What gets captured gets remembered.",
    "Progress is powerful when it is visible.",
    "Turn daily effort into lasting impact.",
    "Intentional reflection fuels consistent growth.",
    "Your impact deserves to be seen.",
    "Discipline in logging builds leadership muscle.",
    "From effort to evidence, one entry at a time.",
    "Small actions, clearly captured, shape big outcomes.",
    "Ownership begins with awareness."
] as const;

// Date/Time Configuration
export const DATE_CONFIG = {
    WEEK_STARTS_ON: 1 as const, // Monday
    DEFAULT_DATE_FORMAT: 'MMM d, yyyy',
    FULL_DATE_FORMAT: 'EEEE, MMMM d',
} as const;

// Validation Limits
export const VALIDATION = {
    MIN_SITUATION_LENGTH: 10,
    MAX_SITUATION_LENGTH: 500,
    MIN_ACTION_LENGTH: 10,
    MAX_ACTION_LENGTH: 1000,
    MIN_IMPACT_LENGTH: 10,
    MAX_IMPACT_LENGTH: 1000,
    MAX_EVIDENCE_LENGTH: 500,
    MIN_REFLECTION_FIELD_LENGTH: 10,
    MAX_REFLECTION_FIELD_LENGTH: 1000,
} as const;

// API/Firebase Configuration
export const API_CONFIG = {
    FIRESTORE_COLLECTIONS: {
        USERS: 'users',
        WINS: 'wins',
        REFLECTIONS: 'reflections',
    },
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY_MS: 1000,
} as const;
