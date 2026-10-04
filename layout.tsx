import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SmartQueue - Government Token & Queue Management System',
  description:
    'Real-time token issuance, counter verification, queue integrity, and staff analytics for public administrative offices with Supabase.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark bg-slate-950 text-slate-100 antialiased">
      <body className={`${inter.className} min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
