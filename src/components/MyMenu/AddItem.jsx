"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'; // Import for the search icon

// AddItem Component
const AddItem = ({ onBackClick, onAddItem }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Starter', // Default category
    price: '',
    discountPercentage: '',
    image: null, // To store the URL of the uploaded image
  });

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
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prevData) => ({
        ...prevData,
        image: imageUrl,
      }));
      console.log('File selected:', file.name);
    }
  };

  const handleDone = () => {
    // Basic validation
    if (!formData.name || !formData.description || !formData.price || !formData.image) {
      // Using a simple alert for now, as per original code context, but recommend a custom modal UI.
      // Do NOT use browser's alert() in production.
      alert('Please fill in all required fields and upload an image.');
      return;
    }
    // Generate a unique ID for the new item
    const newItem = { ...formData, id: Date.now() };
    onAddItem(newItem); // Pass the new item data to the parent
    onBackClick(); // Go back to My Menu view
  };

  return (
    <div className="min-h-screen bg-[#343434] text-white p-8 font-sans rounded-lg flex flex-col items-center">
      <div className="w-full max-w-2xl bg-[#343434] rounded-lg">
        {/* Header with back button and Add Category */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBackClick} className="mr-4 p-2 rounded-full hover:bg-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-2xl font-semibold">Add Item</h1>
          <button className="ml-auto flex items-center bg-[#4A4A4A] rounded-full px-4 py-2 text-sm font-medium hover:bg-[#5A5A5A]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Category
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Upload Image Section */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Upload Image</label>
            <div
              className="rounded-lg h-32 cursor-pointer relative overflow-hidden flex items-center justify-center border border-dashed border-[#CACACA]"
              onClick={handleImageUploadClick}
            >
              {formData.image ? (
                <img src={formData.image} alt="Item Preview" className="w-full h-full object-cover rounded-lg" />
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
                      d="M12 4v16m8-8H4" // Plus icon
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

          {/* Item Name */}
          <div>
            <label htmlFor="name" className="block text-gray-300 text-sm font-medium mb-2">
              Item Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-[#2a2a2a] border border-[#CACACA] focus:outline-none focus:border-blue-500 text-white"
            />
          </div>

          {/* Item Details (Description) */}
          <div>
            <label htmlFor="description" className="block text-gray-300 text-sm font-medium mb-2">
              Item Details
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full p-3 rounded-lg bg-[#2a2a2a] border border-[#CACACA] focus:outline-none focus:border-blue-500 text-white"
            ></textarea>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-gray-300 text-sm font-medium mb-2">
              Category
            </label>
            <div className="relative">
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-[#2a2a2a] border border-[#CACACA] focus:outline-none focus:border-blue-500 text-white appearance-none pr-8"
              >
                <option>Starter</option>
                <option>Main Course</option>
                <option>Dessert</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Item Price */}
          <div>
            <label htmlFor="price" className="block text-gray-300 text-sm font-medium mb-2">
              Item Price
            </label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-[#2a2a2a] border border-[#CACACA] focus:outline-none focus:border-blue-500 text-white"
            />
          </div>

          {/* Discount Percentage */}
          <div>
            <label htmlFor="discountPercentage" className="block text-gray-300 text-sm font-medium mb-2">
              Discount Percentage
            </label>
            <input
              type="text"
              id="discountPercentage"
              name="discountPercentage"
              value={formData.discountPercentage}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-[#2a2a2a] border border-[#CACACA] focus:outline-none focus:border-blue-500 text-white"
            />
          </div>

          {/* Done Button */}
          <div className="col-span-full mt-4">
            <button
              onClick={handleDone}
              type="submit"
              className="w-full mx-auto flex justify-center items-center rounded-full bg-[#00C1C9] text-white py-2 font-medium border-b-4 border-lime-400"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
