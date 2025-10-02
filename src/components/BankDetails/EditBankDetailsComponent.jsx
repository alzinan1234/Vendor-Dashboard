'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { bankDetailsService } from '@/lib/bankDetailsService';

const EditBankDetailsComponent = ({ initialData, isCreating, onBackClick, onSuccess }) => {
  const [formData, setFormData] = useState(initialData || {
    accountNumber: '',
    routingNumber: '',
    bankName: '',
    bankholderName: '',
    bankAddress: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Update form data if initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    }

    if (!formData.routingNumber.trim()) {
      newErrors.routingNumber = 'Routing number is required';
    }

    if (!formData.bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
    }

    if (!formData.bankholderName.trim()) {
      newErrors.bankholderName = 'Bankholder name is required';
    }

    if (!formData.bankAddress.trim()) {
      newErrors.bankAddress = 'Bank address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      let result;

      if (isCreating) {
        // Create new bank details
        console.log('Creating Bank Details:', formData);
        result = await bankDetailsService.createBankDetails(formData);
      } else {
        // Update existing bank details
        console.log('Updating Bank Details:', formData);
        result = await bankDetailsService.updateBankDetails(formData);
      }

      if (result.success) {
        toast.success(result.message || (isCreating ? 'Bank details created successfully!' : 'Bank details updated successfully!'));
        
        // Call onSuccess callback after a short delay
        setTimeout(() => {
          if (onSuccess) {
            onSuccess(result.data);
          }
        }, 1500);
      } else {
        toast.error(result.error || 'Failed to save bank details');
      }
    } catch (err) {
      console.error('Error saving bank details:', err);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#343434] text-gray-100 p-6 flex flex-col items-center">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full p-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button onClick={onBackClick} className="mr-4 p-2 rounded-full hover:bg-[#3A3A3A] transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-400 cursor-pointer hover:text-white transition-colors" />
          </button>
          <h2 className="text-2xl font-bold text-white">
            {isCreating ? 'Create Bank Details' : 'Edit Bank Details'}
          </h2>
        </div>

        {/* Form for Bank Details */}
        <div className="space-y-6">
          {/* Account Number */}
          <div>
            <label htmlFor="accountNumber" className="block text-xs text-white mb-3">
              Account Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              className={`w-full text-white px-4 py-3 rounded-md border ${
                errors.accountNumber ? 'border-red-500' : 'border-[#444]'
              } focus:border-[#00C1C9] focus:ring-1 focus:ring-[#00C1C9] outline-none shadow-inner transition-colors duration-200 bg-transparent`}
              placeholder="Enter Account Number"
              disabled={loading}
            />
            {errors.accountNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>
            )}
          </div>

          {/* Routing Number */}
          <div>
            <label htmlFor="routingNumber" className="block text-xs text-white mb-3">
              Routing Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="routingNumber"
              name="routingNumber"
              value={formData.routingNumber}
              onChange={handleChange}
              className={`w-full text-white px-4 py-3 rounded-md border ${
                errors.routingNumber ? 'border-red-500' : 'border-[#444]'
              } focus:border-[#00C1C9] focus:ring-1 focus:ring-[#00C1C9] outline-none shadow-inner transition-colors duration-200 bg-transparent`}
              placeholder="Enter Routing Number"
              disabled={loading}
            />
            {errors.routingNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.routingNumber}</p>
            )}
          </div>

          {/* Bank Name */}
          <div>
            <label htmlFor="bankName" className="block text-xs text-white mb-3">
              Bank Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="bankName"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              className={`w-full text-white px-4 py-3 rounded-md border ${
                errors.bankName ? 'border-red-500' : 'border-[#444]'
              } focus:border-[#00C1C9] focus:ring-1 focus:ring-[#00C1C9] outline-none shadow-inner transition-colors duration-200 bg-transparent`}
              placeholder="Enter Bank Name"
              disabled={loading}
            />
            {errors.bankName && (
              <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>
            )}
          </div>

          {/* Bankholder Name */}
          <div>
            <label htmlFor="bankholderName" className="block text-xs text-white mb-3">
              Bankholder Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="bankholderName"
              name="bankholderName"
              value={formData.bankholderName}
              onChange={handleChange}
              className={`w-full text-white px-4 py-3 rounded-md border ${
                errors.bankholderName ? 'border-red-500' : 'border-[#444]'
              } focus:border-[#00C1C9] focus:ring-1 focus:ring-[#00C1C9] outline-none shadow-inner transition-colors duration-200 bg-transparent`}
              placeholder="Enter Bankholder Name"
              disabled={loading}
            />
            {errors.bankholderName && (
              <p className="text-red-500 text-xs mt-1">{errors.bankholderName}</p>
            )}
          </div>

          {/* Bank Address */}
          <div>
            <label htmlFor="bankAddress" className="block text-xs text-white mb-3">
              Bank Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="bankAddress"
              name="bankAddress"
              value={formData.bankAddress}
              onChange={handleChange}
              className={`w-full text-white px-4 py-3 rounded-md border ${
                errors.bankAddress ? 'border-red-500' : 'border-[#444]'
              } focus:border-[#00C1C9] focus:ring-1 focus:ring-[#00C1C9] outline-none shadow-inner transition-colors duration-200 bg-transparent`}
              placeholder="Enter Bank Address"
              disabled={loading}
            />
            {errors.bankAddress && (
              <p className="text-red-500 text-xs mt-1">{errors.bankAddress}</p>
            )}
          </div>

          {/* Save & Change Button */}
          <div className="col-span-full mt-4">
            <button
              onClick={handleSubmit}
              type="button"
              className={`w-full mx-auto flex justify-center items-center rounded-full bg-[#00C1C9] text-white py-2 font-medium border-b-4 border-lime-400 transition-opacity ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
              }`}
              disabled={loading}
            >
              {loading ? (isCreating ? 'Creating...' : 'Saving...') : (isCreating ? 'Create Bank Details' : 'Save & Change')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBankDetailsComponent;