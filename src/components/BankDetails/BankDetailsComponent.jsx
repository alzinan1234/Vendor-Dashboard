// components/BankDetailsComponent.js
'use client';
import React from 'react';
import { ArrowLeft, Pencil } from 'lucide-react';
import Link from 'next/link';

const BankDetailsComponent = ({ bankDetails, onEditClick, onBackToSettings }) => {
  // Use passed bankDetails prop, or default if not provided
  const displayBankDetails = bankDetails || {
    accountNumber: '1234567890',
    routingNumber: '021000021',
    bankName: 'Atlantic Federal Bank',
    bankholderName: 'John D. Harper',
    bankAddress: '101 Main Street, New York, NY 10001, USA',
  };

  return (
    <div className="min-h-screen bg-[#343434] text-gray-100 p-6 flex flex-col items-center">
      <div className="w-full  rounded-lg  p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
           
            <h2 className="text-2xl font-bold text-white">Bank Details</h2>
          </div>
          <button
            onClick={onEditClick}
            className="bg-[#00C1C9] text-white px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-[#00A1A9] transition-colors shadow-md"
          >
            <Pencil className="w-4 h-4" />
            <span>Edit Bank Details</span>
          </button>
        </div>

        {/* Bank Details Display */}
        <div className="space-y-6">
          {/* Account Number */}
          <div className=" rounded-md px-4 py-3 border border-[#444] shadow-inner">
            <p className="text-xs text-gray-400 mb-1">Account Number</p>
            <p className="text-lg text-white">{displayBankDetails.accountNumber}</p>
          </div>

          {/* Routing Number */}
          <div className=" rounded-md px-4 py-3 border border-[#444] shadow-inner">
            <p className="text-xs text-gray-400 mb-1">Routing Number</p>
            <p className="text-lg text-white">{displayBankDetails.routingNumber}</p>
          </div>

          {/* Bank Name */}
          <div className=" rounded-md px-4 py-3 border border-[#444] shadow-inner">
            <p className="text-xs text-gray-400 mb-1">Bank Name</p>
            <p className="text-lg text-white">{displayBankDetails.bankName}</p>
          </div>

          {/* Bankholder Name */}
          <div className=" rounded-md px-4 py-3 border border-[#444] shadow-inner">
            <p className="text-xs text-gray-400 mb-1">Bankholder Name</p>
            <p className="text-lg text-white">{displayBankDetails.bankholderName}</p>
          </div>

          {/* Bank Address */}
          <div className=" rounded-md px-4 py-3 border border-[#444] shadow-inner">
            <p className="text-xs text-gray-400 mb-1">Bank Address</p>
            <p className="text-lg text-white">{displayBankDetails.bankAddress}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankDetailsComponent;