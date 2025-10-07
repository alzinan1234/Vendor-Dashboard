"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { reservationService } from "@/lib/reservationService";
import ReservationDetailsCard from "@/components/ManageNewReservation/ReservationDetailsCard";


export default function ReservationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReservationDetail();
  }, [params.id]);

  const fetchReservationDetail = async () => {
    setLoading(true);
    const result = await reservationService.getReservationDetail(params.id);
    
    if (result.success) {
      setReservation(result.data);
      setError(null);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <p className="text-white">Loading reservation details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="bg-[#00C1C9] text-white px-4 py-2 rounded-full"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <p className="text-white">Reservation not found.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <ReservationDetailsCard reservation={reservation} />
    </div>
  );
}