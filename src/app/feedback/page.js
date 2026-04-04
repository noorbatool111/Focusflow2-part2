'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FeedbackPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [rating, setRating] = useState('⭐⭐⭐⭐⭐');
  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('isLoggedIn')) {
      router.push('/login');
    }
    fetch('/api/feedback')
      .then((res) => res.json())
      .then((data) => setReviews(data));
  }, [router]);

  const handleSubmit = async () => {
    if (!name.trim() || !review.trim()) {
      alert('Please fill in your name and review before submitting.');
      return;
    }

    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, rating, review }),
    });

    if (res.ok) {
      const newFeedback = await res.json();
      setReviews([newFeedback, ...reviews]);
      setName('');
      setRating('⭐⭐⭐⭐⭐');
      setReview('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-300 via-pink-100 to-indigo-300 text-gray-900">
      <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center px-6 py-4">
          <h2 className="text-xl font-bold text-pink-500">💬 User Feedback</h2>
          <a href="/dashboard" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transform hover:scale-105 transition duration-300">Back to Dashboard</a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto pt-32 pb-12 px-6">
        <h3 className="text-3xl font-bold mb-6">We Value Your Feedback!</h3>

        {showSuccess && (
          <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6 text-center animate-slide-down">🌟 Thank you for your feedback!</div>
        )}

        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-4">📝 Submit Your Feedback</h3>
          <label className="block font-medium mb-1">Your Name:</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-4 py-2 mb-4" placeholder="Enter your name" />

          <label className="block font-medium mb-1">Your Rating:</label>
          <select value={rating} onChange={(e) => setRating(e.target.value)} className="w-full border rounded px-4 py-2 mb-4">
            <option>⭐</option><option>⭐⭐</option><option>⭐⭐⭐</option><option>⭐⭐⭐⭐</option><option>⭐⭐⭐⭐⭐</option>
          </select>

          <label className="block font-medium mb-1">Your Review:</label>
          <textarea value={review} onChange={(e) => setReview(e.target.value)} className="w-full border rounded px-4 py-2 mb-4" placeholder="Write your review..." />

          <button onClick={handleSubmit} className="bg-green-500 text-white py-2 px-5 rounded">Submit Feedback</button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4">🌟 User Reviews</h3>
          {reviews.map((item) => (
            <div key={item._id} className="border-b py-4 animate-fade-in">
              <p><strong>{item.name}:</strong> {item.rating}<br />&quot;{item.review}&quot;</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}