// app/vendor/orders/[orderId]/page.js
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { X } from 'lucide-react';
import Image from 'next/image';
import orderService from '@/lib/orderService';


const OrderDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId;
  
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await orderService.getOrderDetail(orderId);
        
        if (result.success) {
          setCurrentOrder(result.data);
        } else {
          setError(result.error || 'Failed to load order details');
        }
      } catch (err) {
        setError('An error occurred while fetching order details');
        console.error('Error fetching order details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  // Handler for the close button to go back to the list
  const handleClose = () => {
    router.push('/vendor/orders');
  };

  // Status badge styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'text-orange-400', bg: 'bg-orange-900 bg-opacity-30' },
      confirmed: { color: 'text-blue-400', bg: 'bg-blue-900 bg-opacity-30' },
      served: { color: 'text-purple-400', bg: 'bg-purple-900 bg-opacity-30' },
      completed: { color: 'text-green-400', bg: 'bg-green-900 bg-opacity-30' },
      cancelled: { color: 'text-red-400', bg: 'bg-red-900 bg-opacity-30' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return `inline-flex px-4 py-2 text-sm font-semibold rounded-full ${config.color} ${config.bg}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition duration-200"
          >
            Go Back to Orders
          </button>
        </div>
      </div>
    );
  }

  // Order not found
  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Order not found</p>
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition duration-200"
          >
            Go Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center p-4 font-inter">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>
      <div className="relative bg-[#343434] rounded-lg shadow-xl p-8 max-w-2xl w-full border border-gray-700">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
        >
          <X className="text-gray-300" size={20} />
        </button>

        {/* Status Tag */}
        <div className="flex justify-center mb-6">
          <span className={getStatusBadge(currentOrder.status)}>
            {currentOrder.status.charAt(0).toUpperCase() + currentOrder.status.slice(1)}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
          {/* Image Section */}
          <div className="flex-shrink-0">
            <Image
              src={currentOrder.imageUrl}
              alt="Order"
              className="rounded-lg w-36 h-36 object-cover border border-gray-700"
              width={144}
              height={144}
              onError={(e) => {
                if (e.target && e.target.src !== "https://placehold.co/150x150/6c757d/ffffff?text=No+Image") {
                  e.target.src = "https://placehold.co/150x150/6c757d/ffffff?text=No+Image";
                }
              }}
              unoptimized
            />
          </div>

          {/* Order Details Section */}
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-2xl font-bold text-white mb-4">Order Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-gray-400">Order ID</p>
                <p className="text-lg font-medium text-white">{currentOrder.orderId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Customer Name</p>
                <p className="text-lg font-medium text-white">{currentOrder.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-lg font-medium text-white">{currentOrder.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Table</p>
                <p className="text-lg font-medium text-white">{currentOrder.table}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Quantity</p>
                <p className="text-lg font-medium text-white">{currentOrder.quantity}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Amount</p>
                <p className="text-lg font-medium text-white">{currentOrder.amount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Date</p>
                <p className="text-lg font-medium text-white">{currentOrder.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Time</p>
                <p className="text-lg font-medium text-white">{currentOrder.time}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items Section */}
        {currentOrder.items && currentOrder.items.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-bold text-white mb-4">Order Items</h3>
            <div className="space-y-4">
              {currentOrder.items.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-4">
                    {item.menu_item?.image && (
                      <Image
                        src={item.menu_item.image}
                        alt={item.menu_item.item_name}
                        className="rounded-lg w-16 h-16 object-cover"
                        width={64}
                        height={64}
                        unoptimized
                      />
                    )}
                    <div>
                      <p className="text-lg font-medium text-white">{item.menu_item?.item_name || 'Unknown Item'}</p>
                      <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-400">Price: ${item.price}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">${item.total_price}</p>
                    <div className="flex gap-2 mt-2">
                      {item.is_accepted ? (
                        <span className="text-xs bg-green-900 bg-opacity-30 text-green-400 px-2 py-1 rounded">Accepted</span>
                      ) : (
                        <span className="text-xs bg-orange-900 bg-opacity-30 text-orange-400 px-2 py-1 rounded">Pending</span>
                      )}
                      {item.is_cancelled && (
                        <span className="text-xs bg-red-900 bg-opacity-30 text-red-400 px-2 py-1 rounded">Cancelled</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-700">
          <button
            onClick={handleClose}
            className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition duration-200"
          >
            Back to Orders
          </button>
          {currentOrder.status === 'pending' && (
            <button
              onClick={() => {
                // Handle order acceptance
                const firstItemId = currentOrder.items?.[0]?.id;
                if (firstItemId) {
                  orderService.acceptOrderItem(firstItemId).then(result => {
                    if (result.success) {
                      // Refresh the page or update state
                      window.location.reload();
                    }
                  });
                }
              }}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
            >
              Accept Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;