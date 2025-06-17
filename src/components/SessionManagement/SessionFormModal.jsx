// components/AddNewSessionModal.jsx
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FaTimes, FaTrash } from "react-icons/fa"; // Added FaUpload for consistency

const AddNewSessionModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // State for form fields (simplified for brevity)
  const [sessionTitle, setSessionTitle] = useState("");
  const [aboutSession, setAboutSession] = useState("");
  const [location, setLocation] = useState("");
  const [sessionFee, setSessionFee] = useState("");
  const [therapyType, setTherapyType] = useState("");
  const [aboutTherapist, setAboutTherapist] = useState("");
  const [Therapist, setTherapist] = useState("");
  const [availabilityDates, setAvailabilityDates] = useState([]); // Array of selected dates
  const [timeSlots, setTimeSlots] = useState([{ start: "", end: "" }]); // Array of time slots
  const [thumbnail, setThumbnail] = useState(null); // State for thumbnail image
  const [profilePicture, setProfilePicture] = useState(null); // State for profile picture
  const [currentMonth, setCurrentMonth] = useState(0); // State for the current month (0-indexed)
  const [currentYear, setCurrentYear] = useState(2025); // State for the current year

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay(); // 0 = Sunday

  const handleMonthChange = (direction) => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else if (direction === "next") {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const leadingBlanks = Array.from({ length: firstDayOfMonth }, () => null);

  const handleDateClick = (day) => {
    const selectedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setAvailabilityDates((prevDates) =>
      prevDates.includes(selectedDate)
        ? prevDates.filter((date) => date !== selectedDate)
        : [...prevDates, selectedDate]
    );
  };

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { start: "", end: "" }]);
  };

  const removeTimeSlot = (index) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots.splice(index, 1);
    setTimeSlots(newTimeSlots);
  };

  const handleTimeSlotChange = (index, field, value) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots[index][field] = value;
    setTimeSlots(newTimeSlots);
  };

  const handleFileChange = (e, setImage) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Preview image
      e.target.value = ""; // Reset file input to allow re-selection of the same file
    }
  };

  const handleRemoveImage = (setImage) => {
    setImage(null); // Clear the image state
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      sessionTitle,
      aboutSession,
      location,
      sessionFee,
      therapyType,
      aboutTherapist,
      Therapist,
      availabilityDates,
      timeSlots,
    });
    // Here you would typically send this data to your backend
    onClose(); // Close modal after submission
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-10">
      <div className="relative bg-[#2E2E2E] rounded-lg w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute  right-0  rounded-full p-3 text-white text-xl hover:text-gray-300 transition-colors"
          aria-label="Close modal"
        >
          <FaTimes />
        </button>

        <form onSubmit={handleSubmit} className="p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Add New Session
          </h2>

          {/* Form Fields Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 mb-8">
            {/* Session Title */}
            <div className="flex flex-col gap-6">
              <div>
                <label
                  htmlFor="sessionTitle"
                  className="block text-[#ffff] text-sm font-bold mb-2"
                >
                  Session Title
                </label>
                <input
                  type="text"
                  id="sessionTitle"
                  className="w-full p-3  text-white rounded-lg border border-white focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="Enter Session Title"
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                />
              </div>

              {/* About Therapy Session */}
              <div className="md:col-span-2">
                <label
                  htmlFor="aboutSession"
                  className="block text-[#ffff] text-sm font-bold   mb-2"
                >
                  About Therapy Session
                </label>
                <textarea
                  id="aboutSession"
                  rows="3"
                  className="w-full p-3  text-white rounded-lg border border-white focus:ring-cyan-500 focus:border-cyan-500 resize-y"
                  placeholder="Write about the therapy session"
                  value={aboutSession}
                  onChange={(e) => setAboutSession(e.target.value)}
                ></textarea>
              </div>

              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="block text-[#ffff] text-sm font-bold mb-2"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  className="w-full p-3  text-white rounded-lg border border-white focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="Ex. Los Angeles, CA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              {/* Per session fee */}
              <div>
                <label
                  htmlFor="sessionFee"
                  className="block text-[#ffff] text-sm font-bold mb-2"
                >
                  Per session fee
                </label>
                <input
                  type="number"
                  id="sessionFee"
                  className="w-full p-3  text-white rounded-lg border border-white focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder="$"
                  value={sessionFee}
                  onChange={(e) => setSessionFee(e.target.value)}
                />
              </div>

              {/* Therapy Type (Dropdown) */}
              <div className="relative">
                {" "}
                {/* Added relative for custom arrow positioning */}
                <label
                  htmlFor="therapyType"
                  className="block text-white text-sm font-bold mb-2"
                >
                  Therapy Type
                </label>
                <div className="flex items-center relative">
                  <select
                  id="therapyType"
                  className="w-full p-3 text-white rounded-lg border border-[#ffff] focus:ring-cyan-500 focus:border-cyan-500 appearance-none pr-8"
                  value={therapyType}
                  onChange={(e) => setTherapyType(e.target.value)}
                >
                  <option value="" disabled className="bg-[#000] text-white">
                    Select Therapy Type
                  </option>
                  <option value="CBT" className="bg-gray-800 text-white">
                    CBT
                  </option>
                  <option value="DBT" className="bg-gray-800 text-white">
                    DBT
                  </option>
                  <option
                    value="Talk Therapy"
                    className="bg-gray-500 text-white"
                  >
                    Talk Therapy
                  </option>
                </select>
                {/* Custom arrow for select if default appearance-none is used */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center px-4 text-white">
                  <Image
                    src="/icon/Expand_down_light.svg"
                    alt="_light.svg"
                    width={24} // Adjust width as needed
                    height={24} // Adjust height as needed
                  />
                </div>
                </div>
              </div>

              {/* Therapist Name (Disabled) */}
              <div>
                <label
                  htmlFor="therapistName"
                  className="block text-[#ffff] text-sm font-bold mb-2"
                >
                  Therapist Name
                </label>
                <input
                  type="text"
                  id="therapistName"
                  className="w-full p-3  text-white rounded-lg border border-white cursor-not-allowed"
                  placeholder="Therapist Name"
                  
                  
                />
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {/* About Therapist */}
              <div className="md:col-span-2">
                <label
                  htmlFor="aboutTherapist"
                  className="block text-[#ffff] text-sm font-bold mb-2"
                >
                  About Therapist
                </label>
                <textarea
                  id="aboutTherapist"
                  rows="3"
                  className="w-full p-3  text-white rounded-lg border border-white focus:ring-cyan-500 focus:border-cyan-500 resize-y"
                  placeholder="Write about the therapist"
                  value={aboutTherapist}
                  onChange={(e) => setAboutTherapist(e.target.value)}
                ></textarea>
              </div>

              {/* Therapist Certificates */}
              <div className="md:col-span-2">
                <label
                  htmlFor="aboutTherapist"
                  className="block text-[#ffff] text-sm font-bold mb-2"
                >
                  Therapist Certificats
                </label>
                <textarea
                  id=" Therapist Certificats"
                  rows="3"
                  className="w-full p-3  text-white rounded-lg border border-white focus:ring-cyan-500 focus:border-cyan-500 resize-y"
                  placeholder="Write  Therapist Certificats"
                  value={Therapist}
                  onChange={(e) => setTherapist(e.target.value)}
                ></textarea>
              </div>

              {/* Upload Thumbnail */}
              <div>
                <label className="block text-[#ffff] text-sm font-bold mb-2">
                  Upload Thumbnail
                </label>
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white rounded-lg h-48">
                  {thumbnail ? (
                    <div className="relative">
                      <img
                        src={thumbnail}
                        alt="Thumbnail Preview"
                        className="w-[200px] object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(setThumbnail)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2"
                        aria-label="Remove Thumbnail"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => document.getElementById("thumbnailInput").click()}
                      className="flex flex-col items-center"
                    >
                      <Image
                        src="/icon/Download_light.svg"
                        alt="Upload Thumbnail Icon"
                        width={98}
                        height={98}
                      />
                      <p className="text-[#CACACA] font-semibold text-[15px] mt-2">
                        Upload
                      </p>
                    </button>
                  )}
                  <input
                    id="thumbnailInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, setThumbnail)}
                  />
                </div>
              </div>

              {/* Therapist Profile Picture */}
              <div>
                <label className="block text-[#ffff] text-sm font-bold mb-2">
                  Therapist Profile Picture
                </label>
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white rounded-lg h-48">
                  {profilePicture ? (
                    <div className="relative">
                      <img
                        src={profilePicture}
                        alt="Profile Picture Preview"
                        className="w-[200px] h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(setProfilePicture)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2"
                        aria-label="Remove Profile Picture"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => document.getElementById("profilePictureInput").click()}
                      className="flex flex-col items-center"
                    >
                      <Image
                        src="/icon/Download_light.svg"
                        alt="Upload Profile Picture Icon"
                        width={98}
                        height={98}
                      />
                      <p className="text-[#CACACA] font-semibold text-[15px] mt-2">
                        Upload
                      </p>
                    </button>
                  )}
                  <input
                    id="profilePictureInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, setProfilePicture)}
                  />
                </div>
              </div>
            </div>

            {/* Availability Dates & Time Slots */}

            <div className=" w-[400px]">
              <h3 className="text-xl font-semibold text-white mb-4 text-center">
                Availability
              </h3>

              <div className="grid grid-cols-1  gap-8">
                {/* Calendar Section */}
              <div className="bg-[#343434] rounded-[13.64px] border border-[#DCDCDC] relative overflow-hidden">
  {/* Month header */}
  <div className="flex justify-between items-center mb-2 border-b border-[#DCDCDC] px-4 pt-4 pb-3">
    <span className="font-bold text-[16px] uppercase text-white">
      {new Date(currentYear, currentMonth).toLocaleString("default", {
        month: "long",
      })}{" "}
      {currentYear}
    </span>
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => handleMonthChange("prev")}
        className="w-[22px] h-[22px] flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
      >
        <span className="text-white text-lg">&#8249;</span>
      </button>
      <button
        type="button"
        onClick={() => handleMonthChange("next")}
        className="w-[22px] h-[22px] flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
      >
        <span className="text-white text-lg">&#8250;</span>
      </button>
    </div>
  </div>
  {/* Weekdays */}
  <div className="grid grid-cols-7 gap-1 text-center text-white text-[12px] font-medium mb-2 px-4">
    <span>Mon</span>
    <span>Tue</span>
    <span>Wed</span>
    <span>Thu</span>
    <span>Fri</span>
    <span>Sat</span>
    <span>Sun</span>
  
  
  </div>
  {/* Days grid */}
  <div className="grid grid-cols-7 gap-y-2 gap-x-1 px-4 pb-4">
    {/* Empty cells for leading days */}
    {Array.from({ length: (firstDayOfMonth + 6) % 7 }).map((_, i) => (
      <div key={`empty-${i}`} className="w-[38px] h-[38px]"></div>
    ))}
    {days.map((day) => {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const isSelected = availabilityDates.includes(dateStr);
      // You can add your own logic for available/unavailable days
      const isAvailable = true;
      return (
        <button
          key={day}
          type="button"
          onClick={() => handleDateClick(day)}
          disabled={!isAvailable}
          className={`
            w-[38px] h-[38px] flex items-center justify-center rounded-[27.28px] font-bold text-[12px] transition
            ${isAvailable
              ? isSelected
                ? "bg-[#676767] text-[#343434] outline outline-2 "
                : "bg-[#71F50C] text-[#434343] hover:bg-green-600"
              : "bg-[#4A4A4A] text-[#676767] cursor-not-allowed"}
          `}
        >
          {day}
        </button>
      );
    })}
  </div>
</div>

                {/* Time Slots Section */}
                <div className=" rounded-lg p-6">
                  {timeSlots.map((slot, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 mb-4 text-white"
                    >
                      <input
                        type="time"
                        placeholder="Start Time"
                        className="w-full p-3 bg-[#313131] text-white rounded-lg border border-[#555] focus:ring-cyan-500 focus:border-cyan-500"
                        value={slot.start}
                        onChange={(e) =>
                          handleTimeSlotChange(index, "start", e.target.value)
                        }
                      />
                      <span className="text-white">-</span>
                      <input
                        type="time"
                        placeholder="End Time"
                        className="w-full p-3 bg-[#313131] text-white rounded-lg border border-[#555] focus:ring-cyan-500 focus:border-cyan-500"
                        value={slot.end}
                        onChange={(e) =>
                          handleTimeSlotChange(index, "end", e.target.value)
                        }
                      />
                      {timeSlots.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTimeSlot(index)}
                          className="text-red-500 transition-colors"
                          aria-label="Remove time slot"
                        >
                          <FaTrash className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="submit"
                    className="text-white text-lg px-10 py-2 rounded w-full border border-[#AEAEAE] flex items-center justify-center "
                  >
                    <Image
                      src="/icon/Add_round_light.svg"
                      alt="Add Icon"
                      width={24}
                      height={24}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Create Button */}
          {/* Done Button */}
          <button
            type="submit"
            className="md:w-[1500px] mx-auto flex justify-center items-center  rounded-full bg-cyan-400 hover:bg-cyan-300 text-white py-2 font-medium  border-b-4 border-lime-400"
          >
            create
          </button>
        </form>
      </div>

      {/* Custom Scrollbar Styling (can be put in global CSS or a style tag) */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #2b2b2b; /* Darker track */
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #555; /* Thumb color */
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #777; /* Thumb hover color */
        }
      `}</style>
    </div>
  );
};

export default AddNewSessionModal;
