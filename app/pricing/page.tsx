"use client";

import React, { useState } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { ArrowLeft } from "lucide-react";

export default function PricingPage() {
  const [language, setLanguage] = useState<'en' | 'fr'>('en');
  const translations = {
    en: {
      title: "Pricing & Plans",
      subtitle: "RadMed - AI-Powered Medical Imaging Analysis",
      lastUpdated: "Last updated: July 2025",
      backToApp: "Back to RadMed",
      plans: [
        {
          name: "Free Trial",
          price: "$0",
          features: [
            "Limited number of AI analyses",
            "Access to all imaging tools",
            "Email support"
          ]
        },
        {
          name: "Pro Subscription",
          price: "$49/month",
          features: [
            "Unlimited AI analyses",
            "Early access to new features",
            "HIPAA-compliant data handling",
          ]
        }
      ],
      disclaimer: "All prices are in USD. VAT may apply. No refunds after access is granted. See our Refund Policy for details.",
      companyInfo: "Company: MAJD AI | Country: France"
    },
    fr: {
      title: "Tarifs et Abonnements",
      subtitle: "RadMed - Analyse d'Imagerie Médicale par IA",
      lastUpdated: "Dernière mise à jour : Juillet 2025",
      backToApp: "Retour à RadMed",
      plans: [
        {
          name: "Essai Gratuit",
          price: "0€",
          features: [
            "Nombre limité d'analyses IA",
            "Accès à tous les outils d'imagerie",
            "Traitement des données conforme HIPAA",
            "Support par e-mail"
          ]
        },
        {
          name: "Abonnement Pro",
          price: "49€/mois",
          features: [
            "Analyses IA illimitées",
            "Support prioritaire",
            "Accès anticipé aux nouvelles fonctionnalités",
            "Outils de collaboration en équipe"
          ]
        }
      ],
      disclaimer: "Tous les prix sont en EUR. La TVA peut s'appliquer. Aucun remboursement après l'octroi de l'accès. Voir notre politique de remboursement pour plus de détails.",
      companyInfo: "Société : MAJD AI | Pays : France"
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
        <div className="max-w-2xl w-full bg-gray-900 bg-opacity-60 rounded-xl p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-cyan-300 mb-2 text-center">{t.title}</h1>
          <p className="text-gray-400 text-center mb-4">{t.subtitle}</p>
          <p className="text-gray-500 text-xs text-center mb-6">{t.lastUpdated}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {t.plans.map((plan, idx) => (
              <div key={idx} className="bg-gray-800 rounded-lg p-6 shadow border border-cyan-700 flex flex-col">
                <h2 className="text-xl font-semibold text-cyan-300 mb-2">{plan.name}</h2>
                <div className="text-3xl font-bold mb-4">{plan.price}</div>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  {plan.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-8 text-xs text-gray-400 text-center">
            {t.disclaimer}
          </div>
          <div className="mt-2 text-xs text-gray-400 text-center">
            {t.companyInfo}
          </div>
        </div>
      </main>
    </div>
  );
}
