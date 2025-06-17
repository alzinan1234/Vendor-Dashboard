// components/RegistrationTable.js
"use client"; // This is a client component, necessary for useState and event handlers

import Image from "next/image";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

// Assuming these icons are in your public/icon directory
// and match the colors in the screenshot (green check, red cross, purple eye)
// If you don't have these exact colored SVGs, you might need to use Heroicons
// and apply specific text colors to them (e.g., <CheckCircleIcon className="h-6 w-6 text-[#71F50C]" />)
// For now, I'll assume you have the colored SVGs as per your existing eye.svg usage.
import checkIcon from "../../../public/icon/right.svg"; // Placeholder for green check (if it's a checkmark, update filename)
import crossIcon from "../../../public/icon/trash.svg"; // Placeholder for red cross (if it's a cross, update filename)
import eyeIcon from "../../../public/icon/eye.svg";     // Your existing eye icon

const dummyRows = [
  {
    id: "NK-01",
    name: "Mason Brooks", // Changed to match screenshot
    email: "mason@gmail.com", // Changed to match screenshot
    date: "2024-01-21", // This column is not displayed in the final table structure based on screenshot
    userImage: "/image/userImage.png", // Added user image path
  },
  {
    id: "NK-02",
    name: "Alice Johnson",
    email: "alice@email.com",
    date: "2024-02-11",
    userImage: "/image/userImage.png",
  },
  {
    id: "NK-03",
    name: "Bob Smith",
    email: "bob@email.com",
    date: "2024-03-05",
    userImage: "/image/userImage.png",
  },
  {
    id: "NK-04",
    name: "Charlie Brown",
    email: "charlie@email.com",
    date: "2024-04-15",
    userImage: "/image/userImage.png",
  },
];

export default function RegistrationTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRows, setFilteredRows] = useState(dummyRows);

  // Function to handle search input changes
  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const newFilteredRows = dummyRows.filter(
      (row) =>
        row.id.toLowerCase().includes(term) ||
        row.name.toLowerCase().includes(term) ||
        row.email.toLowerCase().includes(term)
    );
    setFilteredRows(newFilteredRows);
  };

  // Action handlers (placeholder functions)
  const handleAccept = (rowId) => {
    // In a real application, you would perform an API call here
    // to update the registration status in your backend.
    console.log(`Accepted: ${rowId}`);
    // Example: update the local state to reflect the change, e.g., remove from table or change status
    // For this dummy example, we just alert.
    alert(`Accepted: ${rowId}`);
  };

  const handleReject = (rowId) => {
    // In a real application, you would perform an API call here
    console.log(`Rejected: ${rowId}`);
    alert(`Rejected: ${rowId}`);
  };

  const handleView = (rowId) => {
    // In a real application, you would navigate to a detailed view
    // or open a modal with more information.
    console.log(`Viewing details for: ${rowId}`);
    alert(`Viewing details for: ${rowId}`);
  };

  const handleFilterClick = () => {
    // This function would typically open a modal or show a dropdown
    // for more advanced filtering options.
    console.log("Filter button clicked!");
    alert("Filter button clicked! (Implement your filter modal/logic here)");
  };

  return (
    <div className="bg-[#343434] p-4 rounded-lg shadow-lg text-white">
      {/* Header section with title and search/filter */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[20px] font-semibold">
          Manage Registrations
        </h2>

        {/* Search Input Field and Filter Button */}
        <div className="flex items-center">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 bg-[#F3FAFA1A] rounded-tl-[7.04px] rounded-bl-[7.04px] border-[1px] border-[#0000001A] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <button
            onClick={handleFilterClick}
            className="hover:bg-gray-700 transition-colors bg-[#2A2A2A] p-[5px] rounded-tr-[7.04px] rounded-br-[7.04px]"
            aria-label="Filter" // Added aria-label for accessibility
          >
            {/* Filter SVG icon */}
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

      {/* Table container with overflow for responsiveness */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm"> {/* Removed text-left for global centering on cells */}
          <thead>
            <tr className="bg-[#1A5B64]"> {/* Table header row */}
              {/* Table header cells, all centered */}
              <th className="py-3 px-4 font-normal text-[14px] text-center">
                Name
              </th>
              <th className="py-3 px-4 font-normal text-[14px] text-center">
                Email
              </th>
              <th className="py-3 px-4 font-normal text-[14px] text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length > 0 ? (
              filteredRows.map((row) => (
                <tr key={row.id} className="border-b border-[#FFFFFF1A] last:border-b-0">
                  {/* Name cell: Uses flex to align image and text, then justify-center to center content */}
                  <td className="py-2 px-4 flex items-center justify-center">
                    <div className="flex items-center gap-2"> {/* Keeps image and text together */}
                      <Image
                        src={row.userImage}
                        alt={row.name}
                        width={24} // Adjusted size for the user image as per screenshot
                        height={24}
                        className="rounded-full"
                      />
                      <span>{row.name}</span>
                    </div>
                  </td>
                  {/* Email cell: Text content centered directly */}
                  <td className="py-2 px-4 text-center">{row.email}</td>
                  {/* Action cell: Flex container with justify-center to center action buttons */}
                  <td className="py-2">
                    <div className="flex items-center justify-center gap-2">
                      {/* Accept Icon Button */}
                      <button
                        onClick={() => handleAccept(row.id)}
                        className="p-1 rounded-full bg-[#0000001A]  transition-colors group"
                        aria-label="Accept Registration"
                      >
                        {/* Image for checkmark icon (ensure it's correctly placed and named in public/icon) */}
                        <Image
                          src={checkIcon} // This should point to a checkmark SVG, not right.svg based on typical UIs
                          alt="Accept"
                          width={25}
                          height={25}
                          className="group-hover:filter group-hover:brightness-0 group-hover:invert" // For hover effect
                        />
                      </button>

                      {/* Reject Icon Button */}
                      <button
                        onClick={() => handleReject(row.id)}
                        className="p-1 rounded-full bg-[#0000001A]  transition-colors group"
                        aria-label="Reject Registration"
                      >
                        {/* Image for cross icon (ensure it's correctly placed and named in public/icon) */}
                        <Image
                          src={crossIcon} // This should point to a cross/X SVG, not trash.svg based on typical UIs
                          alt="Reject"
                          width={25}
                          height={25}
                          className="group-hover:filter group-hover:brightness-0 group-hover:invert" // For hover effect
                        />
                      </button>

                      {/* View Icon Button */}
                      <button
                        onClick={() => handleView(row.id)}
                        className="p-1 rounded-full bg-[#0000001A]  transition-colors group"
                        aria-label="View Details"
                      >
                        {/* Image for eye icon (ensure it's correctly placed and named in public/icon) */}
                        <Image
                          src={eyeIcon}
                          alt="View"
                          width={25}
                          height={25}
                          className="group-hover:filter group-hover:brightness-0 group-hover:invert" // For hover effect
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                {/* Message when no registrations are found, spanning all 3 columns */}
                <td colSpan="3" className="text-center py-4 text-gray-400">
                  No matching registrations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
