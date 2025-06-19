"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'; // Import for the search icon

// EditItem Component
const EditItem = ({ item, onSave, onBackClick }) => {
  const [formData, setFormData] = useState({
    name: item.name,
    description: "Crispy tortilla chips topped with melted cheddar cheese, jalapeños, and a dash of seasoning—perfect for sharing or as a flavorful snack. Served with salsa and sour cream on the side.", // Static description as per image
    category: item.category,
    price: item.price,
    discountPercentage: '9%', // Static discount as per image
    image: item.image,
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
    onSave(formData); // Pass the updated data back to the parent
  };

  return (
    <div className="min-h-screen bg-[#343434] text-white p-8 font-sans rounded-lg flex flex-col items-center">
      <div className="w-full max-w-2xl bg-[#343434] rounded-lg">
        {/* Header with back button and delete icon */}
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
          <h1 className="text-2xl font-semibold">Edit Item</h1>
          <button className="ml-auto p-2 rounded-full hover:bg-red-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
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
export default EditItem;