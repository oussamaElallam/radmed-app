"use client";

import React, { useState } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { ArrowLeft } from "lucide-react";

export default function RefundPolicyPage() {
  const [language, setLanguage] = useState<'en' | 'fr'>('en');
  const translations = {
    en: {
      title: "Refund Policy",
      subtitle: "RadMed - AI-Powered Medical Imaging Analysis",
      lastUpdated: "Last updated: July 2025",
      backToApp: "Back to RadMed",
      intro: "Thank you for using RadMed. Please read our refund policy carefully.",
      noRefund: "Due to the nature of our AI-powered digital service, all purchases are final and non-refundable once access has been granted.",
      exceptions: "Exceptions may be made solely in cases of accidental duplicate purchase or technical failure preventing access to the service. Please contact support@majdai.ai within 7 days of purchase in such cases.",
      process: "To request a refund under these exceptions, please provide your purchase details and a description of the issue.",
      contact: "For questions about this Refund Policy, contact us at support@majdai.ai.",
      companyInfo: "Company: MAJD AI | Country: Morocco"
    },
    fr: {
      title: "Politique de Remboursement",
      subtitle: "RadMed - Analyse d'Imagerie Médicale par IA",
      lastUpdated: "Dernière mise à jour : Juillet 2025",
      backToApp: "Retour à RadMed",
      intro: "Merci d'utiliser RadMed. Veuillez lire attentivement notre politique de remboursement.",
      noRefund: "En raison de la nature de notre service numérique alimenté par l'IA, tous les achats sont définitifs et non remboursables une fois l'accès accordé.",
      exceptions: "Des exceptions peuvent être faites uniquement en cas d'achat en double accidentel ou de défaillance technique empêchant l'accès au service. Veuillez contacter support@majdai.ai dans les 7 jours suivant l'achat dans ces cas.",
      process: "Pour demander un remboursement dans ces cas, veuillez fournir les détails de votre achat et une description du problème.",
      contact: "Pour toute question concernant cette politique de remboursement, contactez-nous à support@majdai.ai.",
      companyInfo: "Société : MAJD AI | Pays : Maroc"
    }
  };
  const t = translations[language];
  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 flex flex-col">
      <header className="flex items-center p-4 border-b border-gray-800">
        <Link href="/" className="flex items-center text-cyan-400 hover:text-cyan-300">
          <ArrowLeft className="w-5 h-5 mr-2" /> {t.backToApp}
        </Link>
        <div className="flex-1 flex justify-end">
          <button
            onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
            className="ml-4 px-3 py-1 rounded bg-gray-800 text-gray-300 hover:bg-gray-700 text-xs"
          >
            {language === 'en' ? 'FR' : 'EN'}
          </button>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="max-w-xl w-full bg-gray-900 bg-opacity-60 rounded-xl p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-cyan-300 mb-2 text-center">{t.title}</h1>
          <p className="text-gray-400 text-center mb-4">{t.subtitle}</p>
          <p className="text-gray-500 text-xs text-center mb-6">{t.lastUpdated}</p>
          <div className="space-y-4 text-sm">
            <p>{t.intro}</p>
            <p className="font-semibold text-orange-300">{t.noRefund}</p>
            <p>{t.exceptions}</p>
            <p>{t.process}</p>
            <p>{t.contact}</p>
          </div>
          <div className="mt-8 text-xs text-gray-400 text-center">
            {t.companyInfo}
          </div>
        </div>
      </main>
    </div>
  );
}
