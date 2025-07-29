'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

const TERMS_ACCEPTED_KEY = 'radmed_terms_accepted';
const TERMS_VERSION = '1.0'; // Increment this when terms are updated

export const useTermsOfService = () => {
  const { user, isLoaded } = useUser();
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user) return;

    // Check if user has accepted current version of terms
    const acceptedData = localStorage.getItem(TERMS_ACCEPTED_KEY);
    
    if (acceptedData) {
      try {
        const parsed = JSON.parse(acceptedData);
        
        // Check if parsed data is an object and not a boolean/primitive
        if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
          const userAccepted = parsed[user.id];
          
          if (userAccepted && typeof userAccepted === 'object' && userAccepted.version === TERMS_VERSION) {
            setHasAcceptedTerms(true);
            setShowTermsModal(false);
          } else {
            // User hasn't accepted current version
            setHasAcceptedTerms(false);
            setShowTermsModal(true);
          }
        } else {
          // Invalid data format, clear and show terms
          localStorage.removeItem(TERMS_ACCEPTED_KEY);
          setHasAcceptedTerms(false);
          setShowTermsModal(true);
        }
      } catch (error) {
        // Invalid JSON, clear and show terms
        localStorage.removeItem(TERMS_ACCEPTED_KEY);
        setHasAcceptedTerms(false);
        setShowTermsModal(true);
      }
    } else {
      // No acceptance data, show terms
      setHasAcceptedTerms(false);
      setShowTermsModal(true);
    }
  }, [user, isLoaded]);

  const acceptTerms = () => {
    if (!user) return;

    const acceptedData = localStorage.getItem(TERMS_ACCEPTED_KEY);
    let parsed: Record<string, any> = {};
    
    if (acceptedData) {
      try {
        parsed = JSON.parse(acceptedData);
      } catch (error) {
        parsed = {};
      }
    }

    // Store acceptance with timestamp and version
    parsed[user.id] = {
      version: TERMS_VERSION,
      acceptedAt: new Date().toISOString(),
      userEmail: user.emailAddresses[0]?.emailAddress || '',
    };

    localStorage.setItem(TERMS_ACCEPTED_KEY, JSON.stringify(parsed));
    setHasAcceptedTerms(true);
    setShowTermsModal(false);
  };

  const declineTerms = () => {
    // For now, just hide the modal but keep hasAcceptedTerms false
    // In a real app, you might want to redirect to a different page
    setShowTermsModal(false);
    setHasAcceptedTerms(false);
  };

  const forceShowTerms = () => {
    setShowTermsModal(true);
  };

  return {
    showTermsModal,
    hasAcceptedTerms,
    acceptTerms,
    declineTerms,
    forceShowTerms,
    isLoaded,
  };
};
