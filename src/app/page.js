'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  useEffect(() => {
    const loginLogoutBtn = document.getElementById('login-logout-button');
    if (localStorage.getItem('isLoggedIn') === 'true') {
      loginLogoutBtn.textContent = 'Logout';
      loginLogoutBtn.href = '#';
      loginLogoutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('loggedInUserName');
        alert('You have been logged out.');
        location.reload();
      });
    }
  }, []);

  return (
    <div className="text-gray-900 font-sans bg-gradient-to-r from-pink-200 via-pink-100 to-purple-200">
      {/* Header */}
      <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
          <div className="flex items-center">
            <img src="/logo2.png" alt="FocusFlow Logo" className="h-12" />
            <span className="ml-2 text-xl font-semibold text-pink-500">FocusFlow</span>
          </div>
          <nav>
            <ul className="flex gap-6 list-none m-0 p-0">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/dashboard">Dashboard</Link></li>
              <li><Link href="/study-planner">Study Planner</Link></li>
              <li><Link href="/tasks">Tasks</Link></li>
              <li><Link href="/notes">Notes</Link></li>
              <li><Link href="/feedback">Feedback</Link></li>
              <li>
                <Link
                  href="/login"
                  id="login-logout-button"
                  className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition"
                >
                  Login
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-white text-center py-40 px-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 mt-20">
        <h1 className="text-5xl font-bold">Stay Organized & Ace Your Studies!</h1>
        <p className="mt-4 text-lg">Plan your studies, track progress, and boost productivity with FocusFlow.</p>
        <Link
          href="/dashboard"
          className="mt-6 inline-block bg-white text-pink-500 font-semibold py-3 px-6 rounded-full hover:bg-gray-200 transition"
        >
          Get Started
        </Link>
      </section>

      {/* Features */}
      <section className="text-center py-16 px-4">
        <h2 className="text-4xl font-bold text-pink-500 mb-10">Why Choose FocusFlow?</h2>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-pink-500 w-80">
            <h3 className="text-2xl font-semibold">📅 Study Planner</h3>
            <p className="mt-2 text-gray-600">Smart scheduling & personalized study plans.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-blue-500 w-80">
            <h3 className="text-2xl font-semibold">✅ Task & Assignment Tracker</h3>
            <p className="mt-2 text-gray-600">Organize tasks with deadlines & priority levels.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-purple-500 w-80">
            <h3 className="text-2xl font-semibold">📊 Progress Analytics</h3>
            <p className="mt-2 text-gray-600">Visual insights into your study patterns.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-r from-purple-100 to-pink-100 py-16 px-4 text-center">
        <h2 className="text-4xl font-bold text-blue-500 mb-10">What Our Users Say</h2>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <p className="text-lg text-gray-800">&quot;FocusFlow helped me manage my studies efficiently! Highly recommended.&quot; – Noor</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <p className="text-lg text-gray-800">&quot;AI study suggestions made my planning so much easier!&quot; – Nayab</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="text-center py-16 px-4">
        <h2 className="text-4xl font-bold text-purple-500 mb-10">Choose Your Plan</h2>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-green-500 w-80">
            <h3 className="text-2xl font-semibold">🎓 Free Plan</h3>
            <p className="mt-2 text-gray-600">Basic study planning & task tracking.</p>
            <Link href="/signup" className="mt-4 block bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600">Sign Up Free</Link>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-yellow-500 w-80">
            <h3 className="text-2xl font-semibold">💎 Premium Plan</h3>
            <p className="mt-2 text-gray-600">Unlock AI planning, analytics & more.</p>
            <Link href="/pricing" className="mt-4 block bg-yellow-500 text-white py-2 px-4 rounded-full hover:bg-yellow-600">Go Premium</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <p className="m-0">© 2025 FocusFlow. All rights reserved.</p>
          <p className="m-0 text-right">📧 Contact Us: support@FocusFlow.com</p>
        </div>
      </footer>
    </div>
  );
}
