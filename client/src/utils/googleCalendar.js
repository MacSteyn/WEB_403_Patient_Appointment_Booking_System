// Google Calendar Integration
// Uses Google Calendar API to add appointments

const CALENDAR_API = 'https://www.googleapis.com/calendar/v3';

// Load Google Identity Services
export const loadGoogleAuth = () => {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts) { resolve(); return; }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// Request calendar access token
export const getCalendarToken = () => {
  return new Promise((resolve, reject) => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      reject(new Error('VITE_GOOGLE_CLIENT_ID not set in client/.env'));
      return;
    }

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/calendar.events',
      callback: (response) => {
        if (response.error) reject(new Error(response.error));
        else resolve(response.access_token);
      },
    });

    tokenClient.requestAccessToken();
  });
};

// Add appointment to Google Calendar
export const addToGoogleCalendar = async (appointment, doctorName) => {
  const token = await getCalendarToken();

  const appointmentDate = new Date(appointment.date);
  const [hours, minutes] = appointment.time.split(':').map(Number);
  appointmentDate.setHours(hours, minutes, 0, 0);

  const endDate = new Date(appointmentDate);
  endDate.setMinutes(endDate.getMinutes() + 30); // 30 min appointment

  const event = {
    summary: `Medical Appointment — Dr. ${doctorName}`,
    description: `Reason: ${appointment.reason}\nType: ${appointment.type}\n\nBooked via MediBook`,
    start: {
      dateTime: appointmentDate.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 }, // 1 day before
        { method: 'popup', minutes: 60 },       // 1 hour before
      ],
    },
    colorId: '11', // Red color for medical appointments
  };

  const response = await fetch(`${CALENDAR_API}/calendars/primary/events`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Failed to add to Google Calendar');
  }

  const data = await response.json();
  return data.htmlLink; // Link to the calendar event
};
