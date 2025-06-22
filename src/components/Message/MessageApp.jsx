"use client";
//

import React, { useState, useMemo } from 'react';
import { Search, MoreHorizontal, Send, Smile, ChevronLeft, ChevronRight } from 'lucide-react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const MessageApp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Mock data for messages
  const contacts = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: '/api/placeholder/40/40',
      lastMessage: 'Hello, I\'d like to reserve a Deluxe Suite for two nights startin',
      time: '10:25',
      unreadCount: 0,
      isActive: false
    },
    {
      id: 2,
      name: 'Ahmed Latif',
      avatar: '/api/placeholder/40/40',
      lastMessage: 'Hi, I\'m planning to visit next weekend and need a single roo',
      time: '10:25',
      unreadCount: 2,
      isActive: false
    },
    {
      id: 3,
      name: 'Emily Carter',
      avatar: '/api/placeholder/40/40',
      lastMessage: 'Good evening, I need a family room for 4 people from June',
      time: '10:25',
      unreadCount: 2,
      isActive: false
    },
    {
      id: 4,
      name: 'Thomas Müller',
      avatar: '/api/placeholder/40/40',
      lastMessage: 'Dear Team, I am attending a conference nearby and would l',
      time: '10:25',
      unreadCount: 2,
      isActive: false
    },
    {
      id: 5,
      name: 'Leila Ait El Hadj',
      avatar: '/api/placeholder/40/40',
      lastMessage: 'Hello, I\'d like to book a room with a sea view for my honeym',
      time: '10:25',
      unreadCount: 2,
      isActive: false
    },
    {
      id: 6,
      name: 'El Aurassi Hotel',
      avatar: '/api/placeholder/40/40',
      lastMessage: 'Yeah, there are only 3 spots left. Let me book for both of us',
      time: '10:25',
      unreadCount: 2,
      isActive: false
    },
    {
      id: 7,
      name: 'El Aurassi Hotel',
      avatar: '/api/placeholder/40/40',
      lastMessage: 'Yeah, there are only 3 spots left. Let me book for both of us',
      time: '10:25',
      unreadCount: 2,
      isActive: true
    }
  ];

  // Mock conversation data
  const conversation = [
    {
      id: 1,
      sender: 'Sarah Johnson',
      message: 'Hi, I\'d like to confirm my booking for March 15-18. Could you please verify?',
      time: '10:25',
      isOwn: false,
      avatar: '/api/placeholder/32/32'
    },
    {
      id: 2,
      sender: 'Hotel Staff',
      message: 'Hello! Yes, your booking for March 15-18 at the Deluxe Room is confirmed. Let us know if you need assistance.',
      time: '10:26',
      isOwn: true,
      avatar: '/api/placeholder/32/32'
    },
    {
      id: 3,
      sender: 'Sarah Johnson',
      message: 'That sounds perfect. Do we need to book now? I don\'t want to miss out.',
      time: '10:27',
      isOwn: false,
      avatar: '/api/placeholder/32/32'
    },
    {
      id: 4,
      sender: 'Hotel Staff',
      message: 'Yeah, there are only 3 spots left. Let me book for both of us. You cool splitting the bill?',
      time: '10:28',
      isOwn: true,
      avatar: '/api/placeholder/32/32'
    }
  ];

  // Filter contacts based on search
  const filteredContacts = useMemo(() => {
    if (!searchQuery) return contacts;
    return contacts.filter(contact => 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Pagination logic
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContacts = filteredContacts.slice(startIndex, startIndex + itemsPerPage);

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Add message logic here
      setMessageInput('');
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
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };


  return (
  <>
  
    <div className="flex h-screen bg-[#343434] text-white rounded-lg overflow-hidden">
      {/* Left Sidebar - Message List */}
      <div className="w-96  border-r border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-semibold mb-4">Message</h1>
          
          {/* Search Bar */}
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

        {/* Message List */}
        <div className="flex-1 overflow-y-auto">
          {paginatedContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => handleContactClick(contact)}
              className={`flex items-center p-4 hover:bg-gray-700 cursor-pointer border-b border-gray-700 ${
                selectedContact?.id === contact.id ? 'bg-gray-700' : ''
              }`}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
                  <span className="text-sm font-medium">{contact.name.charAt(0)}</span>
                </div>
                {contact.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">{contact.unreadCount}</span>
                  </div>
                )}
              </div>
              
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-medium text-white truncate">{contact.name}</h3>
                  <span className="text-xs text-gray-400">{contact.time}</span>
                </div>
                <p className="text-sm text-gray-300 truncate">{contact.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>

    
      </div>

      {/* Right Side - Conversation */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Conversation Header */}
            <div className="p-4 border-b border-gray-700 ">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
                    <span className="text-sm font-medium">{selectedContact.name.charAt(0)}</span>
                  </div>
                  <h2 className="ml-3 text-lg font-medium">{selectedContact.name}</h2>
                </div>
                <button className="p-2 hover:bg-gray-700 rounded">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Conversation Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversation.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  {!msg.isOwn && (
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-xs font-medium">{msg.sender.charAt(0)}</span>
                    </div>
                  )}
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      msg.isOwn
                        ? 'bg-cyan-500 text-white'
                        : 'bg-gray-700 text-white'
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                  </div>
                  {msg.isOwn && (
                    <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
                      <span className="text-xs font-medium">H</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-700 bg-gray-800">
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Message"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-full border border-gray-600 focus:outline-none focus:border-cyan-500 pr-12"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:bg-gray-600 rounded-full p-1">
                    <Smile className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <button
                  onClick={handleSendMessage}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white p-3 rounded-full transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center ">
            <div className="text-center">
              <h2 className="text-xl font-medium text-gray-300 mb-2">Select a conversation</h2>
              <p className="text-gray-500">Choose a contact to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>

        {/* Pagination */}
        <div className="p-4 ">
          <div className="flex items-center justify-end space-x-2">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {generatePageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && handlePageChange(page)}
                className={`w-8 h-8 rounded text-sm ${
                  page === currentPage
                    ? 'bg-cyan-500 text-white'
                    : typeof page === 'number'
                    ? 'hover:bg-gray-700'
                    : 'cursor-default'
                }`}
                disabled={typeof page !== 'number'}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
  </>
  );
};

export default MessageApp;