"use client";
import React, { useEffect, useState } from 'react';
import { useUser } from '@/lib/context/UserContext';

export default function MembersTab({ orgId }: { orgId: string }) {
  const [members, setMembers] = useState<any[]>([]);
  const { currentUser } = useUser();

  useEffect(() => {
    // Placeholder fetch for organization members
    fetch(`/api/organizations/${orgId}/members`)
      .then((res) => res.json())
      .then((data) => setMembers(data))
      .catch(() => setMembers([]));
  }, [orgId]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Members</h2>
      {members.length === 0 ? (
        <p className="text-sm text-gray-600">No members found.</p>
      ) : (
        <ul className="space-y-3">
          {members.map((member) => (
            <li key={member.id} className="p-4 bg-white rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#2A2621]">{member.name}</span>
                <span className="text-sm text-[#5A554E]">{member.role}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
