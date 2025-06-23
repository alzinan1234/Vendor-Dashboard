// Withdraw Request Component
"use client";
import React, { useState } from 'react';

const WithdrawRequestComponent = ({ onBack }) => {
  const [amount, setAmount] = useState('2000'); // Example default amount
  const [region, setRegion] = useState(''); // Example default region
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle submission logic here
    console.log('Withdraw Request Submitted:', { amount, region });
    // You might want to navigate back to WithdrawsComponent after submission
    // onBack();
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 mr-2 text-gray-400 hover:text-white transition-colors duration-200 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
          {/* Back Arrow Icon */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-100">Withdraw Request</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="amount" className="block text-white text-sm mb-2">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full  border border-gray-600 text-white rounded-lg py-3 px-4 focus:outline-none focus:border-teal-500"
            placeholder="Enter amount"
            required
          />
        </div>

        <div className="mb-8 relative">
          <label htmlFor="region" className="block text-white text-sm mb-2">
            Region
          </label>
          <div className="relative">
            <button
              type="button"
              className="w-full border border-gray-600 rounded-lg py-3 px-4 bg-[#232323] text-left text-white focus:outline-none focus:border-teal-500 flex justify-between items-center"
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              {region ? region : 'Your Region'}
              <svg className="fill-current h-5 w-5 ml-2 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </button>
            {showDropdown && (
              <div className="absolute left-0 right-0 mt-2 bg-[#232323] rounded-lg shadow-lg z-10">
                {/*
                  Options for the dropdown. The 'disabled' property is used to style the
                  placeholder option differently (grayed out and not clickable).
                */}
                {[
                  { value: '', label: 'Your Region', disabled: true },
                  { value: 'usa', label: 'USA' },
                  { value: 'canada', label: 'Canada' },
                  { value: 'europe', label: 'Europe' },
                  { value: 'asia', label: 'Asia' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    disabled={opt.disabled}
                    onClick={() => {
                      if (!opt.disabled) {
                        setRegion(opt.label);
                        setShowDropdown(false);
                      }
                    }}
                    className={`w-full text-left px-4 py-3 transition-all ${
                      opt.disabled
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'hover:bg-white/20 hover:backdrop-blur-md hover:text-white text-gray-200 cursor-pointer'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-span-full mt-4">
            <button
            
              type="submit"
              className="w-full mx-auto flex justify-center items-center rounded-full bg-[#00C1C9] text-white py-2 font-medium border-b-4 border-lime-400"
            >
              Done
            </button>
          </div>
      </form>
    </div>
  );
};

export default WithdrawRequestComponent; 