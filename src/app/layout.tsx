import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { UserProvider } from '@/lib/context/UserContext';
import { EventProvider } from '@/lib/context/EventContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Evida — The Digital Home of Campus Life',
  description:
    'Discover, create, attend, and remember campus experiences in one place. Evida helps students discover campus events and helps schools manage engagement.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#08080B] text-white">
        <UserProvider>
          <EventProvider>{children}</EventProvider>
        </UserProvider>
      </body>
    </html>
  );
}
