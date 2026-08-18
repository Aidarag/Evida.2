import type { Metadata } from 'next';
import './globals.css';
import { UserProvider } from '@/lib/context/UserContext';
import { EventProvider } from '@/lib/context/EventContext';

export const metadata: Metadata = {
  title: 'Evida — The Digital Home of Campus Life',
  description:
    'Discover, create, attend, and remember campus experiences in one place. Evida helps students discover campus events and helps schools manage engagement.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Evida — The Digital Home of Campus Life',
    description:
      'Discover, create, attend, and remember campus experiences in one place.',
    url: 'https://evida.app',
    siteName: 'Evida',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 675,
        alt: 'Evida App Preview — The Digital Home of Campus Life',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Evida — The Digital Home of Campus Life',
    description:
      'Discover, create, attend, and remember campus experiences in one place.',
    images: ['/og-image.jpg'],
  },
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
