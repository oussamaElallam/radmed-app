// RadMed Project Structure & Integration Example
// MAJD AI - Complete Production Setup

/*
📁 Project Structure:
radmed-app/
├── 📁 components/
│   ├── RadMedApp.jsx (your main component)
│   ├── AuthComponent.jsx
│   └── ReportGenerator.jsx
├── 📁 pages/
│   ├── _app.js
│   ├── index.js
│   └── 📁 api/
│       ├── 📁 reports/
│       │   ├── generate.js
│       │   ├── history.js
│       │   └── [id].js
│       └── 📁 webhooks/
│           └── clerk.js
├── 📁 lib/
│   ├── db.js
│   ├── gemini.js
│   └── upload.js
├── 📁 hooks/
│   └── useReports.js
├── 📁 styles/
│   └── globals.css
├── .env.local
├── package.json
└── next.config.js
*/

// ===========================================
// 1. UPDATED MAIN COMPONENT WITH REAL INTEGRATIONS
// ===========================================

// components/RadMedApp.jsx
import React, { useState, useEffect } from 'react';
import { useUser, SignInButton, SignOutButton, SignUpButton } from '@clerk/nextjs';
import { Upload, FileText, Brain, Download, History, LogOut, Zap, Shield, Database, ArrowRight, CheckCircle, Star, Users, Award, Activity } from 'lucide-react';
import { useReports } from '../hooks/useReports';

const RadMedApp = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  const [currentView, setCurrentView] = useState('landing');
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState('generate');
  
  // Real backend integration
  const { reports, loading, generateReport, fetchReports } = useReports();

  useEffect(() => {
    if (isSignedIn) {
      setCurrentView('app');
      fetchReports();
    } else {
      setCurrentView('landing');
    }
  }, [isSignedIn]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage({
          file: file,
          preview: e.target.result,
          name: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateReport = async () => {
    if (!selectedImage) return;
    
    try {
      const patientId = 'PT-' + Math.random().toString(36).substr(2, 9);
      const result = await generateReport(selectedImage.file, patientId, 'Chest X-Ray');
      
      // Success feedback
      console.log('Report generated:', result);
    } catch (error) {
      console.error('Failed to generate report:', error);
      // Handle error (show toast, etc.)
    }
  };

  // Landing Page (same as before but with updated branding)
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Landing page content with RadMed branding */}
        <nav className="relative backdrop-blur-xl bg-white bg-opacity-10 border-b border-white border-opacity-20">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-xl mr-3">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">RadMed</h1>
                  <p className="text-xs text-gray-400">by MAJD AI</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <SignInButton mode="modal">
                  <button className="text-gray-300 hover:text-white transition-colors duration-200">
                    Login
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-2 rounded-xl hover:from-cyan-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105">
                    Get Started
                  </button>
                </SignUpButton>
              </div>
            </div>
          </div>
        </nav>
        {/* Rest of landing page... */}
      </div>
    );
  }

  // Main App with Real Data
  if (isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <header className="relative backdrop-blur-xl bg-white bg-opacity-10 border-b border-white border-opacity-20">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-xl mr-3">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">RadMed</h1>
                  <p className="text-xs text-gray-400">by MAJD AI</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-white font-medium">{user?.firstName} {user?.lastName}</p>
                  <p className="text-gray-300 text-sm">{user?.emailAddresses[0]?.emailAddress}</p>
                </div>
                <SignOutButton>
                  <button className="inline-flex items-center px-4 py-2 bg-red-500 bg-opacity-20 text-red-300 rounded-xl hover:bg-opacity-30 transition-all duration-200">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </SignOutButton>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Navigation Tabs */}
          <div className="flex space-x-1 mb-8">
            {[
              { id: 'generate', label: 'Generate Report', icon: FileText },
              { id: 'history', label: 'Report History', icon: History }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 rounded-2xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'generate' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upload Section */}
              <div className="backdrop-blur-xl bg-white bg-opacity-10 rounded-3xl p-8 border border-white border-opacity-20">
                <h2 className="text-2xl font-bold text-white mb-6">Upload Medical Image</h2>
                
                <div className="border-2 border-dashed border-gray-300 border-opacity-30 rounded-2xl p-8 text-center mb-6 hover:border-cyan-400 hover:border-opacity-50 transition-all duration-300">
                  <input
                    type="file"
                    accept="image/*,.dcm"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300 mb-2">Click to upload or drag and drop</p>
                    <p className="text-gray-500 text-sm">DICOM, JPG, PNG files supported</p>
                  </label>
                </div>

                {selectedImage && (
                  <div className="mb-6">
                    <img
                      src={selectedImage.preview}
                      alt="Selected medical image"
                      className="w-full h-48 object-cover rounded-2xl border border-white border-opacity-20"
                    />
                    <p className="text-gray-300 text-sm mt-2">{selectedImage.name}</p>
                  </div>
                )}

                <button
                  onClick={handleGenerateReport}
                  disabled={!selectedImage || loading}
                  className={`w-full py-4 rounded-2xl font-semibold transition-all duration-300 ${
                    selectedImage && !loading
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-600 hover:to-purple-600 transform hover:scale-105 shadow-lg'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Generating with MAJD AI...
                    </div>
                  ) : (
                    'Generate AI Report'
                  )}
                </button>
              </div>

              {/* Report Display */}
              <div className="backdrop-blur-xl bg-white bg-opacity-10 rounded-3xl p-8 border border-white border-opacity-20">
                <h2 className="text-2xl font-bold text-white mb-6">Latest Report</h2>
                {reports.length > 0 ? (
                  <div className="bg-black bg-opacity-20 rounded-2xl p-6 border border-white border-opacity-10">
                    <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono">
                      {reports[0].report_content || reports[0].preview}
                    </pre>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">Generate your first report to see results here</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="backdrop-blur-xl bg-white bg-opacity-10 rounded-3xl p-8 border border-white border-opacity-20">
              <h2 className="text-2xl font-bold text-white mb-6">Report History</h2>
              
              {reports.length > 0 ? (
                <div className="space-y-4">
                  {reports.map(report => (
                    <div key={report.id} className="bg-black bg-opacity-20 rounded-2xl p-6 border border-white border-opacity-10 hover:border-cyan-400 hover:border-opacity-30 transition-all duration-200">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-white font-semibold">{report.modality}</h3>
                          <p className="text-gray-400 text-sm">Patient ID: {report.patient_id}</p>
                          <p className="text-gray-500 text-xs">Confidence: {(report.ai_confidence * 100).toFixed(1)}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-300 text-sm">{new Date(report.created_at).toLocaleString()}</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            report.status === 'pending_review' 
                              ? 'bg-yellow-500 bg-opacity-20 text-yellow-300' 
                              : 'bg-green-500 bg-opacity-20 text-green-300'
                          }`}>
                            {report.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="bg-black bg-opacity-30 rounded-xl p-4 max-h-32 overflow-y-auto">
                        <pre className="text-gray-300 text-xs whitespace-pre-wrap font-mono">
                          {report.preview}...
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <History className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No reports generated yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return null;
};

export default RadMedApp;

// ===========================================
// 2. CUSTOM HOOKS FOR BACKEND INTEGRATION
// ===========================================

// hooks/useReports.js
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export function useReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, isSignedIn } = useUser();

  const generateReport = async (imageFile, patientId, modality = 'X-Ray', clinicalHistory = '') => {
    setLoading(true);
    
    try {
      // Convert file to base64
      const base64 = await fileToBase64(imageFile);
      
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: base64,
          patientId,
          modality,
          clinicalHistory
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const result = await response.json();
      
      // Refresh reports list
      await fetchReports();
      
      return result;
    } catch (error) {
      console.error('Generate report error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    if (!isSignedIn) return;
    
    try {
      const response = await fetch('/api/reports/history');
      if (!response.ok) throw new Error('Failed to fetch reports');
      
      const data = await response.json();
      setReports(data.reports || []);
    } catch (error) {
      console.error('Fetch reports error:', error);
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchReports();
    }
  }, [isSignedIn]);

  return {
    reports,
    loading,
    generateReport,
    fetchReports
  };
}

// Utility function
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
  });
}

// ===========================================
// 3. PACKAGE.JSON DEPENDENCIES
// ===========================================

/*
{
  "name": "radmed-app",
  "version": "1.0.0",
  "description": "MAJD AI Radiology Platform",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@clerk/nextjs": "^4.27.0",
    "@neondatabase/serverless": "^0.6.0",
    "@google/generative-ai": "^0.1.3",
    "lucide-react": "^0.263.1",
    "tailwindcss": "^3.3.0",
    "svix": "^1.13.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31"
  }
}
*/

// ===========================================
// 4. NEXT.JS CONFIGURATION
// ===========================================

/*
// next.config.js
module.exports = {
  images: {
    domains: ['res.cloudinary.com'], // For image uploads
  },
  api: {
    bodyParser: {
      sizeLimit: '10mb', // For large medical images
    },
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}
*/

// ===========================================
// 5. DEPLOYMENT INSTRUCTIONS
// ===========================================

/*
🚀 DEPLOYMENT STEPS:

1. Setup Vercel:
   - Connect GitHub repo to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy with: vercel --prod

2. Configure Clerk:
   - Set production domain in Clerk dashboard
   - Add webhook: https://yourapp.vercel.app/api/webhooks/clerk
   - Update redirect URLs

3. Setup Neon Database:
   - Create production database
   - Run schema.sql on production
   - Update DATABASE_URL in Vercel

4. Configure Gemini API:
   - Ensure API key has proper permissions
   - Set up billing and usage limits

🔒 SECURITY CHECKLIST:
✅ All API routes protected with Clerk auth
✅ Input validation on all endpoints
✅ File upload size limits
✅ Rate limiting implemented
✅ Environment variables secured
✅ CORS properly configured
*/