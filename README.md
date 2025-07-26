# RadMed - AI Radiology Platform

**Developed by MAJD AI**

RadMed is a cutting-edge AI-powered radiology report generation platform that revolutionizes medical imaging analysis for healthcare professionals.

## 🚀 Features

- **AI-Powered Analysis**: Advanced Gemini 2.5 Pro integration for accurate medical image analysis
- **Secure Authentication**: Clerk-based authentication system with healthcare compliance
- **Real-time Reports**: Instant generation of comprehensive radiology reports
- **Report History**: Complete audit trail of all generated reports
- **HIPAA Ready**: Enterprise-grade security and privacy compliance
- **Multi-format Support**: JPEG, PNG, and DICOM file support

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Authentication**: Clerk
- **Database**: Neon PostgreSQL
- **AI**: Google Gemini 2.5 Pro
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd radmed-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with:
   ```env
   # Database
   DATABASE_URL=your_neon_database_url
   
   # Authentication (Clerk)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   
   # AI Service
   GEMINI_API_KEY=your_gemini_api_key
   
   # Next.js Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NODE_ENV=development
   ```

4. **Initialize the database**
   ```bash
   npm run init-db
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🗄️ Database Setup

The application uses Neon PostgreSQL with the following schema:

### Users Table
- Synced with Clerk authentication
- Stores medical professional information

### Reports Table
- Stores AI-generated radiology reports
- Links to user accounts
- Tracks confidence scores and status

## 🔧 Configuration

### Clerk Setup
1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Create a new application
3. Add your domain to allowed origins
4. Set up webhooks for user synchronization

### Neon Database Setup
1. Create a Neon account at [neon.tech](https://neon.tech)
2. Create a new database
3. Copy the connection string
4. Run the initialization script

### Gemini API Setup
1. Get API key from [Google AI Studio](https://aistudio.google.com)
2. Enable the Generative AI API
3. Add the API key to your environment variables

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Add Environment Variables**
   Add all environment variables in the Vercel dashboard

3. **Deploy**
   ```bash
   vercel --prod
   ```

## 📋 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run init-db` - Initialize database schema

## 🔒 Security Features

- ✅ Clerk authentication with MFA support
- ✅ API route protection
- ✅ Input validation and sanitization
- ✅ File upload size limits (10MB)
- ✅ CORS configuration
- ✅ Environment variable security

## 📱 API Endpoints

### Reports
- `POST /api/reports/generate` - Generate new radiology report
- `GET /api/reports/history` - Get user's report history

### Webhooks
- `POST /api/webhooks/clerk` - Clerk user synchronization

## 🤝 Usage

1. **Sign Up/Login**: Create account or login with existing credentials
2. **Upload Image**: Upload medical image (JPEG, PNG, DICOM)
3. **Generate Report**: AI analyzes the image and generates comprehensive report
4. **Review Results**: View detailed findings, impressions, and recommendations
5. **Download Reports**: Save reports as text files
6. **Track History**: Access all previous reports in history tab

## ⚠️ Medical Disclaimer

**Important**: This application generates AI-assisted radiology reports that are intended for use as a diagnostic aid only. All AI-generated reports must be reviewed and validated by qualified medical professionals before any clinical decisions are made. The AI analysis should never replace professional medical judgment.

## 🆘 Support

For technical support or questions about RadMed, please contact:
- **MAJD AI Support**: support@majdai.com
- **Documentation**: [docs.majdai.com/radmed](https://docs.majdai.com/radmed)

## 📄 License

© 2024 MAJD AI. All rights reserved.

---

**RadMed** - Transforming Medical Imaging with AI-Powered Precision
