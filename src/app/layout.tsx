import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Financial Analysis Calculator',
  description: 'Modern web-based calculator with AI insights and real-time market data',
  keywords: ['finance', 'calculator', 'investment', 'AI', 'stocks', 'analysis'],
  authors: [{ name: 'Financial Analysis Team' }],
  openGraph: {
    title: 'Financial Analysis Calculator',
    description: 'Advanced financial tools with AI-powered insights',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${inter.className} bg-background text-foreground antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}