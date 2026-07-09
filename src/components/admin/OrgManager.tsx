'use client';

import React, { useState } from 'react';
import { Organization } from '@/lib/types';
import { Building, ShieldCheck, ShieldAlert, Plus, Users, Search, Sparkles } from 'lucide-react';

interface OrgManagerProps {
  organizations: Organization[];
  onToggleVerify: (id: string) => Promise<void>;
  onCreateOrg: (orgData: { name: string; description: string; logoColor: string }) => Promise<void>;
}

export default function OrgManager({
  organizations,
  onToggleVerify,
  onCreateOrg,
}: OrgManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logoColor, setLogoColor] = useState('indigo');
  const [creating, setCreating] = useState(false);

  const filteredOrgs = organizations.filter((org) =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) return;
    setCreating(true);
    try {
      await onCreateOrg({ name, description, logoColor });
      setName('');
      setDescription('');
      setLogoColor('indigo');
    } catch (error) {
      console.error(error);
    } finally {
      setCreating(false);
    }
  };

  const getBadgeColor = (color: string) => {
    switch (color) {
      case 'emerald': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25';
      case 'sky': return 'bg-sky-500/10 text-sky-400 border-sky-500/25';
      case 'rose': return 'bg-rose-500/10 text-rose-400 border-rose-500/25';
      case 'amber': return 'bg-amber-500/10 text-amber-400 border-amber-500/25';
      case 'violet': return 'bg-violet-500/10 text-violet-400 border-violet-500/25';
      default: return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/25';
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* List of Orgs */}
      <div className="md:col-span-2 space-y-4">
        {/* Search */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <h3 className="text-sm font-bold text-[#4B5563] uppercase tracking-wider flex items-center gap-1.5">
            <Building className="h-4 w-4 text-indigo-400" />
            Registered Campus Groups ({organizations.length})
          </h3>
          
          <div className="relative w-64">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-3.5 w-3.5 text-slate-500" />
            </div>
            <input
              type="text"
              placeholder="Search organizations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-900/50 py-1.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Orgs List */}
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredOrgs.map((org) => (
            <div
              key={org.id}
              className="rounded-2xl border border-white/5 bg-slate-900/40 p-5 space-y-4 shadow-sm hover:border-white/10 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* Circle Color Tag */}
                    <div className={`h-3 w-3 rounded-full bg-current ${org.logoColor === 'emerald' ? 'text-emerald-400' : org.logoColor === 'sky' ? 'text-sky-400' : org.logoColor === 'rose' ? 'text-rose-400' : org.logoColor === 'amber' ? 'text-amber-400' : org.logoColor === 'violet' ? 'text-violet-400' : 'text-indigo-400'}`} />
                    <h4 className="text-sm font-bold text-white leading-tight">{org.name}</h4>
                  </div>

                  <span className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase border ${
                    org.verified
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {org.verified ? 'Verified' : 'Pending'}
                  </span>
                </div>

                <p className="text-xs text-[#4B5563] mt-2 line-clamp-3">
                  {org.description}
                </p>
              </div>

              {/* Members count and Verify button */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-slate-500 font-semibold">
                  <Users className="h-3.5 w-3.5" />
                  {org.members.length} {org.members.length === 1 ? 'member' : 'members'}
                </span>

                <button
                  onClick={() => onToggleVerify(org.id)}
                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-bold border transition-all cursor-pointer ${
                    org.verified
                      ? 'bg-rose-500/15 text-rose-400 border-rose-500/25 hover:bg-rose-500/25'
                      : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/25'
                  }`}
                >
                  {org.verified ? (
                    <>
                      <ShieldAlert className="h-3 w-3" /> Revoke
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-3 w-3" /> Verify Group
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Register Org form */}
      <div className="md:col-span-1">
        <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-5 space-y-4 shadow-lg">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Plus className="h-4 w-4 text-indigo-400" />
              Register New Organization
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Instantly seed a student group or athletic club on campus.
            </p>
          </div>

          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Club Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Chess Club, Drama Society"
                className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Club Description *</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is the group's purpose?"
                className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Brand Color</label>
              <select
                value={logoColor}
                onChange={(e) => setLogoColor(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="indigo">Indigo</option>
                <option value="emerald">Emerald</option>
                <option value="sky">Sky Blue</option>
                <option value="rose">Rose Red</option>
                <option value="amber">Amber Yellow</option>
                <option value="violet">Violet Purple</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={creating || !name || !description}
              className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/10 transition-all cursor-pointer"
            >
              {creating ? 'Creating...' : 'Register Group'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
