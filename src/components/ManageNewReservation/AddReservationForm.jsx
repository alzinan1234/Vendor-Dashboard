// components/AddReservationForm.jsx

import React from "react";

export default function AddReservationForm({ onClose }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here, e.g., send data to an API
    console.log("Reservation form submitted!");
    onClose(); // Close the form after submission
  };

  return (
    // This div will be the only content displayed in the main section when the form is open
    <div className="bg-[#3F3F3F] md:h-[714px] p-6 rounded-lg shadow-lg w-full text-white mt-4">
      {/* Added mt-4 for spacing from top */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Add Reservation</h2>
        <button onClick={onClose} className="text-white  hover:text-white">
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
          <label
            htmlFor="guestName"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Guest Name
          </label>
          <input
            type="text"
            id="guestName"
            className="w-full px-3 py-2 border border-[#CACACA] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Robo Gladiators"
            defaultValue="Robo Gladiators"
          />
        </div>

        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Phone number
          </label>
          <input
            type="text"
            id="phoneNumber"
            className="w-full px-3 py-2 border border-[#CACACA] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="(319) 555-0115"
            defaultValue="(319) 555-0115"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Email (if)
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 border border-[#CACACA] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="abc@example.com"
            defaultValue="abc@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="partySize"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Party Size
          </label>
          <input
            type="number"
            id="partySize"
            className="w-full px-3 py-2 border border-[#CACACA] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="4"
            defaultValue="4"
          />
        </div>

        <div>
          <label
            htmlFor="time"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Time
          </label>
          <select
            id="time"
            className="w-full px-3 py-2 bg-[#2A2A2A] border border-[#CACACA] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
            defaultValue="7:30 PM"
          >
            <option value="7:30 PM">7:30 PM</option>
            <option value="8:00 PM">8:00 PM</option>
            <option value="8:30 PM">8:30 PM</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Date
          </label>
          <input
            type="text"
            id="date"
            className="w-full px-3 py-2 border border-[#CACACA] rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="March 15, 2024"
            defaultValue="March 15, 2024"
          />
        </div>

        <div className="col-span-full bottom-0 mt-[100px]">
          <button
            type="submit"
            className="w-full mx-auto flex justify-center items-center rounded-full bg-[#00C1C9] text-white py-2 font-medium border-b-4 border-lime-400"
          >
            Add Reservation
          </button>
        </div>
      </form>
    </div>
  );
}
