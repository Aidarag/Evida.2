"use client";
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function OrgDashboard() {
  const { orgId } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (orgId) {
      router.replace(`/student/organizations/${orgId}`);
    }
  }, [orgId, router]);

  return null;
}

