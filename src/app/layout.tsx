import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { UserProvider } from '@/lib/context/UserContext';
import { EventProvider } from '@/lib/context/EventContext';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
});

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
    <html lang="en" className={`${inter.variable}`}>
      <body className="font-sans antialiased bg-[#FFFDE1] text-gray-900 min-h-screen selection:bg-[var(--color-evida-lime)] selection:text-black">
        <UserProvider>
          <EventProvider>
            {children}
          </EventProvider>
        </UserProvider>
      </body>
    </html>
  );
}
