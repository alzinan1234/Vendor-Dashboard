"use client";

import React, { useState } from 'react';

export default function ReplyModal({ review, onClose, onSubmit }) {
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!replyText.trim()) {
      return;
    }

    setSubmitting(true);
    await onSubmit(replyText);
    setSubmitting(false);
  };

  const renderStars = (rating) => {
    const rateValue = rating?.rate || rating || 0;
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-4 h-4 ${i < rateValue ? 'text-[#FDA800]' : 'text-gray-500'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
        </svg>
      );
    }
    return stars;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-[#2A2A2A] rounded-lg shadow-xl w-full max-w-lg border border-gray-600">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
          <h2 className="text-xl font-semibold text-white">Reply to Review</h2>
          <button
            onClick={onClose}
            disabled={submitting}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Review Content */}
        <div className="p-6 border-b border-gray-600">
          <div className="flex items-center gap-2 mb-3">
            {renderStars(review.rate)}
          </div>
          <p className="text-gray-300 text-sm mb-3">{review.text}</p>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>By {review.user?.name || review.user?.email || 'Anonymous'}</span>
            <span>•</span>
            <span>{new Date(review.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Reply Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <label htmlFor="reply" className="block text-sm font-medium text-gray-300 mb-2">
            Your Reply
          </label>
          <textarea
            id="reply"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows="4"
            className="w-full p-3 bg-[#343434] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00C1C9] focus:ring-1 focus:ring-[#00C1C9] resize-none"
            placeholder="Write your reply here..."
            disabled={submitting}
            required
          />
          
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !replyText.trim()}
              className="px-4 py-2 bg-[#00C1C9] text-white rounded-lg hover:bg-[#00A8B0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Sending...' : 'Send Reply'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}