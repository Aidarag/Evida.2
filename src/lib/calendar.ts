import { Event } from './types';

function escapeICS(str: string): string {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

export function downloadEventICS(event: Event) {
  const cleanTitle = event.title ? event.title.replace(/[^\w\s-]/gi, '') : 'Event';
  const cleanDesc = escapeICS(event.description || '');
  const cleanLoc = escapeICS(event.location || 'Campus');
  
  const dateStr = (event.date || '').replace(/-/g, '');
  if (!dateStr) return;

  // Format DTSTART
  // Default to 12:00 PM if no time is provided
  let startHour = 12;
  let startMin = 0;
  
  if (event.time) {
    const match = event.time.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (match) {
      let hr = parseInt(match[1], 10);
      const min = parseInt(match[2], 10);
      const ampm = match[3];
      if (ampm) {
        if (ampm.toUpperCase() === 'PM' && hr < 12) hr += 12;
        if (ampm.toUpperCase() === 'AM' && hr === 12) hr = 0;
      }
      startHour = hr;
      startMin = min;
    } else {
      // Fallback for HH:mm direct split
      const parts = event.time.split(':');
      if (parts.length >= 2) {
        startHour = parseInt(parts[0], 10) || 12;
        startMin = parseInt(parts[1], 10) || 0;
      }
    }
  }

  const dtStart = `${dateStr}T${String(startHour).padStart(2, '0')}${String(startMin).padStart(2, '0')}00`;

  // Format DTEND
  let dtEnd = '';
  if (event.endTime) {
    const match = event.endTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (match) {
      let hr = parseInt(match[1], 10);
      const min = parseInt(match[2], 10);
      const ampm = match[3];
      if (ampm) {
        if (ampm.toUpperCase() === 'PM' && hr < 12) hr += 12;
        if (ampm.toUpperCase() === 'AM' && hr === 12) hr = 0;
      }
      dtEnd = `${dateStr}T${String(hr).padStart(2, '0')}${String(min).padStart(2, '0')}00`;
    } else {
      const parts = event.endTime.split(':');
      if (parts.length >= 2) {
        const endHour = parseInt(parts[0], 10) || (startHour + 1);
        const endMin = parseInt(parts[1], 10) || 0;
        dtEnd = `${dateStr}T${String(endHour).padStart(2, '0')}${String(endMin).padStart(2, '0')}00`;
      }
    }
  }

  // Fallback for end time (1 hour after start)
  if (!dtEnd) {
    const endHour = (startHour + 1) % 24;
    const endHourStr = String(endHour).padStart(2, '0');
    const minStr = String(startMin).padStart(2, '0');
    dtEnd = `${dateStr}T${endHourStr}${minStr}00`;
  }

  // Generate DTSTAMP based on current UTC time
  const now = new Date();
  const stampStr = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Evida//Calendar//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${event.id}@evida.app`,
    `DTSTAMP:${stampStr}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${cleanTitle}`,
    `DESCRIPTION:${cleanDesc}`,
    `LOCATION:${cleanLoc}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${cleanTitle.replace(/\s+/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
