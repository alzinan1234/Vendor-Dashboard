// components/EditBankDetailsComponent.js
'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

const EditBankDetailsComponent = ({ initialData, onSaveClick, onBackClick }) => {
  const [formData, setFormData] = useState(initialData || {
    accountNumber: '',
    routingNumber: '',
    bankName: '',
    bankholderName: '',
    bankAddress: '',
  });

  // Update form data if initialData changes (e.g., when switching from view to edit)
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saving Bank Details:', formData);
    onSaveClick(formData);
  };

  return (
    <div className="min-h-screen bg-[#343434] text-gray-100 p-6 flex flex-col items-center">
      <div className="w-full  p-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button onClick={onBackClick} className="mr-4 p-2 rounded-full hover:bg-[#3A3A3A] transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-400 cursor-pointer hover:text-white transition-colors" />
          </button>
          <h2 className="text-2xl font-bold text-white">Edit Bank Details</h2>
        </div>

        {/* Form for Bank Details */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Number */}
          <div>
            <label htmlFor="accountNumber" className="block text-xs text-white mb-3">Account Number</label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              className="w-full  text-white px-4 py-3 rounded-md border border-[#444] focus:border-[#00C1C9] focus:ring-1 focus:ring-[#00C1C9] outline-none shadow-inner transition-colors duration-200"
              placeholder="Enter Account Number"
            />
          </div>

          {/* Routing Number */}
          <div>
            <label htmlFor="routingNumber" className="block text-xs text-white mb-3">Routing Number</label>
            <input
              type="text"
              id="routingNumber"
              name="routingNumber"
              value={formData.routingNumber}
              onChange={handleChange}
              className="w-full  text-white px-4 py-3 rounded-md border border-[#444] focus:border-[#00C1C9] focus:ring-1 focus:ring-[#00C1C9] outline-none shadow-inner transition-colors duration-200"
              placeholder="Enter Routing Number"
            />
          </div>

          {/* Bank Name */}
          <div>
            <label htmlFor="bankName" className="block text-xs text-white mb-3">Bank Name</label>
            <input
              type="text"
              id="bankName"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              className="w-full  text-white px-4 py-3 rounded-md border border-[#444] focus:border-[#00C1C9] focus:ring-1 focus:ring-[#00C1C9] outline-none shadow-inner transition-colors duration-200"
              placeholder="Enter Bank Name"
            />
          </div>

          {/* Bankholder Name */}
          <div>
            <label htmlFor="bankholderName" className="block text-xs text-white mb-1">Bankholder Name</label>
            <input
              type="text"
              id="bankholderName"
              name="bankholderName"
              value={formData.bankholderName}
              onChange={handleChange}
              className="w-full  text-white px-4 py-3 rounded-md border border-[#444] focus:border-[#00C1C9] focus:ring-1 focus:ring-[#00C1C9] outline-none shadow-inner transition-colors duration-200"
              placeholder="Enter Bankholder Name"
            />
          </div>

          {/* Bank Address */}
          <div>
            <label htmlFor="bankAddress" className="block text-xs text-white mb-1">Bank Address</label>
            <input
              type="text"
              id="bankAddress"
              name="bankAddress"
              value={formData.bankAddress}
              onChange={handleChange}
              className="w-full  text-white px-4 py-3 rounded-md border border-[#444] focus:border-[#00C1C9] focus:ring-1 focus:ring-[#00C1C9] outline-none shadow-inner transition-colors duration-200"
              placeholder="Enter Bank Address"
            />
          </div>

          {/* Save & Change Button */}
        <div className="col-span-full mt-4">
            <button
            
              type="submit"
              className="w-full mx-auto flex justify-center items-center rounded-full bg-[#00C1C9] text-white py-2 font-medium border-b-4 border-lime-400"
            >
              Save & Change
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBankDetailsComponent;