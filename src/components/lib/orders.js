"use client";

// Mock data for orders, now with details for the dynamic page.
export const mockOrders = Array.from({ length: 30 }, (_, i) => ({
  orderId: `HJ47283${i % 10}`, // Corrected to be a unique string
  customerName: 'Jane Cooper',
  qrOrder: 'Mojito',
  table: `Table #${i % 5 + 1}`,
  quantity: (i % 3) + 1,
  status: 'Pending',
  amount: `$${(i % 10 + 1) * 100}`, // Corrected to be a string
  date: `07/${(i % 28) + 1}/24`, // Added mock date
  time: `${(i % 12) + 1}pm`,       // Added mock time
  imageUrl: `https://placehold.co/150x150/A76241/ffffff?text=User${i % 10}`, // Added mock image
}));