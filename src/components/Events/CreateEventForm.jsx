"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Calendar,
  Clock,
  ArrowLeft,
  Upload,
} from "lucide-react";

// Form Component for Creating a New Event
function CreateEventForm({ onBack, onPublish }) {
  const [entryType, setEntryType] = useState("Paid");
  const [price, setPrice] = useState("Paid"); // Note: This seems to be a second dropdown in the UI. I've named it 'price' for now.
  const [bannerName, setBannerName] = useState("");
  const [timeSlots, setTimeSlots] = useState([]); // State for time slots

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setBannerName(e.target.files[0].name);
    }
  };

  const handleAddTimeSlot = () => {
    // For now, let's add a default time slot.
    // In a real application, you might open a modal or prompt for time input.
    setTimeSlots([...timeSlots, "10:40 AM - 11:00 AM"]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const eventData = Object.fromEntries(formData.entries());
    console.log("Publishing Event:", { ...eventData, timeSlots });
    // onPublish(eventData); // You can pass the data up to the parent
    onBack(); // Go back to the list after submission
  };

  return (
    <div className="bg-[#2D2D2D] min-h-screen text-white font-sans rounded-lg flex flex-col p-4 sm:p-6 lg:p-8">
      <header className="flex items-center gap-4 mb-8 w-full">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Create New Event</h1>
      </header>

      <form onSubmit={handleSubmit} className="flex-grow flex flex-col space-y-5">
        <div className="space-y-2">
          <label htmlFor="eventTitle" className="text-sm font-medium text-gray-300">
            Event Title
          </label>
          <input
            type="text"
            id="eventTitle"
            name="eventTitle"
            className="w-full border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00C1C9] "
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="eventDescription" className="text-sm font-medium text-gray-300">
            Event Description
          </label>
          <textarea
            id="eventDescription"
            name="eventDescription"
            rows="4"
            className="w-full border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00C1C9] "
          ></textarea>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-medium text-gray-300">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              className="w-full border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00C1C9] custom-date-input "
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="time" className="text-sm font-medium text-gray-300">
              Time
            </label>
            <input
              type="time"
              id="time"
              name="time"
              className="w-full border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00C1C9] custom-date-input "
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="maxAttendees" className="text-sm font-medium text-gray-300">
            Max number of attendees
          </label>
          <input
            type="number"
            id="maxAttendees"
            name="maxAttendees"
            className="w-full border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00C1C9] "
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label htmlFor="entryType" className="text-sm font-medium text-gray-300">
              Entry Type
            </label>
            <select
              id="entryType"
              name="entryType"
              value={entryType}
              onChange={(e) => setEntryType(e.target.value)}
              className="w-full bg-[#1E1E1E] border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00C1C9]"
            >
              <option>Paid</option>
              <option>Free</option>
            </select>
          </div>
          {/* Based on the image, this second dropdown also exists. Adjust as needed. */}
          <div className="space-y-2">
            <label htmlFor="price" className="text-sm font-medium text-gray-300">
              Price per ticket
            </label>
            <select
              id="price"
              name="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-[#1E1E1E] border border-gray-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00C1C9]"
            >
              <option>Paid</option>
              <option>Free</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Upload Banner</label>
          <div className="relative w-full h-32 border-2 border-dashed border-gray-600 rounded-lg flex flex-col items-center justify-center text-gray-400">
            <input
              type="file"
              id="bannerUpload"
              name="bannerUpload"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
            <Upload size={32} />
            <p className="mt-2 text-sm">{bannerName || "Upload"}</p>
          </div>
        </div>

        {/* Time slot section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="text-base font-medium text-gray-300">Time slot:</label>
            <button
              type="button"
              onClick={handleAddTimeSlot}
              className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="space-y-2">
            {timeSlots.length === 0 && (
              <p className="text-sm text-gray-500">No time slots added yet. Click '+' to add one.</p>
            )}
            {timeSlots.map((slot, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="radio"
                  id={`timeSlot-${index}`}
                  name="selectedTimeSlot"
                  value={slot}
                  className="form-radio h-4 w-4 text-[#00C1C9] border-gray-600 focus:ring-[#00C1C9]"
                />
                <label htmlFor={`timeSlot-${index}`} className="ml-2 text-white text-sm">
                  {slot}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-grow"></div> {/* Spacer */}

        <div className="col-span-full mt-4">
          <button
            type="submit"
            className="w-full mx-auto flex justify-center items-center rounded-full bg-[#00C1C9] text-white py-2 font-medium border-b-4 border-lime-400"
          >
            Publish Event
          </button>
        </div>
      </form>
    </div>
  );
}
export default CreateEventForm;