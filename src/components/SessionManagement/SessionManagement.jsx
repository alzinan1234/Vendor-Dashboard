"use client";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link"; // Import Link for navigation
import { FaPlus, FaFileAlt } from "react-icons/fa"; // Removed unused icons
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

// Import the session management functions
import { getAllSessions, addSession, updateSession, deleteSession } from "../lib/sessions";

// Import the new modal components
import SessionFormModal from './SessionFormModal';
import ConfirmDeleteModal from './ConfirmDeleteModal';


const itemsPerPage = 10; // Number of items to display per page

const SessionManagement = () => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false); // For Add/Edit modal
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false); // For Delete confirmation
  const [sessionToEdit, setSessionToEdit] = useState(null); // Holds data for the session being edited
  const [sessionToDeleteId, setSessionToDeleteId] = useState(null); // Holds the ID of the session to delete
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSessions, setCurrentSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Function to fetch sessions
  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const data = await getAllSessions();
      setCurrentSessions(data);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
      // Handle error, e.g., show a message to the user
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch sessions on component mount
  useEffect(() => {
    fetchSessions();
  }, []);

  // Filtered sessions based on search term
  const filteredSessions = useMemo(() => {
    if (!currentSessions) return []; // Ensure currentSessions is available
    return currentSessions.filter(session =>
      session.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.therapist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [currentSessions, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handler for adding/updating a session
  const handleSaveSession = async (sessionData) => {
    try {
      if (sessionData.id) {
        // Update existing session
        await updateSession(sessionData);
      } else {
        // Add new session
        await addSession(sessionData);
      }
      fetchSessions(); // Re-fetch sessions to update the list
    } catch (error) {
      console.error("Failed to save session:", error);
      // Handle error
    }
  };

  // Handler for opening the Add/Edit modal
  const handleOpenFormModal = (session = null) => {
    setSessionToEdit(session); // Set session to edit, or null for new
    setIsFormModalOpen(true);
  };

  // Handler for closing the Add/Edit modal
  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSessionToEdit(null); // Clear session to edit state
  };

  // Handler for opening the delete confirmation modal
  const handleOpenDeleteConfirmModal = (sessionId) => {
    setSessionToDeleteId(sessionId);
    setIsDeleteConfirmModalOpen(true);
  };

  // Handler for confirming delete
  const handleConfirmDelete = async () => {
    try {
      await deleteSession(sessionToDeleteId);
      fetchSessions(); // Re-fetch sessions to update the list
    } catch (error) {
      console.error("Failed to delete session:", error);
      // Handle error
    } finally {
      setIsDeleteConfirmModalOpen(false);
      setSessionToDeleteId(null);
    }
  };

  // Handler for closing the delete confirmation modal
  const handleCloseDeleteConfirmModal = () => {
    setIsDeleteConfirmModalOpen(false);
    setSessionToDeleteId(null);
  };


  // Helper for rendering pagination buttons
  const renderPaginationButtons = () => {
    const pages = [];
    const maxPageButtons = 5; // Max number of page buttons to display

    if (totalPages <= maxPageButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1); // Always show first page

      const start = Math.max(2, currentPage - Math.floor(maxPageButtons / 2) + 1);
      const end = Math.min(totalPages - 1, currentPage + Math.floor(maxPageButtons / 2) - 1);

      if (start > 2) pages.push('...'); // Ellipsis after first page

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) pages.push('...'); // Ellipsis before last page

      pages.push(totalPages); // Always show last page
    }

    return pages.map((pageNumber, index) => (
      <React.Fragment key={index}>
        {pageNumber === '...' ? (
          <span className="px-2 text-gray-400">...</span>
        ) : (
          <button
            onClick={() => handlePageChange(pageNumber)}
            className={`w-8 h-8 flex items-center justify-center rounded ${
              currentPage === pageNumber
                ? "bg-cyan-500 text-white"
                : "hover:bg-[#2d2d2d] text-white"
            }`}
          >
            {pageNumber}
          </button>
        )}
      </React.Fragment>
    ));
  };


  return (
    <div>
      <div className="bg-[#343434] p-6 rounded-lg text-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Session Management</h2>
          <div className="flex items-center gap-2">
            {/* Add New Session Button */}
             <button
  onClick={() => handleOpenFormModal(true)}
  className="flex items-center gap-2 pl-[2px] pr-[13px] py-1"
  style={{
    borderRadius: '22px',
    background: 'rgba(255,255,255,0.10)',
  }}
>
  <span className="w-[27px] h-[27px] flex items-center justify-center text-black rounded-full bg-white">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 27 27" fill="none">
      <path d="M13.49 6.75L13.49 20.25" stroke="#6A6A6A" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M20.24 13.5L6.73999 13.5" stroke="#6A6A6A" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  </span>
  <span className="text-white font-medium text-[12px]">Add New Session</span>
</button>
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
          <table className="min-w-full border-separate border-spacing-y-4 ">
            <thead className="bg-[#17787C]">
              <tr className="text-sm text-white">
                <th className="py-3 px-4 text-center">Session ID</th>
                <th className="py-3 px-4 text-center">Session Name</th>
                <th className="py-3 px-4 text-center">Thumbnail</th>
                <th className="py-3 px-4 text-center">Time</th>
                <th className="py-3 px-4 text-center">Therapist</th>
                <th className="py-3 px-4 text-center">Sessions</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">Loading sessions...</td>
                </tr>
              ) : (
                paginatedSessions.length > 0 ? (
                  paginatedSessions.map((session) => (
                    <tr key={session.id} className="text-sm border-b border-gray-600 text-white py-5">
                      <td className="py-2 px-4 text-center border-b border-gray-600">{session.id}</td>
                      <td className="py-2 px-4 text-center border-b border-gray-600">{session.name}</td>
                      <td className="py-2 px-4 text-center border-b border-gray-600">
                        {session.thumbnail ? (
                          <Image src={session.thumbnail} alt="Thumbnail" width={40} height={40} className="mx-auto rounded object-cover" />
                        ) : (
                          <FaFileAlt className="mx-auto text-gray-400 text-lg" />
                        )}
                      </td>
                      <td className="py-2 px-4 text-center border-b border-gray-600">{session.time}</td>
                      <td className="py-2 px-4 text-center border-b border-gray-600">{session.therapist}</td>
                      <td className="py-2 px-4 text-center text-green-400 border-b border-gray-600">{session.status}</td>
                      <td className="py-2 px-4 text-center border-b border-gray-600">
                        <div className="flex items-center justify-center gap-3">
                          {/* Use Link to navigate to the dynamic details page */}
                          <Link href={`/admin/session-management/${session.id}`} passHref>
                            <button className="focus:outline-none">
                              <Image src="/icon/eye.svg" alt="View" width={25} height={25} />
                            </button>
                          </Link>
                          {/* Edit Button */}
                          <button onClick={() => handleOpenFormModal(session)} className="focus:outline-none">
                            <Image src="/icon/edit.png" alt="Edit" width={25} height={25} />
                          </button>
                          {/* Delete Button */}
                          <button onClick={() => handleOpenDeleteConfirmModal(session.id)} className="focus:outline-none">
                            <Image src="/icon/trash.svg" alt="Delete" width={25} height={25} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">No sessions found.</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-6 gap-2 text-sm text-white">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="w-8 h-8 flex items-center border rounded-full justify-center  hover:bg-[#2d2d2d] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
  <path d="M1.00005 1C1.00005 1 6.99999 5.41893 7 7.00005C7.00001 8.58116 1 13 1 13" stroke="#C8C8C8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
        </button>
        {renderPaginationButtons()}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-[#2d2d2d] disabled:opacity-50 disabled:cursor-not-allowed"
        >
        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="14" viewBox="0 0 8 14" fill="none">
  <path d="M6.99995 13C6.99995 13 1.00001 8.58107 0.999999 6.99995C0.999986 5.41884 7 1 7 1" stroke="#E2E2E2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
        </button>
      </div>

      {/* Session Add/Edit Modal */}
      <SessionFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSave={handleSaveSession}
        sessionToEdit={sessionToEdit}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteConfirmModalOpen}
        onClose={handleCloseDeleteConfirmModal}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete session ${sessionToDeleteId}? This action cannot be undone.`}
      />
    </div>
  );
};

export default SessionManagement;
