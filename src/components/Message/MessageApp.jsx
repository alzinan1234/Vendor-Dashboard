"use client";
import React, { useState, useMemo, useRef } from "react";
import {
  Search,
  MoreHorizontal,
  Send,
  Smile,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import EmojiPicker from "emoji-picker-react"; // Using emoji-picker-react as per your latest code

const MessageApp = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null); // Ref for the hidden file input
  const itemsPerPage = 6;

  // Mock data for contacts
  const contacts = useMemo(() => [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "https://placehold.co/48x48/667eea/ffffff?text=SJ", // Placeholder avatar
      lastMessage: "Hello, I'd like to reserve a Deluxe Suite for two nights starting...",
      time: "10:25",
      unreadCount: 0,
      isActive: false,
    },
    {
      id: 2,
      name: "Ahmed Latif",
      avatar: "https://placehold.co/48x48/a0aec0/ffffff?text=AL", // Placeholder avatar
      lastMessage: "Hi, I'm planning to visit next weekend and need a single room...",
      time: "10:25",
      unreadCount: 2,
      isActive: false,
    },
    {
      id: 3,
      name: "Emily Carter",
      avatar: "https://placehold.co/48x48/f6e05e/000000?text=EC", // Placeholder avatar
      lastMessage: "Good evening, I need a family room for 4 people from June...",
      time: "10:25",
      unreadCount: 2,
      isActive: false,
    },
    {
      id: 4,
      name: "Thomas Müller",
      avatar: "https://placehold.co/48x48/ed8936/ffffff?text=TM", // Placeholder avatar
      lastMessage: "Dear Team, I am attending a conference nearby and would like...",
      time: "10:25",
      unreadCount: 2,
      isActive: false,
    },
    {
      id: 5,
      name: "Leila Ait El Hadj",
      avatar: "https://placehold.co/48x48/4299e1/ffffff?text=LA", // Placeholder avatar
      lastMessage: "Hello, I'd like to book a room with a sea view for my honeymoon...",
      time: "10:25",
      unreadCount: 2,
      isActive: false,
    },
    {
      id: 6,
      name: "El Aurassi Hotel",
      avatar: "https://placehold.co/48x48/9f7aea/ffffff?text=EH", // Placeholder avatar
      lastMessage: "Yeah, there are only 3 spots left. Let me book for both of us...",
      time: "10:25",
      unreadCount: 2,
      isActive: false,
    },
    {
      id: 7,
      name: "El Aurassi Hotel (Active)",
      avatar: "https://placehold.co/48x48/38b2ac/ffffff?text=EA", // Placeholder avatar
      lastMessage: "Yeah, there are only 3 spots left. Let me book for both of us",
      time: "10:25",
      unreadCount: 2,
      isActive: true,
    },
  ], []);

  // Mock conversation data
  const conversation = useMemo(() => [
    {
      id: 1,
      sender: "Sarah Johnson",
      message: "Hi, I'd like to confirm my booking for March 15-18. Could you please verify?",
      time: "10:25",
      isOwn: false,
      avatar: "https://placehold.co/32x32/667eea/ffffff?text=SJ", // Placeholder avatar
    },
    {
      id: 2,
      sender: "Sarah Johnson",
      message: "Hi, I'd like to confirm my booking for March 15-18. Could you please verify?",
      time: "10:25",
      isOwn: false,
      avatar: "https://placehold.co/32x32/667eea/ffffff?text=SJ", // Placeholder avatar
    },
    {
      id: 3,
      sender: "Hotel Staff",
      message: "Hello! Yes, your booking for March 15-18 at the Deluxe Room is confirmed. Let us know if you need assistance.",
      time: "10:26",
      isOwn: true,
      avatar: "https://placehold.co/32x32/4a5568/ffffff?text=HS", // Placeholder avatar
    },
    {
      id: 4,
      sender: "Sarah Johnson",
      message: "That sounds perfect. Do we need to book now? I don't want to miss out.",
      time: "10:27",
      isOwn: false,
      avatar: "https://placehold.co/32x32/667eea/ffffff?text=SJ", // Placeholder avatar
    },
    {
      id: 5,
      sender: "Hotel Staff",
      message: "Yeah, there are only 3 spots left. Let me book for both of us. You cool splitting the bill?",
      time: "10:28",
      isOwn: true,
      avatar: "https://placehold.co/32x32/4a5568/ffffff?text=HS", // Placeholder avatar
    },
    {
      id: 6,
      sender: "Hotel Staff",
      message: "Yeah, there are only 3 spots left. Let me book for both of us. You cool splitting the bill?",
      time: "10:28",
      isOwn: true,
      avatar: "https://placehold.co/32x32/4a5568/ffffff?text=HS", // Placeholder avatar
    },
  ], []);

  // Filter contacts based on search query
  const filteredContacts = useMemo(() => {
    if (!searchQuery) return contacts;
    return contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, contacts]);

  // Pagination logic for contacts list
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContacts = filteredContacts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Handles contact selection
  const handleContactClick = (contact) => {
    setSelectedContact(contact);
  };

  // Handles sending a message
  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // In a real application, you'd send this message to a backend or update a global state
      console.log("Sending message:", messageInput);
      setMessageInput("");
      setShowEmojiPicker(false); // Hide emoji picker after sending
    }
  };

  // Handles changing pagination page
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Triggers the hidden file input click
  const handleAttachFileClick = () => {
    fileInputRef.current.click();
  };

  // Handles file selection
  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      console.log("Attached file:", files[0].name, "Type:", files[0].type, "Size:", files[0].size, "bytes");
      // To "display in message box" (meaning next to the input), you would
      // typically manage a state variable here for selected files to show their names
      // or a small preview. For this request, we'll confirm the file selection.
      //
      // Example of how you might visually confirm the attachment near the input:
      // const [attachedFiles, setAttachedFiles] = useState([]);
      // setAttachedFiles([...attachedFiles, files[0].name]);
      //
      // You can also add logic here to upload the file to a server.
      // Example for uploading:
      // const formData = new FormData();
      // formData.append('file', files[0]);
      // fetch('/api/upload-file', { method: 'POST', body: formData })
      //   .then(response => response.json())
      //   .then(data => console.log('Upload success:', data))
      //   .catch(error => console.error('Upload error:', error));
    }
  };

  // Handles emoji selection from the picker
  const handleEmojiSelect = (emojiData) => {
    // emojiData.emoji is used for 'emoji-picker-react'
    setMessageInput((prevInput) => prevInput + emojiData.emoji);
  };

  // Toggles the visibility of the emoji picker
  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  return (
    <>
      <div className="relative bg-[#343434] rounded-lg p-4 font-inter text-white min-h-screen">
        {/* Header Section (Search and Filter) */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-2xl font-semibold text-white">Messages</h1>
          <div className="flex items-center w-full sm:w-auto">
            <div className="relative flex-grow">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages or contacts..."
                className="pl-10 pr-4 py-2 w-full sm:w-64 bg-[#F3FAFA1A] rounded-tl-md rounded-bl-md border border-[#0000001A] text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all text-white placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="flex items-center justify-center p-2 bg-[#2A2A2A] rounded-tr-md rounded-br-md hover:bg-gray-700 transition-colors border border-[#0000001A]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
              >
                <path d="M11 8.5L20 8.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M4 16.5L14 16.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <ellipse cx="7" cy="8.5" rx="3" ry="3" transform="rotate(90 7 8.5)" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <ellipse cx="17" cy="16.5" rx="3" ry="3" transform="rotate(90 17 16.5)" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Main Content Area: Message List (Left) and Conversation (Right) */}
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-160px)] bg-[#343434] text-white rounded-lg overflow-hidden">
          {/* Left Sidebar - Message List */}
          <div className="flex-none w-full lg:w-1/3 flex flex-col p-4 bg-[#2A2A2A] rounded-lg shadow-inner overflow-hidden">
            <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-3">Conversations</h2>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {paginatedContacts.length > 0 ? (
                paginatedContacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => handleContactClick(contact)}
                    className={`flex items-center p-4 bg-[#FFFFFF1A] rounded-xl shadow-sm cursor-pointer border-2 border-transparent hover:border-cyan-500 transition-all duration-200 ease-in-out
                      ${selectedContact?.id === contact.id ? "border-cyan-500 bg-[#FFFFFF2A]" : ""}`}
                  >
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-700 flex-shrink-0"
                      onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/48x48/667eea/ffffff?text=User"; }} // Fallback for broken images
                    />
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-semibold text-white truncate text-base">
                          {contact.name}
                        </h3>
                        <span className="text-xs text-gray-300">
                          {contact.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 truncate">
                        {contact.lastMessage}
                      </p>
                    </div>
                    {contact.unreadCount > 0 && (
                      <div className="ml-3 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">
                          {contact.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-8">No contacts found.</div>
              )}
            </div>

            {/* Pagination for Contacts */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center p-4 mt-4 border-t border-gray-700">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 mx-1 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-200" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-3 py-1 mx-1 rounded-md text-sm font-medium
                      ${pageNumber === currentPage
                          ? 'bg-[#00C1C9] text-white shadow-md'
                          : 'text-gray-200 hover:bg-gray-600'
                      } focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors`}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 mx-1 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-200" />
                </button>
              </div>
            )}
          </div>

          {/* Right Side - Conversation Area */}
          <div className="flex-1 flex flex-col items-center bg-[#2A2A2A] rounded-lg shadow-inner overflow-hidden">
            {selectedContact ? (
              <div className="w-full h-full flex flex-col">
                {/* Conversation Header */}
                <div className="p-4 sm:p-6 border-b border-[#FFFFFF33] flex items-center justify-between rounded-t-lg bg-[#383838]">
                  <div className="flex items-center">
                    <img
                      src={selectedContact.avatar}
                      alt={selectedContact.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#FFFFFF33]"
                      onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/40x40/667eea/ffffff?text=User"; }} // Fallback for broken images
                    />
                    <h2 className="ml-3 text-lg font-semibold text-white">
                      {selectedContact.name}
                    </h2>
                  </div>
                  <button className="p-2 rounded-full hover:bg-gray-600 transition-colors">
                    <MoreHorizontal className="w-6 h-6 text-gray-200" /> {/* Lucide icon */}
                  </button>
                </div>

                {/* Conversation Messages Display */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
                  {conversation.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
                    >
                      {!msg.isOwn && (
                        <img
                          src={selectedContact.avatar} // Use selected contact's avatar for received messages
                          alt={msg.sender}
                          className="w-8 h-8 rounded-full object-cover mr-3 flex-shrink-0"
                          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/32x32/667eea/ffffff?text=User"; }} // Fallback
                        />
                      )}
                      <div
                        className={`relative max-w-[75%] px-4 py-2 rounded-xl text-sm font-normal break-words
                          ${msg.isOwn
                            ? "bg-cyan-600 text-white rounded-br-none shadow-md"
                            : "bg-[#383838] text-white rounded-bl-none shadow-md"
                          }`}
                      >
                        <span>{msg.message}</span>
                        <span className="block text-right text-xs text-gray-200 mt-1 opacity-80">{msg.time}</span>
                      </div>
                      {msg.isOwn && (
                        <img
                          src="https://placehold.co/32x32/4a5568/ffffff?text=You" // Placeholder for own avatar
                          alt="You"
                          className="w-8 h-8 rounded-full object-cover ml-3 flex-shrink-0"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Message Input Area */}
                <div className="p-4 flex items-center gap-3 border-t border-gray-700 bg-[#383838] rounded-b-lg">
                  {/* Attach File Button */}
                  <button
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#007DD01A] text-gray-400 hover:bg-[#007DD033] transition-colors flex-shrink-0"
                    onClick={handleAttachFileClick}
                    title="Attach File"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 25 25"
                      fill="none"
                    >
                      <path d="M12.5 6.33984L12.5 18.2198" stroke="white" strokeWidth="0.99" strokeLinecap="round" />
                      <path d="M18.4404 12.2798L6.56043 12.2798" stroke="white" strokeWidth="0.99" strokeLinecap="round" />
                    </svg>
                  </button>
                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    multiple // Allow multiple files if needed
                  />

                  {/* Message Text Input */}
                  <div className="flex-grow relative">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="w-full px-4 py-2 rounded-full bg-[#007DD01A] text-white border-none focus:outline-none focus:ring-2 focus:ring-cyan-500 pr-12" // Increased pr for emoji button
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    {/* Emoji Button */}
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-[#007DD033] transition-colors"
                      onClick={toggleEmojiPicker}
                      title="Insert Emoji"
                    >
                      <Smile className="w-5 h-5" /> {/* Lucide icon */}
                    </button>

                    {/* Emoji Picker Popover */}
                    {showEmojiPicker && (
                      <div className="absolute bottom-14 right-0 z-20">
                        <EmojiPicker
                          onEmojiClick={handleEmojiSelect}
                          theme="dark" // Matches your dark theme
                          searchDisabled={false}
                          width={300}
                          height={350}
                        />
                      </div>
                    )}
                  </div>

                  {/* Send Message Button */}
                  <button
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-cyan-500 text-white hover:bg-cyan-600 transition-all flex-shrink-0"
                    onClick={handleSendMessage}
                    title="Send Message"
                  >
                    <Send className="w-6 h-6" /> {/* Lucide icon */}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-2xl p-4 text-center">
                Select a conversation to start chatting!
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Optional global styles for scrollbar if you want a custom look */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #343434;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #555;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #777;
        }
      `}</style>
    </>
  );
};

export default MessageApp;
