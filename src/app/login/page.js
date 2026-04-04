'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {

    if (localStorage.getItem('isLoggedIn') === 'true') {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Login failed.');
        return;
      }

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('loggedInUser', email);
      localStorage.setItem('loggedInUserName', data.user.fullName);

      alert('Login successful!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-pink-300 via-pink-200 to-purple-200 p-4">
      <Link href="/" className="absolute top-6 left-6 bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-700">← Home</Link>
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border-t-4 border-pink-500">
        <h2 className="text-2xl text-center font-bold text-pink-500 mb-1">Welcome Back!</h2>
        <p className="text-center text-gray-600 mb-6">Login to your FocusFlow account</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className="font-semibold text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            className="w-full p-3 border rounded-lg mb-4 mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            required
          />
          <label htmlFor="password" className="font-semibold text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            className="w-full p-3 border rounded-lg mb-4 mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-pink-500 text-white py-3 rounded-full font-semibold hover:bg-pink-700 transition">Login</button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-600">
          Don&apos;t have an account? <Link href="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
