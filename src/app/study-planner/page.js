'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StudyPlannerPage() {
  const router = useRouter();
  const [studyTime, setStudyTime] = useState('');
  const [countdown, setCountdown] = useState('');
  const [showReset, setShowReset] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    // Redirect if not logged in
    if (typeof window !== 'undefined' && !localStorage.getItem('isLoggedIn')) {
      router.push('/login');
    }
  }, [router]);

  const startCountdown = (targetTime) => {
    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetTime - now;

      if (distance <= 0) {
        clearInterval(timerRef.current);
        setCountdown("📚 It's time to study!");
        alert("⏰ Your study session is starting now!");
        return;
      }

      const hrs = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown(`⏳ Time Left: ${hrs}h ${mins}m ${secs}s`);
    }, 1000);
  };

  const handleTimeChange = (e) => {
    const selected = new Date(e.target.value);
    const now = new Date();

    if (selected <= now) {
      alert("Please select a time in the future!");
      setStudyTime('');
      setCountdown('');
      return;
    }

    setStudyTime(e.target.value);
    setShowReset(true);
    startCountdown(selected.getTime());
  };

  const handleReset = () => {
    clearInterval(timerRef.current);
    setStudyTime('');
    setCountdown('');
    setShowReset(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-300 via-pink-100 to-purple-300 text-gray-900">
      {/* Header */}
      <header className="fixed w-full top-0 left-0 z-50 bg-white shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
          <h2 className="text-2xl font-bold text-pink-500">📅 Study Planner</h2>
          <a
            href="/dashboard"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Back to Dashboard
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto pt-28 px-4 pb-10 animate-fadeIn">
        <h3 className="text-3xl font-bold mb-6">Plan Your Study Sessions</h3>

        {/* Reminder Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-6 hover:scale-[1.01] transition">
          <h3 className="text-xl font-semibold mb-3">⏰ Set Study Reminder</h3>
          <label htmlFor="studyTime" className="block mb-2 text-gray-600">
            Select Study Date & Time:
          </label>
          <input
            type="datetime-local"
            id="studyTime"
            value={studyTime}
            onChange={handleTimeChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 mb-4"
          />
          <p className="text-blue-600 font-semibold">✅ Select your study time and keep this page open to track it!</p>
          {countdown && <p className="text-green-600 font-bold mt-4">{countdown}</p>}
          {showReset && (
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              onClick={handleReset}
            >
              Reset Reminder
            </button>
          )}
        </div>

        {/* Google Calendar Sync */}
        <div className="bg-white p-6 rounded-xl shadow-lg hover:scale-[1.01] transition">
          <h3 className="text-xl font-semibold mb-3">📆 Sync with Google Calendar</h3>
          <p className="mb-4">Click below to open Google Calendar and manually add your study session.</p>
          <a
            href="https://calendar.google.com/calendar/u/0/r/eventedit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
          >
            Open Google Calendar
          </a>
        </div>
      </main>
    </div>
  );
}