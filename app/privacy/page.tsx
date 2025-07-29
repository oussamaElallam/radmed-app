'use client';

import React, { useState } from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const [language, setLanguage] = useState<'en' | 'fr'>('en');

  const translations = {
    en: {
      title: 'Privacy Policy',
      subtitle: 'RadMed - AI-Powered Medical Imaging Analysis',
      backToApp: 'Back to RadMed',
      lastUpdated: 'Last updated',
      introduction: '1. Introduction',
      introText: 'This Privacy Policy describes how RadMed ("we", "our", or "us") collects, uses, and protects your information when you use our AI-powered medical imaging analysis service.',
      informationCollection: '2. Information We Collect',
      collectionText: 'We collect the following types of information:',
      collectionPoints: [
        'Account information (name, email, professional credentials)',
        'Medical images uploaded for analysis',
        'Usage data and analytics',
        'Device and browser information',
        'Communication records with our support team'
      ],
      dataUse: '3. How We Use Your Data',
      useText: 'We use your information to:',
      usePoints: [
        'Provide AI-powered medical image analysis services',
        'Improve our algorithms and service quality',
        'Communicate with you about your account and our services',
        'Ensure compliance with medical regulations',
        'Provide customer support and technical assistance'
      ],
      dataSecurity: '4. Data Security',
      securityText: 'We implement robust security measures:',
      securityPoints: [
        'End-to-end encryption for all medical data',
        'HIPAA-compliant data handling procedures',
        'Regular security audits and penetration testing',
        'Access controls and authentication systems',
        'Secure data centers with 24/7 monitoring'
      ],
      dataRetention: '5. Data Retention',
      retentionText: 'We retain your data as follows:',
      retentionPoints: [
        'Medical images: Processed and deleted within 24 hours unless explicitly saved',
        'Account information: Retained while your account is active',
        'Usage analytics: Anonymized and retained for service improvement',
        'Communication records: Retained for 3 years for support purposes'
      ],
      dataSharing: '6. Data Sharing',
      sharingText: 'We do not sell your personal data. We may share information only:',
      sharingPoints: [
        'With your explicit consent',
        'To comply with legal obligations',
        'With trusted service providers under strict confidentiality agreements',
        'In case of business transfer (with prior notice)'
      ],
      userRights: '7. Your Rights',
      rightsText: 'You have the right to:',
      rightsPoints: [
        'Access your personal data',
        'Correct inaccurate information',
        'Delete your account and associated data',
        'Export your data in a portable format',
        'Opt-out of non-essential communications'
      ],
      cookies: '8. Cookies and Tracking',
      cookiesText: 'We use cookies and similar technologies for:',
      cookiesPoints: [
        'Essential website functionality',
        'User authentication and session management',
        'Analytics and performance monitoring',
        'Personalization of user experience'
      ],
      international: '9. International Data Transfers',
      internationalText: 'Your data may be processed in countries other than your own. We ensure adequate protection through appropriate safeguards and compliance with applicable data protection laws.',
      contact: '10. Contact Us',
      contactText: 'For privacy-related questions or requests, contact us at privacy@majdai.ai or through our support channels.',
      changes: '11. Policy Changes',
      changesText: 'We may update this Privacy Policy periodically. We will notify users of significant changes via email or through our service.',
    },
    fr: {
      title: 'Politique de Confidentialité',
      subtitle: 'RadMed - Analyse d\'Imagerie Médicale Alimentée par l\'IA',
      backToApp: 'Retour à RadMed',
      lastUpdated: 'Dernière mise à jour',
      introduction: '1. Introduction',
      introText: 'Cette Politique de Confidentialité décrit comment RadMed ("nous", "notre" ou "nos") collecte, utilise et protège vos informations lorsque vous utilisez notre service d\'analyse d\'imagerie médicale alimenté par l\'IA.',
      informationCollection: '2. Informations que Nous Collectons',
      collectionText: 'Nous collectons les types d\'informations suivants :',
      collectionPoints: [
        'Informations de compte (nom, email, références professionnelles)',
        'Images médicales téléchargées pour analyse',
        'Données d\'utilisation et analyses',
        'Informations sur l\'appareil et le navigateur',
        'Enregistrements de communication avec notre équipe de support'
      ],
      dataUse: '3. Comment Nous Utilisons Vos Données',
      useText: 'Nous utilisons vos informations pour :',
      usePoints: [
        'Fournir des services d\'analyse d\'images médicales alimentés par l\'IA',
        'Améliorer nos algorithmes et la qualité de notre service',
        'Communiquer avec vous concernant votre compte et nos services',
        'Assurer la conformité aux réglementations médicales',
        'Fournir un support client et une assistance technique'
      ],
      dataSecurity: '4. Sécurité des Données',
      securityText: 'Nous mettons en œuvre des mesures de sécurité robustes :',
      securityPoints: [
        'Chiffrement de bout en bout pour toutes les données médicales',
        'Procédures de traitement des données conformes HIPAA',
        'Audits de sécurité réguliers et tests de pénétration',
        'Contrôles d\'accès et systèmes d\'authentification',
        'Centres de données sécurisés avec surveillance 24h/24'
      ],
      dataRetention: '5. Conservation des Données',
      retentionText: 'Nous conservons vos données comme suit :',
      retentionPoints: [
        'Images médicales : Traitées et supprimées dans les 24 heures sauf si explicitement sauvegardées',
        'Informations de compte : Conservées tant que votre compte est actif',
        'Analyses d\'utilisation : Anonymisées et conservées pour l\'amélioration du service',
        'Enregistrements de communication : Conservés pendant 3 ans à des fins de support'
      ],
      dataSharing: '6. Partage des Données',
      sharingText: 'Nous ne vendons pas vos données personnelles. Nous pouvons partager des informations uniquement :',
      sharingPoints: [
        'Avec votre consentement explicite',
        'Pour se conformer aux obligations légales',
        'Avec des prestataires de services de confiance sous des accords de confidentialité stricts',
        'En cas de transfert d\'entreprise (avec préavis)'
      ],
      userRights: '7. Vos Droits',
      rightsText: 'Vous avez le droit de :',
      rightsPoints: [
        'Accéder à vos données personnelles',
        'Corriger les informations inexactes',
        'Supprimer votre compte et les données associées',
        'Exporter vos données dans un format portable',
        'Vous désinscrire des communications non essentielles'
      ],
      cookies: '8. Cookies et Suivi',
      cookiesText: 'Nous utilisons des cookies et technologies similaires pour :',
      cookiesPoints: [
        'Fonctionnalité essentielle du site web',
        'Authentification utilisateur et gestion de session',
        'Analyses et surveillance des performances',
        'Personnalisation de l\'expérience utilisateur'
      ],
      international: '9. Transferts Internationaux de Données',
      internationalText: 'Vos données peuvent être traitées dans des pays autres que le vôtre. Nous assurons une protection adéquate grâce à des garanties appropriées et à la conformité aux lois applicables de protection des données.',
      contact: '10. Nous Contacter',
      contactText: 'Pour les questions ou demandes liées à la confidentialité, contactez-nous à privacy@majdai.ai ou via nos canaux de support.',
      changes: '11. Modifications de la Politique',
      changesText: 'Nous pouvons mettre à jour cette Politique de Confidentialité périodiquement. Nous informerons les utilisateurs des changements significatifs par email ou via notre service.',
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
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{t.title}</h1>
            <p className="text-gray-400 text-lg">{t.subtitle}</p>
            <p className="text-gray-500 text-sm mt-2">{t.lastUpdated}: January 2025</p>
          </div>

          {/* Content */}
          <div className="text-gray-300 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-cyan-300 mb-3">{t.introduction}</h2>
              <p>{t.introText}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan-300 mb-3">{t.informationCollection}</h2>
              <p className="mb-3">{t.collectionText}</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                {t.collectionPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan-300 mb-3">{t.dataUse}</h2>
              <p className="mb-3">{t.useText}</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                {t.usePoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan-300 mb-3">{t.dataSecurity}</h2>
              <p className="mb-3">{t.securityText}</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                {t.securityPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan-300 mb-3">{t.dataRetention}</h2>
              <p className="mb-3">{t.retentionText}</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                {t.retentionPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan-300 mb-3">{t.dataSharing}</h2>
              <p className="mb-3">{t.sharingText}</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                {t.sharingPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan-300 mb-3">{t.userRights}</h2>
              <p className="mb-3">{t.rightsText}</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                {t.rightsPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan-300 mb-3">{t.cookies}</h2>
              <p className="mb-3">{t.cookiesText}</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                {t.cookiesPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan-300 mb-3">{t.international}</h2>
              <p>{t.internationalText}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan-300 mb-3">{t.contact}</h2>
              <p>{t.contactText}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-cyan-300 mb-3">{t.changes}</h2>
              <p>{t.changesText}</p>
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
