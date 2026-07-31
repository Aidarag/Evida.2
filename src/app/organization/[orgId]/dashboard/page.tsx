"use client";
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CreateEventModal from '@/components/student/CreateEventModal';
import { useUser } from '@/lib/context/UserContext';

// Import tab components (to be created separately)
import EventsTab from './EventsTab';
import MembersTab from './MembersTab';
import AnnouncementsTab from './AnnouncementsTab';
import ProfileTab from './ProfileTab';
import SettingsTab from './SettingsTab';

export default function OrgDashboard() {
  const { orgId } = useParams();
  const { activeProfile } = useUser();
  const router = useRouter();

  // Guard: ensure user is on their organization dashboard
  if (activeProfile.type !== 'organization' || activeProfile.orgId !== orgId) {
    router.replace('/student/dashboard');
    return null;
  }

  const tabs = ['Events', 'Members', 'Announcements', 'Profile', 'Settings'];
  const [currentTab, setCurrentTab] = useState(tabs[0]);
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  const renderTab = () => {
    switch (currentTab) {
      case 'Events':
        return <EventsTab orgId={orgId as string} onCreate={() => setShowCreateEvent(true)} />;
      case 'Members':
        return <MembersTab orgId={orgId as string} />;
      case 'Announcements':
        return <AnnouncementsTab />;
      case 'Profile':
        return <ProfileTab />;
      case 'Settings':
        return <SettingsTab />;
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#2A2621] font-sans p-8">
      <header className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
          {activeProfile.name}'s Organization Dashboard
        </h1>
      </header>

      {/* Tab navigation */}
      <nav className="flex gap-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setCurrentTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              currentTab === tab
                ? 'bg-[#FD5C05] text-white'
                : 'bg-white text-[#2A2621] hover:bg-[#FD5C05]/10'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      <section className="bg-white rounded-xl p-6 shadow-sm">{renderTab()}</section>

      {/* Event creation modal */}
      {showCreateEvent && (
        <CreateEventModal
          isOpen={showCreateEvent}
          onClose={() => setShowCreateEvent(false)}
          currentUser={useUser().currentUser!}
          organizations={[]}
          onSubmit={async (payload) => {
            await fetch(`/api/events`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...payload, organizationId: orgId }),
            });
          }}
        />
      )}
    </main>
  );
}

