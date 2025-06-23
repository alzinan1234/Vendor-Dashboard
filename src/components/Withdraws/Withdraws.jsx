// components/Withdraws.jsx
"use client";
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from "next/image";
import { useRouter } from 'next/navigation'; // Import useRouter

const Withdraws = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter(); // Initialize useRouter

  // Mock data for withdrawals
  const withdrawals = [
    {
      id: 1,
      date: 'Aug, 15 2023 02:50 PM',
      time: '2:50 PM',
      status: 'Confirmed',
      amount: 1000
    },
    {
      id: 2,
      date: 'Aug, 15 2023 02:29 PM',
      time: '2:29 PM',
      status: 'Pending',
      amount: 500
    },
    // Add more mock data as needed
    ...Array.from({ length: 28 }, (_, i) => ({
      id: i + 3,
      date: `Aug, ${15 - Math.floor(i / 2)} 2023 0${2 + Math.floor(Math.random() * 8)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} PM`,
      time: `${2 + Math.floor(Math.random() * 60).toString().padStart(2, '0')} PM`, // Fixed time generation for better accuracy
      status: Math.random() > 0.5 ? 'Confirmed' : 'Pending',
      amount: Math.floor(Math.random() * 2000) + 100
    }))
  ];

  const totalPages = Math.ceil(withdrawals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedWithdrawals = withdrawals.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleWithdrawClick = () => {
    // Navigates to the withdraw request page.
    // Ensure you have a page/component at '/withdraw-request', e.g., app/withdraw-request/page.jsx
    router.push('/withdraw-request');
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  return (
    <>
      <div className="min-h-screen bg-[#343434] text-white p-6 rounded-xl">
        <div className="">
          {/* Header */}
          <h1 className="text-2xl font-medium text-white mb-8">Withdraws</h1>

          {/* Balance Card */}
          <div className="relative rounded-2xl p-8 mb-8 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
              <Image
                src="/image/withdraw-bgImage.png"
                alt="Background pattern"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                className="rounded-2xl opacity-60"
                priority
              />
            </div>
            {/* Wallet Icon */}


            {/* Balance Info */}
            <div className="relative z-10">
              <p className="text-white text-sm font-normal mb-2">Your Balance</p>
              <h2 className="text-[40px] font-bold text-white mb-6">$1000</h2>

              {/* Withdraw Button - Styled as per request */}
              <button
                onClick={handleWithdrawClick} // Add onClick handler
                className="flex flex-col justify-center items-center gap-[8.425px] flex-shrink-0
                           w-[226px] h-[33px] border border-white rounded-[52px]
                           text-white font-medium hover:bg-white hover:text-teal-600 transition-colors"
                style={{ background: 'linear-gradient(180deg, #2A3D45 0%, #1F2C33 100%)' }}
              >
                Withdraw
              </button>
            </div>

            {/* Background Wave Pattern */}
            <div className="absolute bottom-0 left-0 right-0 h-20 opacity-20 z-10">
              <svg viewBox="0 0 400 100" className="w-full h-full">
                <path d="M0,50 Q100,10 200,50 T400,50 L400,100 L0,100 Z" fill="currentColor" className="text-white" />
              </svg>
            </div>
          </div>

          {/* Transactions Table */}
          <div className=" rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="bg-[#00C1C980] px-6 py-2">
              <div className="grid grid-cols-3 gap-4">
                {/* Added text-center to header columns */}
                <div className="text-white font-medium text-center">Date</div>
                <div className="text-white font-medium text-center">Time</div>
                <div className="text-white font-medium text-center">Status</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-700">
              {paginatedWithdrawals.map((withdrawal) => (
                <div key={withdrawal.id} className="px-6 py-4 hover:bg-gray-750 transition-colors">
                  {/* Added justify-items-center to the grid */}
                  <div className="grid grid-cols-3 gap-4 items-center justify-items-center">
                    <div className="text-gray-300 text-sm">{withdrawal.date}</div>
                    <div className="text-gray-300 text-sm">{withdrawal.time}</div>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        withdrawal.status === 'Confirmed'
                          ? ' text-[#71F50C]'
                          : ' text-[#FB6000]'
                        }`}>
                        {withdrawal.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>


        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-8 space-x-2">
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-2 border rounded-full text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {generatePageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && handlePageChange(page)}
            className={`min-w-8 h-8 px-2 rounded-md text-sm font-medium transition-colors ${
              page === currentPage
                ? 'bg-[#21F6FF] text-white'
                : typeof page === 'number'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                  : 'text-gray-600 cursor-default'
            }`}
            disabled={typeof page !== 'number'}
          >
            {page}
          </button>
        ))}

        {!generatePageNumbers().includes(totalPages) && totalPages > 4 && ( // Condition for the last '...' and last page button
          <>
            <span className="text-gray-600 text-sm px-1">...</span>
            <button
              onClick={() => handlePageChange(totalPages)}
              className="min-w-8 h-8 px-2 rounded-md text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-2 border rounded-full text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </>
  );
};

export default Withdraws;