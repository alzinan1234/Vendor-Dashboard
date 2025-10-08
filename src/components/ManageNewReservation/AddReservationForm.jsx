"use client";

import React, { useState } from "react";
import { reservationService } from "@/lib/reservationService";
import { venueService } from "@/lib/venueService";
import toast from 'react-hot-toast';

export default function AddReservationForm({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    guestName: "",
    partySize: "",
    bookingTime: "",
    bookingDate: "",
    specialRequests: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const loadingToast = toast.loading('Creating reservation...');
    setLoading(true);

    try {
      const venueId = await venueService.getMyVenueId();

      const result = await reservationService.createReservation({
        guestName: formData.guestName,
        partySize: formData.partySize,
        bookingTime: formData.bookingTime,
        bookingDate: formData.bookingDate,
        hospitalityVenue: venueId,
        specialRequests: formData.specialRequests
      });

      toast.dismiss(loadingToast);

      if (result.success) {
        toast.success('Reservation created successfully!');
        onSuccess();
        onClose();
      } else {
        toast.error(result.error || 'Failed to create reservation');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to create reservation: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#3F3F3F] md:h-[714px] p-6 rounded-lg shadow-lg w-full text-white mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Add Reservation</h2>
        <button onClick={onClose} className="text-white hover:text-gray-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="guestName" className="block text-sm font-medium text-gray-300 mb-1">
            Guest Name *
          </label>
          <input
            type="text"
            id="guestName"
            name="guestName"
            value={formData.guestName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2  border border-[#CACACA] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
            placeholder="Enter guest name"
          />
        </div>

        <div>
          <label htmlFor="partySize" className="block text-sm font-medium text-gray-300 mb-1">
            Party Size *
          </label>
          <input
            type="number"
            id="partySize"
            name="partySize"
            value={formData.partySize}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-3 py-2  border border-[#CACACA] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
            placeholder="Enter party size"
          />
        </div>

        <div>
          <label htmlFor="bookingTime" className="block text-sm font-medium text-gray-300 mb-1">
            Time *
          </label>
          <input
            type="time"
            id="bookingTime"
            name="bookingTime"
            value={formData.bookingTime}
            onChange={handleChange}
            required
            className="w-full px-3 py-2  border border-[#CACACA] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
          />
        </div>

        <div>
          <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-300 mb-1">
            Date *
          </label>
          <input
            type="date"
            id="bookingDate"
            name="bookingDate"
            value={formData.bookingDate}
            onChange={handleChange}
            required
            className="w-full px-3 py-2  border border-[#CACACA] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
          />
        </div>

        <div>
          <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-300 mb-1">
            Special Requests
          </label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2  border border-[#CACACA] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-white"
            placeholder="Any special requests..."
          />
        </div>

        <div className="col-span-full bottom-0 mt-[100px]">
          <button
            type="submit"
            disabled={loading}
            className="w-full mx-auto flex justify-center items-center rounded-full bg-[#00C1C9] text-white py-2 font-medium border-b-4 border-lime-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Add Reservation'}
          </button>
        </div>
      </form>
    </div>
  );
}