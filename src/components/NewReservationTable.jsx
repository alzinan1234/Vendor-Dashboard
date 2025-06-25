"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const reservations = [
  {
    id: 1,
    table: "Table #1",
    guestName: "Robo Gladiators",
    partySize: 4,
    time: "12:30 PM",
    date: "March 15, 2024",
    avatar: "/avatar.png", // Replace with actual avatar path
  },
  {
    id: 2,
    table: "Table #2",
    guestName: "Robo Gladiators",
    partySize: 2,
    time: "11:30 PM",
    date: "March 15, 2024",
    avatar: "/avatar.png",
  },
  {
    id: 3,
    table: "Table #3",
    guestName: "Robo Gladiators",
    partySize: 1,
    time: "10:30 PM",
    date: "March 15, 2024",
    avatar: "/avatar.png",
  },
  {
    id: 4,
    table: "Table #4",
    guestName: "Robo Gladiators",
    partySize: 4,
    time: "8:30 PM",
    date: "March 15, 2024",
    avatar: "/avatar.png",
  },
];

export default function NewReservationTable() {
  const [search, setSearch] = useState("");

  const filtered = reservations.filter((r) =>
    r.guestName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#3F3F3F] text-white p-4 rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">New Reservation</h2>
        {/* Search Input and Button Group */}
        <div className="flex items-center ">
          <div className="relative ">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 bg-[#F3FAFA1A] rounded-tl-[7.04px] rounded-bl-[7.04px] border-[1px] border-[#0000001A]   text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>

          <button className=" hover:bg-gray-700 transition-colors bg-[#2A2A2A] p-[5px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
            >
              <path
                d="M11 8.5L20 8.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M4 16.5L14 16.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <ellipse
                cx="7"
                cy="8.5"
                rx="3"
                ry="3"
                transform="rotate(90 7 8.5)"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <ellipse
                cx="17"
                cy="16.5"
                rx="3"
                ry="3"
                transform="rotate(90 17 16.5)"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-[#00C1C980] text-white text-center">
              {" "}
              {/* Added text-center here */}
              <th className="px-4 py-2">Table</th>
              <th className="px-4 py-2">Guest Name</th>
              <th className="px-4 py-2">Party Size</th>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((res) => (
              <tr
                key={res.id}
                className="border-b-[0.49px] border-b-[rgba(208,208,208,0.8)] h"
              >
                <td className="px-4 py-2 align-middle text-center">
                  {res.table}
                </td>{" "}
                {/* Added text-center */}
                <td className="px-4 py-2 flex items-center gap-2 justify-center align-middle">
                  <img
                    src={res.avatar}
                    alt={res.guestName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  {res.guestName}
                </td>
                <td className="px-4 py-2 align-middle text-center">
                  {res.partySize}
                </td>{" "}
                {/* Added text-center */} {/* Added text-center */}
                <td className="px-4 py-2 align-middle text-center">
                  {res.time}
                </td>{" "}
                {/* Added text-center */}
                <td className="px-4 py-2 align-middle text-center">
                  {res.date}
                </td>{" "}
                {/* Added text-center */}
                <td className="px-4 py-2 flex items-center gap-[10px] justify-center align-middle">
                  <button className="bg-[#4BB54B1A] border border-[#4BB54B] rounded-[51px] p-[5px] flex justify-center items-center shrink-0 hover:text-green-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 12 9"
                      fill="none"
                    >
                      <path
                        d="M1.3335 6.01782C1.3335 6.01782 2.3335 6.01782 3.66683 8.35116C3.66683 8.35116 7.37271 2.24004 10.6668 1.01782"
                        stroke="#4BB54B"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button className="text-red-500 hover:text-red-700 border border-[#FF0000] rounded-[51px] p-[5px] ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 12 11"
                      fill="none"
                    >
                      <path
                        d="M10.6668 0.684326L1.3335 10.0177M1.3335 0.684326L10.6668 10.0177"
                        stroke="#FF0000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  <Link href={`/vendor/manage-new-reservation/${res.id}`}>
                  <button className="text-purple-400 border border-[#C267FF] hover:text-purple-600 rounded-[51px] p-[5px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 11"
                      fill="none"
                    >
                      <path
                        d="M14.3628 4.63424C14.5655 4.91845 14.6668 5.06056 14.6668 5.27091C14.6668 5.48127 14.5655 5.62338 14.3628 5.90759C13.4521 7.18462 11.1263 9.93758 8.00016 9.93758C4.87402 9.93758 2.54823 7.18462 1.63752 5.90759C1.43484 5.62338 1.3335 5.48127 1.3335 5.27091C1.3335 5.06056 1.43484 4.91845 1.63752 4.63424C2.54823 3.35721 4.87402 0.604248 8.00016 0.604248C11.1263 0.604248 13.4521 3.35721 14.3628 4.63424Z"
                        stroke="#C267FF"
                      />
                      <path
                        d="M10 5.271C10 4.16643 9.10457 3.271 8 3.271C6.89543 3.271 6 4.16643 6 5.271C6 6.37557 6.89543 7.271 8 7.271C9.10457 7.271 10 6.37557 10 5.271Z"
                        stroke="#C267FF"
                      />
                    </svg>
                  </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
