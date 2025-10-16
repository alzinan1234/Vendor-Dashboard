"use client";

import { myMenuService } from "@/lib/myMenueService";
import React, { useState, useRef } from "react";

import toast from 'react-hot-toast';

const AddCategory = ({ onBackClick, onAddCategory }) => {
  const [formData, setFormData] = useState({
    name: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error('File size too large. Maximum size is 5MB.');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
        return;
      }

      setFormData((prevData) => ({
        ...prevData,
        image: file,
      }));
    } catch (error) {
      console.error('File validation error:', error);
      toast.error('Error processing image. Please try again.');
    }
  };

  const handleDone = async () => {
    // Form validation
    if (!formData.name.trim()) {
      toast.error("Please enter a category name.");
      return;
    }

    if (!formData.image) {
      toast.error("Please upload a category image.");
      return;
    }

    try {
      setLoading(true);

      // Validate image again before submission
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      
      if (formData.image.size > maxSize) {
        throw new Error('File size too large. Maximum size is 5MB.');
      }

      if (!allowedTypes.includes(formData.image.type)) {
        throw new Error('Invalid file type. Please upload a JPEG, PNG, or WebP image.');
      }

      const response = await myMenuService.createCategory({
        name: formData.name.trim(),
        image: formData.image
      });

      if (response.success) {
        toast.success('Category created successfully!');
        onAddCategory(response.data);
        onBackClick();
      } else {
        throw new Error(response.message || 'Failed to create category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error(error.message || 'Failed to create category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#343434] text-white p-8 font-sans rounded-lg flex flex-col items-center">
      <div className="w-6xl bg-[#343434] rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBackClick}
            className="mr-4 p-2 rounded-full hover:bg-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <h1 className="text-2xl font-semibold">Add Category</h1>
          <div></div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Category Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-[#2a2a2a] border border-[#CACACA] focus:outline-none focus:border-blue-500 text-white"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Item Category Icon
            </label>
            <div
              className="rounded-lg h-32 cursor-pointer relative overflow-hidden flex items-center justify-center border border-dashed border-[#CACACA]"
              onClick={handleImageUploadClick}
            >
              {formData.image ? (
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Category Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-gray-400 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="text-gray-400 text-sm">Upload</span>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>
          </div>

          <div className="col-span-full mt-4">
            <button
              onClick={handleDone}
              disabled={loading}
              type="submit"
              className={`w-full mx-auto flex justify-center items-center rounded-full bg-[#00C1C9] text-white py-2 font-medium border-b-4 border-lime-400 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;