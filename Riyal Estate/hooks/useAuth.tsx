'use client';

import { logoutUser, onAuthChange } from '@/lib/firebase/auth';
import { IUserProfile } from '@/types';
import { User as FirebaseUser } from 'firebase/auth';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    user: FirebaseUser | null;
    userProfile: IUserProfile | null;
    loading: boolean;
    isLoading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthChange(async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                // Fetch user profile from your API
                try {
                    const token = await firebaseUser.getIdToken();
                    const response = await fetch('/api/users/profile', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();

                        // If user profile doesn't exist, sync with database
                        if (!data.data) {
                            const syncResponse = await fetch('/api/users/sync', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    firebaseUid: firebaseUser.uid,
                                    email: firebaseUser.email,
                                    displayName: firebaseUser.displayName,
                                    photoURL: firebaseUser.photoURL,
                                    phone: firebaseUser.phoneNumber,
                                }),
                            });

                            if (syncResponse.ok) {
                                const syncData = await syncResponse.json();
                                setUserProfile(syncData.data);
                            }
                        } else {
                            setUserProfile(data.data);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                }
            } else {
                setUserProfile(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        await logoutUser();
        setUser(null);
        setUserProfile(null);
    };

    const refreshProfile = async () => {
        if (user) {
            try {
                const token = await user.getIdToken();
                const response = await fetch('/api/users/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserProfile(data.data);
                }
            } catch (error) {
                console.error('Error refreshing profile:', error);
            }
        }
    };

    const isAdmin = user?.email === process.env.ADMIN_EMAIL || user?.email === 'shubhholyacres@gmail.com';

    return (
        <AuthContext.Provider
            value={{
                user,
                userProfile,
                loading,
                isLoading: loading,
                isAuthenticated: !!user,
                isAdmin,
                logout,
                refreshProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
