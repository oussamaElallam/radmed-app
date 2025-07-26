# RadMed Backend Integration Guide
## MAJD AI Radiology Platform

This guide shows how to integrate RadMed frontend with real backend services (Clerk, Neon, Gemini 2.5 Pro).

---

## 📦 Installation & Setup

### 1. Install Dependencies
```bash
npm install @clerk/nextjs @neondatabase/serverless @google/generative-ai
npm install @types/node dotenv
```

### 2. Environment Variables
Create `.env.local`:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret

# Neon Database
DATABASE_URL=postgresql://username:password@your-neon-db.neon.tech/radmed?sslmode=require

# Google Gemini API
GOOGLE_API_KEY=your_gemini_api_key

# App Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🔐 Clerk Authentication Setup

### `pages/_app.js` or `app/layout.js`
```javascript
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```

### Updated Authentication Component
```javascript
import { useUser, SignInButton, SignOutButton, SignUpButton } from '@clerk/nextjs'

const AuthComponent = () => {
  const { isSignedIn, user, isLoaded } = useUser()

  if (!isLoaded) return <div>Loading...</div>

  if (!isSignedIn) {
    return (
      <div className="auth-container">
        <SignInButton mode="modal">
          <button className="btn-primary">Sign In</button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="btn-secondary">Sign Up</button>
        </SignUpButton>
      </div>
    )
  }

  return (
    <div className="user-profile">
      <span>Hello, {user.firstName}!</span>
      <SignOutButton>
        <button className="btn-logout">Sign Out</button>
      </SignOutButton>
    </div>
  )
}
```

---

## 🗄️ Neon Database Schema

### Database Setup
```sql
-- Create users table (synced with Clerk)
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  medical_license TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create reports table
CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(clerk_id),
  patient_id TEXT NOT NULL,
  image_url TEXT,
  image_filename TEXT,
  report_content TEXT,
  modality TEXT,
  status TEXT DEFAULT 'pending_review',
  ai_confidence DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_created_at ON reports(created_at);
```

### Database Connection
```javascript
// lib/db.js
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

export default sql
```

---

## 🤖 Gemini AI Integration

### AI Service Setup
```javascript
// lib/gemini.js
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)

export async function generateRadiologyReport(imageData, clinicalHistory = '') {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" })
    
    const prompt = `
    You are an expert radiologist. Analyze this medical image and generate a comprehensive radiology report.
    
    Clinical History: ${clinicalHistory}
    
    Please provide:
    1. Patient Information section
    2. Findings section (detailed analysis)
    3. Impression section (summary/diagnosis)
    4. Recommendations section
    
    Format as a professional radiology report.
    `

    const imagePart = {
      inlineData: {
        data: imageData,
        mimeType: "image/jpeg"
      }
    }

    const result = await model.generateContent([prompt, imagePart])
    const response = await result.response
    const text = response.text()

    return {
      success: true,
      report: text,
      confidence: 0.95 // You can implement confidence scoring
    }
  } catch (error) {
    console.error('Gemini API Error:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
```

---

## 🚀 API Routes (Next.js)

### `pages/api/reports/generate.js`
```javascript
import { auth } from '@clerk/nextjs'
import sql from '../../../lib/db'
import { generateRadiologyReport } from '../../../lib/gemini'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { userId } = auth(req)
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { imageData, patientId, modality, clinicalHistory } = req.body

    // Generate AI report
    const aiResult = await generateRadiologyReport(imageData, clinicalHistory)
    
    if (!aiResult.success) {
      return res.status(500).json({ error: 'AI generation failed' })
    }

    // Save to database
    const result = await sql`
      INSERT INTO reports (user_id, patient_id, report_content, modality, ai_confidence, status)
      VALUES (${userId}, ${patientId}, ${aiResult.report}, ${modality}, ${aiResult.confidence}, 'pending_review')
      RETURNING id, created_at
    `

    res.status(200).json({
      success: true,
      report: aiResult.report,
      reportId: result[0].id,
      createdAt: result[0].created_at
    })

  } catch (error) {
    console.error('Generate report error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
```

### `pages/api/reports/history.js`
```javascript
import { auth } from '@clerk/nextjs'
import sql from '../../../lib/db'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { userId } = auth(req)
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const reports = await sql`
      SELECT id, patient_id, modality, status, ai_confidence, created_at, 
             LEFT(report_content, 200) as preview
      FROM reports 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 50
    `

    res.status(200).json({ reports })

  } catch (error) {
    console.error('Get reports error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
```

### `pages/api/webhooks/clerk.js` (User Sync)
```javascript
import { Webhook } from 'svix'
import sql from '../../../lib/db'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  const payload = JSON.stringify(req.body)
  const headers = req.headers

  const wh = new Webhook(WEBHOOK_SECRET)
  let evt

  try {
    evt = wh.verify(payload, headers)
  } catch (err) {
    return res.status(400).json({ error: 'Webhook verification failed' })
  }

  if (evt.type === 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data

    await sql`
      INSERT INTO users (clerk_id, email, first_name, last_name)
      VALUES (${id}, ${email_addresses[0].email_address}, ${first_name}, ${last_name})
      ON CONFLICT (clerk_id) DO NOTHING
    `
  }

  res.status(200).json({ success: true })
}
```

---

## 🖼️ Image Upload & Storage

### File Upload Service
```javascript
// lib/upload.js
export async function uploadToCloudinary(file) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'radmed_images')
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData
    }
  )
  
  return response.json()
}

// Convert file to base64 for Gemini
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
  })
}
```

---

## 🔧 Updated Frontend Hooks

### Custom Hooks for Backend Integration
```javascript
// hooks/useReports.js
import { useState } from 'react'
import { useUser } from '@clerk/nextjs'

export function useReports() {
  const [loading, setLoading] = useState(false)
  const [reports, setReports] = useState([])
  const { user } = useUser()

  const generateReport = async (imageFile, patientId, modality) => {
    setLoading(true)
    
    try {
      const imageData = await fileToBase64(imageFile)
      
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageData,
          patientId,
          modality
        })
      })

      const result = await response.json()
      
      if (result.success) {
        await fetchReports() // Refresh list
        return result
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Generate report error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports/history')
      const data = await response.json()
      setReports(data.reports)
    } catch (error) {
      console.error('Fetch reports error:', error)
    }
  }

  return {
    reports,
    loading,
    generateReport,
    fetchReports
  }
}
```

---

## 🚀 Deployment Checklist

### 1. Vercel Deployment
```bash
npm install -g vercel
vercel --prod
```

### 2. Environment Variables (Production)
- Set all env vars in Vercel dashboard
- Update NEXT_PUBLIC_APP_URL to production URL
- Configure Clerk production instance
- Set up Neon production database

### 3. Clerk Configuration
- Add production domain to Clerk dashboard
- Set up webhooks endpoint: `https://yourapp.com/api/webhooks/clerk`
- Configure sign-in/sign-up redirects

### 4. Database Migration
```bash
# Run migration on Neon production
psql $DATABASE_URL -f schema.sql
```

---

## 🔒 Security Best Practices

1. **API Route Protection**: Always verify Clerk auth in API routes
2. **Input Validation**: Validate all inputs server-side
3. **Rate Limiting**: Implement rate limiting for AI generation
4. **File Upload Security**: Validate file types and sizes
5. **Environment Variables**: Never expose secrets in frontend
6. **CORS Configuration**: Restrict to your domain only

---

This complete integration transforms your RadMed frontend into a fully functional production application! 🚀