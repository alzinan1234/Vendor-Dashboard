"use client";

import { nightlifeBookingsService } from '@/lib/eventRegistration';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';


export default function EventRegistrationManagement() {
  const [registrations, setRegistrations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 5;

  // Fetch bookings on mount
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await nightlifeBookingsService.getBookings();
      if (response.success) {
        setRegistrations(response.data);
      } else {
        setError(response.error || 'Failed to load bookings');
        toast.error(response.error || 'Failed to load bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load bookings');
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  // Map API data to table format
  const transformedRegistrations = registrations.map(booking => ({
    id: booking.id,
    eventName: booking.night_life_event?.name || 'N/A',
    paymentStatus: booking.is_paid ? 'Paid' : 'Unpaid',
    attendeeName: booking.user || 'N/A',
    emailPhone: booking.night_life_event?.phone_number || 'N/A',
    guests: booking.number_of_guests || 0,
    totalPrice: booking.total_price || '0.00',
    registeredOn: new Date(booking.booking_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    status: booking.status === 'confirmed' ? 'Confirmed' : booking.status === 'pending' ? 'Pending' : 'Cancelled',
    bookingData: booking
  }));

  // Filter registrations based on search term
  const filteredRegistrations = transformedRegistrations.filter(reg =>
    Object.values(reg).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRegistrations = filteredRegistrations.slice(startIndex, startIndex + itemsPerPage);

  // Handle search
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  // Handle confirm booking
  const handleConfirm = async (id) => {
    try {
      const response = await nightlifeBookingsService.confirmBooking(id);
      if (response.success) {
        toast.success('Booking confirmed successfully!');
        fetchBookings();
      } else {
        toast.error(response.error || 'Failed to confirm booking');
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
      toast.error('Failed to confirm booking');
    }
  };

  // Handle cancel booking
  const handleReject = async (id) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const response = await nightlifeBookingsService.cancelBooking(id);
      if (response.success) {
        toast.success('Booking cancelled successfully!');
        fetchBookings();
      } else {
        toast.error(response.error || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  // Handle mark as paid
  const handleMarkPaid = async (id) => {
    try {
      const response = await nightlifeBookingsService.markAsPaid(id);
      if (response.success) {
        toast.success('Booking marked as paid!');
        fetchBookings();
      } else {
        toast.error(response.error || 'Failed to mark as paid');
      }
    } catch (error) {
      console.error('Error marking as paid:', error);
      toast.error('Failed to mark as paid');
    }
  };

  // Handle view details
  const handleView = (booking) => {
    toast.success(`Viewing booking: ${booking.eventName}`);
    // You can implement a modal or navigate to detail page here
  };

  // Render pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= maxButtons - 1; i++) {
          buttons.push(i);
        }
        buttons.push('...');
        buttons.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        buttons.push(1);
        buttons.push('...');
        for (let i = totalPages - (maxButtons - 2); i <= totalPages; i++) {
          buttons.push(i);
        }
      } else {
        buttons.push(1);
        buttons.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          buttons.push(i);
        }
        buttons.push('...');
        buttons.push(totalPages);
      }
    }

    return buttons;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#343434] text-white p-4 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C1C9] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-[#343434] text-gray-100 p-4 font-sans flex flex-col">
        <div className="w-full rounded-lg overflow-hidden">
          {/* Header Section */}
          <div className="flex items-center justify-between p-6 bg-[#343434]">
            <h1 className="text-3xl font-semibold text-white">Event Registration Management</h1>
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="flex items-center">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    className="pl-10 pr-4 py-2 bg-[#F3FAFA1A] rounded-tl-[7.04px] rounded-bl-[7.04px] border-[1px] border-[#0000001A] text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#00C1C9] placeholder-gray-500"
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

          {/* Error State */}
          {error && (
            <div className="bg-red-900 bg-opacity-20 border border-red-500 text-red-400 px-6 py-3 mx-6 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Table Section */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-[#00C1C980]">
                <tr>
                  {['Event Name', 'Payment Status', 'Attendee Name', 'Email / Phone', 'Guests', 'Total Price', 'Registered On', 'Status', 'Action'].map((header) => (
                    <th
                      key={header}
                      scope="col"
                      className="px-6 py-4 text-xs font-medium text-gray-300 uppercase tracking-wider text-center whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {currentRegistrations.length > 0 ? (
                  currentRegistrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-[#3A3A3A] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">{reg.eventName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <span
                          className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                            reg.paymentStatus === 'Paid' 
                              ? 'bg-green-900 text-[#71F50C]' 
                              : 'bg-red-900 text-red-400'
                          }`}
                        >
                          {reg.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">{reg.attendeeName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 text-center font-mono">{reg.emailPhone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center font-medium">{reg.guests}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#00C1C9] text-center font-semibold">${reg.totalPrice}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 text-center">{reg.registeredOn}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <span
                          className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                            reg.status === 'Confirmed'
                              ? 'bg-green-900 text-[#71F50C]'
                              : reg.status === 'Pending'
                              ? 'bg-orange-900 text-[#FB6000]'
                              : 'bg-red-900 text-red-400'
                          }`}
                        >
                          {reg.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center justify-center gap-2">
                          {reg.status === 'Pending' ? (
                            <>
                              <button
                                onClick={() => handleConfirm(reg.id)}
                                className="text-green-400 hover:text-green-300 border border-green-400 p-2 rounded-full hover:bg-green-900 hover:bg-opacity-30 transition-all"
                                title="Confirm Booking"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
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
                                className="text-red-400 hover:text-red-300 border border-red-400 p-2 rounded-full hover:bg-red-900 hover:bg-opacity-30 transition-all"
                                title="Cancel Booking"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
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
                          ) : reg.status === 'Confirmed' ? (
                            <>
                              <button
                                onClick={() => handleView(reg)}
                                className="text-purple-400 hover:text-purple-300 border border-purple-400 p-2 rounded-full hover:bg-purple-900 hover:bg-opacity-30 transition-all"
                                title="View Details"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
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
                              {reg.paymentStatus === 'Unpaid' && (
                                <button
                                  onClick={() => handleMarkPaid(reg.id)}
                                  className="text-[#00C1C9] hover:text-cyan-300 border border-[#00C1C9] p-2 rounded-full hover:bg-cyan-900 hover:bg-opacity-30 transition-all"
                                  title="Mark as Paid"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                  </svg>
                                </button>
                              )}
                              <button
                                onClick={() => handleReject(reg.id)}
                                className="text-red-400 hover:text-red-300 border border-red-400 p-2 rounded-full hover:bg-red-900 hover:bg-opacity-30 transition-all"
                                title="Cancel Booking"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <line x1="18" y1="6" x2="6" y2="18"></line>
                                  <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                              </button>
                            </>
                          ) : (
                            <span className="text-gray-500 text-xs">No actions</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-6 py-8 text-center text-sm text-gray-400">
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Section */}
        {totalPages > 0 && (
          <div className="flex items-center justify-end p-6 gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-full bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

            {renderPaginationButtons().map((pageNumber, index) => (
              <button
                key={index}
                onClick={() => typeof pageNumber === 'number' && setCurrentPage(pageNumber)}
                disabled={pageNumber === '...'}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  pageNumber === currentPage
                    ? 'bg-[#00C1C9] text-white'
                    : pageNumber === '...'
                    ? 'bg-transparent text-gray-400 cursor-default'
                    : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
          </div>
        )}
      </div>
    </>
  );
}