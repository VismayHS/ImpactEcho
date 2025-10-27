import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { WalletProvider } from '@/context/WalletContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CursorGlow from '../components/CursorGlow';
import PageTransition from '../components/PageTransition';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ImpactEcho - AI-Powered Blockchain Charity Platform',
  description: 'Transform charitable giving with AI-verified blockchain transparency. 100% transparent, 0% fees.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <WalletProvider>
            {/* Cursor Reactive Glow Effect */}
            <CursorGlow />
            
            <Navbar />
            <PageTransition>
              <main>
                {children}
              </main>
            </PageTransition>
            <Footer />
            <Toaster position="top-right" />
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
