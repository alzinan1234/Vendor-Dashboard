'use client';
import React, { useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { bankDetailsService } from '@/lib/bankDetailsService';

const BankDetailsComponent = ({ onEditClick }) => {
  const [bankDetails, setBankDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasBankDetails, setHasBankDetails] = useState(false);

  // Fetch bank details on component mount
  useEffect(() => {
    fetchBankDetails();
  }, []);

  const fetchBankDetails = async () => {
    setLoading(true);
    try {
      const result = await bankDetailsService.getBankDetails();
      
      if (result.success) {
        setBankDetails({
          accountNumber: result.data.account_number,
          routingNumber: result.data.routing_number,
          bankName: result.data.bank_name,
          bankholderName: result.data.bankholder_name,
          bankAddress: result.data.bank_address,
        });
        setHasBankDetails(true);
      } else if (result.notFound) {
        // No bank details found
        setHasBankDetails(false);
        setBankDetails(null);
      } else {
        toast.error(result.error || 'Failed to load bank details');
        setHasBankDetails(false);
      }
    } catch (error) {
      console.error('Error fetching bank details:', error);
      toast.error('An error occurred while loading bank details');
      setHasBankDetails(false);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    onEditClick(bankDetails, hasBankDetails);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#343434] text-gray-100 p-6 flex flex-col items-center justify-center">
        <Toaster position="top-center" reverseOrder={false} />
        <div className="text-white text-lg">Loading bank details...</div>
      </div>
    );
  }

  if (!hasBankDetails) {
    return (
      <div className="min-h-screen bg-[#343434] text-gray-100 p-6 flex flex-col items-center">
        <Toaster position="top-center" reverseOrder={false} />
        <div className="w-full p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">Bank Details</h2>
          </div>

          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-gray-400 text-center mb-8">
              <p className="text-xl mb-2">No bank details found</p>
              <p className="text-sm">Please create your bank details to get started</p>
            </div>
            <button
              onClick={handleEditClick}
              className="bg-[#00C1C9] text-white px-6 py-3 rounded-full flex items-center space-x-2 hover:bg-[#00A1A9] transition-colors shadow-md"
            >
              <span>Create Bank Details</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#343434] text-gray-100 p-6 flex flex-col items-center">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full rounded-lg p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-white">Bank Details</h2>
          </div>
          <button
            onClick={handleEditClick}
            className="bg-[#00C1C9] text-white px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-[#00A1A9] transition-colors shadow-md"
          >
            <Pencil className="w-4 h-4" />
            <span>Edit Bank Details</span>
          </button>
        </div>

        {/* Bank Details Display */}
        <div className="space-y-6">
          {/* Account Number */}
          <div className="rounded-md px-4 py-3 border border-[#444] shadow-inner">
            <p className="text-xs text-gray-400 mb-1">Account Number</p>
            <p className="text-lg text-white">{bankDetails.accountNumber}</p>
          </div>

          {/* Routing Number */}
          <div className="rounded-md px-4 py-3 border border-[#444] shadow-inner">
            <p className="text-xs text-gray-400 mb-1">Routing Number</p>
            <p className="text-lg text-white">{bankDetails.routingNumber}</p>
          </div>

          {/* Bank Name */}
          <div className="rounded-md px-4 py-3 border border-[#444] shadow-inner">
            <p className="text-xs text-gray-400 mb-1">Bank Name</p>
            <p className="text-lg text-white">{bankDetails.bankName}</p>
          </div>

          {/* Bankholder Name */}
          <div className="rounded-md px-4 py-3 border border-[#444] shadow-inner">
            <p className="text-xs text-gray-400 mb-1">Bankholder Name</p>
            <p className="text-lg text-white">{bankDetails.bankholderName}</p>
          </div>

          {/* Bank Address */}
          <div className="rounded-md px-4 py-3 border border-[#444] shadow-inner">
            <p className="text-xs text-gray-400 mb-1">Bank Address</p>
            <p className="text-lg text-white">{bankDetails.bankAddress}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankDetailsComponent;