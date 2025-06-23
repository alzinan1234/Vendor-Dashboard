// app/withdraw-request/page.jsx (or pages/withdraw-request.jsx)
"use client";
import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const WithdrawRequest = () => {
  const router = useRouter();
  const [amount, setAmount] = useState('2000'); // Initialize with 2000 as per image
  const [region, setRegion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the submission logic here, e.g., send data to an API
    console.log('Withdraw Request Submitted:', { amount, region });
    // Optionally, navigate back or show a success message
    router.back(); // Go back to the previous page (Withdraws)
  };

  return (
    <div className="min-h-screen bg-[#343434] text-white p-6 rounded-xl flex flex-col items-center justify-center">
      <div className="w-full max-w-lg bg-[#343434] p-6 rounded-xl">
        <div className="flex items-center mb-8">
          <button onClick={() => router.back()} className="text-white mr-4">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-medium text-white">Withdraw Request</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#2A2A2A] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-[#00C1C9]"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-300 mb-2">
              Region
            </label>
            <select
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#2A2A2A] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-[#00C1C9] appearance-none cursor-pointer"
            >
              <option value="" disabled>Your Region</option>
              {/* Add more region options as needed */}
              <option value="usa">USA</option>
              <option value="europe">Europe</option>
              <option value="asia">Asia</option>
            </select>
            {/* Custom arrow for select, if needed, you can add it with Tailwind */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z"/></svg>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg text-white font-semibold transition-colors duration-300"
            style={{
              background: 'linear-gradient(90deg, #00C1C9 0%, #21F6FF 100%)',
              boxShadow: '0px 4px 15px rgba(0, 193, 201, 0.4)'
            }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default WithdrawRequest;