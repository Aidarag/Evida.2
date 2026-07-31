import React, { useEffect, useState } from 'react';
import { useUser } from '@/lib/context/UserContext';

export default function EventsTab({ orgId, onCreate }: { orgId: string; onCreate: () => void }) {
  const [events, setEvents] = useState<any[]>([]);
  const { currentUser } = useUser();

  useEffect(() => {
    // Fetch events for the organization (placeholder API)
    fetch(`/api/events?orgId=${orgId}`)
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch(() => setEvents([]));
  }, [orgId]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Events</h2>
        <button
          onClick={onCreate}
          className="px-4 py-2 bg-[#FD5C05] text-white rounded-xl text-sm font-bold hover:bg-[#CC3D00]"
        >
          + Create Event
        </button>
      </div>
      {events.length === 0 ? (
        <p className="text-sm text-gray-600">No events found for this organization.</p>
      ) : (
        <ul className="space-y-3">
          {events.map((ev) => (
            <li key={ev.id} className="p-4 bg-white rounded-xl shadow-sm">
              <h3 className="font-bold text-[#2A2621]">{ev.title}</h3>
              <p className="text-xs text-[#5A554E]">{ev.date} • {ev.location}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
