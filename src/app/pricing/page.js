'use client';

import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-300 via-pink-100 to-purple-300 text-gray-900 p-8">
      <h1 className="text-4xl font-bold text-center text-purple-800 mb-12">Choose Your Plan</h1>

      <div className="flex flex-wrap justify-center gap-8">
        {/* Free Plan */}
        <div className="bg-white rounded-2xl p-8 w-80 shadow-lg border-t-4 border-green-500 hover:-translate-y-1 transition-transform duration-300 free">
          <h2 className="text-2xl font-semibold mb-2">🎓 Free Plan</h2>
          <p className="text-gray-600 mb-4">Basic study planning & task tracking.</p>
          <ul className="text-gray-700 mb-6 space-y-2 list-none pl-0">
            <li className="relative pl-5 before:content-['✓'] before:absolute before:left-0 before:text-green-500">AI Study Planner (Basic)</li>
            <li className="relative pl-5 before:content-['✓'] before:absolute before:left-0 before:text-green-500">Task & Assignment Tracking</li>
            <li className="relative pl-5 before:content-['❌'] before:absolute before:left-0 before:text-red-500">Progress Analytics</li>
            <li className="relative pl-5 before:content-['❌'] before:absolute before:left-0 before:text-red-500">Premium Resources</li>
          </ul>
          <Link
            href="/signup"
            className="block text-center font-bold bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600 transition-colors"
          >
            Sign Up Free
          </Link>
        </div>

        {/* Premium Plan */}
        <div className="bg-white rounded-2xl p-8 w-80 shadow-lg border-t-4 border-yellow-400 hover:-translate-y-1 transition-transform duration-300 premium">
          <h2 className="text-2xl font-semibold mb-2">💎 Premium Plan</h2>
          <p className="text-gray-600 mb-4">Unlock AI planning, analytics & more.</p>
          <ul className="text-gray-700 mb-6 space-y-2 list-none pl-0">
            <li className="relative pl-5 before:content-['✓'] before:absolute before:left-0 before:text-green-500">AI Study Planner (Advanced)</li>
            <li className="relative pl-5 before:content-['✓'] before:absolute before:left-0 before:text-green-500">Task & Assignment Tracking</li>
            <li className="relative pl-5 before:content-['✓'] before:absolute before:left-0 before:text-green-500">Progress Analytics</li>
            <li className="relative pl-5 before:content-['✓'] before:absolute before:left-0 before:text-green-500">Premium Resources</li>
          </ul>
          <Link
            href="/signup"
            className="block text-center font-bold bg-yellow-400 text-gray-900 py-2 px-4 rounded-full hover:bg-yellow-500 transition-colors"
          >
            Go Premium
          </Link>
        </div>
      </div>
    </div>
  );
}