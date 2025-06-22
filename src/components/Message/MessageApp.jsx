"use client";
//

import React, { useState, useMemo } from "react";
import {
  Search,
  MoreHorizontal,
  Send,
  Smile,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const MessageApp = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Mock data for messages
  const contacts = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "/avater/user1.jpg",
      lastMessage:
        "Hello, I'd like to reserve a Deluxe Suite for two nights startin",
      time: "10:25",
      unreadCount: 0,
      isActive: false,
    },
    {
      id: 2,
      name: "Ahmed Latif",
      avatar: "/avater/user2.jpg",
      lastMessage:
        "Hi, I'm planning to visit next weekend and need a single roo",
      time: "10:25",
      unreadCount: 2,
      isActive: false,
    },
    {
      id: 3,
      name: "Emily Carter",
      avatar: "/avater/user3.jpg",
      lastMessage: "Good evening, I need a family room for 4 people from June",
      time: "10:25",
      unreadCount: 2,
      isActive: false,
    },
    {
      id: 4,
      name: "Thomas Müller",
      avatar: "/avater/user4.jpg",
      lastMessage: "Dear Team, I am attending a conference nearby and would l",
      time: "10:25",
      unreadCount: 2,
      isActive: false,
    },
    {
      id: 5,
      name: "Leila Ait El Hadj",
      avatar: "/avater/user2.jpg",
      lastMessage:
        "Hello, I'd like to book a room with a sea view for my honeym",
      time: "10:25",
      unreadCount: 2,
      isActive: false,
    },
    {
      id: 6,
      name: "El Aurassi Hotel",
      avatar: "/avater/user1.jpg",
      lastMessage:
        "Yeah, there are only 3 spots left. Let me book for both of us",
      time: "10:25",
      unreadCount: 2,
      isActive: false,
    },
    {
      id: 7,
      name: "El Aurassi Hotel",
      avatar: "/avater/user1.jpg",
      lastMessage:
        "Yeah, there are only 3 spots left. Let me book for both of us",
      time: "10:25",
      unreadCount: 2,
      isActive: true,
    },
   
  ];

  // Mock conversation data
  const conversation = [
    {
      id: 1,
      sender: "Sarah Johnson",
      message:
        "Hi, I'd like to confirm my booking for March 15-18. Could you please verify?",
      time: "10:25",
      isOwn: false,
      avatar: "/avater/user1.jpg",
    },
    {
      id: 2,
      sender: "Sarah Johnson",
      message:
        "Hi, I'd like to confirm my booking for March 15-18. Could you please verify?",
      time: "10:25",
      isOwn: false,
      avatar: "/api/placeholder/32/32",
    },
    {
      id: 3,
      sender: "Hotel Staff",
      message:
        "Hello! Yes, your booking for March 15-18 at the Deluxe Room is confirmed. Let us know if you need assistance.",
      time: "10:26",
      isOwn: true,
      avatar: "/api/placeholder/32/32",
    },
    {
      id: 4,
      sender: "Sarah Johnson",
      message:
        "That sounds perfect. Do we need to book now? I don't want to miss out.",
      time: "10:27",
      isOwn: false,
      avatar: "/api/placeholder/32/32",
    },
    {
      id: 5,
      sender: "Hotel Staff",
      message:
        "Yeah, there are only 3 spots left. Let me book for both of us. You cool splitting the bill?",
      time: "10:28",
      isOwn: true,
      avatar: "/api/placeholder/32/32",
    },
    {
      id: 6,
      sender: "Hotel Staff",
      message:
        "Yeah, there are only 3 spots left. Let me book for both of us. You cool splitting the bill?",
      time: "10:28",
      isOwn: true,
      avatar: "/api/placeholder/32/32",
    },
  ];

  // Filter contacts based on search
  const filteredContacts = useMemo(() => {
    if (!searchQuery) return contacts;
    return contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContacts = filteredContacts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Add message logic here
      setMessageInput("");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  return (
    <>
      <div className=" relative bg-[#343434] rounded-lg p-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-semibold">Message</h1>
          <div className="flex items-center ">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 bg-[#F3FAFA1A] rounded-tl-[7.04px] rounded-bl-[7.04px] border-[1px] border-[#0000001A] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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

        <div className="flex gap-[121px] h-screen bg-[#343434] text-white rounded-lg overflow-hidden ">
          {/* Left Sidebar - Message List */}
          <div className="   flex flex-col">
            {/* Header */}

            {/* Message List */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {paginatedContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => handleContactClick(contact)}
                  className={`flex items-center p-4 bg-[#FFFFFF1A] rounded-2xl shadow-sm cursor-pointer border border-transparent hover:border-cyan-500 transition-all ${
                    selectedContact?.id === contact.id ? "border-cyan-500" : ""
                  }`}
                >
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-700"
                  />
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-semibold text-white truncate">
                        {contact.name}
                      </h3>
                      <span className="text-xs text-gray-300">
                        {contact.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-200 truncate">
                      {contact.lastMessage}
                    </p>
                  </div>
                  {contact.unreadCount > 0 && (
                    <div className="ml-3 w-7 h-7 bg-cyan-500 rounded flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {contact.unreadCount}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
           
          </div>
          {/* Right Side - Conversation */}
          <div className="flex-1 h-screen flex flex-col items-center ">
            {selectedContact ? (
              <div className="w-full  bg-[#FFFFFF1A] rounded-2xl flex flex-col shadow-lg ">
                {/* Conversation Header */}
                <div className="p-6 border-b border-[#FFFFFF33]  flex items-center justify-between rounded-t-2xl">
                  <div className="flex items-center">
                    <img
                      src={selectedContact.avatar}
                      alt={selectedContact.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#FFFFFF33]"
                    />
                    <h2 className="ml-3 text-lg font-semibold">
                      {selectedContact.name}
                    </h2>
                  </div>
                  <button className="p-2  rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 25 25"
                      fill="none"
                    >
                      <rect
                        x="0.520508"
                        y="0.719727"
                        width="23.76"
                        height="23.76"
                        rx="11.88"
                        fill="#F4F4F4"
                        fill-opacity="0.1"
                      />
                      <circle
                        cx="12.4002"
                        cy="12.5999"
                        r="0.99"
                        stroke="white"
                        stroke-width="1.98"
                        stroke-linecap="round"
                      />
                      <circle
                        cx="6.4607"
                        cy="12.5999"
                        r="0.99"
                        stroke="white"
                        stroke-width="1.98"
                        stroke-linecap="round"
                      />
                      <circle
                        cx="18.3406"
                        cy="12.5999"
                        r="0.99"
                        stroke="white"
                        stroke-width="1.98"
                        stroke-linecap="round"
                      />
                    </svg>
                  </button>
                </div>
                {/* Conversation Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {conversation.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.isOwn ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!msg.isOwn && (
                        <img
                          src={selectedContact.avatar}
                          alt={msg.sender}
                          className="w-8 h-8 rounded-full object-cover mr-3 flex-shrink-0"
                        />
                      )}
                      <div
                        className={`relative max-w-xs lg:max-w-md px-5 py-3 rounded-2xl text-sm font-normal ${
                          msg.isOwn
                            ? "bg-[#383838] text-white rounded-br-none"
                            : "bg-[#383838] text-white rounded-bl-none"
                        }`}
                      >
                        <span>{msg.message}</span>
                        {/* Chat bubble tail */}
                        <span
                          className={`absolute ${
                            msg.isOwn ? "right-0 bottom-0" : "left-0 bottom-0"
                          } w-0 h-0 border-t-8 border-t-transparent ${
                            msg.isOwn
                              ? "border-l-8 border-l-cyan-500"
                              : "border-r-8 border-r-[#232323]"
                          } border-b-0`}
                        ></span>
                      </div>
                      {msg.isOwn && (
                        <img
                          src="/api/placeholder/32/32"
                          alt="You"
                          className="w-8 h-8 rounded-full object-cover ml-3 flex-shrink-0"
                        />
                      )}
                    </div>
                  ))}
                </div>
                {/* Message Input */}
                <div className="p-4 flex items-center gap-3 border-t border-gray-700 #FFFFFF1A rounded-b-2xl">
                  <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#007DD01A] text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
  <path d="M12.5 6.33984L12.5 18.2198" stroke="white" stroke-width="0.99" stroke-linecap="round"/>
  <path d="M18.4404 12.2798L6.56043 12.2798" stroke="white" stroke-width="0.99" stroke-linecap="round"/>
</svg>
                  </button>
                  <input
                    type="text"
                    placeholder="Message"
                    className="flex-1 px-4 relative py-2 rounded-full bg-[#007DD01A] text-white border-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />

                  <div className="w-10 h-10 flex items-center justify-center absolute right-23 rounded-full " >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="25"
                      viewBox="0 0 24 25"
                      fill="none"
                    >
                      <circle
                        cx="12.0594"
                        cy="12.2801"
                        r="9.405"
                        stroke="white"
                        stroke-width="0.99"
                        stroke-linecap="round"
                      />
                      <path
                        d="M8.3061 15.624C8.72374 15.9857 9.29504 16.2632 9.94232 16.4501C10.5935 16.6381 11.3231 16.7348 12.0596 16.7348C12.7962 16.7348 13.5257 16.6381 14.1769 16.4501C14.8242 16.2632 15.3955 15.9857 15.8131 15.624"
                        stroke="white"
                        stroke-width="0.99"
                        stroke-linecap="round"
                      />
                      <circle
                        cx="9.08961"
                        cy="10.3001"
                        r="0.99"
                        fill="white"
                        stroke="white"
                        stroke-width="0.99"
                        stroke-linecap="round"
                      />
                      <circle
                        cx="15.03"
                        cy="10.3001"
                        r="0.99"
                        fill="white"
                        stroke="white"
                        stroke-width="0.99"
                        stroke-linecap="round"
                      />
                    </svg>
                  </div>
                  <button
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-cyan-500 text-white hover:bg-cyan-600 transition"
                    onClick={handleSendMessage}
                  >
                    <Send className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-xl">
                Sleect a conversation
              </div>
            )}
          </div>
        </div>
      </div>
       {/* Pagination */}
                <div className="flex items-center justify-end p-4 rounded-b-lg">
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
                          : 'text-gray-200 hover:bg-gray-500'
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
                  {totalPages > 5 && (
                    <>
                      {currentPage < totalPages - 2 && <span className="mx-1 text-gray-300">....</span>}
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        className={`px-4 py-2 mx-1 rounded text-sm font-medium ${
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
};

export default MessageApp;
