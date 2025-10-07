"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const AddBannerModal = ({ isOpen, onClose, onSave, editBanner = null }) => {
  const [formData, setFormData] = useState({
    bannerTitle: "",
    description: "",
    imageUrl: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    link: "",
    location: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editBanner) {
      setFormData({
        bannerTitle: editBanner.banner_title || editBanner.title || "",
        description: editBanner.banner_description || editBanner.description || "",
        imageUrl: editBanner.image || editBanner.imageUrl || "",
        startDate: editBanner.start_date || editBanner.startDate || "",
        startTime: editBanner.start_time || editBanner.startTime || "",
        endDate: editBanner.end_date || editBanner.endDate || "",
        endTime: editBanner.end_time || editBanner.endTime || "",
        link: editBanner.link || "",
        location: editBanner.location || "",
      });
    } else {
      // Reset form for new banner
      setFormData({
        bannerTitle: "",
        description: "",
        imageUrl: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        link: "",
        location: "",
      });
      setImageFile(null);
    }
  }, [editBanner, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation with toast notifications
    if (!formData.bannerTitle.trim()) {
      toast.error('Please enter a banner title', {
        duration: 3000,
        icon: '⚠️',
      });
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('Please enter a description', {
        duration: 3000,
        icon: '⚠️',
      });
      return;
    }

    if (!editBanner && !imageFile) {
      toast.error('Please upload a banner image', {
        duration: 3000,
        icon: '📷',
      });
      return;
    }

    if (!formData.startDate) {
      toast.error('Please select a start date', {
        duration: 3000,
        icon: '📅',
      });
      return;
    }

    if (!formData.endDate) {
      toast.error('Please select an end date', {
        duration: 3000,
        icon: '📅',
      });
      return;
    }

    if (!formData.startTime) {
      toast.error('Please select a start time', {
        duration: 3000,
        icon: '⏰',
      });
      return;
    }

    if (!formData.endTime) {
      toast.error('Please select an end time', {
        duration: 3000,
        icon: '⏰',
      });
      return;
    }

    // Date validation
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    if (endDate < startDate) {
      toast.error('End date cannot be before start date', {
        duration: 3000,
        icon: '⚠️',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await onSave({
        ...formData,
        imageFile: imageFile,
        id: editBanner ? editBanner.id : null
      });

      // Reset form
      setFormData({
        bannerTitle: "",
        description: "",
        imageUrl: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        link: "",
        location: "",
      });
      setImageFile(null);
    } catch (error) {
      console.error('Error submitting banner:', error);
      toast.error('An unexpected error occurred', {
        duration: 4000,
        icon: '❌',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-[#343434] rounded-lg p-10 relative shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          disabled={isSubmitting}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-xl font-semibold mb-6 text-white">
          {editBanner ? 'Edit Banner' : 'Add New Banner'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-full">
            <label htmlFor="bannerTitle" className="block text-gray-300 text-sm font-bold mb-2">
              Banner Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="bannerTitle"
              name="bannerTitle"
              value={formData.bannerTitle}
              onChange={handleChange}
              className="w-full p-3 bg-lightGray rounded-md text-white border border-[#CACACA] focus:outline-none focus:border-teal"
              placeholder="Enter banner title"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="col-span-full">
            <label htmlFor="description" className="block text-gray-300 text-sm font-bold mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full p-3 bg-lightGray rounded-md text-white border border-[#CACACA] focus:outline-none focus:border-teal"
              placeholder="Enter banner description"
              required
              disabled={isSubmitting}
            ></textarea>
          </div>
          <div className="col-span-full">
            <label htmlFor="uploadBanner" className="block text-gray-300 text-sm font-bold mb-2">
              Upload Banner {!editBanner && <span className="text-red-500">*</span>}
            </label>
            <div className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#CACACA] rounded-md cursor-pointer bg-lightGray hover:border-teal transition-colors duration-200">
              <input
                type="file"
                id="uploadBanner"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isSubmitting}
              />
              <label htmlFor="uploadBanner" className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="Banner Preview" className="max-h-32 object-contain" />
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
                    <span className="text-gray-400">Upload</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="startDate" className="block text-gray-300 text-sm font-bold mb-2">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full p-3 bg-lightGray rounded-md text-white border border-[#CACACA] focus:outline-none focus:border-teal"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="startTime" className="block text-gray-300 text-sm font-bold mb-2">
              Start Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full p-3 bg-lightGray rounded-md text-white border border-[#CACACA] focus:outline-none focus:border-teal"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-gray-300 text-sm font-bold mb-2">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full p-3 bg-lightGray rounded-md text-white border border-[#CACACA] focus:outline-none focus:border-teal"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="endTime" className="block text-gray-300 text-sm font-bold mb-2">
              End Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full p-3 bg-lightGray rounded-md text-white border border-[#CACACA] focus:outline-none focus:border-teal"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="col-span-full">
            <label htmlFor="link" className="block text-gray-300 text-sm font-bold mb-2">
              Link
            </label>
            <input
              type="url"
              id="link"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className="w-full p-3 bg-lightGray rounded-md text-white border border-[#CACACA] focus:outline-none focus:border-teal"
              placeholder="https://example.com"
              disabled={isSubmitting}
            />
          </div>
          <div className="col-span-full">
            <label htmlFor="location" className="block text-gray-300 text-sm font-bold mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-3 bg-lightGray rounded-md text-white border border-[#CACACA] focus:outline-none focus:border-teal"
              placeholder="Luna Lounge, Downtown LA"
              disabled={isSubmitting}
            />
          </div>
          <div className="col-span-full mt-4">
            <button
              type="submit"
              className={`w-full mx-auto flex justify-center items-center rounded-full bg-cyan-400 hover:bg-cyan-300 text-white py-2 font-medium border-b-4 border-lime-400 transition-opacity ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (editBanner ? 'Update Banner' : 'Create Banner')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBannerModal;