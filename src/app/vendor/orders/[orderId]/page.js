"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // For navigation
import { X } from 'lucide-react';
 // Import data to find the specific order
import Image from 'next/image';
import { mockOrders } from '@/components/lib/orders';

// This component now fetches its own data based on the URL parameter
const OrderDetailsPage = ({ params }) => {
  const router = useRouter();
  const { orderId } = params; // Get orderId from URL
  const [currentOrder, setCurrentOrder] = useState(null);

  useEffect(() => {
    if (orderId) {
      // Find the order from the mock data array.
      // In a real app, you would fetch this from an API: fetch(`/api/orders/${orderId}`)
      const foundOrder = mockOrders.find(o => o.orderId === orderId);
      setCurrentOrder(foundOrder);
    }
  }, [orderId]);

  // Handler for the close button to go back to the list
  const handleClose = () => {
    router.push('/vendor/orders'); // Or use router.back()
  };

  // Loading or not found state
  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <p>Loading order details or order not found...</p>
      </div>
    );
  }

  // The original UI remains unchanged
  return (
    <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center p-4 font-inter">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>
      <div className="relative bg-[#343434] rounded-lg shadow-xl p-8 max-w-lg w-full border border-gray-700">
        <button
          onClick={handleClose} // Use the new handler
          className="absolute top-4 right-4 p-2 rounded-full  hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
        >
          <X className="text-gray-300" size={20} />
        </button>

        <div className="flex justify-center mb-6">
          <span className="inline-flex px-4 py-2 text-sm font-semibold rounded-full text-orange-400 bg-orange-900 bg-opacity-30">
            {currentOrder.status}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Image
            src={currentOrder.imageUrl || "https://placehold.co/150x150/6c757d/ffffff?text=No+Image"}
            alt="Customer"
            className="rounded-lg w-36 h-36 object-cover border border-gray-700"
            width={144}
            height={144}
            onError={
              (e) => {
                if (e.target && e.target.src !== "https://placehold.co/150x150/6c757d/ffffff?text=No+Image") {
                  e.target.src = "https://placehold.co/150x150/6c757d/ffffff?text=No+Image";
                }
              }
            }
            unoptimized
          />
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