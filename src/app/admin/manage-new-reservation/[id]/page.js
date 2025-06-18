
import { reservations } from "@/components/lib/data";
import ReservationDetailsCard from "@/components/ManageNewReservation/ReservationDetailsCard";



export default function ReservationDetailPage({ params }) {
  const reservation = reservations.find((r) => r.id === parseInt(params.id));

  if (!reservation) {
    return <p className="text-white p-4">Reservation not found.</p>;
  }

  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <ReservationDetailsCard reservation={reservation} />
    </div>
  );
}
