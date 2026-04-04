'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUpPage() {
  const router = useRouter();
  const [maxDate, setMaxDate] = useState('');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setMaxDate(today);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('full-name').value.trim();
    const dob = document.getElementById('dob').value;
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password.length < 8) {
      alert('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (!dob) {
      alert('Please enter your date of birth.');
      return;
    }

    const dobDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - dobDate.getFullYear();
    if (
      age < 10 ||
      (age === 10 && today < new Date(dobDate.setFullYear(dobDate.getFullYear() + 10)))
    ) {
      alert('You must be at least 10 years old to sign up.');
      return;
    }

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, dob, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Signup failed.');
        return;
      }

      alert(data.message || 'Signup successful!');
      router.push('/login');
    } catch (error) {
      console.error('Signup error:', error);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-300 via-pink-100 to-indigo-300 text-gray-900 relative">
      <Link
        href="/"
        className="back-button absolute top-5 left-5 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg text-sm inline-flex items-center no-underline z-50"
      >
        ← Home
      </Link>

      <div className="signup-container bg-white p-8 rounded-xl shadow-lg w-full max-w-md border-t-4 border-pink-500">
        <h2 className="text-pink-500 font-bold text-2xl text-center mb-1">
          Create your FocusFlow Account
        </h2>
        <p className="text-center text-gray-600 mb-6">Sign up to get started</p>

        <form id="signup-form" onSubmit={handleSubmit}>
          <label className="block mb-1 font-semibold text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="full-name"
            placeholder="Enter your full name"
            required
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-base"
          />

          <label className="block mb-1 font-semibold text-gray-700">
            Date of Birth
          </label>
          <input
            type="date"
            id="dob"
            required
            max={maxDate}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-base"
          />

          <label className="block mb-1 font-semibold text-gray-700">Email</label>
          <input
            type="email"
            id="signup-email"
            placeholder="Enter your email"
            required
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-base"
          />

          <label className="block mb-1 font-semibold text-gray-700">
            Password <span className="text-gray-500 text-xs">(min 8 characters)</span>
          </label>
          <input
            type="password"
            id="signup-password"
            placeholder="Enter password"
            required
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-base"
          />

          <label className="block mb-1 font-semibold text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirm-password"
            placeholder="Confirm password"
            required
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-base"
          />

          <button
            type="submit"
            className="w-full p-3 bg-pink-500 text-white rounded-full font-bold text-base hover:bg-pink-600 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600 login-link">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}