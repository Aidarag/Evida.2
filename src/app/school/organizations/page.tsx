'use client';

import React, { useState } from 'react';
import { useEvents } from '@/lib/context/EventContext';
import { useUser } from '@/lib/context/UserContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import EmptyState from '@/components/ui/EmptyState';
import { Building2, Search, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrganizationsPage() {
  const { organizations, toggleVerifyOrg } = useEvents();
  const { currentUser } = useUser();
  const [searchQuery, setSearchQuery] = useState('');

  if (!currentUser || currentUser.role !== 'admin') return null;

  const filteredOrgs = organizations.filter(org => 
    org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 justify-between md:items-end">
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-[#191919] tracking-tight">Organizations</h1>
          <p className="text-sm text-[#374151]">Manage and verify campus student groups.</p>
        </div>
        <div className="w-full md:w-80">
           <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#374151]/50" />
            <Input
              placeholder="Search organizations..."
              className="pl-12 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredOrgs.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-6">
          {filteredOrgs.map((org) => (
            <Card key={org.id} className="p-6 flex flex-col h-full">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br flex items-center justify-center from-${org.logoColor}-500 to-${org.logoColor}-700 shrink-0`}>
                    <span className="font-bold text-[#191919] text-xl">{org.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#191919] leading-snug">{org.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-[#374151]">{org.members.length} members</span>
                      <span className="h-1 w-1 rounded-full bg-[#191919]/25" />
                      {org.verified ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-[#191919] uppercase">
                          <CheckCircle2 className="h-3 w-3" /> Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-[#374151] uppercase">
                          <XCircle className="h-3 w-3" /> Unverified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-[#374151] mt-4 flex-1">
                {org.description}
              </p>

              <div className="pt-5 mt-5 border-t border-black/[0.06] flex justify-end">
                <Button
                  variant={org.verified ? "ghost" : "neon"}
                  size="sm"
                  onClick={() => toggleVerifyOrg(org.id)}
                >
                  {org.verified ? "Revoke Verification" : "Verify Organization"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Building2 className="h-8 w-8 text-[#374151]" />}
          title="No organizations found"
        />
      )}
    </div>
  );
}
