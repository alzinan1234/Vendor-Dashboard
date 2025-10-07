"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from "react-hot-toast";

export default function PromotionSetupModal({ onClose, onSave, initialData = null }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      console.log('Editing promotion:', initialData);
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setStartDate(initialData.start_date || '');
      setEndDate(initialData.end_date || '');
      setImagePreview(initialData.image || '');
    } else {
      // Reset form for new promotion
      setTitle('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setImageFile(null);
      setImagePreview('');
    }
  }, [initialData]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      toast.error('Please enter a title', {
        duration: 3000,
        icon: '⚠️',
      });
      return;
    }

    if (!description.trim()) {
      toast.error('Please enter a description', {
        duration: 3000,
        icon: '⚠️',
      });
      return;
    }

    if (!startDate) {
      toast.error('Please select a start date', {
        duration: 3000,
        icon: '📅',
      });
      return;
    }

    if (!endDate) {
      toast.error('Please select an end date', {
        duration: 3000,
        icon: '📅',
      });
      return;
    }

    // Date validation
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end < start) {
      toast.error('End date cannot be before start date', {
        duration: 3000,
        icon: '⚠️',
      });
      return;
    }

    if (!initialData && !imageFile) {
      toast.error('Please upload an image', {
        duration: 3000,
        icon: '📷',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await onSave({
        title,
        description,
        startDate,
        endDate,
        imageFile,
        id: initialData ? initialData.id : null
      });

      // Clear form only if not editing
      if (!initialData) {
        setTitle('');
        setDescription('');
        setStartDate('');
        setEndDate('');
        setImageFile(null);
        setImagePreview('');
      }
    } catch (error) {
      console.error('Error submitting promotion:', error);
      toast.error('An unexpected error occurred', {
        duration: 4000,
        icon: '❌',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="md:w-[1118px] bg-[#343434] rounded-lg shadow-lg p-6 text-white relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-teal-400 hover:text-teal-300 bg-[#00C1C91A] rounded-full p-2 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <h1 className="ml-4 text-[20px] font-semibold">
            {initialData ? 'Edit Promotion' : 'Add New Promotion'}
          </h1>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="promotion-title" className="block mb-1 text-sm">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="promotion-title"
              placeholder="Enter title"
              className="w-full rounded border border-[#CACACA] px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-transparent"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="promotion-description" className="block mb-1 text-sm">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="promotion-description"
              placeholder="Enter description"
              rows="4"
              className="w-full rounded border border-[#CACACA] px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-transparent"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="start-date" className="block mb-1 text-sm">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="start-date"
                className="w-full rounded border border-[#CACACA] px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 bg-transparent"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="end-date" className="block mb-1 text-sm">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="end-date"
                className="w-full rounded border border-[#CACACA] px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 bg-transparent"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label htmlFor="promotion-image" className="block mb-1 text-sm">
              Upload Image {!initialData && <span className="text-red-500">*</span>}
            </label>
            <div className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#CACACA] rounded-md cursor-pointer bg-transparent hover:border-teal-500 transition-colors duration-200">
              <input
                type="file"
                id="promotion-image"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isSubmitting}
              />
              <label htmlFor="promotion-image" className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="max-h-32 object-contain" />
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-gray-400 mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    <span className="text-gray-400">Upload Image</span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Done Button */}
          <button
            type="submit"
            className={`w-full mt-6 rounded-full bg-cyan-400 hover:bg-cyan-300 text-white py-2 font-medium border-b-4 border-lime-400 transition-opacity ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : (initialData ? 'Update Promotion' : 'Create Promotion')}
          </button>
        </form>
      </div>
    </div>
  );
}