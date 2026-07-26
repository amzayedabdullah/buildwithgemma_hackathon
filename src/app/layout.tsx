import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Hisab.AI (হিসাব.এআই) - Spoken Bangla Micro-Business Ledger',
  description:
    'Voice-First Micro-Business Baki Ledger powered by Google Gemma for 15M+ shopkeepers in Bangladesh.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="font-['Hind_Siliguri','Inter',sans-serif] bg-slate-950 text-slate-100 min-h-screen"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
