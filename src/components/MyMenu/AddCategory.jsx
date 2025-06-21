"use client";

import React, { useState, useRef } from "react";

const AddCategory = ({ onBackClick, onAddCategory }) => {
  const [formData, setFormData] = useState({
    name: "",
    image: null,
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
      console.log("File selected:", file.name);
    }
  };

  const handleDone = () => {
    if (!formData.name || !formData.image) {
      alert("Please fill in all required fields and upload an image.");
      return;
    }
    const newCategory = { ...formData, id: Date.now() };
    onAddCategory(newCategory);
    onBackClick();
  };

  return (
    <div className=" bg-[#343434] text-white p-8 font-sans rounded-lg flex flex-col items-center">
      <div className=" w-6xl bg-[#343434] rounded-lg">
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
                  src={formData.image}
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
              type="submit"
              className="w-full mx-auto flex justify-center items-center rounded-full bg-[#00C1C9] text-white py-2 font-medium border-b-4 border-lime-400"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
