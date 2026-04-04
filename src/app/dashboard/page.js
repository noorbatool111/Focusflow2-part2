'use client'; // enables useEffect for client-side rendering

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const name = localStorage.getItem('loggedInUserName');
    if (!loggedIn || !name) {
      window.location.href = '/login';
    } else {
      setIsLoggedIn(true);
      setFullName(name);
    }
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('loggedInUserName');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#ffecd2] to-[#fcb69f] text-gray-900 font-sans">
      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
          <div className="flex items-center">
            <img src="/logo2.png" alt="FocusFlow Logo" className="h-12" />
            <span className="ml-2 text-pink-500 font-semibold text-xl">FocusFlow</span>
          </div>
          <nav>
            <ul className="flex items-center gap-6 list-none m-0 p-0">
              <li>
                <Link href="/" className="text-gray-900 font-medium hover:text-pink-500">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-900 font-medium hover:text-pink-500">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/study-planner" className="text-gray-900 font-medium hover:text-pink-500">
                  Study Planner
                </Link>
              </li>
              <li>
                <Link href="/tasks" className="text-gray-900 font-medium hover:text-pink-500">
                  Tasks
                </Link>
              </li>
              <li>
                <Link href="/notes" className="text-gray-900 font-medium hover:text-pink-500">
                  Notes
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="text-gray-900 font-medium hover:text-pink-500">
                  Feedback
                </Link>
              </li>
              <li>
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-700 transition"
                  >
                    Logout
                  </button>
                ) : (
                  <Link href="/login" className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-700 transition">
                    Login
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="pt-32 max-w-7xl mx-auto px-6 pb-12">
        <h1 className="text-4xl text-center mb-6 text-blue-500">Welcome to Your Dashboard</h1>
        <p className="text-center text-lg mb-10">Welcome, {fullName}!</p>

        <div className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:-translate-y-1 transition-transform">
            <h3 className="text-pink-500 text-xl mb-2">📅 Study Planner</h3>
            <p className="text-gray-600 mb-4">Create and manage your personalized study schedules.</p>
            <Link href="/study-planner" className="inline-block bg-blue-500 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition">
              Open Planner
            </Link>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:-translate-y-1 transition-transform">
            <h3 className="text-pink-500 text-xl mb-2">✅ Tasks</h3>
            <p className="text-gray-600 mb-4">Track your tasks, deadlines and priorities efficiently.</p>
            <Link href="/tasks" className="inline-block bg-blue-500 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition">
              Manage Tasks
            </Link>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:-translate-y-1 transition-transform">
            <h3 className="text-pink-500 text-xl mb-2">📝 Notes</h3>
            <p className="text-gray-600 mb-4">Take, organize and review your study notes easily.</p>
            <Link href="/notes" className="inline-block bg-blue-500 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition">
              View Notes
            </Link>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:-translate-y-1 transition-transform">
            <h3 className="text-pink-500 text-xl mb-2">💬 Feedback</h3>
            <p className="text-gray-600 mb-4">Share your thoughts to help us improve FocusFlow.</p>
            <Link href="/feedback" className="inline-block bg-blue-500 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition">
              Give Feedback
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-6 mt-12">
        <p>📧 Contact Us: support@FocusFlow.com</p>
        <p>© 2025 FocusFlow. All rights reserved.</p>
      </footer>
    </div>
  );
}