'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

export interface UserProfile {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  linkedin_url: string | null;
  experiences: any[] | null;
  skills: string[] | null;
  contacted_linkedins: string[] | null;
  created_at: string;
  updated_at: string;
  templates: any[] | null;
  user_email: string | null;
  email_finder_calls: number;
  school: string | null;
  preferences: any | null;
}

export interface ProfileSetupStatus {
  isSetupComplete: boolean;
  missingFields: string[];
  setupPercentage: number;
}

export function useUserProfile() {
  const { token, isLoading: authLoading, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('[useUserProfile] Fetching profile with token:', apiClient.hasToken() ? 'present' : 'missing');
      console.log('[useUserProfile] Current auth state:', { isAuthenticated, token: token ? 'present' : 'null' });
      
      const response = await apiClient.getUserBio();
      console.log('[useUserProfile] Profile fetch response:', response);
      console.log('[useUserProfile] Response data structure:', {
        success: response.success,
        hasData: !!response.data,
        dataSuccess: (response.data as any)?.success,
        hasProfile: !!(response.data as any)?.profile,
        profileData: (response.data as any)?.profile
      });
      
      if (response.success && (response.data as any)?.success) {
        const profileData = (response.data as any).profile;
        console.log('[useUserProfile] Setting profile data:', profileData);
        setProfile(profileData);
      } else {
        const errorMsg = response.error || 'Failed to fetch profile';
        console.error('[useUserProfile] Failed to fetch profile:', errorMsg, response);
        setError(errorMsg);
      }
    } catch (err) {
      setError('Network error while fetching profile');
      console.error('[useUserProfile] Error fetching user profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    try {
      setError(null);
      
      console.log('Updating profile with token:', apiClient.hasToken() ? 'present' : 'missing');
      console.log('Profile data:', profileData);
      const response = await apiClient.updateUserBio(profileData);
      console.log('Profile update response:', response);
      
      if (response.success && (response.data as any)?.success) {
        setProfile((response.data as any).profile);
        return { success: true };
      } else {
        setError(response.error || 'Failed to update profile');
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMsg = 'Network error while updating profile';
      setError(errorMsg);
      console.error('Error updating user profile:', err);
      return { success: false, error: errorMsg };
    }
  };

  const getProfileSetupStatus = (): ProfileSetupStatus => {
    if (!profile) {
      return {
        isSetupComplete: false,
        missingFields: ['profile'],
        setupPercentage: 0
      };
    }

    const requiredFields = [
      { key: 'linkedin_url', label: 'LinkedIn URL' },
      { key: 'experiences', label: 'Work Experience' },
      { key: 'skills', label: 'Skills' }
    ];

    const missingFields: string[] = [];
    let completedFields = 0;

    requiredFields.forEach(field => {
      const value = profile[field.key as keyof UserProfile];
      const isEmpty = 
        value === null || 
        value === undefined || 
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === 'string' && value.trim() === '');

      if (isEmpty) {
        missingFields.push(field.label);
      } else {
        completedFields++;
      }
    });

    const setupPercentage = Math.round((completedFields / requiredFields.length) * 100);
    const isSetupComplete = missingFields.length === 0;

    return {
      isSetupComplete,
      missingFields,
      setupPercentage
    };
  };

  useEffect(() => {
    // Only fetch profile when auth is ready and user is authenticated
    if (!authLoading && isAuthenticated && token) {
      console.log('Auth ready, fetching profile...');
      fetchProfile();
    } else if (!authLoading && !isAuthenticated) {
      // Auth check complete but not authenticated
      setIsLoading(false);
    }
  }, [authLoading, isAuthenticated, token]);

  return {
    profile,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
    getProfileSetupStatus
  };
}
