"use client";

import { useRouter } from "next/navigation";

export default function ReservationDetailsCard({ reservation }) {
  const router = useRouter();

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="w-full max-w-md bg-[#343434] text-white rounded-xl p-6 flex flex-col gap-4">
      <button
        className="flex justify-end text-white hover:text-gray-300"
        onClick={() => router.back()}
      >
        ✕
      </button>

      <div className="flex items-center gap-5">
        <div className="w-24 h-24 rounded-md bg-[#00C1C9] flex items-center justify-center text-4xl font-bold">
          {reservation.guest_name.charAt(0)}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2 text-sm">
            <span className="text-white/80">Guest Name:</span>
            <span className="font-semibold">{reservation.guest_name}</span>
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-white/80">Email:</span>
            <span className="font-semibold">{reservation.user?.email || 'N/A'}</span>
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-white/80">Venue:</span>
            <span className="font-bold">{reservation.hospitality_venue?.venue_name || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold">Reservation Details:</h3>

        <div className="flex justify-between text-sm">
          <span>Table:</span>
          <span className="font-semibold text-sm">{reservation.table_number || 'Not assigned'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Party Size:</span>
          <span className="text-sm">{reservation.party_size}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Time:</span>
          <span className="font-semibold text-sm">{formatTime(reservation.booking_time)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Date:</span>
          <span className="text-sm">{formatDate(reservation.booking_date)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Status:</span>
          <span className={`text-sm px-2 py-1 rounded-full ${
            reservation.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
            reservation.status === 'confirmed' ? 'bg-green-500/20 text-green-500' :
            reservation.status === 'cancelled' ? 'bg-red-500/20 text-red-500' :
            'bg-blue-500/20 text-blue-500'
          }`}>
            {reservation.status}
          </span>
        </div>
        {reservation.special_requests && (
          <div className="flex flex-col gap-1 text-sm">
            <span>Special Requests:</span>
            <span className="text-sm text-gray-300">{reservation.special_requests}</span>
          </div>
        )}
      </div>
    </div>
  );
}