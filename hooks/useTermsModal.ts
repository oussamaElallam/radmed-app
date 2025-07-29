'use client';

import { useState } from 'react';

export const useTermsModal = () => {
  const [showTermsModal, setShowTermsModal] = useState(false);

  const openTermsModal = () => {
    setShowTermsModal(true);
  };

  const closeTermsModal = () => {
    setShowTermsModal(false);
  };

  return {
    showTermsModal,
    openTermsModal,
    closeTermsModal,
  };
};
