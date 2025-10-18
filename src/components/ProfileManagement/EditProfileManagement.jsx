"use client";

import React, { useState, useRef, useEffect } from 'react';
import { profileService } from '@/lib/ProfileManagementService';
import toast from 'react-hot-toast';

const EditProfileManagement = ({ onBackClick, onSuccess, initialData, venueData }) => {
  const [formData, setFormData] = useState({
    restaurantName: '',
    description: '',
    address: '',
    phoneNumber: '',
    email: '',
    operatingHours: [
      { day: 'Monday', openTime: '', closeTime: '', isOpen: true },
      { day: 'Tuesday', openTime: '', closeTime: '', isOpen: true },
      { day: 'Wednesday', openTime: '', closeTime: '', isOpen: true },
      { day: 'Thursday', openTime: '', closeTime: '', isOpen: true },
      { day: 'Friday', openTime: '', closeTime: '', isOpen: true },
      { day: 'Saturday', openTime: '', closeTime: '', isOpen: true },
      { day: 'Sunday', openTime: '', closeTime: '', isOpen: true },
    ],
  });

  const [uploadedImages, setUploadedImages] = useState(Array(4).fill(null));
  const [imageFiles, setImageFiles] = useState(Array(4).fill(null));
  const [submitting, setSubmitting] = useState(false);

  const fileInputRefs = useRef([]);
  fileInputRefs.current = [...Array(4)].map((_, i) => fileInputRefs.current[i] ?? React.createRef());

  useEffect(() => {
    initializeFormData();
  }, [initialData, venueData]);

  const initializeFormData = () => {
    if (initialData) {
      // Extract operating hours from API response
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      const operatingHours = days.map((day, index) => ({
        day: day.charAt(0).toUpperCase() + day.slice(1),
        openTime: initialData[`${day}_open`] ? initialData[`${day}_open`].substring(0, 5) : '',
        closeTime: initialData[`${day}_close`] ? initialData[`${day}_close`].substring(0, 5) : '',
        isOpen: initialData[`${day}_is_open`] || false,
      }));

      setFormData({
        restaurantName: initialData.name || '',
        description: initialData.description || '',
        address: initialData.address || '',
        phoneNumber: initialData.phone_number || '',
        email: initialData.email || '',
        operatingHours: operatingHours,
      });
      
      loadExistingImages();
    } else if (venueData) {
      // Pre-fill with venue data if no profile exists
      setFormData(prev => ({
        ...prev,
        restaurantName: venueData.venue_name || '',
        address: venueData.location || '',
        phoneNumber: venueData.mobile_number || '',
        email: venueData.user?.email || '',
      }));
      
      if (venueData.profile_picture) {
        setUploadedImages([venueData.profile_picture, null, null, null]);
      }
    }
  };

  const loadExistingImages = () => {
    if (initialData?.venue_images && initialData.venue_images.length > 0) {
      const existingImages = [...Array(4)].map((_, index) => {
        const image = initialData.venue_images[index];
        if (!image) return null;
        
        // Handle both string URLs and objects with image property
        if (typeof image === 'string') {
          return image;
        }
        if (image?.image) {
          return image.image;
        }
        return null;
      });
      setUploadedImages(existingImages);
    }
  };

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

  const handleImageUploadClick = (index) => {
    if (!submitting) {
      fileInputRefs.current[index].current.click();
    }
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      
      setUploadedImages(prevImages => {
        const newImages = [...prevImages];
        newImages[index] = imageUrl;
        return newImages;
      });

      setImageFiles(prevFiles => {
        const newFiles = [...prevFiles];
        newFiles[index] = file;
        return newFiles;
      });
    }
  };

  const handleRemoveImage = (index, e) => {
    e.stopPropagation();
    
    const imageUrl = uploadedImages[index];
    
    setUploadedImages(prevImages => {
      const newImages = [...prevImages];
      // Only revoke blob URLs, not API URLs
      if (imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
      }
      newImages[index] = null;
      return newImages;
    });

    setImageFiles(prevFiles => {
      const newFiles = [...prevFiles];
      newFiles[index] = null;
      return newFiles;
    });
  };

  const validateForm = () => {
    if (!formData.restaurantName.trim()) {
      toast.error('Restaurant/Bar name is required');
      return false;
    }

    if (!formData.email.trim()) {
      toast.error('Email is required');
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if (!formData.phoneNumber.trim()) {
      toast.error('Phone number is required');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    const loadingToast = toast.loading(initialData ? 'Updating profile...' : 'Creating profile...');

    try {
      // Prepare profile data with operating hours
      const profileData = {
        name: formData.restaurantName,
        description: formData.description,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        operatingHours: formData.operatingHours,
      };

      // Get only new image files (not existing URLs)
      const newImages = imageFiles.filter(file => file !== null);

      // Create or update profile
      let result;
      if (initialData) {
        result = await profileService.updateProfile(profileData, newImages);
      } else {
        result = await profileService.createProfile(profileData, newImages);
      }

      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success(result.message || (initialData ? 'Profile updated successfully' : 'Profile created successfully'));
        
        // Clean up only blob URLs, not API URLs
        uploadedImages.forEach(url => {
          if (url && url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
          }
        });

        if (onSuccess) {
          onSuccess();
        } else {
          onBackClick();
        }
      } else {
        toast.error(result.error || (initialData ? 'Failed to update profile' : 'Failed to create profile'));
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('An unexpected error occurred');
      console.error('Save error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#343434] text-white p-8 font-sans rounded-lg flex flex-col items-center">
      <div className="w-full bg-[#343434] rounded-lg">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button 
            onClick={onBackClick} 
            className="mr-4 p-2 rounded-full hover:bg-gray-700 transition-colors"
            disabled={submitting}
            aria-label="Go back"
          >
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
          <h1 className="text-2xl font-semibold">
            {initialData ? 'Edit Profile' : 'Create Profile'}
          </h1>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Restaurant/Bar Name */}
          <div>
            <label htmlFor="restaurantName" className="block text-gray-300 text-sm font-medium mb-2">
              Restaurant/Bar Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="restaurantName"
              name="restaurantName"
              value={formData.restaurantName}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-[#2A2A2A] border border-[#CACACA] focus:outline-none focus:border-[#00C1C9] focus:ring-1 focus:ring-[#00C1C9] text-white transition-colors"
              placeholder="Enter restaurant/bar name"
              disabled={submitting}
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
              className="w-full p-3 rounded-lg bg-[#2A2A2A] border border-[#CACACA] focus:outline-none focus:border-[#00C1C9] focus:ring-1 focus:ring-[#00C1C9] text-white resize-none transition-colors"
              placeholder="Describe your venue..."
              disabled={submitting}
            ></textarea>
          </div>

          {/* Upload Image Section */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">Upload Images</label>
            <div className="rounded-lg">
              {/* Main Image */}
              <div
                className="flex flex-col items-center justify-center border border-dashed border-[#CACACA] rounded-lg h-32 cursor-pointer hover:border-[#00C1C9] relative overflow-hidden transition-colors"
                onClick={() => handleImageUploadClick(0)}
              >
                {uploadedImages[0] ? (
                  <>
                    <img 
                      src={uploadedImages[0]} 
                      alt="Main Preview" 
                      className="absolute inset-0 w-full h-full object-cover rounded-lg" 
                    />
                    <button
                      onClick={(e) => handleRemoveImage(0, e)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 z-10 transition-colors"
                      disabled={submitting}
                      aria-label="Remove image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </>
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
                    <span className="text-gray-400 text-sm">Upload Main Image</span>
                    <span className="text-gray-500 text-xs mt-1">Max 5MB</span>
                  </>
                )}
                <input
                  type="file"
                  ref={fileInputRefs.current[0]}
                  onChange={(e) => handleFileChange(0, e)}
                  className="hidden"
                  accept="image/*"
                  disabled={submitting}
                />
              </div>

              {/* Additional Images */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                {[1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center p-4 border border-dashed border-[#CACACA] rounded-lg h-32 cursor-pointer hover:border-[#00C1C9] relative overflow-hidden transition-colors"
                    onClick={() => handleImageUploadClick(idx)}
                  >
                    {uploadedImages[idx] ? (
                      <>
                        <img 
                          src={uploadedImages[idx]} 
                          alt={`Preview ${idx + 1}`}
                          className="absolute inset-0 w-full h-full object-cover rounded-lg" 
                        />
                        <button
                          onClick={(e) => handleRemoveImage(idx, e)}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 z-10 transition-colors"
                          disabled={submitting}
                          aria-label={`Remove image ${idx + 1}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </>
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
                      disabled={submitting}
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
              className="w-full p-3 rounded-lg bg-[#2A2A2A] border border-[#CACACA] focus:outline-none focus:border-[#00C1C9] focus:ring-1 focus:ring-[#00C1C9] text-white transition-colors"
              placeholder="Enter address"
              disabled={submitting}
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-gray-300 text-sm font-medium mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-[#2A2A2A] border border-[#CACACA] focus:outline-none focus:border-[#00C1C9] focus:ring-1 focus:ring-[#00C1C9] text-white transition-colors"
              placeholder="Enter phone number"
              disabled={submitting}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-[#2A2A2A] border border-[#CACACA] focus:outline-none focus:border-[#00C1C9] focus:ring-1 focus:ring-[#00C1C9] text-white transition-colors"
              placeholder="Enter email address"
              disabled={submitting}
            />
          </div>

          {/* Operating Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Operating Hours</h3>
            <div className="overflow-x-auto rounded-lg">
              <table className="min-w-full text-white">
                <thead className='bg-[#FFFFFF1A]'>
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-300">Day</th>
                    <th className="py-3 px-4 text-center text-sm font-medium text-gray-300">Open Time</th>
                    <th className="py-3 px-4 text-center text-sm font-medium text-gray-300">Close Time</th>
                    <th className="py-3 px-4 text-center text-sm font-medium text-gray-300">Open/Closed</th>
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
                          className="w-full p-2 rounded-md bg-[#2A2A2A] border border-gray-500 text-white focus:outline-none focus:border-[#00C1C9] transition-colors"
                          disabled={!hour.isOpen || submitting}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="time"
                          value={hour.closeTime}
                          onChange={(e) => handleOperatingHoursChange(index, 'closeTime', e.target.value)}
                          className="w-full p-2 rounded-md bg-[#2A2A2A] border border-gray-500 text-white focus:outline-none focus:border-[#00C1C9] transition-colors"
                          disabled={!hour.isOpen || submitting}
                        />
                      </td>
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={hour.isOpen}
                          onChange={(e) => handleOperatingHoursChange(index, 'isOpen', e.target.checked)}
                          className="form-checkbox h-5 w-5 text-[#00C1C9] rounded focus:ring-2 focus:ring-[#00C1C9] cursor-pointer"
                          disabled={submitting}
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
              disabled={submitting}
              type="button"
              className="w-full mx-auto flex justify-center items-center rounded-full bg-[#00C1C9] hover:bg-[#00A0A8] text-white py-3 font-medium border-b-4 border-lime-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {initialData ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileManagement;