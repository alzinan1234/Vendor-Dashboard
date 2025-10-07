"use client";

import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import AddReservationForm from "./AddReservationForm";
import { reservationService } from "@/lib/reservationService";


export default function ManageNewReservation() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddReservationForm, setShowAddReservationForm] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const itemsPerPage = 6;

  // Fetch reservations on mount
  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    const result = await reservationService.getReservations();
    
    if (result.success) {
      setReservations(result.data);
      setError(null);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleCancelReservation = async (reservationId) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;

    const result = await reservationService.updateReservationStatus(reservationId, 'cancelled');
    
    if (result.success) {
      fetchReservations(); // Refresh list
      alert('Reservation cancelled successfully');
    } else {
      alert(result.error);
    }
  };

  const filteredReservations = reservations.filter((r) =>
    r.guest_name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReservations = filteredReservations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const formatTime = (time) => {
    // Convert 18:30:00 to 6:30 PM
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (date) => {
    // Convert 2025-10-15 to October 15, 2025
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return <div className="text-white p-4">Loading reservations...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <>
      {showAddReservationForm ? (
        <AddReservationForm 
          onClose={() => setShowAddReservationForm(false)} 
          onSuccess={fetchReservations}
        />
      ) : (
        <>
          <div className="bg-[#3F3F3F] text-white p-4 rounded-md font-sans">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Manage New Reservation</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddReservationForm(true)}
                  className="flex items-center gap-2 bg-[#FFFFFF1A] text-white px-4 py-2 rounded-full text-[12px] font-normal hover:bg-[#00A0A8] transition-colors"
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
                    <path d="M12 5V19" />
                    <path d="M5 12H19" />
                  </svg>
                  Add Reservation
                </button>
                <div className="flex items-center">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search"
                      className="pl-10 pr-4 py-2 bg-[#F3FAFA1A] rounded-tl-[7.04px] rounded-bl-[7.04px] border-[1px] border-[#0000001A] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                      }}
                      autoComplete="off"
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
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-[#00C1C980] text-white text-center">
                    <th className="px-4 py-2">Table</th>
                    <th className="px-4 py-2">Guest Name</th>
                    <th className="px-4 py-2">Party Size</th>
                    <th className="px-4 py-2">Time</th>
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentReservations.map((res) => (
                    <tr
                      key={res.id}
                      className="border-b-[0.49px] border-b-[rgba(208,208,208,0.8)]"
                    >
                      <td className="px-4 py-2 align-middle text-center">
                        {res.table_number || 'Not assigned'}
                      </td>
                      <td className="px-4 py-2 flex items-center gap-2 justify-center align-middle">
                        <div className="w-6 h-6 rounded-full bg-[#00C1C9] flex items-center justify-center text-xs">
                          {res.guest_name.charAt(0)}
                        </div>
                        {res.guest_name}
                      </td>
                      <td className="px-4 py-2 align-middle text-center">
                        {res.party_size}
                      </td>
                      <td className="px-4 py-2 align-middle text-center">
                        {formatTime(res.booking_time)}
                      </td>
                      <td className="px-4 py-2 align-middle text-center">
                        {formatDate(res.booking_date)}
                      </td>
                      <td className="px-4 py-2 align-middle text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          res.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                          res.status === 'confirmed' ? 'bg-green-500/20 text-green-500' :
                          res.status === 'cancelled' ? 'bg-red-500/20 text-red-500' :
                          'bg-blue-500/20 text-blue-500'
                        }`}>
                          {res.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 flex items-center gap-[10px] justify-center align-middle">
                        <button 
                          onClick={() => handleCancelReservation(res.id)}
                          className="text-red-500 hover:text-red-700 border border-[#FF0000] rounded-[51px] p-[5px]"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 12 11"
                            fill="none"
                          >
                            <path
                              d="M10.6668 0.684326L1.3335 10.0177M1.3335 0.684326L10.6668 10.0177"
                              stroke="#FF0000"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>

                        <a
                          href={`/vendor/manage-new-reservation/${res.id}`}
                          className="text-purple-400 border border-[#C267FF] hover:text-purple-600 rounded-[51px] p-[5px]"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 11"
                            fill="none"
                          >
                            <path
                              d="M14.3628 4.63424C14.5655 4.91845 14.6668 5.06056 14.6668 5.27091C14.6668 5.48127 14.5655 5.62338 14.3628 5.90759C13.4521 7.18462 11.1263 9.93758 8.00016 9.93758C4.87402 9.93758 2.54823 7.18462 1.63752 5.90759C1.43484 5.62338 1.3335 5.48127 1.3335 5.27091C1.3335 5.06056 1.43484 4.91845 1.63752 4.63424C2.54823 3.35721 4.87402 0.604248 8.00016 0.604248C11.1263 0.604248 13.4521 3.35721 14.3628 4.63424Z"
                              stroke="#C267FF"
                            />
                            <path
                              d="M10 5.271C10 4.16643 9.10457 3.271 8 3.271C6.89543 3.271 6 4.16643 6 5.271C6 6.37557 6.89543 7.271 8 7.271C9.10457 7.271 10 6.37557 10 5.271Z"
                              stroke="#C267FF"
                            />
                          </svg>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Pagination */}
          <div className="flex justify-end items-center mt-4 space-x-2">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`px-4 py-3 rounded-full ${
                currentPage === 1
                  ? "bg-[#2A2A2A] text-gray-500 cursor-not-allowed"
                  : "bg-[#2A2A2A] hover:bg-gray-700"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="8"
                height="15"
                viewBox="0 0 8 15"
                fill="none"
              >
                <path
                  d="M6.99995 13.45C6.99995 13.45 1.00001 9.03102 0.999999 7.4499C0.999986 5.86879 7 1.44995 7 1.44995"
                  stroke="#E2E2E2"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === number
                    ? "bg-[#21F6FF] text-white"
                    : "bg-[#2A2A2A] hover:bg-gray-700"
                }`}
              >
                {number}
              </button>
            ))}
            {totalPages > 4 && currentPage < totalPages - 2 && (
              <span className="text-gray-400">...</span>
            )}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-3 rounded-full ${
                currentPage === totalPages
                  ? "bg-[#2A2A2A] text-gray-500 cursor-not-allowed"
                  : "bg-[#2A2A2A] hover:bg-gray-700"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="8"
                height="15"
                viewBox="0 0 8 15"
                fill="none"
              >
                <path
                  d="M1.00005 1.44995C1.00005 1.44995 6.99999 5.86889 7 7.45C7.00001 9.03111 1 13.45 1 13.45"
                  stroke="#C8C8C8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </>
      )}
    </>
  );
}