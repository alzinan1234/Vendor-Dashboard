"use client";

import React, { useState } from 'react';
import { withdrawalService } from '@/lib/withdrawalService';
import toast from 'react-hot-toast';

const WithdrawRequestComponent = ({ onBack, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [region, setRegion] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const regions = [
    { value: '', label: 'Select Region', disabled: true },
    { value: 'USA', label: 'USA' },
    { value: 'Canada', label: 'Canada' },
    { value: 'Europe', label: 'Europe' },
    { value: 'Asia', label: 'Asia' },
    { value: 'Africa', label: 'Africa' },
    { value: 'Australia', label: 'Australia' },
    { value: 'South America', label: 'South America' },
  ];

  const validateForm = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return false;
    }

    if (!region) {
      toast.error('Please select a region');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    const loadingToast = toast.loading('Submitting withdrawal request...');

    const withdrawalData = {
      amount: parseFloat(amount),
      region: region
    };

    const result = await withdrawalService.createWithdrawalRequest(withdrawalData);

    toast.dismiss(loadingToast);

    if (result.success) {
      toast.success(result.message || 'Withdrawal request submitted successfully');
      
      // Reset form
      setAmount('');
      setRegion('');
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Go back after short delay
      setTimeout(() => {
        onBack();
      }, 1000);
    } else {
      toast.error(result.error || 'Failed to submit withdrawal request');
    }

    setSubmitting(false);
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack} 
          className="p-2 mr-2 text-gray-400 hover:text-white transition-colors duration-200 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          disabled={submitting}
          aria-label="Go back"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-100">Withdraw Request</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="amount" className="block text-white text-sm mb-2">
            Amount <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">$</span>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-[#2A2A2A] border border-gray-600 text-white rounded-lg py-3 pl-8 pr-4 focus:outline-none focus:border-[#00C1C9] focus:ring-1 focus:ring-[#00C1C9] transition-colors"
              placeholder="Enter amount"
              min="0"
              step="0.01"
              required
              disabled={submitting}
            />
          </div>
          <p className="text-gray-400 text-xs mt-1">Enter the withdrawal amount</p>
        </div>

        <div className="mb-8 relative">
          <label htmlFor="region" className="block text-white text-sm mb-2">
            Region <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <button
              type="button"
              className="w-full border border-gray-600 rounded-lg py-3 px-4 bg-[#2A2A2A] text-left text-white focus:outline-none focus:border-[#00C1C9] focus:ring-1 focus:ring-[#00C1C9] flex justify-between items-center transition-colors"
              onClick={() => !submitting && setShowDropdown((prev) => !prev)}
              disabled={submitting}
            >
              {region ? region : 'Select Region'}
              <svg 
                className={`fill-current h-5 w-5 ml-2 text-white transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </button>
            {showDropdown && !submitting && (
              <div className="absolute left-0 right-0 mt-2 bg-[#232323] rounded-lg shadow-lg z-10 border border-gray-600 max-h-60 overflow-y-auto">
                {regions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={opt.disabled}
                    onClick={() => {
                      if (!opt.disabled) {
                        setRegion(opt.value);
                        setShowDropdown(false);
                      }
                    }}
                    className={`w-full text-left px-4 py-3 transition-all ${
                      opt.disabled
                        ? 'text-gray-400 cursor-not-allowed bg-[#1A1A1A]'
                        : region === opt.value
                        ? 'bg-[#00C1C9] text-white'
                        : 'hover:bg-white/20 hover:backdrop-blur-md hover:text-white text-gray-200 cursor-pointer'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="text-gray-400 text-xs mt-1">Select your region for processing</p>
        </div>

        <div className="col-span-full mt-4">
          <button
            type="submit"
            disabled={submitting}
            className="w-full mx-auto flex justify-center items-center rounded-full bg-[#00C1C9] hover:bg-[#00A0A8] text-white py-3 font-medium border-b-4 border-lime-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              'Submit Request'
            )}
          </button>
        </div>
      </form>

      {/* Info Box */}
      <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div className="text-sm text-gray-300">
            <p className="font-semibold text-blue-400 mb-1">Important Information</p>
            <ul className="space-y-1 text-xs">
              <li>• Withdrawal requests are typically processed within 3-5 business days</li>
              <li>• Minimum withdrawal amount may vary by region</li>
              <li>• Bank details must be verified before requesting withdrawal</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawRequestComponent;