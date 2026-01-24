import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { storageService } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/constants';
import { toast } from 'sonner';

const ADMIN_EMAIL = 'shamanthcareers@gmail.com';

export interface UserProfile {
    displayName: string;
    email: string;
    role: string;
    bio: string;
    status: 'Active Contributor' | 'Open to Work' | 'On Sabbatical';
    photoURL?: string;
    updatedAt?: Date;
}

const DEFAULT_PROFILE: UserProfile = {
    displayName: '',
    email: '',
    role: 'Professional',
    bio: 'Building impactful solutions.',
    status: 'Active Contributor',
};

export function useProfile() {
    const { currentUser } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isAdmin = currentUser?.email === ADMIN_EMAIL;
    const isGuest = currentUser && !isAdmin;

    // Load Profile
    useEffect(() => {
        if (!currentUser) {
            setProfile(null);
            setIsLoading(false);
            return;
        }

        if (isAdmin) {
            // Admin: Sync from Firestore
            const userRef = doc(db, 'users', currentUser.uid);
            const unsubscribe = onSnapshot(userRef, (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setProfile({
                        ...DEFAULT_PROFILE,
                        ...data,
                        displayName: data.displayName || currentUser.displayName || '',
                        email: currentUser.email || '',
                        updatedAt: data.updatedAt?.toDate(),
                    } as UserProfile);
                } else {
                    // Initialize if not exists
                    const initialProfile = {
                        ...DEFAULT_PROFILE,
                        displayName: currentUser.displayName || '',
                        email: currentUser.email || '',
                    };
                    setProfile(initialProfile);
                }
                setIsLoading(false);
            }, (error) => {
                console.error("Error fetching profile:", error);
                setIsLoading(false);
            });

            return () => unsubscribe();
        } else {
            // Guest: Load from Store or Init with Auth defaults
            const storedProfile = storageService.get<UserProfile>(STORAGE_KEYS.PROFILE); // We need to add PROFILE key
            if (storedProfile) {
                setProfile(storedProfile);
            } else {
                setProfile({
                    ...DEFAULT_PROFILE,
                    displayName: currentUser.displayName || '',
                    email: currentUser.email || '',
                });
            }
            setIsLoading(false);
        }
    }, [currentUser, isAdmin]);

    // Save Profile
    const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
        if (!currentUser || !profile) return;

        const newProfile = { ...profile, ...updates, updatedAt: new Date() };

        if (isAdmin) {
            try {
                const userRef = doc(db, 'users', currentUser.uid);
                // Convert Date to Timestamp for Firestore
                const firestoreData = {
                    ...updates,
                    updatedAt: Timestamp.now(),
                    email: currentUser.email, // Ensure email is locked
                };

                // Use setDoc with merge: true to create or update
                await setDoc(userRef, firestoreData, { merge: true });
                toast.success("Profile updated successfully");
            } catch (error) {
                console.error("Failed to update profile:", error);
                toast.error("Failed to save profile");
                throw error;
            }
        } else {
            // Guest: Local Storage
            setProfile(newProfile);
            storageService.set(STORAGE_KEYS.PROFILE, newProfile); // Need to define this key
            toast.success("Profile updated locally");
        }
    }, [currentUser, profile, isAdmin]);

    return { profile, isLoading, updateProfile, isGuest };
}
