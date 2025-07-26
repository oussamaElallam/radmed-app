'use client';

import React, { useState, useEffect } from 'react';
import { useUser, SignInButton, SignOutButton, SignUpButton, UserButton } from '@clerk/nextjs';
import NextImage from 'next/image';
import { 
  Upload, FileText, Download, History, LogOut, Zap, Shield, Database, 
  ArrowRight, CheckCircle, Star, Users, Award, Activity, AlertCircle, Loader2, Brain 
} from 'lucide-react';
import { useReports } from '@/hooks/useReports';

export default function HomePage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [currentView, setCurrentView] = useState('landing');
  const [selectedImages, setSelectedImages] = useState<{file: File, preview: string, name: string}[]>([]);
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    age: '',
    sex: '',
    modality: 'X-Ray',
    clinicalHistory: ''
  });
  const [userTier, setUserTier] = useState<'free' | 'pro'>('free');
  const [dailyReportsUsed, setDailyReportsUsed] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeFormData, setUpgradeFormData] = useState({
    email: '',
    name: '',
    features: ''
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('generate');
  const [editingReport, setEditingReport] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [language, setLanguage] = useState<'en' | 'fr'>('en');
  
  // Translations
  const t = {
    en: {
      // Navigation
      login: 'Login',
      getStarted: 'Get Started',
      
      // Landing page
      heroTitle: 'AI-Powered Radiology Reports',
      heroSubtitle: 'Generate comprehensive radiology reports instantly with advanced AI technology',
      heroMain: 'Transform Medical Imaging with',
      heroGradient: 'AI-Powered Precision',
      heroDesc: 'RadMed assists healthcare professionals with AI-powered medical image analysis, providing diagnostic support to enhance clinical decision-making.',
      heroStartTrial: 'Start Free Beta',
      heroWatchDemo: 'See Live Demo',
      betaBadge: 'Early Access Beta',
      statAccuracy: 'AI Accuracy',
      statReports: 'Beta Reports',
      statPartners: 'Early Users',
      statSupport: 'Response Time',
      statAccuracyValue: '98.5%',
      statReportsValue: '1,200+',
      statPartnersValue: '50+',
      statSupportValue: '<2hrs',
      featuresTitle: 'Powerful Features for Modern Healthcare',
      featuresDesc: 'Everything you need to revolutionize your radiology workflow',
      feature1Title: 'Advanced AI Powered',
      feature1Desc: 'Advanced AI models assist healthcare professionals with medical image analysis and diagnostic support.',
      feature2Title: 'HIPAA Compliant',
      feature2Desc: 'Enterprise-grade security ensures patient data privacy and regulatory compliance.',
      feature3Title: 'Instant Results',
      feature3Desc: 'Generate draft radiology reports in seconds to assist healthcare professionals.',
      feature4Title: 'Multi-Modal Support',
      feature4Desc: 'Supports X-Ray, CT, MRI, Ultrasound, and DICOM formats for comprehensive analysis.',
      feature5Title: 'Multi-Language',
      feature5Desc: 'Generate reports in English and French with more languages coming soon.',
      feature6Title: 'Export Options',
      feature6Desc: 'Download reports in professional Word format or plain text for easy integration.',
      
      // Technology section
      techTitle: 'Built on Cutting-Edge Technology',
      techDesc: 'Our AI stack combines the latest advances in medical imaging and natural language processing',
      tech1Title: 'Advanced AI Models',
      tech1Desc: 'AI technology to assist healthcare professionals with medical image interpretation.',
      tech2Title: 'Cloud Infrastructure',
      tech2Desc: 'Scalable cloud architecture ensuring fast, reliable, and secure performance.',
      tech3Title: 'Secure Authentication',
      tech3Desc: 'Enterprise-grade user authentication and secure session management.',
      tech4Title: 'Secure Processing',
      tech4Desc: 'All images processed securely with automatic deletion after analysis.',
      
      // Use cases
      useCasesTitle: 'Supporting Healthcare Professionals',
      useCasesDesc: 'RadMed provides diagnostic aid across various medical specialties',
      useCase1: 'Chest X-Ray Analysis',
      useCase1Desc: 'Assist in identifying potential pneumonia, fractures, and abnormalities in chest radiographs.',
      useCase2: 'Orthopedic Imaging',
      useCase2Desc: 'Support analysis of bone fractures, joint conditions, and musculoskeletal disorders.',
      useCase3: 'Emergency Radiology',
      useCase3Desc: 'Provide preliminary analysis to assist with urgent cases and after-hours coverage.',
      useCase4: 'Quality Assurance',
      useCase4Desc: 'Diagnostic aid for complex cases and educational support for resident training.',
      
      // Sample report
      sampleTitle: 'RadMed in Action',
      sampleDesc: 'Real example of AI-generated diagnostic support report',
      samplePatient: 'Sarah M.',
      sampleAge: '52',
      sampleSex: 'Female',
      sampleDate: 'January 25, 2025',
      sampleModality: 'X-Ray',
      sampleClinical: 'Persistent cough and shortness of breath for 2 weeks',
      sampleGenerated: 'January 25, 2025, 10:30 AM',
      sampleContent: 'TECHNIQUE:\nPA and lateral chest radiographs were obtained.\n\nFINDINGS:\nThe heart size is within normal limits. There is increased opacity in the right lower lobe consistent with consolidation. No pleural effusion is identified. The left lung appears clear. Bony structures show no acute abnormalities. The mediastinal contours are normal.\n\nIMPRESSION:\nRight lower lobe consolidation, suggestive of pneumonia. Clinical correlation recommended.',
      sampleDisclaimer: 'DISCLAIMER: This report was generated using AI technology and requires review and validation by a qualified radiologist before clinical use. The AI analysis should be considered as a preliminary assessment and should not replace professional medical judgment.',
      sampleReportId: 'RAD-1737842230145',
      
      // Team section
      teamTitle: 'Meet the Team',
      teamDesc: 'Passionate healthcare technologists building the future of radiology',
      founderName: 'MAJD AI Team',
      founderRole: 'AI Healthcare Specialists',
      founderDesc: 'Combining expertise in artificial intelligence and medical imaging to democratize access to quality radiology interpretation.',
      
      // FAQ
      faqTitle: 'Frequently Asked Questions',
      faq1Q: 'Is RadMed FDA approved?',
      faq1A: 'RadMed is a diagnostic aid tool in beta phase, designed to assist healthcare professionals. All medical decisions and final diagnoses must be made by qualified medical professionals.',
      faq2Q: 'How secure is patient data?',
      faq2A: 'We follow HIPAA compliance standards. Images are processed securely and automatically deleted after analysis. No patient data is stored.',
      faq3Q: 'What image formats are supported?',
      faq3A: 'We support JPEG, PNG, and DICOM (.dcm) formats for various imaging modalities including X-Ray, CT, MRI, and Ultrasound.',

      faq5Q: 'Is there a cost for using RadMed?',
      faq5A: 'We offer a free tier with limited reports per day. Pro plans with unlimited usage will be available soon.',
      
      // Contact
      contactTitle: 'Get in Touch',
      contactDesc: 'Have questions? We\'d love to hear from you.',
      contactEmail: 'Contact us at info@majdai.ai',
      
      footer: ' MAJD AI. All rights reserved.',
      footerRights: 'All rights reserved.',
      visitMajd: 'Visit majdai.ai',
      
      // Main app
      generate: 'Generate',
      history: 'History',
      uploadImage: 'Upload Medical Images',
      dragDrop: 'Drag and drop your medical images here, or click to browse',
      supportedFormats: 'Supported formats: JPEG, PNG, DICOM (.dcm)',
      addMore: 'Add More Images',
      removeImage: 'Remove',
      imagesSelected: 'images selected',
      
      // Patient form
      patientInfo: 'Patient Information',
      patientName: 'Patient Name',
      age: 'Age',
      sex: 'Sex',
      male: 'Male',
      female: 'Female',
      other: 'Other',
      modality: 'Modality',
      clinicalHistory: 'Clinical History',
      
      // Report generation
      generateReport: 'Generate Report',
      generating: 'Generating Report...',
      generatedReport: 'Generated Report',
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      download: 'Download',
      
      // Report history
      reportHistory: 'Report History',
      refresh: 'Refresh',
      noReports: 'No reports generated yet',
      noReportsDesc: 'Upload an image to get started',
      confidence: 'Confidence',
      downloadFull: 'Download Full Report',
      
      // Status
      pendingReview: 'PENDING REVIEW',
      reviewed: 'REVIEWED',
      
      // Disclaimer
      disclaimer: ' AI-generated reports are for assistance only and must be reviewed and validated by qualified medical professionals before clinical use.',
      selectImages: 'Please select at least one image',
      
      // Tier system
      freeVersion: 'Free Version',
      proVersion: 'Pro Version',
      dailyLimit: 'Daily Limit: 3 reports',
      reportsUsed: 'Reports used today',
      upgradePrompt: 'Upgrade to Pro for unlimited reports',
      upgradeToPro: 'Upgrade to Pro',
      comingSoon: 'Coming Soon!',
      upgradeMessage: 'Pro version is coming soon. Fill out the form below to be notified when it\'s available.',
      limitReached: 'Daily limit reached. Upgrade to Pro for unlimited reports.'
    },
    fr: {
      // Navigation
      login: 'Connexion',
      getStarted: 'Commencer',
      
      // Landing page
      heroTitle: 'Rapports de Radiologie IA',
      heroSubtitle: 'Générez des rapports de radiologie complets instantanément avec une technologie IA avancée',
      heroMain: 'Transformez l\'Imagerie Médicale avec',
      heroGradient: 'Précision Alimentée par l\'IA',
      heroDesc: 'RadMed assiste les professionnels de santé avec une analyse d\'images médicales alimentée par IA, fournissant un support diagnostique pour améliorer la prise de décision clinique.',
      heroStartTrial: 'Bêta Gratuite',
      heroWatchDemo: 'Voir Démo Live',
      betaBadge: 'Bêta Accès Anticipé',
      statAccuracy: 'Précision IA',
      statReports: 'Rapports Bêta',
      statPartners: 'Utilisateurs Précoces',
      statSupport: 'Temps de Réponse',
      statAccuracyValue: '98.5%',
      statReportsValue: '1,200+',
      statPartnersValue: '50+',
      statSupportValue: '<2hrs',
      featuresTitle: 'Fonctionnalités Puissantes pour la Santé Moderne',
      featuresDesc: 'Tout ce dont vous avez besoin pour révolutionner votre flux de travail en radiologie',
      feature1Title: 'Alimenté par IA Avancée',
      feature1Desc: 'Des modèles IA avancés assistent les professionnels de santé avec l\'analyse d\'images médicales et le support diagnostique.',
      feature2Title: 'Conforme HIPAA',
      feature2Desc: 'La sécurité de niveau entreprise garantit la confidentialité des données des patients et la conformité réglementaire.',
      feature3Title: 'Résultats Instantanés',
      feature3Desc: 'Générez des ébauches de rapports de radiologie en secondes pour assister les professionnels de santé.',
      feature4Title: 'Support Multi-Modal',
      feature4Desc: 'Supporte les formats X-Ray, CT, IRM, Échographie et DICOM pour une analyse complète.',
      feature5Title: 'Multi-Langue',
      feature5Desc: 'Générez des rapports en anglais et français avec plus de langues à venir.',
      feature6Title: 'Options d\'Export',
      feature6Desc: 'Téléchargez les rapports en format Word professionnel ou texte brut pour une intégration facile.',
      
      // Technology section
      techTitle: 'Construit sur une Technologie de Pointe',
      techDesc: 'Notre stack IA combine les dernières avancées en imagerie médicale et traitement du langage naturel',
      tech1Title: 'Modèles IA Avancés',
      tech1Desc: 'Technologie IA pour assister les professionnels de santé avec l\'interprétation d\'images médicales.',
      tech2Title: 'Infrastructure Cloud',
      tech2Desc: 'Architecture cloud évolutive garantissant des performances rapides, fiables et sécurisées.',
      tech3Title: 'Authentification Sécurisée',
      tech3Desc: 'Authentification utilisateur de niveau entreprise et gestion de session sécurisée.',
      tech4Title: 'Traitement Sécurisé',
      tech4Desc: 'Toutes les images sont traitées de manière sécurisée avec suppression automatique après analyse.',
      
      // Use cases
      useCasesTitle: 'Soutien aux Professionnels de Santé',
      useCasesDesc: 'RadMed fournit une aide diagnostique dans diverses spécialités médicales',
      useCase1: 'Analyse Radiographie Thoracique',
      useCase1Desc: 'Assiste à identifier les pneumonies, fractures et anomalies potentielles dans les radiographies thoraciques.',
      useCase2: 'Imagerie Orthopédique',
      useCase2Desc: 'Soutient l\'analyse des fractures osseuses, conditions articulaires et troubles musculo-squelettiques.',
      useCase3: 'Radiologie d\'Urgence',
      useCase3Desc: 'Fournit une analyse préliminaire pour assister avec les cas urgents et la couverture après les heures.',
      useCase4: 'Assurance Qualité',
      useCase4Desc: 'Aide diagnostique pour cas complexes et support éducatif pour la formation des résidents.',
      
      // Sample report
      sampleTitle: 'RadMed en Action',
      sampleDesc: 'Exemple réel de rapport de support diagnostique généré par IA',
      samplePatient: 'Sarah M.',
      sampleAge: '52',
      sampleSex: 'Féminin',
      sampleDate: '25 janvier 2025',
      sampleModality: 'Radiographie',
      sampleClinical: 'Toux persistante et essoufflement depuis 2 semaines',
      sampleGenerated: '25 janvier 2025, 10h30',
      sampleContent: 'TECHNIQUE:\nRadiographies thoraciques PA et latérale ont été obtenues.\n\nCONSTATATIONS:\nLa taille du cœur est dans les limites normales. Il y a une opacité accrue dans le lobe inférieur droit compatible avec une consolidation. Aucun épanchement pleural n\'est identifié. Le poumon gauche apparaît clair. Les structures osseuses ne montrent aucune anomalie aiguë. Les contours médiastinaux sont normaux.\n\nIMPRESSION:\nConsolidation du lobe inférieur droit, suggérant une pneumonie. Corrélation clinique recommandée.',
      sampleDisclaimer: 'AVERTISSEMENT: Ce rapport a été généré en utilisant la technologie IA et nécessite une révision et validation par un radiologue qualifié avant utilisation clinique. L\'analyse IA doit être considérée comme une évaluation préliminaire et ne doit pas remplacer le jugement médical professionnel.',
      sampleReportId: 'RAD-1737842230145',
      
      // Team section
      teamTitle: 'Rencontrez l\'Équipe',
      teamDesc: 'Technologues de santé passionnés construisant l\'avenir de la radiologie',
      founderName: 'Équipe MAJD AI',
      founderRole: 'Spécialistes IA Santé',
      founderDesc: 'Combinant expertise en intelligence artificielle et imagerie médicale pour démocratiser l\'accès à une interprétation radiologique de qualité.',
      
      // FAQ
      faqTitle: 'Questions Fréquemment Posées',
      faq1Q: 'RadMed est-il approuvé par la FDA?',
      faq1A: 'RadMed est un outil d\'aide diagnostique en phase bêta, conçu pour assister les professionnels de santé. Toutes les décisions médicales et diagnostics finaux doivent être pris par des professionnels médicaux qualifiés.',
      faq2Q: 'Quelle est la sécurité des données patients?',
      faq2A: 'Nous suivons les standards de conformité HIPAA. Les images sont traitées de manière sécurisée et automatiquement supprimées après analyse. Aucune donnée patient n\'est stockée.',
      faq3Q: 'Quels formats d\'image sont supportés?',
      faq3A: 'Nous supportons les formats JPEG, PNG et DICOM (.dcm) pour diverses modalités d\'imagerie incluant X-Ray, CT, IRM et Échographie.',

      faq5Q: 'Y a-t-il un coût pour utiliser RadMed?',
      faq5A: 'Nous offrons un niveau gratuit avec rapports limités par jour. Les plans Pro avec usage illimité seront bientôt disponibles.',
      
      // Contact
      contactTitle: 'Contactez-nous',
      contactDesc: 'Vous avez des questions? Nous aimerions vous entendre.',
      contactEmail: 'Contactez-nous à info@majdai.ai',
      
      footer: ' MAJD AI. Tous droits réservés.',
      footerRights: 'Tous droits réservés.',
      visitMajd: 'Visiter majdai.ai',
      
      // Main app
      generate: 'Générer',
      history: 'Historique',
      uploadImage: 'Télécharger Images Médicales',
      dragDrop: 'Glissez-déposez vos images médicales ici, ou cliquez pour parcourir',
      supportedFormats: 'Formats supportés: JPEG, PNG, DICOM (.dcm)',
      addMore: "Ajouter Plus d\'Images",
      removeImage: 'Supprimer',
      imagesSelected: 'images sélectionnées',
      
      // Patient form
      patientInfo: 'Informations Patient',
      patientName: 'Nom du Patient',
      age: 'Âge',
      sex: 'Sexe',
      male: 'Masculin',
      female: 'Féminin',
      other: 'Autre',
      modality: 'Modalité',
      clinicalHistory: 'Antécédents Cliniques',
      
      // Report generation
      generateReport: 'Générer le Rapport',
      generating: 'Génération du Rapport...',
      generatedReport: 'Rapport Généré',
      edit: 'Modifier',
      save: 'Sauvegarder',
      cancel: 'Annuler',
      download: 'Télécharger',
      
      // Report history
      reportHistory: 'Historique des Rapports',
      refresh: 'Actualiser',
      noReports: 'Aucun rapport généré',
      noReportsDesc: 'Téléchargez une image pour commencer',
      confidence: 'Confiance',
      downloadFull: 'Télécharger le Rapport Complet',
      
      // Status
      pendingReview: 'EN ATTENTE DE RÉVISION',
      reviewed: 'RÉVISÉ',
      
      // Disclaimer
      disclaimer: "⚠️ Les rapports générés par IA sont uniquement à des fins d'assistance et doivent être révisés et validés par des professionnels médicaux qualifiés avant utilisation clinique.",
      selectImages: 'Veuillez sélectionner au moins une image',
      
      // Tier system
      freeVersion: 'Version Gratuite',
      proVersion: 'Version Pro',
      dailyLimit: 'Limite quotidienne: 3 rapports',
      reportsUsed: "Rapports utilisés aujourd'hui",
      upgradePrompt: 'Passez à Pro pour des rapports illimités',
      upgradeToPro: 'Passer à Pro',
      comingSoon: 'Bientôt Disponible!',
      upgradeMessage: 'La version Pro arrive bientôt. Remplissez le formulaire ci-dessous pour être averti quand elle sera disponible.',
      limitReached: 'Limite quotidienne atteinte. Passez à Pro pour des rapports illimités.'
    }
  };
  
  // Real backend integration
  const { reports, loading, error, generateReport, fetchReports, downloadReport, clearError, updateReport } = useReports();

  // Set dailyReportsUsed based on reports created today
  useEffect(() => {
    if (isSignedIn && reports.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dailyCount = reports.filter(r => {
        const created = new Date(r.createdAt);
        return created >= today;
      }).length;
      setDailyReportsUsed(dailyCount);
    } else if (isSignedIn) {
      setDailyReportsUsed(0);
    }
  }, [isSignedIn, reports]);

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        setCurrentView('app');
      } else {
        setCurrentView('landing');
      }
    }
  }, [isSignedIn, isLoaded]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    for (const file of files) {
      let preview = '';
      
      if (file.name.toLowerCase().endsWith('.dcm')) {
        // For DICOM files, convert to base64 for preview
        try {
          const { fileToBase64 } = await import('@/hooks/useReports');
          const { base64 } = await fileToBase64(file);
          preview = `data:image/png;base64,${base64}`;
        } catch (error) {
          console.error('Failed to generate DICOM preview:', error);
          preview = '/api/placeholder/300/200?text=DICOM+File';
        }
        
        setSelectedImages(prev => [...prev, {
          file: file,
          preview: preview,
          name: file.name
        }]);
      } else {
        // For regular images, use FileReader
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedImages(prev => [...prev, {
            file: file,
            preview: e.target?.result as string,
            name: file.name
          }]);
        };
        reader.readAsDataURL(file);
      }
    }
  };
  
  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleGenerateReport = async () => {
    if (selectedImages.length === 0) {
      alert(t[language].selectImages);
      return;
    }

    // Check daily limit for free users
    if (userTier === 'free' && dailyReportsUsed >= 3) {
      setShowUpgradeModal(true);
      return;
    }

    try {
      const result = await generateReport(
        selectedImages.map(img => img.file),
        {
          name: patientInfo.name,
          age: patientInfo.age,
          sex: patientInfo.sex,
          modality: patientInfo.modality,
          clinicalHistory: patientInfo.clinicalHistory
        },
        language
      );

      // No need to increment dailyReportsUsed here; it will update after fetchReports

      // Clear form and images after successful generation
      setSelectedImages([]);
      setPatientInfo({
        name: '',
        age: '',
        sex: '',
        modality: 'X-Ray',
        clinicalHistory: ''
      });
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('Failed to generate report. Please try again.');
    }
  };

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-white">Loading RadMed...</p>
        </div>
      </div>
    );
  }

  // Landing Page
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
          }} />
        </div>

        {/* Navigation */}
        <nav className="relative backdrop-blur-xl bg-white bg-opacity-10 border-b border-white border-opacity-20">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <NextImage src="/pnglogo.png" alt="RadMed Logo" width={40} height={40} className="mr-3 object-contain" />
                <div>
                  <h1 className="text-2xl font-bold text-white">RadMed</h1>
                  <p className="text-xs text-gray-400">by MAJD AI</p>
                </div>
              </div>
                            <div className="flex items-center space-x-4">
                {/* Beta Badge */}
                <div className="hidden md:flex items-center px-3 py-1 bg-gradient-to-r from-cyan-500 to-purple-500 bg-opacity-20 border border-cyan-400 border-opacity-30 rounded-full">
                  <span className="text-cyan-300 text-sm font-medium">{t[language].betaBadge}</span>
                </div>
                
                {/* Language Selector */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 rounded-lg text-sm transition-all duration-200 min-w-[60px] ${
                      language === 'en'
                        ? 'bg-cyan-500 bg-opacity-30 text-cyan-300 border border-cyan-400'
                        : 'bg-gray-500 bg-opacity-20 text-gray-300 hover:bg-opacity-30'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLanguage('fr')}
                    className={`px-3 py-1 rounded-lg text-sm transition-all duration-200 min-w-[60px] ${
                      language === 'fr'
                        ? 'bg-cyan-500 bg-opacity-30 text-cyan-300 border border-cyan-400'
                        : 'bg-gray-500 bg-opacity-20 text-gray-300 hover:bg-opacity-30'
                    }`}
                  >
                    FR
                  </button>
                </div>
                
                <SignInButton mode="modal">
                  <button className="text-gray-300 hover:text-white transition-colors duration-200">
                    {t[language].login}
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="btn-primary text-sm px-4 py-2 min-w-[120px]">
                    {t[language].getStarted}
                  </button>
                </SignUpButton>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative py-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
              {t[language].heroMain}
              <span className="text-gradient block mt-2">{t[language].heroGradient}</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              {t[language].heroDesc}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <SignUpButton mode="modal">
                <button className="btn-primary text-base px-6 py-3 min-w-[160px]">
                  {t[language].heroStartTrial}
                </button>
              </SignUpButton>
              <button 
                className="btn-secondary text-base px-6 py-3 min-w-[140px]"
                onClick={() => {
                  const featuresSection = document.getElementById('features');
                  featuresSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Learn More
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">{t[language].featuresTitle}</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                {t[language].featuresDesc}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white bg-opacity-5 backdrop-blur-xl border border-white border-opacity-10 rounded-2xl p-8 hover:bg-opacity-10 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center mb-6">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{t[language].feature1Title}</h3>
                <p className="text-gray-300">
                  {t[language].feature1Desc}
                </p>
              </div>
              <div className="bg-white bg-opacity-5 backdrop-blur-xl border border-white border-opacity-10 rounded-2xl p-8 hover:bg-opacity-10 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{t[language].feature2Title}</h3>
                <p className="text-gray-300">
                  {t[language].feature2Desc}
                </p>
              </div>
              <div className="bg-white bg-opacity-5 backdrop-blur-xl border border-white border-opacity-10 rounded-2xl p-8 hover:bg-opacity-10 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{t[language].feature3Title}</h3>
                <p className="text-gray-300">
                  {t[language].feature3Desc}
                </p>
              </div>
              <div className="bg-white bg-opacity-5 backdrop-blur-xl border border-white border-opacity-10 rounded-2xl p-8 hover:bg-opacity-10 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center mb-6">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{t[language].feature4Title}</h3>
                <p className="text-gray-300">
                  {t[language].feature4Desc}
                </p>
              </div>
              <div className="bg-white bg-opacity-5 backdrop-blur-xl border border-white border-opacity-10 rounded-2xl p-8 hover:bg-opacity-10 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center mb-6">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{t[language].feature5Title}</h3>
                <p className="text-gray-300">
                  {t[language].feature5Desc}
                </p>
              </div>
              <div className="bg-white bg-opacity-5 backdrop-blur-xl border border-white border-opacity-10 rounded-2xl p-8 hover:bg-opacity-10 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center mb-6">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{t[language].feature6Title}</h3>
                <p className="text-gray-300">
                  {t[language].feature6Desc}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="py-20 px-6 bg-black bg-opacity-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">{t[language].techTitle}</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                {t[language].techDesc}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{t[language].tech1Title}</h3>
                <p className="text-gray-400 text-sm">{t[language].tech1Desc}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{t[language].tech2Title}</h3>
                <p className="text-gray-400 text-sm">{t[language].tech2Desc}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{t[language].tech3Title}</h3>
                <p className="text-gray-400 text-sm">{t[language].tech3Desc}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{t[language].tech4Title}</h3>
                <p className="text-gray-400 text-sm">{t[language].tech4Desc}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">{t[language].useCasesTitle}</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                {t[language].useCasesDesc}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white bg-opacity-5 backdrop-blur-xl border border-white border-opacity-10 rounded-2xl p-6 hover:bg-opacity-10 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{t[language].useCase1}</h3>
                <p className="text-gray-400 text-sm">{t[language].useCase1Desc}</p>
              </div>
              <div className="bg-white bg-opacity-5 backdrop-blur-xl border border-white border-opacity-10 rounded-2xl p-6 hover:bg-opacity-10 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{t[language].useCase2}</h3>
                <p className="text-gray-400 text-sm">{t[language].useCase2Desc}</p>
              </div>
              <div className="bg-white bg-opacity-5 backdrop-blur-xl border border-white border-opacity-10 rounded-2xl p-6 hover:bg-opacity-10 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{t[language].useCase3}</h3>
                <p className="text-gray-400 text-sm">{t[language].useCase3Desc}</p>
              </div>
              <div className="bg-white bg-opacity-5 backdrop-blur-xl border border-white border-opacity-10 rounded-2xl p-6 hover:bg-opacity-10 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{t[language].useCase4}</h3>
                <p className="text-gray-400 text-sm">{t[language].useCase4Desc}</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-6 bg-black bg-opacity-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">{t[language].faqTitle}</h2>
            </div>
            <div className="space-y-6">
              <div className="bg-white bg-opacity-5 backdrop-blur-xl border border-white border-opacity-10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">{t[language].faq1Q}</h3>
                <p className="text-gray-300">{t[language].faq1A}</p>
              </div>
              <div className="bg-white bg-opacity-5 backdrop-blur-xl border border-white border-opacity-10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">{t[language].faq2Q}</h3>
                <p className="text-gray-300">{t[language].faq2A}</p>
              </div>
              <div className="bg-white bg-opacity-5 backdrop-blur-xl border border-white border-opacity-10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">{t[language].faq3Q}</h3>
                <p className="text-gray-300">{t[language].faq3A}</p>
              </div>
              <div className="bg-white bg-opacity-5 backdrop-blur-xl border border-white border-opacity-10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">{t[language].faq5Q}</h3>
                <p className="text-gray-300">{t[language].faq5A}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-4">{t[language].contactTitle}</h2>
            <p className="text-xl text-gray-300 mb-8">{t[language].contactDesc}</p>
            <div className="bg-white bg-opacity-5 backdrop-blur-xl border border-white border-opacity-10 rounded-2xl p-8">
              <p className="text-lg text-cyan-400 font-medium">
                {language === 'en' ? 'Contact us at ' : 'Contactez-nous à '}
                <a 
                  href="mailto:info@majdai.ai" 
                  className="text-cyan-300 hover:text-cyan-100 underline transition-colors duration-200"
                >
                  info@majdai.ai
                </a>
              </p>
              <div className="mt-6">
                <SignUpButton mode="modal">
                  <button className="btn-primary px-8 py-3 text-lg">
                    {t[language].heroStartTrial}
                  </button>
                </SignUpButton>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full border-t border-white border-opacity-10 bg-black bg-opacity-30 py-6 mt-8">
          <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-gray-400 text-sm text-center">
            <span>
              MAJD AI. {t[language].footerRights}
            </span>
          </div>
        </footer>
      </div>
    );
  }

  // Main App (authenticated view)
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="relative backdrop-blur-xl bg-white bg-opacity-10 border-b border-white border-opacity-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
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
              <div className="flex space-x-2">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-lg text-sm transition-all duration-200 min-w-[60px] ${
                    language === 'en'
                      ? 'bg-cyan-500 bg-opacity-30 text-cyan-300 border border-cyan-400'
                      : 'bg-gray-500 bg-opacity-20 text-gray-300 hover:bg-opacity-30'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('fr')}
                  className={`px-3 py-1 rounded-lg text-sm transition-all duration-200 min-w-[60px] ${
                    language === 'fr'
                      ? 'bg-cyan-500 bg-opacity-30 text-cyan-300 border border-cyan-400'
                      : 'bg-gray-500 bg-opacity-20 text-gray-300 hover:bg-opacity-30'
                  }`}
                >
                  FR
                </button>
              </div>
              
              <div className="text-right">
                <p className="text-white font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="text-gray-400 text-sm">{user?.emailAddresses[0]?.emailAddress}</p>
              </div>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex space-x-1 bg-black bg-opacity-20 rounded-2xl p-1 w-fit mx-auto">
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'generate'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                : 'text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10'
            }`}
          >
            <Upload className="w-5 h-5 mr-2" />
            {t[language].generate}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                : 'text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10'
            }`}
          >
            <History className="w-5 h-5 mr-2" />
            {t[language].history}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 mb-6">
          <div className="bg-red-500 bg-opacity-20 border border-red-500 border-opacity-50 rounded-xl p-4 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
            <p className="text-red-300">{error}</p>
            <button onClick={clearError} className="ml-auto text-red-400 hover:text-red-300">
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {activeTab === 'generate' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="card">
              <h2 className="text-2xl font-bold text-white mb-6">{t[language].uploadImage}</h2>
              
              <div className="border-2 border-dashed border-gray-600 rounded-2xl p-8 text-center hover:border-cyan-400 transition-colors duration-200">
                <input
                  type="file"
                  accept="image/*,.dcm"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="imageUpload"
                  multiple
                />
                <label htmlFor="imageUpload" className="cursor-pointer">
                  {selectedImages.length > 0 ? (
                    <div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        {selectedImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <NextImage
                              src={image.preview}
                              alt={`Preview ${index + 1}`}
                              width={200}
                              height={128}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                removeImage(index);
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                            <p className="text-white text-xs mt-1 truncate">{image.name}</p>
                          </div>
                        ))}
                      </div>
                      <p className="text-cyan-300 font-medium">{selectedImages.length} {t[language].imagesSelected}</p>
                      <p className="text-gray-400 text-sm mt-2">{t[language].addMore}</p>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-white font-medium mb-2">{t[language].dragDrop}</p>
                      <p className="text-gray-400 text-sm">{t[language].supportedFormats}</p>
                    </div>
                  )}
                </label>
              </div>

              {/* Patient Information Form */}
              {selectedImages.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-semibold text-white mb-4">{t[language].patientInfo}</h3>
                  
                  {/* Patient Demographics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">{t[language].patientName}</label>
                      <input
                        type="text"
                        value={patientInfo.name}
                        onChange={(e) => setPatientInfo({...patientInfo, name: e.target.value})}
                        className="w-full px-4 py-2 bg-black bg-opacity-30 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                        placeholder="Enter patient name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">{t[language].age}</label>
                      <input
                        type="text"
                        value={patientInfo.age}
                        onChange={(e) => setPatientInfo({...patientInfo, age: e.target.value})}
                        className="w-full px-4 py-2 bg-black bg-opacity-30 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                        placeholder="Age"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">{t[language].sex}</label>
                      <select
                        value={patientInfo.sex}
                        onChange={(e) => setPatientInfo({...patientInfo, sex: e.target.value})}
                        className="w-full px-4 py-2 bg-black bg-opacity-30 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                      >
                        <option value="">{t[language].sex}</option>
                        <option value="Male">{t[language].male}</option>
                        <option value="Female">{t[language].female}</option>
                        <option value="Other">{t[language].other}</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Study Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">{t[language].modality}</label>
                      <select
                        value={patientInfo.modality}
                        onChange={(e) => setPatientInfo({...patientInfo, modality: e.target.value})}
                        className="w-full px-4 py-2 bg-black bg-opacity-30 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                      >
                        <option value="X-Ray">X-Ray</option>
                        <option value="CT">CT Scan</option>
                        <option value="MRI">MRI</option>
                        <option value="Ultrasound">Ultrasound</option>
                        <option value="Mammography">Mammography</option>
                        <option value="Nuclear Medicine">Nuclear Medicine</option>
                        <option value="PET Scan">PET Scan</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">{t[language].clinicalHistory}</label>
                      <input
                        type="text"
                        value={patientInfo.clinicalHistory}
                        onChange={(e) => setPatientInfo({...patientInfo, clinicalHistory: e.target.value})}
                        placeholder={language === 'fr' ? 'Dépistage de routine' : 'Routine screening'}
                        className="w-full px-4 py-2 bg-black bg-opacity-30 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleGenerateReport}
                disabled={selectedImages.length === 0 || loading || (userTier === 'free' && dailyReportsUsed >= 3)}
                className="w-full mt-6 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {t[language].generating}
                  </>
                ) : (
                  <>
                    <NextImage src="/pnglogo.png" alt="RadMed Logo" width={20} height={20} className="mr-2 object-contain" />
                    {t[language].generateReport}
                  </>
                )}
              </button>
              
              {/* Tier System Info */}
              <div className="mt-4 p-4 bg-black bg-opacity-30 rounded-lg border border-gray-600">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-300">
                    {userTier === 'free' ? t[language].freeVersion : t[language].proVersion}
                  </span>
                  {userTier === 'free' && (
                    <button
                      onClick={() => setShowUpgradeModal(true)}
                      className="text-xs px-3 py-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-full hover:shadow-lg transition-all duration-200"
                    >
                      {t[language].upgradeToPro}
                    </button>
                  )}
                </div>
                {userTier === 'free' && (
                  <>
                    <div className="text-xs text-gray-400 mb-1">{t[language].dailyLimit}</div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">{t[language].reportsUsed}: {dailyReportsUsed}/3</span>
                      <div className="w-20 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(dailyReportsUsed / 3) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    {dailyReportsUsed >= 3 && (
                      <div className="mt-2 text-xs text-yellow-400">
                        {t[language].limitReached}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Generated Report Preview */}
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">{t[language].generatedReport}</h2>
                {reports.length > 0 && (
                  <div className="flex space-x-2">
                    {editingReport === reports[0].id.toString() ? (
                      <>
                        <button
                          onClick={async () => {
                            try {
                              await updateReport(reports[0].id.toString(), editedContent);
                              setEditingReport(null);
                              setEditedContent('');
                            } catch (error) {
                              console.error('Failed to save report:', error);
                            }
                          }}
                          className="flex items-center px-3 py-1 bg-blue-500 bg-opacity-20 text-blue-300 rounded-lg hover:bg-opacity-30 transition-all duration-200"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {t[language].save}
                        </button>
                        <button
                          onClick={() => {
                            setEditingReport(null);
                            setEditedContent('');
                          }}
                          className="flex items-center px-3 py-1 bg-gray-500 bg-opacity-20 text-gray-300 rounded-lg hover:bg-opacity-30 transition-all duration-200"
                        >
                          {t[language].cancel}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingReport(reports[0].id.toString());
                            setEditedContent(reports[0].content);
                          }}
                          className="flex items-center px-3 py-1 bg-yellow-500 bg-opacity-20 text-yellow-300 rounded-lg hover:bg-opacity-30 transition-all duration-200"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          {t[language].edit}
                        </button>
                        <button
                          onClick={() => downloadReport(reports[0])}
                          className="flex items-center px-3 py-1 bg-green-500 bg-opacity-20 text-green-300 rounded-lg hover:bg-opacity-30 transition-all duration-200"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          {t[language].download}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {reports.length > 0 ? (
                <div className="bg-black bg-opacity-20 rounded-2xl p-6 border border-white border-opacity-10">
                  <div className="mb-4">
                    <h3 className="text-white font-semibold">Patient ID: {reports[0].patientId}</h3>
                    <p className="text-gray-400 text-sm">{reports[0].modality} • {new Date(reports[0].createdAt).toLocaleDateString()}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                      reports[0].status === 'pending_review' 
                        ? 'bg-yellow-500 bg-opacity-20 text-yellow-300' 
                        : 'bg-green-500 bg-opacity-20 text-green-300'
                    }`}>
                      {reports[0].status === 'pending_review' ? t[language].pendingReview : t[language].reviewed}
                    </span>
                  </div>
                  
                  {editingReport === reports[0].id.toString() ? (
                    <div className="space-y-4">
                      <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="w-full h-96 px-4 py-3 bg-black bg-opacity-40 border border-gray-600 rounded-lg text-gray-300 text-sm font-mono resize-none focus:border-cyan-400 focus:outline-none"
                        placeholder="Edit the radiology report..."
                      />
                      <p className="text-gray-500 text-xs">Review and edit the AI-generated report. Make sure all findings are accurate before saving.</p>
                    </div>
                  ) : (
                    <div className="max-h-96 overflow-y-auto scrollbar-hide">
                      <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                        {reports[0].content}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">{t[language].noReports}</p>
                  <p className="text-gray-500 text-sm">{t[language].noReportsDesc}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">{t[language].reportHistory}</h2>
              <button
                onClick={() => fetchReports()}
                className="flex items-center px-4 py-2 bg-cyan-500 bg-opacity-20 text-cyan-300 rounded-xl hover:bg-opacity-30 transition-all duration-200"
              >
                <Activity className="w-4 h-4 mr-2" />
                {t[language].refresh}
              </button>
            </div>
            
            {reports.length > 0 ? (
              <div className="space-y-4">
                {reports.map(report => (
                  <div key={report.id} className="bg-black bg-opacity-20 rounded-2xl p-6 border border-white border-opacity-10 hover:border-cyan-400 hover:border-opacity-30 transition-all duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-white font-semibold">{report.modality}</h3>
                        <p className="text-gray-500 text-xs">{t[language].confidence}: {(report.confidence * 100).toFixed(1)}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-300 text-sm">{new Date(report.createdAt).toLocaleString()}</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          report.status === 'pending_review' 
                            ? 'bg-yellow-500 bg-opacity-20 text-yellow-300' 
                            : 'bg-green-500 bg-opacity-20 text-green-300'
                        }`}>
                          {report.status === 'pending_review' ? t[language].pendingReview : t[language].reviewed}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-black bg-opacity-30 rounded-xl p-4 max-h-32 overflow-y-auto scrollbar-hide mb-4">
                      <pre className="text-gray-300 text-xs whitespace-pre-wrap font-mono">
                        {report.content.substring(0, 300)}...
                      </pre>
                    </div>
                    
                    <button
                      onClick={() => downloadReport(report)}
                      className="flex items-center px-4 py-2 bg-green-500 bg-opacity-20 text-green-300 rounded-xl hover:bg-opacity-30 transition-all duration-200"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {t[language].downloadFull}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <History className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">{t[language].noReports}</p>
                <p className="text-gray-500 text-sm">{t[language].noReportsDesc}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="relative backdrop-blur-xl bg-orange-500 bg-opacity-10 border-t border-orange-500 border-opacity-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <p className="text-orange-300 text-sm text-center">
            {t[language].disclaimer}
          </p>
        </div>
      </div>
      
      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-gray-700">
            <div className="text-center">
              <div className="flex items-center justify-center mx-auto mb-4">
                <NextImage src="/pnglogo.png" alt="RadMed Logo" width={64} height={64} className="object-contain" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{t[language].comingSoon}</h3>
              <p className="text-gray-300 mb-6">{t[language].upgradeMessage}</p>
              
              {/* Coming Soon Form */}
              <form 
                action="https://formspree.io/f/xgvyqrqk" 
                method="POST"
                className="space-y-4 mb-6"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setFormSubmitting(true);
                  
                  try {
                    const response = await fetch('https://formspree.io/f/xgvyqrqk', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                        email: upgradeFormData.email,
                        name: upgradeFormData.name,
                        features: upgradeFormData.features,
                        message: `RadMed Pro Interest - Name: ${upgradeFormData.name}, Features: ${upgradeFormData.features}`
                      })
                    });
                    
                    if (response.ok) {
                      alert('Thank you! We\'ll notify you when Pro is available.');
                      setUpgradeFormData({ email: '', name: '', features: '' });
                      setShowUpgradeModal(false);
                    } else {
                      throw new Error('Form submission failed');
                    }
                  } catch (error) {
                    alert('There was an error submitting the form. Please try again.');
                  } finally {
                    setFormSubmitting(false);
                  }
                }}
              >
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={upgradeFormData.email}
                  onChange={(e) => setUpgradeFormData({...upgradeFormData, email: e.target.value})}
                  required
                  className="w-full px-4 py-3 bg-black bg-opacity-30 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                />
                <input
                  type="text"
                  name="name"
                  placeholder="Your name (optional)"
                  value={upgradeFormData.name}
                  onChange={(e) => setUpgradeFormData({...upgradeFormData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-black bg-opacity-30 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
                />
                <textarea
                  name="features"
                  placeholder="What features would you like to see in Pro? (optional)"
                  rows={3}
                  value={upgradeFormData.features}
                  onChange={(e) => setUpgradeFormData({...upgradeFormData, features: e.target.value})}
                  className="w-full px-4 py-3 bg-black bg-opacity-30 border border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none resize-none"
                ></textarea>
                
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowUpgradeModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={formSubmitting || !upgradeFormData.email}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {formSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Notify Me'
                    )}
                  </button>
                </div>
              </form>
              

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
