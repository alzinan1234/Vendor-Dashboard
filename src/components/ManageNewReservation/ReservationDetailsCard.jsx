// app/components/ReservationDetailsCard.js
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ReservationDetailsCard({ reservation }) {
  const router = useRouter();

  return (
    <div className="w-full max-w-md  bg-[#343434] text-white rounded-xl p-6 flex flex-col gap-4">
      <button
        className=" top-0 right-0 flex justify-end text-white hover:text-gray-300"
        onClick={() => router.back()}
      >
        ✕
      </button>

      <div className="flex items-center gap-5">
        <Image
          src={reservation.avatar}
          alt={reservation.guestName}
          width={96}
          height={68}
          className="rounded-md object-cover"
        />

        <div className="flex flex-col gap-2">
          <div className="flex gap-2 text-sm">
            <span className="text-white/80">Guest Name:</span>
            <span className="font-semibold">{reservation.guestName}</span>
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-white/80">Email:</span>
            <span className="font-semibold">{reservation.email}</span>
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-white/80">Phone number:</span>
            <span className="font-bold">{reservation.phone}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold">Reservation Details:</h3>

        <div className="flex justify-between text-sm">
          <span>Table :</span>
          <span className="font-semibold text-sm">{reservation.table}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Party Size:</span>
          <span className="text-sm">{reservation.partySize}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Time:</span>
          <span className="font-semibold text-sm">{reservation.time}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Date:</span>
          <span className="text-sm">{reservation.date}</span>
        </div>
      </div>
    </div>
  );
}