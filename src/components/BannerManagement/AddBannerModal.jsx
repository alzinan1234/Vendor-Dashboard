
"use client";
import React, { useState } from "react";

const AddBannerModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    bannerTitle: "",
    description: "",
    imageUrl: "", // To store the URL of the uploaded image
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    link: "",
    location: "",
  });
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // For demonstration, we'll use a FileReader to get a preview URL.
      // In a real application, you'd upload this file to a server and get a permanent URL.
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result })); // Use reader.result as temporary URL
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would handle image upload to a cloud storage (e.g., Cloudinary, S3)
    // and then save the banner data (including the image URL) to your database.
    console.log("Submitting banner data:", formData, "Image file:", imageFile);
    onSave(formData); // Pass data up to parent component
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
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black  bg-opacity-75 flex items-center justify-center z-50 p-4 ">
      <div className="bg-[#343434] rounded-lg p-10  relative shadow-xl w-full max-w-4xl  max-h-[90vh] overflow-y-auto custom-scrollbar ">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
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
        <h2 className="text-xl font-semibold mb-6  text-white">Add New Banner</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-full">
            <label htmlFor="bannerTitle" className="block text-gray-300 text-sm font-bold mb-2">
              Banner Title
            </label>
            <input
              type="text"
              id="bannerTitle"
              name="bannerTitle"
              value={formData.bannerTitle}
              onChange={handleChange}
              className="w-full p-3 bg-lightGray rounded-md text-white border border-[#CACACA] focus:outline-none focus:border-teal"
              placeholder="May 7, 2025"
              required
            />
          </div>
          <div className="col-span-full">
            <label htmlFor="description" className="block text-gray-300 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full p-3 bg-lightGray rounded-md text-white border border-[#CACACA] focus:outline-none focus:border-teal"
              placeholder="Enter banner description"
            ></textarea>
          </div>
          <div className="col-span-full">
            <label htmlFor="uploadBanner" className="block text-gray-300 text-sm font-bold mb-2">
              Upload Banner
            </label>
            <div className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#CACACA] rounded-md cursor-pointer bg-lightGray hover:border-teal transition-colors duration-200">
              <input
                type="file"
                id="uploadBanner"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
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
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full p-3 bg-lightGray rounded-md text-white border border-[#CACACA] focus:outline-none focus:border-teal"
              required
            />
          </div>
          <div>
            <label htmlFor="startTime" className="block text-gray-300 text-sm font-bold mb-2">
              Start Time
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full p-3 bg-lightGray rounded-md text-white border border-[#CACACA] focus:outline-none focus:border-teal"
              required
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-gray-300 text-sm font-bold mb-2">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full p-3 bg-lightGray rounded-md text-white border border-[#CACACA]focus:outline-none focus:border-teal"
              required
            />
          </div>
          <div>
            <label htmlFor="endTime" className="block text-gray-300 text-sm font-bold mb-2">
              End Time
            </label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full p-3 bg-lightGray rounded-md text-white border border-[#CACACA] focus:outline-none focus:border-teal"
              required
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
            />
          </div>
           <div className="col-span-full mt-4">
              <button
            type="submit"
            className="w-full mx-auto flex justify-center items-center  rounded-full bg-cyan-400 hover:bg-cyan-300 text-white py-2 font-medium  border-b-4 border-lime-400"
          >
            create
          </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBannerModal;