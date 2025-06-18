"use client";

import React, { useState, useRef } from 'react';

// EditProfileManagement Component
const EditProfileManagement = ({ onBackClick }) => {
  const [formData, setFormData] = useState({
    restaurantName: '',
    description: '',
    address: '',
    phoneNumber: '',
    email: '',
    operatingHours: [
      { day: 'Monday', openTime: '', closeTime: '', isOpen: false },
      { day: 'Tuesday', openTime: '', closeTime: '', isOpen: false },
      { day: 'Wednesday', openTime: '', closeTime: '', isOpen: false },
      { day: 'Thursday', openTime: '', closeTime: '', isOpen: false },
      { day: 'Friday', openTime: '', closeTime: '', isOpen: false },
      { day: 'Saturday', openTime: '', closeTime: '', isOpen: false },
      { day: 'Sunday', openTime: '', closeTime: '', isOpen: false },
    ],
  });

  // State to store URLs of uploaded images for preview
  const [uploadedImages, setUploadedImages] = useState(Array(4).fill(null));

  // Create refs for each upload input
  const fileInputRefs = useRef([]);
  // Ensure refs array has enough elements
  fileInputRefs.current = [...Array(4)].map((_, i) => fileInputRefs.current[i] ?? React.createRef());


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleOperatingHoursChange = (index, field, value) => {
    setFormData((prevData) => {
      const newOperatingHours = [...prevData.operatingHours];
      newOperatingHours[index][field] = value;
      return {
        ...prevData,
        operatingHours: newOperatingHours,
      };
    });
  };

  const handleSave = () => {
    // Here you would typically send the formData to an API
    console.log('Saving changes:', formData);
    // You can also access the uploaded image files from the `uploadedImages` state if needed
    console.log('Uploaded image previews:', uploadedImages);
    onBackClick(); // Go back to profile view after saving
  };

  const handleImageUploadClick = (index) => {
    // Programmatically click the hidden file input
    fileInputRefs.current[index].current.click();
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a URL for the selected file to display as a preview
      const imageUrl = URL.createObjectURL(file);
      setUploadedImages(prevImages => {
        const newImages = [...prevImages];
        newImages[index] = imageUrl; // Update the specific image slot
        return newImages;
      });
      console.log(`File selected for upload ${index + 1}:`, file.name);
    }
  };

  return (
    <div className="min-h-screen bg-[#343434] text-white p-8 font-sans rounded-lg flex flex-col items-center">
      <div className="w-full  bg-[#343434] rounded-lg">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
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
          <h1 className="text-2xl font-semibold">Edit</h1>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Restaurant/Bar Name */}
          <div>
            <label htmlFor="restaurantName" className="block text-gray-300 text-sm font-medium mb-2">
              Restaurant/Bar Name
            </label>
            <input
              type="text"
              id="restaurantName"
              name="restaurantName"
              value={formData.restaurantName}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg  border border-[#CACACA] focus:outline-none focus:border-blue-500 text-white"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-gray-300 text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full p-3 rounded-lg  border border-[#CACACA] focus:outline-none focus:border-blue-500 text-white"
            ></textarea>
          </div>

          {/* Upload Image Section */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Upload Image</label>
            <div className="rounded-lg ">
              <div
                className="flex flex-col items-center justify-center border border-dashed border-[#CACACA] rounded-lg h-32 cursor-pointer hover:border-blue-400 relative overflow-hidden" // Added relative and overflow-hidden
                onClick={() => handleImageUploadClick(0)} // Trigger first input
              >
                {uploadedImages[0] ? (
                  <img src={uploadedImages[0]} alt="Uploaded Preview" className="absolute inset-0 w-full h-full object-cover rounded-lg" />
                ) : (
                  <>
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
                  </>
                )}
                <input
                  type="file"
                  ref={fileInputRefs.current[0]}
                  onChange={(e) => handleFileChange(0, e)}
                  className="hidden"
                  accept="image/*"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                {[1, 2, 3].map((idx) => ( // Render remaining three upload sections
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center p-4 border border-dashed border-[#CACACA] rounded-lg h-32 cursor-pointer hover:border-blue-400 relative overflow-hidden" // Added relative and overflow-hidden
                    onClick={() => handleImageUploadClick(idx)}
                  >
                    {uploadedImages[idx] ? (
                      <img src={uploadedImages[idx]} alt="Uploaded Preview" className="absolute inset-0 w-full h-full object-cover rounded-lg" />
                    ) : (
                      <>
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
                      </>
                    )}
                    <input
                      type="file"
                      ref={fileInputRefs.current[idx]}
                      onChange={(e) => handleFileChange(idx, e)}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-gray-300 text-sm font-medium mb-2">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg  border border-[#CACACA] focus:outline-none focus:border-blue-500 text-white"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-gray-300 text-sm font-medium mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg  border border-[#CACACA] focus:outline-none focus:border-blue-500 text-white"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg  border border-[#CACACA] focus:outline-none focus:border-blue-500 text-white"
            />
          </div>

          {/* Operating Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Operating Hours</h3>
            <div className="overflow-x-auto rounded-lg">
              <table className="min-w-full text-white">
                <thead className='bg-[#FFFFFF1A] '>
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Day</th>
                    <th className="py-3 px-4 text-center text-sm font-medium text-gray-300">Open Time</th>
                    <th className="py-3 px-4 text-center text-sm font-medium text-gray-300">Close Time</th>
                    <th className="py-3 px-4 text-center text-sm font-medium text-gray-300 ">Open/Closed</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.operatingHours.map((hour, index) => (
                    <tr key={hour.day} className="border-t border-gray-600">
                      <td className="py-3 px-4 whitespace-nowrap">{hour.day}</td>
                      <td className="py-3 px-4">
                        <input
                          type="time"
                          value={hour.openTime}
                          onChange={(e) => handleOperatingHoursChange(index, 'openTime', e.target.value)}
                          className="w-full p-2 rounded-md  border border-gray-500 text-white"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="time"
                          value={hour.closeTime}
                          onChange={(e) => handleOperatingHoursChange(index, 'closeTime', e.target.value)}
                          className="w-full p-2 rounded-md border border-gray-500 text-white"
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={hour.isOpen}
                          onChange={(e) => handleOperatingHoursChange(index, 'isOpen', e.target.checked)}
                          className="form-checkbox h-5 w-5 text-blue-600 rounded"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Save Changes Button */}
          <div className="col-span-full mt-4">
            <button
              onClick={handleSave}
              type="submit"
              className="w-full mx-auto flex justify-center items-center rounded-full bg-[#00C1C9] text-white py-2 font-medium border-b-4 border-lime-400"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditProfileManagement;