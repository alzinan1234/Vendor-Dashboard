// "use client"; // This is a client component, necessary for useState and event handlers

// import Image from "next/image";
// import { useState } from "react";
// import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

// // --- SVG Icons for Actions ---

// // Green Checkmark Icon for Approve
// const ApproveIcon = () => (
//   <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <circle cx="16" cy="16" r="16" fill="#16A34A" fillOpacity="0.1" />
//     <path d="M21.3332 12.5L14.4998 19.3333L10.6665 15.5" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>
// );

// // Red 'X' Icon for Decline
// const DeclineIcon = () => (
//   <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <circle cx="16" cy="16" r="16" fill="#DC2626" fillOpacity="0.1" />
//     <path d="M19.5562 12.4434L12.4434 19.5562" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//     <path d="M12.4434 12.4434L19.5562 19.5562" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>
// );

// // Purple Eye Icon for View
// const ViewIcon = () => (
//   <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <circle cx="16" cy="16" r="16" fill="#9333EA" fillOpacity="0.1" />
//     <path d="M16.0002 11.3333C18.3335 11.3333 20.6668 12.8 22.1668 15.5C20.6668 18.2 18.3335 19.6667 16.0002 19.6667C13.6668 19.6667 11.3335 18.2 9.8335 15.5C11.3335 12.8 13.6668 11.3333 16.0002 11.3333Z" stroke="#9333EA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//     <path d="M16 17.5C17.3807 17.5 18.5 16.3807 18.5 15C18.5 13.6193 17.3807 12.5 16 12.5C14.6193 12.5 13.5 13.6193 13.5 15C13.5 16.3807 14.6193 17.5 16 17.5Z" stroke="#9333EA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>
// );


// // --- Dummy Data reflecting the screenshot ---
// const dummyReservations = [
//   {
//     id: 1,
//     guestName: "Robo Gladiators",
//     avatarUrl: "https://via.placeholder.com/32/FF5733/FFFFFF?text=RG", // Using a public placeholder
//     partySize: 4,
//     table: "Table #4",
//     time: "7:30 PM",
//     date: "March 15, 2024",
//   },
//   {
//     id: 2,
//     guestName: "Robo Gladiators",
//     avatarUrl: "https://via.placeholder.com/32/33FF57/FFFFFF?text=RG",
//     partySize: 2,
//     table: "Table #4",
//     time: "7:30 PM",
//     date: "March 15, 2024",
//   },
//   {
//     id: 3,
//     guestName: "Robo Gladiators",
//     avatarUrl: "https://via.placeholder.com/32/3357FF/FFFFFF?text=RG",
//     partySize: 1,
//     table: "Table #4",
//     time: "7:30 PM",
//     date: "March 15, 2024",
//   },
//   {
//     id: 4,
//     guestName: "Robo Gladiators",
//     avatarUrl: "https://via.placeholder.com/32/FFFF33/000000?text=RG",
//     partySize: 4,
//     table: "Table #4",
//     time: "7:30 PM",
//     date: "March 15, 2024",
//   },
// ];


// export default function NewReservationTable() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [reservations, setReservations] = useState(dummyReservations);

//   // Function to handle search input changes
//   const handleSearchChange = (e) => {
//     const term = e.target.value.toLowerCase();
//     setSearchTerm(term);

//     const filtered = dummyReservations.filter(
//       (reservation) =>
//         reservation.guestName.toLowerCase().includes(term) ||
//         reservation.table.toLowerCase().includes(term) ||
//         reservation.date.toLowerCase().includes(term) ||
//         reservation.time.toLowerCase().includes(term)
//     );
//     setReservations(filtered);
//   };

//   // --- Action Handlers ---
//   const handleApprove = (reservationId) => {
//     alert(`Approving reservation ID: ${reservationId}`);
//     // Add your approval logic here (e.g., API call, state update)
//   };

//   const handleDecline = (reservationId) => {
//     if (confirm(`Are you sure you want to decline reservation ID: ${reservationId}?`)) {
//         alert(`Declining reservation ID: ${reservationId}`);
//         // Remove the item from the list for this demo
//         setReservations(prev => prev.filter(r => r.id !== reservationId));
//     }
//   };

//   const handleView = (reservationId) => {
//     alert(`Viewing details for reservation ID: ${reservationId}`);
//     // Implement navigation or modal display logic here
//   };
  
//   const handleFilterClick = () => {
//     alert("Filter button clicked! Implement your filter logic here.");
//   };

//   return (
//     <div className="bg-[#2A2E33] p-6 rounded-xl shadow-lg bg-white/10">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold text-white">
//           New Reservation
//         </h2>

//         {/* Search Input Field and Filter Button */}
//         <div className="flex items-center">
//           <div className="relative">
//             <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search"
//               className="pl-10 pr-4 py-2 bg-[#3A3F44] text-white rounded-md border border-gray-600 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
//               value={searchTerm}
//               onChange={handleSearchChange}
//             />
//           </div>
//           <button
//             onClick={handleFilterClick}
//             className="ml-2 p-2 bg-[#3A3F44] hover:bg-gray-700 rounded-md transition-colors"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <line x1="4" y1="21" x2="4" y2="14"></line>
//               <line x1="4" y1="10" x2="4" y2="3"></line>
//               <line x1="12" y1="21" x2="12" y2="12"></line>
//               <line x1="12" y1="8" x2="12" y2="3"></line>
//               <line x1="20" y1="21" x2="20" y2="16"></line>
//               <line x1="20" y1="12" x2="20" y2="3"></line>
//               <line x1="1" y1="14" x2="7" y2="14"></line>
//               <line x1="9" y1="8" x2="15" y2="8"></line>
//               <line x1="17" y1="16" x2="23" y2="16"></line>
//             </svg>
//           </button>
//         </div>
//       </div>
      
//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full text-left text-sm">
//           <thead>
//             <tr className="text-white bg-[#1E293B] border-b border-gray-700">
//               {/* Added text-center to relevant headers */}
//               <th className="p-4 font-semibold text-center">Table</th> 
//               <th className="p-4 font-semibold">Guest Name</th>
//               <th className="p-4 font-semibold text-center">Party Size</th>
//               <th className="p-4 font-semibold">Table</th> {/* Duplicate header - consider removing or clarifying */}
//               <th className="p-4 font-semibold">Time</th>
//               <th className="p-4 font-semibold">Date</th>
//               <th className="p-4 font-semibold text-center">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {reservations.length > 0 ? (
//               reservations.map((row) => (
//                 <tr key={row.id} className="border-b border-gray-700 text-gray-300">
//                   {/* Added text-center to relevant table data cells */}
//                   <td className="p-4 text-center">{row.table}</td>
//                   <td className="p-4 flex items-center gap-3">
//                     <Image
//                       src={row.avatarUrl}
//                       alt="Guest Avatar"
//                       width={32}
//                       height={32}
//                       className="rounded-full"
//                       onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/32'; }} // Fallback for broken image links
//                     />
//                     {row.guestName}
//                   </td>
//                   <td className="p-4 text-center">{row.partySize}</td>
//                   <td className="p-4">{row.table}</td>
//                   <td className="p-4">{row.time}</td>
//                   <td className="p-4 text-center">{row.date}</td>
//                   <td className="p-4">
//                     <div className="flex items-center justify-center gap-2"> {/* Centered actions */}
//                       <button onClick={() => handleApprove(row.id)} className="cursor-pointer">
//                         <ApproveIcon />
//                       </button>
//                       <button onClick={() => handleDecline(row.id)} className="cursor-pointer">
//                         <DeclineIcon />
//                       </button>
//                       <button onClick={() => handleView(row.id)} className="cursor-pointer">
//                         <ViewIcon />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="7" className="text-center py-6 text-gray-400">
//                   No reservations found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }