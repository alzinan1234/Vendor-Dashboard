"use client";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';

// Main App component
export default function EventRegistrationManagement() {
  // Sample data for event registrations
  const [registrations, setRegistrations] = useState([
    {
      id: 1,
      eventName: 'Jazz Night',
      paymentStatus: 'Paid',
      attendeeName: 'Sarah Khan',
      emailPhone: '+971 XXX',
      guests: 2,
      registeredOn: 'May 13, 2025',
      status: 'Confirmed',
    },
    {
      id: 2,
      eventName: 'Jazz Night',
      paymentStatus: 'Paid',
      attendeeName: 'Sarah Khan',
      emailPhone: '+971 XXX',
      guests: 2,
      registeredOn: 'May 13, 2025',
      status: 'Pending',
    },
    {
      id: 3,
      eventName: 'Tech Conference',
      paymentStatus: 'Unpaid',
      attendeeName: 'John Doe',
      emailPhone: '+123 YYY',
      guests: 1,
      registeredOn: 'May 10, 2025',
      status: 'Pending',
    },
    {
      id: 4,
      eventName: 'Art Exhibition',
      paymentStatus: 'Paid',
      attendeeName: 'Jane Smith',
      emailPhone: '+456 ZZZ',
      guests: 3,
      registeredOn: 'May 11, 2025',
      status: 'Confirmed',
    },
    {
      id: 5,
      eventName: 'Coding Workshop',
      paymentStatus: 'Paid',
      attendeeName: 'David Lee',
      emailPhone: '+789 AAA',
      guests: 1,
      registeredOn: 'May 12, 2025',
      status: 'Confirmed',
    },
    // Add more dummy data as needed
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 5; // Number of items to display per page

  // Filter registrations based on search term
  const filteredRegistrations = registrations.filter(reg =>
    Object.values(reg).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRegistrations = filteredRegistrations.slice(startIndex, startIndex + itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle confirming a registration
  const handleConfirm = (id) => {
    setRegistrations(prevRegistrations =>
      prevRegistrations.map(reg =>
        reg.id === id ? { ...reg, status: 'Confirmed' } : reg
      )
    );
  };

  // Handle rejecting a registration
  const handleReject = (id) => {
    setRegistrations(prevRegistrations =>
      prevRegistrations.map(reg =>
        reg.id === id ? { ...reg, status: 'Rejected' } : reg
      )
    );
  };

  // Handle viewing a registration (placeholder for actual view logic)
  const handleView = (id) => {
    alert(`Viewing registration with ID: ${id}`);
    // In a real application, you would navigate to a detail page or open a modal
  };

  return (
   <>
    
   
    <div className="min-h-screen bg-[#343434] text-gray-100 p-4 font-sans flex flex-col items-center">
      <div className="w-full  rounded-lg  overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4  rounded-t-lg">
          <h1 className="text-xl font-semibold text-white">Event Registration Management</h1>
         <div className="flex items-center gap-4">
            {/* search icon */}
            <div className="flex items-center ">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 bg-[#F3FAFA1A] rounded-tl-[7.04px] rounded-bl-[7.04px] border-[1px] border-[#0000001A] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={searchTerm}
              onChange={handleSearchChange}
                />
              </div>

              <button className="hover:bg-gray-700 transition-colors bg-[#2A2A2A] p-[5px] rounded-tr-[7.04px] rounded-br-[7.04px]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                >
                  <path
                    d="M11 8.5L20 8.5"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M4 16.5L14 16.5"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <ellipse
                    cx="7"
                    cy="8.5"
                    rx="3"
                    ry="3"
                    transform="rotate(90 7 8.5)"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <ellipse
                    cx="17"
                    cy="16.5"
                    rx="3"
                    ry="3"
                    transform="rotate(90 17 16.5)"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-[#00C1C980]">
              <tr>
                {['Event Name', 'Payment Status', 'Attendee Name', 'Email / Phone', 'Guests', 'Registered On', 'Status', 'Action'].map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider text-center"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {currentRegistrations.length > 0 ? (
                currentRegistrations.map((reg) => (
                  <tr key={reg.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">{reg.eventName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          reg.paymentStatus === 'Paid' ? ' text-[#71F50C]' : ' text-red-600'
                        }`}
                      >
                        {reg.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">{reg.attendeeName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">{reg.emailPhone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">{reg.guests}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">{reg.registeredOn}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          reg.status === 'Confirmed'
                            ? ' text-[#71F50C]'
                            : reg.status === 'Pending'
                            ? ' text-[#FB6000]'
                            : ' text-red-700'
                        }`}
                      >
                        {reg.status}
                      </span>
                    </td>
                    <td className="px-6 flex items-center justify-center py-4 whitespace-nowrap text-sm font-medium text-center">
                      {reg.status === 'Pending' ? (
                        <>
                          <button
                            onClick={() => handleConfirm(reg.id)}
                            className="text-green-400 hover:text-green-600 border mx-1 p-1 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                            title="Confirm"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </button>
                          <button
                            onClick={() => handleReject(reg.id)}
                            className="text-[#FF0000] border border-[#FF0000] hover:text-red-600 mx-1 p-1 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                            title="Reject"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleView(reg.id)}
                            className="text-purple-400 border hover:text-purple-600 mx-1 p-1 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            title="View"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          </button>
                          <button
                            onClick={() => handleReject(reg.id)}
                            className="border border-[#FF0000] hover:text-red-600 mx-1 p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                            title="Reject"
                          >
                           <svg xmlns="http://www.w3.org/2000/svg" width="12" height="11" viewBox="0 0 12 11" fill="none">
  <path d="M10.6663 0.943359L1.33301 10.2767M1.33301 0.943359L10.6663 10.2767" stroke="#FF0000" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                          </button>     
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-400">
                    No registrations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        
      </div>
    </div>
    <div className="flex items-center justify-end p-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 mx-1 rounded-full bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-200"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`px-4 py-2 mx-1 rounded text-sm font-medium ${
                pageNumber === currentPage
                  ? 'bg-[#00C1C9] text-white'
                  : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              {pageNumber}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 mx-1 rounded-full bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-200"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
          {totalPages > 5 && ( // Show "..." and last page if more than 5 pages
            <>
              {currentPage < totalPages - 2 && <span className="mx-1 text-gray-300">....</span>}
              <button
                onClick={() => handlePageChange(totalPages)}
                className={`px-4 py-2 mx-1 rounded-full text-sm font-medium ${
                  totalPages === currentPage
                    ? 'bg-[#00C1C9] text-white'
                    : 'bg-gray-600 text-gray-200 hover:bg-gray-500' 
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>
   </>
  );
}