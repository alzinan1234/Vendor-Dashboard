"use client";

import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import AddReservationForm from "./AddReservationForm"; // Import the new component

const reservations = [
  {
    id: 1,
    table: "Table #1",
    guestName: "Robo Gladiators",
    partySize: 4,
    time: "12:30 PM",
    date: "March 15, 2024",
    avatar: "https://placehold.co/24x24/00C1C9/FFFFFF?text=RG", // Placeholder image for avatar
  },
  {
    id: 2,
    table: "Table #2",
    guestName: "Robo Gladiators",
    partySize: 2,
    time: "11:30 PM",
    date: "March 15, 2024",
    avatar: "https://placehold.co/24x24/00C1C9/FFFFFF?text=RG",
  },
  {
    id: 3,
    table: "Table #3",
    guestName: "Robo Gladiators",
    partySize: 1,
    time: "10:30 PM",
    date: "March 15, 2024",
    avatar: "https://placehold.co/24x24/00C1C9/FFFFFF?text=RG",
  },
  {
    id: 4,
    table: "Table #4",
    guestName: "Robo Gladiators",
    partySize: 4,
    time: "8:30 PM",
    date: "March 15, 2024",
    avatar: "https://placehold.co/24x24/00C1C9/FFFFFF?text=RG",
  },
  {
    id: 5,
    table: "Table #5",
    guestName: "Another Guest",
    partySize: 3,
    time: "7:00 PM",
    date: "March 16, 2024",
    avatar: "https://placehold.co/24x24/FF6347/FFFFFF?text=AG",
  },
  {
    id: 6,
    table: "Table #6",
    guestName: "Third Party",
    partySize: 5,
    time: "9:00 PM",
    date: "March 16, 2024",
    avatar: "https://placehold.co/24x24/9370DB/FFFFFF?text=TP",
  },
  {
    id: 7,
    table: "Table #7",
    guestName: "Fourth Guest",
    partySize: 2,
    time: "6:00 PM",
    date: "March 17, 2024",
    avatar: "https://placehold.co/24x24/3CB371/FFFFFF?text=FG",
  },
  {
    id: 8,
    table: "Table #8",
    guestName: "Fifth Group",
    partySize: 6,
    time: "8:00 PM",
    date: "March 17, 2024",
    avatar: "https://placehold.co/24x24/FFA500/FFFFFF?text=FG",
  },
  {
    id: 9,
    table: "Table #9",
    guestName: "Sixth Person",
    partySize: 1,
    time: "5:00 PM",
    date: "March 18, 2024",
    avatar: "https://placehold.co/24x24/6A5ACD/FFFFFF?text=SP",
  },
  {
    id: 10,
    table: "Table #10",
    guestName: "Seventh Party",
    partySize: 4,
    time: "1:00 PM",
    date: "March 18, 2024",
    avatar: "https://placehold.co/24x24/DA70D6/FFFFFF?text=SP",
  },
];

export default function ManageNewReservation() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddReservationForm, setShowAddReservationForm] = useState(false); // State for form visibility
  const itemsPerPage = 6; // Set the number of items per page as seen in the screenshot

  const filteredReservations = reservations.filter((r) =>
    r.guestName.toLowerCase().includes(search.toLowerCase())
  );

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);

  // Get current reservations for the displayed page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReservations = filteredReservations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Go to previous page
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Go to next page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }  

  return (
    <>
      {showAddReservationForm ? (
        <AddReservationForm onClose={() => setShowAddReservationForm(false)} />
      ) : (
        <>
          <div className="bg-[#3F3F3F] text-white p-4 rounded-md font-sans">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Manage New Reservation</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddReservationForm(true)} // Set state to true on click
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
                    className="lucide lucide-plus"
                  >
                    <path d="M12 5V19" />
                    <path d="M5 12H19" />
                  </svg>
                  Add Reservation
                </button>
              <div className="flex items-center gap-4">
                            <div className="flex items-center ">
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
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentReservations.map((res) => (
                    <tr
                      key={res.id}
                      className="border-b-[0.49px] border-b-[rgba(208,208,208,0.8)] h"
                    >
                      <td className="px-4 py-2 align-middle text-center">
                        {res.table}
                      </td>
                      <td className="px-4 py-2 flex items-center gap-2 justify-center align-middle">
                        <img
                          src={res.avatar}
                          alt={res.guestName}
                          className="w-6 h-6 rounded-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://placehold.co/24x24/00C1C9/FFFFFF?text=${res.guestName.charAt(
                              0
                            )}`;
                          }} // Fallback for image loading errors
                        />
                        {res.guestName}
                      </td>
                      <td className="px-4 py-2 align-middle text-center">
                        {res.partySize}
                      </td>
                      <td className="px-4 py-2 align-middle text-center">
                        {res.time}
                      </td>
                      <td className="px-4 py-2 align-middle text-center">
                        {res.date}
                      </td>
                      <td className="px-4 py-2 flex items-center gap-[10px] justify-center align-middle">
                    
                        <button className="text-red-500 hover:text-red-700 border border-[#FF0000] rounded-[51px] p-[5px] ">
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

                        {/* Replaced Next.js Link with a standard anchor tag */}
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
            {/* Show ellipsis if there are more than 4 pages and not near the end */}
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
