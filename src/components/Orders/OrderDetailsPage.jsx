"use client";

import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/router'; // Removed to resolve compilation error
import { X } from 'lucide-react'; // For the close button icon

// Mock data for a single order, used for standalone testing/display if no 'order' prop is passed.
// In a real application, this component would receive its 'order' data via props or fetch it directly.
const defaultMockOrder = {
  orderId: 'HJ472839',
  customerName: 'Sunan Rahman',
  qrOrder: 'Mojito',
  table: 'Table #4',
  quantity: 2,
  status: 'Pending', 
  amount: '$200',
  date: '07/02/24',
  time: '7pm',
  imageUrl: 'https://placehold.co/150x150/A76241/ffffff?text=User',
};

const OrderDetailsPage = ({ order, onClose }) => { // Accept order and onClose as props
  // Use the provided 'order' prop, or fallback to mock data for standalone display
  const [currentOrder, setCurrentOrder] = useState(order || defaultMockOrder);
  const [loading, setLoading] = useState(false); // No loading state needed if data is passed via props

  // If this component were truly dynamic and fetching data,
  // the useEffect would look different. For now, it just ensures
  // the component re-renders if the 'order' prop changes.
  useEffect(() => {
    if (order) {
      setCurrentOrder(order);
    }
  }, [order]);


  if (!currentOrder) { // Handles case where no order prop is passed and no default mock
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        Order data not available.
        {/* If this were part of a modal, onClose would be used here */}
        <button
          onClick={onClose} // Use onClose prop for closing
          className="ml-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition duration-200"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4 font-inter">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
      <div className="relative bg-[#343434] rounded-lg shadow-xl p-8 max-w-lg w-full border border-gray-700">
        {/* Close button */}
        <button
          onClick={onClose} // Use onClose prop for closing
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
        >
          <X className="text-gray-300" size={20} />
        </button>

        {/* Status Tag */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex px-4 py-2 text-sm font-semibold rounded-full text-orange-400 bg-orange-900 bg-opacity-30">
            {currentOrder.status}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Image Section */}
          <div className="flex-shrink-0">
            <img
              src={currentOrder.imageUrl}
              alt="Customer"
              className="rounded-lg w-36 h-36 object-cover border border-gray-700"
              onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/150x150/6c757d/ffffff?text=No+Image"; }} // Fallback image
            />
          </div>

          {/* Order Details Section */}
          <div className="text-center sm:text-left">
            <p className="text-lg font-medium text-white mb-2">Order ID: {currentOrder.orderId}</p>
            <p className="text-md text-gray-300 mb-1">Customer name: {currentOrder.customerName}</p>
            <p className="text-md text-gray-300 mb-1">QR Order: {currentOrder.qrOrder}</p>
            <p className="text-md text-gray-300 mb-1">Table: {currentOrder.table}</p>
            <p className="text-md text-gray-300 mb-1">Quantity: {currentOrder.quantity}</p>
            <p className="text-md text-gray-300 mb-1">Date: {currentOrder.date}</p>
            <p className="text-md text-gray-300 mb-1">Time: {currentOrder.time}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
