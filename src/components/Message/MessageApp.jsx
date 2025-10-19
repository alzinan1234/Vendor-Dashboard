"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  MoreHorizontal,
  Send,
  Smile,
  ChevronLeft,
  ChevronRight,
  Paperclip,
} from "lucide-react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

// API Configurationhttps://luke-stat-forming-kinase.trycloudflare.com/
const API_CONFIG = {
  BASE_URL: "https://luke-stat-forming-kinase.trycloudflare.com",
  WS_URL: "wss://luke-stat-forming-kinase.trycloudflare.com",
  ENDPOINTS: {
    VENDORS_LIST: "/api/vendorchat/vendors/",
    CONVERSATIONS: "/api/vendorchat/conversations/",
    MESSAGES: (vendorId) => `/api/vendorchat/messages/${vendorId}/`,
    UPLOAD_FILE: "/api/vendorchat/upload-file/",
  }
};

const MessageApp = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [conversations, setConversations] = useState({});
  const [contacts, setContacts] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const itemsPerPage = 6;

  // Simple emoji list (since we can't use emoji-picker-react)
  const emojis = ['😊', '😂', '❤️', '👍', '🙏', '🎉', '👋', '🔥', '✨', '💯'];

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  // Fetch vendors list
  const fetchVendors = async () => {
    try {
      setIsLoadingContacts(true);
      const token = getAuthToken();
      if (!token) {
        console.error('No auth token found');
        return;
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.VENDORS_LIST}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Vendors data:', data);

      if (data.success && data.vendors) {
        const formattedContacts = data.vendors.map(vendor => ({
          id: vendor.id,
          name: vendor.venue_name || 'Unknown Vendor',
          avatar: vendor.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(vendor.venue_name || 'V')}&background=667eea&color=fff`,
          email: vendor.email,
          location: vendor.location,
          lastMessage: "Start a conversation",
          time: "",
          unreadCount: 0,
          isActive: false,
        }));
        setContacts(formattedContacts);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setIsLoadingContacts(false);
    }
  };

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONVERSATIONS}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Conversations data:', data);

      // Update contacts with last message info
      if (data.conversations) {
        const updatedContacts = contacts.map(contact => {
          const conversation = data.conversations.find(conv => conv.vendor === contact.id);
          if (conversation && conversation.last_message) {
            return {
              ...contact,
              lastMessage: conversation.last_message.text || "Start a conversation",
              time: formatTime(conversation.last_message.created_at),
              unreadCount: conversation.unread_count_user || 0,
            };
          }
          return contact;
        });
        setContacts(updatedContacts);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  // Fetch messages for a specific vendor
  const fetchMessages = async (vendorId) => {
    try {
      setIsLoadingMessages(true);
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MESSAGES(vendorId)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Messages data:', data);

      if (data.messages) {
        const formattedMessages = data.messages.map(msg => ({
          id: msg.id,
          sender: msg.sender_name || "User",
          message: msg.text || "",
          time: formatTime(msg.created_at),
          isOwn: msg.sender === msg.user, // Adjust based on your user ID
          avatar: msg.sender_email ? `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.sender_name || 'U')}&background=4a5568&color=fff` : selectedContact?.avatar,
          status: msg.is_read ? 'read' : 'delivered',
          file: msg.file,
          file_url: msg.file_url,
          message_type: msg.message_type,
        }));

        setConversations(prev => ({
          ...prev,
          [vendorId]: formattedMessages
        }));
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Initialize WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      const token = getAuthToken();
      if (!token) {
        console.error('No access token available');
        return;
      }

      console.log("Connecting to WebSocket...");

      const ws = new WebSocket(`${API_CONFIG.WS_URL}/ws/vendor-chat/?token=${token}`);

      ws.onopen = () => {
        console.log('WebSocket connected successfully');
        setIsConnected(true);
        setSocket(ws);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received WebSocket message:', data);
          handleWebSocketMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event);
        setIsConnected(false);
        setSocket(null);
        
        setTimeout(() => {
          console.log('Attempting to reconnect...');
          connectWebSocket();
        }, 3000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      return ws;
    };

    const ws = connectWebSocket();
    fetchVendors();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  // Fetch conversations after contacts are loaded
  useEffect(() => {
    if (contacts.length > 0) {
      fetchConversations();
    }
  }, [contacts.length]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, selectedContact]);

  // Handle incoming WebSocket messages
  const handleWebSocketMessage = (data) => {
    const { type, receiver_id, message, sender, timestamp, message_id, sender_name } = data;

    switch (type) {
      case 'connection_established':
        console.log('Connection established:', data.message);
        break;

      case 'receive_message':
        handleReceivedMessage({
          contactId: receiver_id,
          message,
          sender,
          senderName: sender_name,
          timestamp,
          messageId: message_id
        });
        break;

      case 'message_sent':
        updateMessageStatus(message_id, 'sent');
        break;

      case 'message_delivered':
        updateMessageStatus(message_id, 'delivered');
        break;

      case 'message_read':
        updateMessageStatus(message_id, 'read');
        break;

      case 'error':
        console.error('WebSocket error:', data.error || data.message);
        break;

      default:
        console.log('Unknown message type:', type);
    }
  };

  // Handle received messages
  const handleReceivedMessage = (data) => {
    const { contactId, message, sender, senderName, timestamp, messageId } = data;
    
    setConversations(prev => {
      const contactConversation = prev[contactId] || [];
      const newMessage = {
        id: messageId || Date.now(),
        sender: senderName || "Vendor",
        message: message,
        time: formatTime(timestamp),
        isOwn: false,
        avatar: getContactAvatar(contactId),
        status: 'delivered'
      };

      return {
        ...prev,
        [contactId]: [...contactConversation, newMessage]
      };
    });

    updateContactLastMessage(contactId, message, timestamp);
  };

  // Update message status
  const updateMessageStatus = (messageId, status) => {
    if (!selectedContact) return;

    setConversations(prev => ({
      ...prev,
      [selectedContact.id]: prev[selectedContact.id]?.map(msg => 
        msg.id === messageId ? { ...msg, status } : msg
      ) || []
    }));
  };

  // Update contact's last message
  const updateContactLastMessage = (contactId, message, timestamp) => {
    setContacts(prev => prev.map(contact => 
      contact.id === contactId 
        ? { ...contact, lastMessage: message, time: formatTime(timestamp), unreadCount: contact.id === selectedContact?.id ? 0 : contact.unreadCount + 1 }
        : contact
    ));
  };

  // Get contact avatar
  const getContactAvatar = (contactId) => {
    const contact = contacts.find(c => c.id === contactId);
    return contact?.avatar || `https://ui-avatars.com/api/?name=User&background=667eea&color=fff`;
  };

  // Format time for display
  const formatTime = (timestamp) => {
    if (!timestamp) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Filter contacts based on search query
  const filteredContacts = useMemo(() => {
    if (!searchQuery) return contacts;
    return contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, contacts]);

  // Pagination logic
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContacts = filteredContacts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Get current conversation
  const currentConversation = useMemo(() => {
    if (!selectedContact) return [];
    return conversations[selectedContact.id] || [];
  }, [selectedContact, conversations]);

  // Handle contact selection
  const handleContactClick = async (contact) => {
    setSelectedContact(contact);
    await fetchMessages(contact.id);
    
    // Mark as read
    setContacts(prev => prev.map(c => 
      c.id === contact.id ? { ...c, unreadCount: 0 } : c
    ));
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (messageInput.trim() && selectedContact && socket && isConnected) {
      const messageData = {
        type: "send_message",
        receiver_id: selectedContact.id,
        message: messageInput.trim(),
        timestamp: new Date().toISOString(),
        message_id: Date.now()
      };

      // Optimistic update
      const optimisticMessage = {
        id: messageData.message_id,
        sender: "You",
        message: messageData.message,
        time: formatTime(messageData.timestamp),
        isOwn: true,
        avatar: "https://ui-avatars.com/api/?name=You&background=4a5568&color=fff",
        status: 'sending'
      };

      setConversations(prev => ({
        ...prev,
        [selectedContact.id]: [...(prev[selectedContact.id] || []), optimisticMessage]
      }));

      socket.send(JSON.stringify(messageData));
      console.log("Sent message:", messageData);

      setMessageInput("");
      setShowEmojiPicker(false);

      updateContactLastMessage(selectedContact.id, messageData.message, messageData.timestamp);
    } else if (!isConnected) {
      alert('Unable to send message. Please check your connection.');
    }
  };

  // Handle file upload
  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (files.length > 0 && selectedContact) {
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('vendor_id', selectedContact.id);
      formData.append('text', `Sent a file: ${file.name}`);

      try {
        const token = getAuthToken();
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UPLOAD_FILE}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          console.log('File uploaded:', data);
          
          // Add file message to conversation
          const fileMessage = {
            id: data.data.id,
            sender: "You",
            message: data.data.text,
            time: formatTime(data.data.created_at),
            isOwn: true,
            avatar: "https://ui-avatars.com/api/?name=You&background=4a5568&color=fff",
            status: 'sent',
            file: data.data.file,
            file_url: data.data.file_url,
            message_type: data.data.message_type
          };

          setConversations(prev => ({
            ...prev,
            [selectedContact.id]: [...(prev[selectedContact.id] || []), fileMessage]
          }));
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Failed to upload file');
      }
    }
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="relative bg-[#343434] rounded-lg p-4 font-sans text-white min-h-screen">
      {/* Connection Status */}
      {/* <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium ${
        isConnected ? 'bg-green-500' : 'bg-red-500'
      }`}>
        {isConnected ? 'Connected' : 'Disconnected'}
      </div> */}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl font-semibold text-white">Vendor Messages</h1>
        <div className="flex items-center w-full sm:w-auto">
          <div className="relative flex-grow">
            {/* <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /> */}
            <input
              type="text"
              placeholder="Search messages or vendors..."
              className="pl-10 pr-4 py-2 w-full sm:w-64  rounded-l-md border border-gray-700 text-sm focus:outline-none  transition-all text-white placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="flex items-center justify-center p-2  rounded-r-md hover:bg-gray-700 transition-colors border border-gray-700">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-160px)]  text-white rounded-lg overflow-hidden">
        {/* Contacts List */}
        <div className="flex-none w-full lg:w-1/3 flex flex-col p-4  rounded-lg shadow-inner overflow-hidden">
          <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-3">Conversations</h2>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {isLoadingContacts ? (
              <div className="text-center text-gray-400 py-8">Loading vendors...</div>
            ) : paginatedContacts.length > 0 ? (
              paginatedContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => handleContactClick(contact)}
                  className={`flex items-center p-4 bg-gray-700 rounded-xl shadow-sm cursor-pointer border-2 border-transparent hover:border-cyan-500 transition-all duration-200 ease-in-out
                    ${selectedContact?.id === contact.id ? "border-cyan-500 bg-gray-600" : ""}`}
                >
                  <div className="relative">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-600 flex-shrink-0"
                    />
                    {contact.isActive && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                    )}
                  </div>
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
              <div className="text-center text-gray-400 py-8">No vendors found.</div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center p-4 mt-4 border-t border-gray-700">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 mx-1 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-1 mx-1 rounded-md text-sm font-medium
                    ${pageNumber === currentPage
                        ? 'bg-cyan-500 text-white shadow-md'
                        : 'text-gray-200 hover:bg-gray-600'
                    } transition-colors`}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 mx-1 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Conversation Area */}
        <div className="flex-1 flex flex-col items-center  rounded-lg shadow-inner overflow-hidden">
          {selectedContact ? (
            <div className="w-full h-full flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-gray-700 flex items-center justify-between rounded-t-lg bg-gray-750">
                <div className="flex items-center">
                  <img
                    src={selectedContact.avatar}
                    alt={selectedContact.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
                  />
                  <div className="ml-3">
                    <h2 className="text-lg font-semibold text-white">
                      {selectedContact.name}
                    </h2>
                    <p className="text-xs text-gray-400">
                      {selectedContact.location || `Vendor ID: ${selectedContact.id}`}
                    </p>
                  </div>
                </div>
                <button className="p-2 rounded-full hover:bg-gray-600 transition-colors">
                  <MoreHorizontal className="w-6 h-6" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {isLoadingMessages ? (
                  <div className="text-center text-gray-400">Loading messages...</div>
                ) : currentConversation.length > 0 ? (
                  currentConversation.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
                    >
                      {!msg.isOwn && (
                        <img
                          src={msg.avatar}
                          alt={msg.sender}
                          className="w-8 h-8 rounded-full object-cover mr-3 flex-shrink-0"
                        />
                      )}
                      <div
                        className={`relative max-w-[75%] px-4 py-2 rounded-xl text-sm break-words
                          ${msg.isOwn
                            ? "bg-cyan-600 text-white rounded-br-none shadow-md"
                            : "bg-gray-700 text-white rounded-bl-none shadow-md"
                          }`}
                      >
                        <span>{msg.message}</span>
                        {msg.file_url && (
                          <div className="mt-2">
                            <a href={msg.file_url} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:underline flex items-center gap-1">
                              <Paperclip className="w-4 h-4" />
                              View File
                            </a>
                          </div>
                        )}
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-xs opacity-70">{msg.time}</span>
                          {msg.isOwn && (
                            <span className="text-xs opacity-70">
                              {msg.status === 'sending' ? '🕐' : 
                               msg.status === 'sent' ? '✓' : 
                               msg.status === 'delivered' ? '✓✓' : 
                               msg.status === 'read' ? '✓✓' : '✓'}
                            </span>
                          )}
                        </div>
                      </div>
                      {msg.isOwn && (
                        <img
                          src="https://ui-avatars.com/api/?name=You&background=4a5568&color=fff"
                          alt="You"
                          className="w-8 h-8 rounded-full object-cover ml-3 flex-shrink-0"
                        />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400">No messages yet. Start the conversation!</div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 flex items-center gap-3 border-t border-gray-700 bg-gray-750 rounded-b-lg">
                <button
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors flex-shrink-0"
                  onClick={() => fileInputRef.current.click()}
                  title="Attach File"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />

                <div className="flex-grow relative">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="w-full px-4 py-2 rounded-full bg-gray-700 text-white border-none focus:outline-none focus:ring-2 focus:ring-cyan-500 pr-12"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-600 transition-colors"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    title="Insert Emoji"
                  >
                    <Smile className="w-5 h-5" />
                  </button>

                  {showEmojiPicker && (
                    <div className="absolute bottom-14 right-0 z-20 bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-700">
                      <div className="grid grid-cols-5 gap-2">
                        {emojis.map((emoji, idx) => (
                          <button
                            key={idx}
                            className="text-2xl hover:bg-gray-700 p-1 rounded"
                            onClick={() => {
                              setMessageInput(prev => prev + emoji);
                              setShowEmojiPicker(false);
                            }}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-cyan-500 text-white hover:bg-cyan-600 transition-all flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || !isConnected}
                  title="Send Message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-2xl p-4 text-center">
              Select a vendor to start chatting!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageApp;