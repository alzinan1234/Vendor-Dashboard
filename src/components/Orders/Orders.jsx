"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation for App Router
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { mockOrders } from '../lib/orders';
; // Import mock data from the central file

const Orders = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  const router = useRouter(); // Initialize the router

  // Handler to navigate to the order details page
  const handleViewDetails = (orderId) => {
    router.push(`/admin/orders/${orderId}`);
  };
  
  // Filter orders based on search term
  const filteredOrders = orders.filter(order =>
    Object.values(order).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Get current orders for the displayed page
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  
  const getPaginationRange = (currentPage, totalPages, delta = 1) => {
    const range = [];
    delta = Math.max(1, delta);
    const left = currentPage - delta;
    const right = currentPage + delta;
    if (1 <= totalPages) { range.push(1); }
    if (left > 2) { range.push('...'); }
    for (let i = Math.max(2, left); i <= Math.min(totalPages - 1, right); i++) {
        if (!range.includes(i)) { range.push(i); }
    }
    if (right < totalPages - 1) { range.push('...'); }
    if (totalPages > 1 && !range.includes(totalPages)) { range.push(totalPages); }
    const uniqueRange = [...new Set(range)];
    return uniqueRange.sort((a, b) => {
        if (typeof a === 'number' && typeof b === 'number') return a - b;
        if (a === '...') return -1;
        if (b === '...') return 1;
        return 0;
    }).filter((item, index, arr) => !(item === '...' && arr[index + 1] === '...'));
  };

  const paginationRange = getPaginationRange(currentPage, totalPages);

  return (
    <div>
      <div className="bg-[#343434] text-gray-100 p-4 font-inter rounded-lg">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          body { font-family: 'Inter', sans-serif; }
        `}</style>
        <div className="mx-auto rounded-lg">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-4 sm:mb-0">Orders</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center ">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="pl-10 pr-4 py-2 bg-[#F3FAFA1A] rounded-tl-[7.04px] rounded-bl-[7.04px] border-[1px] border-[#0000001A] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="hover:bg-gray-700 transition-colors bg-[#2A2A2A] p-[5px] rounded-tr-[7.04px] rounded-br-[7.04px]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                    <path d="M11 8.5L20 8.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M4 16.5L14 16.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <ellipse cx="7" cy="8.5" rx="3" ry="3" transform="rotate(90 7 8.5)" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <ellipse cx="17" cy="16.5" rx="3" ry="3" transform="rotate(90 17 16.5)" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-[#00C1C980]">
                <tr>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider rounded-tl-lg">Order ID</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Customer Name</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">QR Order</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Table</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Quantity</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {currentOrders.map((order, index) => (
                  <tr key={index} className="transition duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200 text-center">{order.orderId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">{order.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">{order.qrOrder}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">{order.table}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">{order.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span className="inline-flex px-2 text-xs font-semibold leading-5 rounded-full text-orange-400 bg-orange-900 bg-opacity-30">{order.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">{order.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2 justify-center">
                      {/* MODIFIED: onClick handler to navigate to the details page */}
                      <button onClick={() => handleViewDetails(order.orderId)} className="text-purple-400 border border-[#C267FF] hover:text-purple-600 rounded-[51px] p-[5px]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 11" fill="none">
                          <path d="M14.3628 4.63424C14.5655 4.91845 14.6668 5.06056 14.6668 5.27091C14.6668 5.48127 14.5655 5.62338 14.3628 5.90759C13.4521 7.18462 11.1263 9.93758 8.00016 9.93758C4.87402 9.93758 2.54823 7.18462 1.63752 5.90759C1.43484 5.62338 1.3335 5.48127 1.3335 5.27091C1.3335 5.06056 1.43484 4.91845 1.63752 4.63424C2.54823 3.35721 4.87402 0.604248 8.00016 0.604248C11.1263 0.604248 13.4521 3.35721 14.3628 4.63424Z" stroke="#C267FF" />
                          <path d="M10 5.271C10 4.16643 9.10457 3.271 8 3.271C6.89543 3.271 6 4.16643 6 5.271C6 6.37557 6.89543 7.271 8 7.271C9.10457 7.271 10 6.37557 10 5.271Z" stroke="#C267FF" />
                        </svg>
                      </button>
                      <button className="text-red-500 hover:text-red-700 border border-[#FF0000] rounded-[51px] p-[5px]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 12 11" fill="none">
                          <path d="M10.6668 0.684326L1.3335 10.0177M1.3335 0.684326L10.6668 10.0177" stroke="#FF0000" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Pagination */}
      <div className="flex justify-end items-center mt-6 gap-2 text-sm text-white">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="w-8 h-8 flex items-center border rounded-full justify-center p-[10px] hover:bg-[#1f1f1f] disabled:opacity-50 disabled:cursor-not-allowed">
          <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="M6.99995 13C6.99995 13 1.00001 8.58107 0.999999 6.99995C0.999986 5.41884 7 1 7 1" stroke="#E2E2E2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === '...') {
            return <span key={`ellipsis-${index}`} className="px-2">...</span>;
          }
          return (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              // Corrected className syntax
              className={`w-8 h-8 flex items-center justify-center rounded ${currentPage === pageNumber ? "bg-[#21F6FF] text-black" : "hover:bg-[#1f1f1f]"}`}
            >
              {pageNumber}
            </button>
          );
        })}
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="w-8 h-8 flex items-center border rounded-full justify-center hover:bg-[#1f1f1f] disabled:opacity-50 disabled:cursor-not-allowed">
          <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="M1.00005 1C1.00005 1 6.99999 5.41893 7 7.00005C7.00001 8.58116 1 13 1 13" stroke="#C8C8C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
    </div>
  );
};

export default Orders;