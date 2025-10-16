"use client";

import React, { useState, useRef } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import AddCategory from "./AddCategory";
import toast, { Toaster } from 'react-hot-toast';

const AddItem = ({ onBackClick, onAddItem, categories }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    price: "",
    discountPercentage: "",
    calories: "",
    servingSize: "",
    image: null,
  });

  const fileInputRef = useRef(null);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);

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
      setFormData((prevData) => ({
        ...prevData,
        image: file, // Store the actual file for upload
      }));
    }
  };

  const handleDone = () => {
    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.categoryId ||
      !formData.image
    ) {
      toast.error("Please fill in all required fields and upload an image.");
      return;
    }
    
    onAddItem(formData);
  };

  const handleAddCategoryClick = () => {
    setIsAddCategoryOpen(true);
  };

const handleCategoryAdded = (newCategory) => {
  setIsAddCategoryOpen(false);
  props.onCategoryAdded(); // Call parent refetch
  toast.success('Category added successfully!');
};
  return (
    <div className="min-h-screen bg-[#343434] text-white p-8 font-sans rounded-lg flex flex-col items-center relative">
      <Toaster position="top-right" />
      <div className="w-full max-w-2xl bg-[#343434] rounded-lg">
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
          <h1 className="text-2xl font-semibold">Add Item</h1>
          <button
            onClick={handleAddCategoryClick}
            className="ml-auto flex items-center bg-[#4A4A4A] rounded-full px-4 py-2 text-sm font-medium hover:bg-[#5A5A5A]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Category
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Upload Image
            </label>
            <div
              className="rounded-lg h-32 cursor-pointer relative overflow-hidden flex items-center justify-center border border-dashed border-[#CACACA]"
              onClick={handleImageUploadClick}
            >
              {formData.image ? (
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt="Item Preview"
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

          <div>
            <label
              htmlFor="name"
              className="block text-gray-300 text-sm font-medium mb-2"
            >
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

          <div>
            <label
              htmlFor="description"
              className="block text-gray-300 text-sm font-medium mb-2"
            >
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

          <div>
            <label
              htmlFor="categoryId"
              className="block text-gray-300 text-sm font-medium mb-2"
            >
              Category
            </label>
            <div className="relative">
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg bg-[#2a2a2a] border border-[#CACACA] focus:outline-none focus:border-blue-500 text-white appearance-none pr-8"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
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

          <div>
            <label
              htmlFor="price"
              className="block text-gray-300 text-sm font-medium mb-2"
            >
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

          <div>
            <label
              htmlFor="discountPercentage"
              className="block text-gray-300 text-sm font-medium mb-2"
            >
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

          <div>
            <label
              htmlFor="calories"
              className="block text-gray-300 text-sm font-medium mb-2"
            >
              Calories (Optional)
            </label>
            <input
              type="text"
              id="calories"
              name="calories"
              value={formData.calories}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-[#2a2a2a] border border-[#CACACA] focus:outline-none focus:border-blue-500 text-white"
            />
          </div>

          <div>
            <label
              htmlFor="servingSize"
              className="block text-gray-300 text-sm font-medium mb-2"
            >
              Serving Size (Optional)
            </label>
            <input
              type="text"
              id="servingSize"
              name="servingSize"
              value={formData.servingSize}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-[#2a2a2a] border border-[#CACACA] focus:outline-none focus:border-blue-500 text-white"
            />
          </div>

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

      {isAddCategoryOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <AddCategory
            onBackClick={() => setIsAddCategoryOpen(false)}
            onAddCategory={handleCategoryAdded}
          />
        </div>
      )}
    </div>
  );
};

export default AddItem;