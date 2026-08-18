'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FeaturedEventsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/school/dashboard');
  }, [router]);

  return null;
}
