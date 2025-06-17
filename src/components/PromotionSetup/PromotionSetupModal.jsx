// Assuming this is in the same directory, e.g., pages/PromotionSetupModal.js
"use client"; // This component also needs to be a Client Component

import React, { useState } from "react";
import { ArrowLeftIcon } from '@heroicons/react/24/outline'; // Using Heroicons

export default function PromotionSetupModal({ onClose, onAddPromotion }) {
  // State for form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateRange, setDateRange] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Basic validation (you can expand this)
    if (!title.trim() || !description.trim() || !dateRange.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    // Create a new promotion object
    const newPromotion = {
      id: Date.now(), // Simple unique ID for demo. In real app, backend assigns ID.
      title,
      description,
      schedule: dateRange, // Map dateRange to schedule
      views: 0, // New promotions start with 0 views
    };

    // Call the function passed from the parent to add the new promotion
    onAddPromotion(newPromotion);

    // Clear form fields
    setTitle('');
    setDescription('');
    setDateRange('');

    // Close the modal
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"> {/* Modal Overlay */}
      <div className="md:w-[1118px]  bg-[#343434] rounded-lg shadow-lg p-6 text-white relative"> {/* Modal Content */}
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={onClose} // Call onClose when the back button is clicked
            className="text-teal-400 hover:text-teal-300 bg-[#00C1C91A] rounded-full p-2 transition-colors"
            aria-label="Go back" // Added for accessibility
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <h1 className="ml-4 text-[20px] font-semibold">Add New Promotion</h1>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-6"> {/* Add onSubmit */}
          <div>
            <label htmlFor="promotion-title" className="block mb-1 text-sm">Title</label>
            <input
              type="text"
              id="promotion-title" // Added id for accessibility
              placeholder="Enter title"
              className="w-full rounded border border-[#CACACA]  px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required // Added required attribute
            />
          </div>

          <div>
            <label htmlFor="promotion-description" className="block mb-1 text-sm">Description</label>
            <input
              type="text"
              id="promotion-description" // Added id
              placeholder="Enter description"
              className="w-full rounded border border-[#CACACA]  px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="promotion-date-range" className="block mb-1 text-sm">Date Range</label>
            <input
              type="text"
              id="promotion-date-range" // Added id
              placeholder="Enter date range (e.g., Monday to Friday)"
              className="w-full rounded border border-[#CACACA]  px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              required
            />
          </div>

          {/* Done Button */}
          <button
            type="submit" // Type submit for form submission
            className="w-full mt-[213px] rounded-full bg-cyan-400 hover:bg-cyan-300 text-white py-2 font-medium border-b-4 border-lime-400 transition-colors"
          >
            Done
          </button>
        </form>
      </div>
    </div>
  );
}