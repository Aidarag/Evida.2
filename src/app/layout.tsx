import type { Metadata } from 'next';
import './globals.css';
import { UserProvider } from '@/lib/context/UserContext';
import { EventProvider } from '@/lib/context/EventContext';

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Syne:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-white text-gray-900 min-h-screen selection:bg-[#FD5C05] selection:text-white">
        <UserProvider>
          <EventProvider>
            {children}
          </EventProvider>
        </UserProvider>
      </body>
    </html>
  );
}
