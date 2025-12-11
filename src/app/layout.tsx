import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    default: 'ReWise — Learn Smarter with AI',
    template: '%s | ReWise',
  },
  description: 'Practice, interview, debate and reason — powered by AI.',
  openGraph: {
    title: 'ReWise — Learn Smarter with AI',
    description: 'An educational practice platform that uses AI to create interactive learning experiences.',
    url: 'https://rewisedemo.com', // Replace with your actual domain
    siteName: 'ReWise',
    images: [
      {
        url: 'https://picsum.photos/seed/rewisepreview/1200/630', // Replace with your actual OG image
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ReWise — Learn Smarter with AI',
    description: 'Practice, interview, debate and reason — powered by AI.',
    // Replace with your Twitter handle
    // creator: '@yourtwitterhandle', 
    images: ['https://picsum.photos/seed/rewisepreview/1200/630'], // Replace with your actual OG image
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-dvh flex-col bg-background">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
