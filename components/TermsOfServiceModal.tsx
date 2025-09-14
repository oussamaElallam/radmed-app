'use client';

import React, { useEffect } from 'react';

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
  language?: 'en' | 'fr';
  showAcceptDecline?: boolean;
}

const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({
  isOpen,
  onAccept,
  onDecline,
  language = 'en',
  showAcceptDecline = true,
}) => {
  // Prevent body scroll when modal is open (iOS fix)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const translations = {
    en: {
      title: 'Terms of Service',
      subtitle: 'Please read and accept our terms to continue using RadMed',
      acceptance: '1. Acceptance of Terms',
      acceptanceText: 'By accessing and using RadMed, you accept and agree to be bound by the terms and provision of this agreement.',
      medicalDisclaimer: '2. Medical Disclaimer',
      importantWarning: '⚠️ IMPORTANT MEDICAL DISCLAIMER',
      disclaimerText: 'RadMed is an AI-powered medical imaging analysis tool designed to assist healthcare professionals. This service:',
      disclaimerPoints: [
        'Is NOT intended to replace professional medical judgment',
        'Should NOT be used as the sole basis for diagnosis or treatment decisions',
        'Requires validation by qualified healthcare professionals',
        'May contain errors or inaccuracies in analysis results'
      ],
      userResponsibilities: '3. User Responsibilities',
      responsibilitiesText: 'Users must:',
      responsibilityPoints: [
        'Be qualified healthcare professionals or use under professional supervision',
        'Verify all AI-generated analyses with clinical expertise',
        'Comply with applicable medical regulations and standards',
        'Protect patient privacy and confidentiality',
        'Use the service only for legitimate medical purposes'
      ],
      dataPrivacy: '4. Data Privacy and Security',
      privacyText: 'We are committed to protecting your data:',
      privacyPoints: [
        'Medical images are processed securely and encrypted',
        'We comply with HIPAA and other applicable privacy regulations',
        'Data is not stored longer than necessary for processing',
        'Users are responsible for obtaining proper patient consent'
      ],
      limitations: '5. Limitations of Liability',
      limitationsText: 'RadMed and its developers shall not be liable for:',
      limitationPoints: [
        'Any medical decisions made based on AI analysis results',
        'Errors, inaccuracies, or omissions in the analysis',
        'Any damages arising from the use of this service',
        'Technical issues or service interruptions'
      ],
      serviceAvailability: '6. Service Availability',
      availabilityText: 'We strive to maintain service availability but cannot guarantee uninterrupted access. The service may be temporarily unavailable for maintenance or technical issues.',
      intellectualProperty: '7. Intellectual Property',
      ipText: 'All content, features, and functionality of RadMed are owned by us and are protected by copyright, trademark, and other intellectual property laws.',
      modifications: '8. Modifications to Terms',
      modificationsText: 'We reserve the right to modify these terms at any time. Users will be notified of significant changes and must accept updated terms to continue using the service.',
      termination: '9. Termination',
      terminationText: 'We may terminate or suspend access to our service immediately, without prior notice, for any reason whatsoever, including without limitation if you breach the Terms.',
      contact: '10. Contact Information',
      contactText: 'For questions about these Terms of Service, please contact our support team.',
      finalWarning: '🚨 By accepting these terms, you acknowledge that you understand the limitations of AI-assisted medical analysis and agree to use this tool responsibly as part of your professional medical practice.',
      decline: 'Decline',
      accept: 'I Accept the Terms of Service',
      close: 'Close'
    },
    fr: {
      title: 'Conditions d\'Utilisation',
      subtitle: 'Veuillez lire et accepter nos conditions pour continuer à utiliser RadMed',
      acceptance: '1. Acceptation des Conditions',
      acceptanceText: 'En accédant et en utilisant RadMed, vous acceptez et convenez d\'être lié par les termes et dispositions de cet accord.',
      medicalDisclaimer: '2. Avertissement Médical',
      importantWarning: '⚠️ AVERTISSEMENT MÉDICAL IMPORTANT',
      disclaimerText: 'RadMed est un outil d\'analyse d\'imagerie médicale alimenté par l\'IA conçu pour assister les professionnels de la santé. Ce service :',
      disclaimerPoints: [
        'N\'est PAS destiné à remplacer le jugement médical professionnel',
        'Ne doit PAS être utilisé comme seule base pour les décisions de diagnostic ou de traitement',
        'Nécessite une validation par des professionnels de santé qualifiés',
        'Peut contenir des erreurs ou des inexactitudes dans les résultats d\'analyse'
      ],
      userResponsibilities: '3. Responsabilités de l\'Utilisateur',
      responsibilitiesText: 'Les utilisateurs doivent :',
      responsibilityPoints: [
        'Être des professionnels de santé qualifiés ou utiliser sous supervision professionnelle',
        'Vérifier toutes les analyses générées par l\'IA avec une expertise clinique',
        'Se conformer aux réglementations et normes médicales applicables',
        'Protéger la confidentialité et la vie privée des patients',
        'Utiliser le service uniquement à des fins médicales légitimes'
      ],
      dataPrivacy: '4. Confidentialité et Sécurité des Données',
      privacyText: 'Nous nous engageons à protéger vos données :',
      privacyPoints: [
        'Les images médicales sont traitées de manière sécurisée et cryptées',
        'Nous respectons HIPAA et autres réglementations de confidentialité applicables',
        'Les données ne sont pas stockées plus longtemps que nécessaire pour le traitement',
        'Les utilisateurs sont responsables d\'obtenir le consentement approprié du patient'
      ],
      limitations: '5. Limitations de Responsabilité',
      limitationsText: 'RadMed et ses développeurs ne sauraient être tenus responsables de :',
      limitationPoints: [
        'Toute décision médicale prise basée sur les résultats d\'analyse IA',
        'Erreurs, inexactitudes ou omissions dans l\'analyse',
        'Tout dommage résultant de l\'utilisation de ce service',
        'Problèmes techniques ou interruptions de service'
      ],
      serviceAvailability: '6. Disponibilité du Service',
      availabilityText: 'Nous nous efforçons de maintenir la disponibilité du service mais ne pouvons garantir un accès ininterrompu. Le service peut être temporairement indisponible pour maintenance ou problèmes techniques.',
      intellectualProperty: '7. Propriété Intellectuelle',
      ipText: 'Tout le contenu, les fonctionnalités et la fonctionnalité de RadMed nous appartiennent et sont protégés par les lois sur le droit d\'auteur, les marques de commerce et autres lois sur la propriété intellectuelle.',
      modifications: '8. Modifications des Conditions',
      modificationsText: 'Nous nous réservons le droit de modifier ces conditions à tout moment. Les utilisateurs seront informés des changements significatifs et devront accepter les conditions mises à jour pour continuer à utiliser le service.',
      termination: '9. Résiliation',
      terminationText: 'Nous pouvons résilier ou suspendre l\'accès à notre service immédiatement, sans préavis, pour quelque raison que ce soit, y compris sans limitation si vous violez les Conditions.',
      contact: '10. Informations de Contact',
      contactText: 'Pour des questions sur ces Conditions d\'Utilisation, veuillez contacter notre équipe de support.',
      finalWarning: '🚨 En acceptant ces conditions, vous reconnaissez que vous comprenez les limitations de l\'analyse médicale assistée par IA et acceptez d\'utiliser cet outil de manière responsable dans le cadre de votre pratique médicale professionnelle.',
      decline: 'Refuser',
      accept: 'J\'Accepte les Conditions d\'Utilisation',
      close: 'Fermer'
    }
  };

  const t = translations[language];

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Prevent modal from closing when clicking inside the modal content
    if (e.target === e.currentTarget) {
      // Don't close on backdrop click for iOS compatibility
      return;
    }
  };

  // Handle touch events for iOS
  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  const handleButtonClick = (callback: () => void) => {
    return (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      callback();
    };
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm"
      onClick={handleBackdropClick}
      style={{
        WebkitOverflowScrolling: 'touch', // iOS smooth scrolling
        overscrollBehavior: 'contain' // Prevent iOS bounce scrolling
      }}
    >
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-2">{t.title}</h2>
          <p className="text-gray-400">{t.subtitle}</p>
        </div>
        
        <div 
          className="p-6 overflow-y-auto max-h-[50vh] flex-1"
          style={{
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain'
          }}
        >
          <div className="text-gray-300 space-y-4">
            <section>
              <h3 className="text-lg font-semibold text-cyan-300 mb-2">{t.acceptance}</h3>
              <p>{t.acceptanceText}</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-cyan-300 mb-2">{t.medicalDisclaimer}</h3>
              <p className="text-yellow-400 font-medium">{t.importantWarning}</p>
              <p>{t.disclaimerText}</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                {t.disclaimerPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-cyan-300 mb-2">{t.userResponsibilities}</h3>
              <p>{t.responsibilitiesText}</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                {t.responsibilityPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-cyan-300 mb-2">{t.dataPrivacy}</h3>
              <p>{t.privacyText}</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                {t.privacyPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-cyan-300 mb-2">{t.limitations}</h3>
              <p>{t.limitationsText}</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                {t.limitationPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-cyan-300 mb-2">{t.serviceAvailability}</h3>
              <p>{t.availabilityText}</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-cyan-300 mb-2">{t.intellectualProperty}</h3>
              <p>{t.ipText}</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-cyan-300 mb-2">{t.modifications}</h3>
              <p>{t.modificationsText}</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-cyan-300 mb-2">{t.termination}</h3>
              <p>{t.terminationText}</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-cyan-300 mb-2">{t.contact}</h3>
              <p>{t.contactText}</p>
            </section>

            <div className="bg-red-900 bg-opacity-30 border border-red-500 rounded-lg p-4 mt-6">
              <p className="text-red-300 font-medium">
                {t.finalWarning}
              </p>
            </div>
          </div>
        </div>

        {showAcceptDecline && (
          <div className="p-6 border-t border-gray-700 flex flex-col sm:flex-row gap-3 sm:gap-4 bg-gray-900 sticky bottom-0 z-10">
            <button
              onClick={handleButtonClick(onDecline)}
              onTouchStart={handleTouchStart}
              className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 active:bg-gray-500 text-white rounded-lg transition-colors font-medium touch-manipulation"
              style={{
                WebkitTapHighlightColor: 'transparent',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none'
              }}
            >
              {t.decline}
            </button>
            <button
              onClick={handleButtonClick(onAccept)}
              onTouchStart={handleTouchStart}
              className="flex-1 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-400 text-white rounded-lg transition-colors font-medium touch-manipulation"
              style={{
                WebkitTapHighlightColor: 'transparent',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none'
              }}
            >
              {t.accept}
            </button>
          </div>
        )}
        
        {!showAcceptDecline && (
          <div className="p-6 border-t border-gray-700">
            <button
              onClick={handleButtonClick(onDecline)}
              onTouchStart={handleTouchStart}
              className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-400 text-white rounded-lg transition-colors font-medium touch-manipulation"
              style={{
                WebkitTapHighlightColor: 'transparent',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none'
              }}
            >
              {t.close}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TermsOfServiceModal;
