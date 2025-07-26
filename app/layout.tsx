import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'RadMed - AI Radiology Platform by MAJD AI',
  description: 'Revolutionary AI-powered radiology report generation for medical professionals',
  keywords: 'radiology, AI, medical imaging, healthcare, MAJD AI',
  authors: [{ name: 'MAJD AI' }],
  icons: {
    icon: '/pnglogo.png',
    shortcut: '/pnglogo.png',
    apple: '/pnglogo.png',
  },
  openGraph: {
    title: 'RadMed - AI Radiology Platform',
    description: 'Revolutionary AI-powered radiology report generation for medical professionals',
    images: ['/pnglogo.png'],
  },
  metadataBase: new URL('https://radmed.windsurf.build'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {children}
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
