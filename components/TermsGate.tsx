'use client';

import React from 'react';
import { useUser } from '@clerk/nextjs';
import { useTermsOfService } from '../hooks/useTermsOfService';
import TermsOfServiceModal from './TermsOfServiceModal';

interface TermsGateProps {
  children: React.ReactNode;
  language?: 'en' | 'fr';
}

const TermsGate: React.FC<TermsGateProps> = ({ children, language = 'en' }) => {
  const { user, isLoaded } = useUser();
  const {
    showTermsModal,
    hasAcceptedTerms,
    acceptTerms,
    declineTerms,
    isLoaded: termsLoaded,
  } = useTermsOfService();

  // Show loading state while checking authentication and terms
  if (!isLoaded || !termsLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, let Clerk handle it
  if (!user) {
    return <>{children}</>;
  }

  // If user hasn't accepted terms, show blocking screen
  if (!hasAcceptedTerms) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="text-center max-w-md">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">
                Welcome to <span className="text-cyan-400">RadMed</span>
              </h1>
              <p className="text-gray-300 text-lg">
                AI-Powered Medical Imaging Analysis
              </p>
            </div>
            
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-gray-700">
              <div className="text-yellow-400 text-5xl mb-4">📋</div>
              <h2 className="text-xl font-semibold text-white mb-3">
                Terms of Service Required
              </h2>
              <p className="text-gray-300 mb-6">
                Before you can access RadMed, you must read and accept our Terms of Service. 
                This includes important medical disclaimers and usage guidelines.
              </p>
              
              <div className="bg-red-900 bg-opacity-30 border border-red-500 rounded-lg p-4 mb-6">
                <p className="text-red-300 text-sm">
                  <strong>Important:</strong> RadMed is a medical AI tool. By continuing, you acknowledge 
                  that you are a qualified healthcare professional or using this under professional supervision.
                </p>
              </div>

              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors font-medium"
              >
                Review Terms of Service
              </button>
            </div>
          </div>
        </div>

        <TermsOfServiceModal
          isOpen={showTermsModal}
          onAccept={acceptTerms}
          onDecline={declineTerms}
          language={language}
        />
      </div>
    );
  }

  // User has accepted terms, show the app
  return (
    <>
      {children}
      <TermsOfServiceModal
        isOpen={showTermsModal}
        onAccept={acceptTerms}
        onDecline={declineTerms}
        language={language}
      />
    </>
  );
};

export default TermsGate;
