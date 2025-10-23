// components/VendorMessageApp.jsx
"use client";

import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import {
  Send,
  ChevronLeft,
  ChevronRight,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
} from "lucide-react";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import { conversationService } from "@/lib/ConversationService";

// Import API Config and Services
import { API_CONFIG, getApiUrl } from "@/lib/config";
import { venueServiceUserID } from "@/lib/venueService";

// ==================== UTILITY FUNCTIONS ====================
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return (
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
    );
  }
  return null;
};

// Replace the extractVendorIdFromToken function with this:
const extractVendorIdFromToken = () => {
  const token = getAuthToken();
  if (!token) {
    console.log("No token found");
    return null;
  }

  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("Invalid token format");
      return null;
    }

    const decoded = JSON.parse(atob(parts[1]));
    console.log("Full decoded token:", decoded); // Debug all fields

    // Try different possible field names for user ID
    const userId =
      decoded.user_id || decoded.id || decoded.sub || decoded.userId;

    if (!userId) {
      console.warn(
        "No user ID found in token. Available fields:",
        Object.keys(decoded)
      );
      return null;
    }

    console.log("Extracted user ID from token:", userId);
    return userId;
  } catch (e) {
    console.error("Failed to decode token:", e);
    return null;
  }
};

// Add this function to get vendor ID from venue API
const getVendorIdFromVenueAPI = async () => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("No auth token");

    const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.MY_VENUE), {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, redirect to login
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        throw new Error("Session expired. Please login again.");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success && data.data) {
      // Return the user ID from venue data (this is your vendor ID)
      const vendorId = data.data.user?.id;
      console.log("Got vendor ID from venue API:", vendorId);
      return vendorId;
    }

    throw new Error("Failed to get vendor ID from venue API");
  } catch (error) {
    console.error("getVendorIdFromVenueAPI error:", error);
    return null;
  }
};

const formatTime = (timestamp) => {
  if (!timestamp)
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "Unknown";
  }
};

const formatDate = (timestamp) => {
  if (!timestamp) return "";
  try {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  } catch {
    return "";
  }
};

const getMessageStatusIcon = (status) => {
  switch (status) {
    case "sending":
      return "⏱️";
    case "sent":
      return "✓";
    case "delivered":
      return "✓✓";
    case "read":
      return "✓✓";
    default:
      return "✓";
  }
};

// ==================== MESSAGE ITEM COMPONENT ====================
const MessageItem = ({ msg }) => (
  <div
    className={`flex ${
      msg.isOwn ? "justify-end" : "justify-start"
    } animate-in fade-in slide-in-from-bottom-2`}
  >
    {!msg.isOwn && (
      <img
        src={msg.avatar}
        alt={msg.sender}
        className="w-8 h-8 rounded-full object-cover mr-3 flex-shrink-0"
      />
    )}
    <div
      className={`relative max-w-xs lg:max-w-md px-4 py-3 rounded-xl text-sm break-words shadow-md ${
        msg.isOwn
          ? "bg-cyan-600 text-white rounded-br-none"
          : "bg-gray-700 text-white rounded-bl-none"
      }`}
    >
      {msg.reply_to_data && (
        <div className="bg-black/20 rounded-lg px-3 py-2 mb-2 border-l-4 border-cyan-400">
          <p className="text-xs opacity-70 mb-1">
            Replying to {msg.reply_to_data.sender_email}
          </p>
          <p className="text-xs truncate">{msg.reply_to_data.text}</p>
        </div>
      )}

      {msg.message_type === "file" || (msg.file_url && msg.file) ? (
        <div className="space-y-2">
          <p className="text-sm">{msg.message}</p>
          <a
            href={msg.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-300 hover:underline flex items-center gap-2 text-xs"
          >
            <Paperclip className="w-3 h-3" />
            Download File
          </a>
        </div>
      ) : (
        <p>{msg.message}</p>
      )}

      <div className="flex items-center justify-end gap-2 mt-2">
        <span className="text-xs opacity-70">{msg.time}</span>
        {msg.isOwn && (
          <span className="text-xs opacity-70">
            {getMessageStatusIcon(msg.status)}
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
);

// ==================== MAIN COMPONENT ====================
const VendorMessageApp = () => {
  const [myVendorId, setMyVendorId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [conversations, setConversations] = useState({});
  const [contacts, setContacts] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const itemsPerPage = 6;

  const emojis = [
    "😊",
    "😂",
    "❤️",
    "👍",
    "🙏",
    "🎉",
    "👋",
    "🔥",
    "✨",
    "💯",
    "🎈",
    "🌟",
  ];

  // ==================== LIFECYCLE HOOKS ====================

  // Extract vendor ID from token on mount
  useEffect(() => {
    const initializeVendor = async () => {
      // First try to get from token
      let vendorId = extractVendorIdFromToken();

      // If not found in token, get from venue API
      if (!vendorId) {
        vendorId = await getVendorIdFromVenueAPI();
      }

      if (vendorId) {
        setMyVendorId(vendorId);
        console.log("Successfully set vendor ID:", vendorId);
      } else {
        setError(
          "Vendor not found - Could not determine vendor ID. Please check browser console for details."
        );
      }
    };

    initializeVendor();
  }, []);

  // Clear success message after timeout
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Clear error message after timeout
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, selectedContact]);

  // ==================== FETCH FUNCTIONS ====================

  const fetchCustomers = useCallback(async () => {
    setIsLoadingContacts(true);
    const result = await conversationService.getConversations();

    console.log("ppppppppppp result conversations", result);

    if (result.success) {
      console.log("=== DEBUG Conversations ===");
      console.log("All conversations:", result.conversations);
      result.conversations.forEach((conv) => {
        console.log("Conversation:", {
          id: conv.id,
          user: conv.user, // This should be the CUSTOMER ID
          vendor: conv.vendor, // This should be your VENDOR ID (29)
          vendor_name: conv.vendor_name,
          last_message: conv.last_message,
        });
      });
      console.log("=== END DEBUG ===");

      const customerContacts = result.conversations.map((conversation) => {
        const customerName =
          conversation.last_message?.sender_name ||
          conversation.last_message?.sender_email?.split("@")[0] ||
          `Customer ${conversation.user}`;
        return {
          id: conversation.user,
          name: customerName,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            customerName
          )}&background=667eea&color=fff`,
          email: conversation.last_message?.sender_email || "",
          location: "Customer",
          lastMessage:
            conversation.last_message?.text || "Start a conversation",
          time: formatTime(conversation.last_message?.created_at),
          unreadCount: conversation.unread_count_vendor || 0,
          isActive: true,
          conversationId: conversation.id,
          vendorId: conversation.vendor,
        };
      });
      setContacts(customerContacts);
    } else {
      setError(result.error);
    }
    setIsLoadingContacts(false);
  }, []);

  const [customerId, setCustomerId] = useState(null);

  
const fetchMessages = useCallback(
    async (customerId) => {
      setIsLoadingMessages(true);

      console.log("Fetching messages for customer ID:", customerId);
      console.log("My vendor ID:", myVendorId);

      const result = await conversationService.getMessages(customerId);
      setCustomerId(customerId);

      if (result.success) {
        const contact = contacts.find((c) => c.id === customerId);

        console.log("=== FETCH MESSAGES DEBUG ===");
        console.log("Customer ID:", customerId);
        console.log("My Vendor ID:", myVendorId);
        console.log("Sample message from API:", result.messages[0]);
        console.log("============================");

        const formattedMessages = result.messages.map((msg) => {
          // Check if sender is vendor (msg.sender === myVendorId means vendor sent it)
          const isVendorMessage = msg.sender === Number(myVendorId);
          
          console.log(`Message ${msg.id}: sender=${msg.sender} (${typeof msg.sender}), myVendorId=${myVendorId} (${typeof myVendorId}), isVendor=${isVendorMessage}`);

          return {
            id: msg.id,
            sender: msg.sender_name || "User",
            message: msg.text || "",
            time: formatTime(msg.created_at),
            isOwn: isVendorMessage, // Vendor's messages on right
            avatar: isVendorMessage
              ? "https://ui-avatars.com/api/?name=You&background=06b6d4&color=fff"
              : contact?.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  msg.sender_name || "C"
                )}&background=667eea&color=fff`,
            status: msg.is_read ? "read" : "delivered",
            file: msg.file || null,
            file_url: msg.file_url || null,
            message_type: msg.message_type || "text",
            created_at: msg.created_at,
            reply_to: msg.reply_to,
            reply_to_data: msg.reply_to_data,
          };
        });

        setConversations((prev) => ({
          ...prev,
          [customerId]: formattedMessages,
        }));
      } else {
        setError(result.error);
      }
      setIsLoadingMessages(false);
    },
    [contacts, myVendorId]
  );
  // ==================== WEBSOCKET CONNECTION ====================

  useEffect(() => {
    const connectWebSocket = () => {
      const token = getAuthToken();
      if (!token) return;

      const ws = new WebSocket(
        `wss://heaven-produce-hanging-mainland.trycloudflare.com/ws/vendor-chat/?token=${token}`
      );

      ws.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("WebSocket message:", data);
          handleWebSocketMessage(data, customerId);
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
        setTimeout(connectWebSocket, 3000);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
      };

      setSocket(ws);
      return ws;
    };

    const ws = connectWebSocket();
    fetchCustomers();

    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [fetchCustomers]);

  // ==================== MESSAGE HANDLERS ====================

  const handleWebSocketMessage = (data, customerId) => {
    console.log("data lllll", data);

    console.log("customerId", customerId);

    console.log("WebSocket message received:", data);
    console.log("xxxxxxxxxxxxxxxxxx");
    console.log("Sending message to customer ID:", customerId);
    console.log("yyyyyyyyyyyyyyyyy");
    console.log("Selected contact:", selectedContact);
    console.log("xxxxxxxxxxxxxxxxxx");
    console.log("Contact ID type:", typeof customerId);
    console.log("xxxxxxxxxxxxxxxxxx");

    const {
      type,
      receiver_id,
      vendor_id,
      message,
      sender,
      timestamp,
      message_id,
      sender_name,
      sender_avatar,
      sender_email,
    } = data;

    switch (type) {
      case "connection_established":
        console.log("Connection established:", data.message);
        break;

      case "receive_message":
      case "message_sent":
        const customerId = receiver_id || vendor_id;

        if (customerId) {
          handleReceivedMessage({
            customerId: customerId,
            message: message || data.text,
            sender,
            senderName: sender_name,
            senderAvatar: sender_avatar,
            senderEmail: sender_email,
            timestamp: timestamp || data.created_at,
            messageId: message_id || data.id,
            file: data.file,
            file_url: data.file_url,
            message_type: data.message_type,
            reply_to: data.reply_to,
            reply_to_data: data.reply_to_data,
          });

          if (message_id) {
            updateMessageStatus(message_id, "sent");
          }

          fetchCustomers();
        }
        break;

      case "message_delivered":
        updateMessageStatus(message_id, "delivered");
        break;

      case "message_read":
        updateMessageStatus(message_id, "read");
        break;

      case "user_typing":
        setTypingUsers((prev) => ({
          ...prev,
          [receiver_id]: true,
        }));
        setTimeout(() => {
          setTypingUsers((prev) => ({
            ...prev,
            [receiver_id]: false,
          }));
        }, 3000);
        break;

      case "error":
        console.error("WebSocket error:", data.error || data.message);
        setError(data.error || data.message || "WebSocket error occurred");
        break;

      default:
        break;
    }
  };

  const handleReceivedMessage = (data) => {
    const {
      customerId,
      message,
      sender,
      senderName,
      senderAvatar,
      senderEmail,
      timestamp,
      messageId,
      file,
      file_url,
      message_type,
      reply_to,
      reply_to_data,
    } = data;

    const token = getAuthToken();
    const userEmail = token ? JSON.parse(atob(token.split(".")[1])).email : "";

    setConversations((prev) => {
      const contactConversation = prev[customerId] || [];
      const newMessage = {
        id: messageId || Date.now(),
        sender: senderName || "Customer",
        message: message,
        time: formatTime(timestamp),
        isOwn: senderEmail === userEmail,
        avatar:
          senderAvatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            senderName || "C"
          )}&background=667eea&color=fff`,
        status: "delivered",
        message_type: message_type || "text",
        file: file || null,
        file_url: file_url || null,
        reply_to: reply_to,
        reply_to_data: reply_to_data,
        created_at: timestamp,
      };

      return {
        ...prev,
        [customerId]: [...contactConversation, newMessage],
      };
    });

    updateContactLastMessage(customerId, message, timestamp);

    if (senderEmail !== userEmail && selectedContact?.id !== customerId) {
      updateContactUnreadCount(customerId, 1);
    }
  };

  const updateMessageStatus = (messageId, status) => {
    if (!selectedContact) return;

    setConversations((prev) => ({
      ...prev,
      [selectedContact.id]: (prev[selectedContact.id] || []).map((msg) =>
        msg.id === messageId ? { ...msg, status } : msg
      ),
    }));
  };

  const updateContactLastMessage = (customerId, message, timestamp) => {
    setContacts((prev) => {
      const updatedContacts = prev.map((contact) =>
        contact.id === customerId
          ? { ...contact, lastMessage: message, time: formatTime(timestamp) }
          : contact
      );

      return updatedContacts.sort((a, b) => {
        if (!a.time) return 1;
        if (!b.time) return -1;
        const timeA = new Date(`1970-01-01 ${a.time}`);
        const timeB = new Date(`1970-01-01 ${b.time}`);
        return timeB - timeA;
      });
    });
  };

  const updateContactUnreadCount = (customerId, increment) => {
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === customerId
          ? {
              ...contact,
              unreadCount: Math.max(0, contact.unreadCount + increment),
            }
          : contact
      )
    );
  };

  // ==================== UI EVENT HANDLERS ====================

  const handleContactClick = async (contact) => {
    await fetchMessages(contact.id);
    setSelectedContact(contact);
    setSearchQuery("");
    console.log("contact id 000000000000", contact.id);
    updateContactUnreadCount(contact.id, -contact.unreadCount);
  };

  const handleSendMessage = useCallback(async () => {
    if (!messageInput.trim() || !selectedContact) return;

    const messageText = messageInput.trim();
    const customerId = selectedContact.id;
    const messageId = Date.now();

    const optimisticMessage = {
      id: messageId,
      sender: "You",
      message: messageText,
      time: formatTime(new Date().toISOString()),
      isOwn: true,
      avatar:
        "https://ui-avatars.com/api/?name=You&background=4a5568&color=fff",
      status: "sending",
      message_type: "text",
    };

    setConversations((prev) => ({
      ...prev,
      [customerId]: [...(prev[customerId] || []), optimisticMessage],
    }));

    updateContactLastMessage(customerId, messageText, new Date().toISOString());
    setMessageInput("");
    setShowEmojiPicker(false);

    // Define the WebSocket message
    const wsMessage = {
      type: "send_message",
      receiver_id: customerId, // This is the CUSTOMER user ID
      message: messageText,
      reply_to: null,
    };

    console.log("=== DEBUG WebSocket Message ===");
    console.log("Sending to customer ID:", customerId);
    console.log("My vendor ID:", myVendorId);
    console.log("Message text:", messageText);
    console.log("WebSocket message payload:", wsMessage);
    console.log("WebSocket connected:", isConnected);
    console.log("=== END DEBUG ===");

    if (socket && isConnected) {
      socket.send(JSON.stringify(wsMessage));
    } else {
      console.error("WebSocket not connected!");
      setError("WebSocket not connected. Please wait for connection.");
      // Remove the optimistic message if WebSocket fails
      setConversations((prev) => ({
        ...prev,
        [customerId]: prev[customerId].filter((m) => m.id !== messageId),
      }));
      return;
    }
  }, [messageInput, selectedContact, socket, isConnected, myVendorId]);

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (!files || !selectedContact) return;

    const file = files[0];
    setIsUploadingFile(true);

    try {
      const result = await conversationService.uploadFile(
        selectedContact.id, // Only customer ID
        file,
        messageInput || `Sent a file: ${file.name}`
        // Remove vendor_id parameter completely
      );

      if (result.success) {
        const fileMessage = {
          id: result.data?.data?.id || Date.now(),
          sender: "You",
          message: result.data?.data?.text || `Sent a file: ${file.name}`,
          time: formatTime(result.data?.data?.created_at),
          isOwn: true,
          avatar:
            "https://ui-avatars.com/api/?name=You&background=4a5568&color=fff",
          status: "sent",
          file: result.data?.data?.file || file.name,
          file_url: result.data?.data?.file_url || null,
          message_type: "file",
        };

        setConversations((prev) => ({
          ...prev,
          [selectedContact.id]: [
            ...(prev[selectedContact.id] || []),
            fileMessage,
          ],
        }));

        setSuccessMessage("File uploaded successfully");
      } else {
        setError(result.error || "Failed to upload file");
      }
    } catch (err) {
      setError(err.message || "Failed to upload file");
    }

    setIsUploadingFile(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ==================== COMPUTED VALUES ====================

  const filteredContacts = useMemo(() => {
    if (!searchQuery) return contacts;
    const query = searchQuery.toLowerCase();
    return contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(query) ||
        contact.email.toLowerCase().includes(query) ||
        contact.lastMessage.toLowerCase().includes(query)
    );
  }, [searchQuery, contacts]);

  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContacts = filteredContacts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const currentConversation = useMemo(() => {
    if (!selectedContact) return [];
    return conversations[selectedContact.id] || [];
  }, [selectedContact, conversations]);

  // ==================== RENDER ====================

  return (
    <div className="bg-[#343434] rounded-lg p-4 font-sans text-white min-h-screen flex flex-col">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-semibold">
          Customer Messages
        </h1>
        <div className="relative w-full sm:w-80">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers or messages..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-cyan-500 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500/20 text-white placeholder-gray-400 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 text-red-300 p-4 rounded-lg mb-4 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-300 hover:text-red-200"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* SUCCESS MESSAGE */}
      {successMessage && (
        <div className="bg-green-900/20 border border-green-500/30 text-green-300 p-4 rounded-lg mb-4 flex items-center gap-3 animate-in fade-in">
          <CheckIcon className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm">{successMessage}</span>
        </div>
      )}

      {/* CONNECTION STATUS */}
      {!isConnected && (
        <div className="bg-yellow-900/20 border border-yellow-500/30 text-yellow-300 p-3 rounded-lg mb-4 text-sm flex items-center gap-2">
          <ArrowPathIcon className="h-4 w-4 animate-spin" />
          Reconnecting...
        </div>
      )}

      {/* MAIN LAYOUT */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
        {/* CONVERSATIONS LIST */}
        <div className="flex-none w-full lg:w-1/3 flex flex-col bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <h2 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-3">
            Conversations ({contacts.length})
          </h2>

          {isLoadingContacts ? (
            <div className="flex items-center justify-center py-8">
              <ArrowPathIcon className="h-6 w-6 animate-spin text-cyan-500" />
              <span className="ml-2 text-gray-400">Loading customers...</span>
            </div>
          ) : paginatedContacts.length > 0 ? (
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {paginatedContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => handleContactClick(contact)}
                  className={`flex items-center p-3 rounded-lg cursor-pointer border-2 border-transparent hover:border-cyan-500 transition-all duration-200 ${
                    selectedContact?.id === contact.id
                      ? "bg-gray-700 border-cyan-500"
                      : "bg-gray-700/50 hover:bg-gray-700"
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
                    />
                    {contact.isActive && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                    )}
                  </div>

                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-semibold text-white truncate">
                        {contact.name}
                      </h3>
                      <span className="text-xs text-gray-400 ml-2">
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
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              {searchQuery ? "No customers found" : "No customers available"}
            </div>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-700">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg font-medium transition-colors ${
                      page === currentPage
                        ? "bg-cyan-500 text-white"
                        : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 flex flex-col bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
          {selectedContact ? (
            <>
              {/* CHAT HEADER */}
              <div className="p-4 border-b border-gray-700 bg-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedContact.avatar}
                    alt={selectedContact.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {selectedContact.name}
                    </h2>
                    <p className="text-xs text-gray-400">
                      {selectedContact.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
                    title="Call"
                  >
                    <Phone className="w-5 h-5 text-gray-400" />
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
                    title="Video Call"
                  >
                    <Video className="w-5 h-5 text-gray-400" />
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
                    title="More Options"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* MESSAGES AREA */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-800 to-gray-900">
                {isLoadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="flex flex-col items-center gap-3">
                      <ArrowPathIcon className="h-8 w-8 animate-spin text-cyan-500" />
                      <p className="text-gray-400">Loading messages...</p>
                    </div>
                  </div>
                ) : currentConversation.length > 0 ? (
                  <>
                    {currentConversation.map((msg, idx) => {
                      const prevMsg =
                        idx > 0 ? currentConversation[idx - 1] : null;
                      const showDate =
                        !prevMsg ||
                        formatDate(msg.created_at) !==
                          formatDate(prevMsg.created_at);

                      return (
                        <div key={msg.id}>
                          {showDate && (
                            <div className="flex items-center gap-3 my-4">
                              <div className="flex-1 border-t border-gray-600"></div>
                              <span className="text-xs text-gray-500">
                                {formatDate(msg.created_at)}
                              </span>
                              <div className="flex-1 border-t border-gray-600"></div>
                            </div>
                          )}
                          <MessageItem msg={msg} />
                        </div>
                      );
                    })}
                    {typingUsers[selectedContact.id] && (
                      <div className="flex items-end gap-3">
                        <img
                          src={selectedContact.avatar}
                          alt={selectedContact.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="bg-gray-700 rounded-xl px-4 py-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <BellIcon className="w-12 h-12 mb-3 opacity-50" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* MESSAGE INPUT */}
              <div className="p-4 border-t border-gray-700 bg-gray-800">
                <div className="flex items-end gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingFile}
                    title="Attach File"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                  >
                    {isUploadingFile ? (
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    ) : (
                      <Paperclip className="w-5 h-5" />
                    )}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <div className="flex-grow relative">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="w-full px-4 py-3 rounded-full bg-gray-700 text-white border border-gray-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 placeholder-gray-400 transition-all pr-12"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                    />

                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                      title="Insert Emoji"
                    >
                      <span className="text-xl">😊</span>
                    </button>

                    {showEmojiPicker && (
                      <div className="absolute bottom-16 right-0 z-20 bg-gray-800 p-3 rounded-lg shadow-xl border border-gray-700">
                        <div className="grid grid-cols-6 gap-2">
                          {emojis.map((emoji, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setMessageInput((prev) => prev + emoji);
                                setShowEmojiPicker(false);
                              }}
                              className="text-xl hover:bg-gray-700 p-2 rounded transition-colors"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleSendMessage}
                    disabled={
                      !messageInput.trim() || isSendingMessage || !isConnected
                    }
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-600/50 disabled:cursor-not-allowed transition-all flex-shrink-0"
                    title="Send Message"
                  >
                    {isSendingMessage ? (
                      <ArrowPathIcon className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  {messageInput.length} characters
                </p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4 p-4">
              <BellIcon className="w-16 h-16 opacity-30" />
              <h3 className="text-xl font-semibold">
                Select a customer to start messaging
              </h3>
              <p className="text-sm">
                Choose a conversation from the list to begin
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorMessageApp;
