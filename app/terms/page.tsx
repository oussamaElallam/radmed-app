'use client';

import React, { useState } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfServicePage() {
  const [language, setLanguage] = useState<'en' | 'fr'>('en');

  const translations = {
    en: {
      title: 'Terms of Service',
      subtitle: 'RadMed - AI-Powered Medical Imaging Analysis',
      backToApp: 'Back to RadMed',
      lastUpdated: 'Last updated',
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
      contactText: 'For questions about these Terms of Service, please contact our support team at info@majdai.ai.',
      finalWarning: '⚠️ By using RadMed, you acknowledge that you understand the limitations of AI-assisted medical analysis and agree to use this tool responsibly as part of your professional medical practice.',
    },
    fr: {
      title: 'Conditions d\'Utilisation',
      subtitle: 'RadMed - Analyse d\'Imagerie Médicale Alimentée par l\'IA',
      backToApp: 'Retour à RadMed',
      lastUpdated: 'Dernière mise à jour',
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
      contactText: 'Pour des questions sur ces Conditions d\'Utilisation, veuillez contacter notre équipe de support à info@majdai.ai.',
      finalWarning: '⚠️ En utilisant RadMed, vous reconnaissez que vous comprenez les limitations de l\'analyse médicale assistée par IA et acceptez d\'utiliser cet outil de manière responsable dans le cadre de votre pratique médicale professionnelle.',
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <header className="relative backdrop-blur-xl bg-white bg-opacity-10 border-b border-white border-opacity-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <NextImage src="/pnglogo.png" alt="RadMed Logo" width={40} height={40} className="mr-3 object-contain" />
              <div>
                <h1 className="text-2xl font-bold text-white">RadMed</h1>
                <p className="text-xs text-gray-400">by MAJD AI</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    language === 'en' 
                      ? 'bg-cyan-500 bg-opacity-30 text-cyan-300 border border-cyan-400' 
                      : 'text-gray-300 hover:text-white bg-gray-500 bg-opacity-20'
                  }`}
                >
                  🇺🇸 EN
                </button>
                <button
                  onClick={() => setLanguage('fr')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    language === 'fr' 
                      ? 'bg-cyan-500 bg-opacity-30 text-cyan-300 border border-cyan-400' 
                      : 'text-gray-300 hover:text-white bg-gray-500 bg-opacity-20'
                  }`}
                >
                  🇫🇷 FR
                </button>
              </div>

              {/* Back to App */}
              <Link href="/" className="flex items-center text-gray-300 hover:text-cyan-300 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.backToApp}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-gray-900 bg-opacity-50 backdrop-blur-xl border border-gray-700 rounded-2xl p-8">
          {/* Title */}
          <div className="bg-cyan-900 bg-opacity-20 border border-cyan-400 rounded-lg p-4 mb-6 text-center text-sm text-cyan-200">
  {language === 'en'
    ? 'These Terms & Conditions are entered into by and between MAJD AI, registered in Morocco, and the user.'
    : 'Ces Conditions d’Utilisation sont conclues entre MAJD AI, enregistrée au Maroc, et l’utilisateur.'}
</div>
<div className="text-center mb-8">
  <h1 className="text-3xl font-bold text-white mb-2">{t.title}</h1>
            <p className="text-gray-400 text-lg">{t.subtitle}</p>
            <p className="text-gray-500 text-sm mt-2">{t.lastUpdated}: July 2025</p>
          </div>

          {/* Content */}
          <div className="text-gray-300 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-cyan-300 mb-3">{t.acceptance}</h2>
              <p>{t.acceptanceText}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan-300 mb-3">{t.medicalDisclaimer}</h2>
              <p className="text-yellow-400 font-medium mb-3">{t.importantWarning}</p>
              <p className="mb-3">{t.disclaimerText}</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                {t.disclaimerPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan-300 mb-3">{t.userResponsibilities}</h2>
              <p className="mb-3">{t.responsibilitiesText}</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                {t.responsibilityPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan-300 mb-3">{t.dataPrivacy}</h2>
              <p className="mb-3">{t.privacyText}</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                {t.privacyPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan-300 mb-3">{t.limitations}</h2>
              <p className="mb-3">{t.limitationsText}</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                {t.limitationPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan-300 mb-3">{t.serviceAvailability}</h2>
              <p>{t.availabilityText}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan-300 mb-3">{t.intellectualProperty}</h2>
              <p>{t.ipText}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan-300 mb-3">{t.modifications}</h2>
              <p>{t.modificationsText}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan-300 mb-3">{t.termination}</h2>
              <p>{t.terminationText}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan-300 mb-3">{t.contact}</h2>
              <p>{t.contactText}</p>
            </section>

            <div className="bg-red-900 bg-opacity-30 border border-red-500 rounded-lg p-6 mt-8">
              <p className="text-red-300 font-medium text-center">
                {t.finalWarning}
              </p>
            </div>
            <section>
              <h2 className="text-xl font-semibold text-cyan-300 mb-3">
                {language === 'en' ? 'Company Information' : 'Informations sur la société'}
              </h2>
              <p>
                {language === 'en'
                  ? 'Company: MAJD AI\nCountry: Morocco'
                  : 'Société : MAJD AI\nPays : Maroc'}
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white border-opacity-10 bg-black bg-opacity-30 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400 text-sm">
          <span>
            <a 
              href="https://majdai.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 font-medium"
            >
              MAJD AI
            </a> - All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
