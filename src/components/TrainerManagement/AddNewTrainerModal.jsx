// components/AddNewTrainerModal.jsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaTimes, FaUpload } from "react-icons/fa"; // FaTimes for close, FaUpload for upload icon

const AddNewTrainerModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // State for form fields (basic example, expand as needed)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    yearsOfExperience: "",
    bio: "",
    achievements: "",
    skillLevelExpertise: "",
    location: "",
    preferredTrainingLocations: [], // Changed to an array to store multiple locations
    currentPreferredLocationInput: "", // New state for the current input field value
    perHourRate: "",
    profilePicture: null, // For file object
    availability: [], // Array of selected dates
    timeSlots: [{ startTime: "", endTime: "" }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for the new input field for preferred training locations
  const handleCurrentPreferredLocationInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      currentPreferredLocationInput: e.target.value,
    }));
  };

  const handleAddPreferredLocation = () => {
    if (formData.currentPreferredLocationInput.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        preferredTrainingLocations: [
          ...prev.preferredTrainingLocations,
          prev.currentPreferredLocationInput.trim(),
        ],
        currentPreferredLocationInput: "", // Clear the input after adding
      }));
    }
  };

  const handleRemovePreferredLocation = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      preferredTrainingLocations: prev.preferredTrainingLocations.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        profilePicture: e.target.files[0],
      }));
    }
  };

  const handleDateSelect = (day) => {
    setFormData((prev) => {
      const newAvailability = prev.availability.includes(day)
        ? prev.availability.filter((d) => d !== day)
        : [...prev.availability, day];
      return { ...prev, availability: newAvailability.sort((a, b) => a - b) };
    });
  };

  const addTimeSlot = () => {
    setFormData((prev) => ({
      ...prev,
      timeSlots: [...prev.timeSlots, { startTime: "", endTime: "" }],
    }));
  };

  const removeTimeSlot = (index) => {
    setFormData((prev) => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((_, i) => i !== index),
    }));
  };

  const handleTimeSlotChange = (index, field, value) => {
    setFormData((prev) => {
      const newTimeSlots = [...prev.timeSlots];
      newTimeSlots[index] = { ...newTimeSlots[index], [field]: value };
      return { ...prev, timeSlots: newTimeSlots };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Trainer Data Submitted:", formData);
    // Here you would typically send this data to your backend API
    onClose(); // Close modal after submission
  };

  // Mock calendar data for JANUARI 2025 as per screenshot
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const calendarStartOffset = 3; // Jan 1, 2025 was a Wednesday (0=Sun, 1=Mon, 2=Tue, 3=Wed)
  const availableDates = [
    16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative bg-[#343434] p-6 rounded-lg shadow-lg w-[1336px]  text-white max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
          aria-label="Close"
        >
          <FaTimes className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-semibold mb-6">Add Trainer</h2>

        <form onSubmit={handleSubmit} className="">
          <div className="grid grid-cols-3  w-full gap-12 ">
            {/* Full Name */}
            <div className="flex flex-col gap-5 ">
              <div className="col-span-1 md:col-span-1 lg:col-span-1">
                <label htmlFor="fullName" className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full p-2  border border-[#C3C3C3]  rounded focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              {/* Email Address */}
              <div className="col-span-1 md:col-span-1 lg:col-span-1">
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2  border border-[#C3C3C3]  rounded focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              {/* Phone Number / If */}
              <div className="col-span-1 md:col-span-1 lg:col-span-1">
                <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1">
                  Phone Number / If
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full p-2  border border-[#C3C3C3]  rounded focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Years of Experience */}
              <div className="col-span-1 md:col-span-1 lg:col-span-1">
                <label
                  htmlFor="yearsOfExperience"
                  className="block text-sm font-medium mb-1"
                >
                  Years of Experience
                </label>
                <input
                  type="number"
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  className="w-full p-2  border border-[#C3C3C3]  rounded focus:outline-none focus:border-cyan-500"
                  min="0"
                />
              </div>

              {/* Bio */}
              <div className="col-span-1 md:col-span-1 lg:col-span-1">
                <label htmlFor="bio" className="block text-sm font-medium mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-2  border border-[#C3C3C3]  rounded focus:outline-none focus:border-cyan-500"
                ></textarea>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {/* Achievements */}
              <div className="col-span-1 md:col-span-1 lg:col-span-1">
                <label htmlFor="achievements" className="block text-sm font-medium mb-1">
                  Achievements
                </label>
                <textarea
                  id="achievements"
                  name="achievements"
                  value={formData.achievements}
                  onChange={handleChange}
                  rows="3" // Adjust rows as needed
                  className="w-full p-2  border border-[#C3C3C3]  rounded focus:outline-none focus:border-cyan-500"
                ></textarea>
              </div>

              {/* Skill Level Expertise */}
              <div className="col-span-1 md:col-span-1 lg:col-span-1">
                <label
                  htmlFor="skillLevelExpertise"
                  className="block text-sm font-medium mb-1"
                >
                  Skill Level Expertise (Optional)
                </label>
                <input
                  type="text"
                  id="skillLevelExpertise"
                  name="skillLevelExpertise"
                  value={formData.skillLevelExpertise}
                  onChange={handleChange}
                  className="w-full p-2  border border-[#C3C3C3]  rounded focus:outline-none focus:border-cyan-500"
                  placeholder="Beginner" // Placeholder from image
                />
              </div>

              {/* Location */}
              <div className="col-span-1 md:col-span-1 lg:col-span-1">
                <label htmlFor="location" className="block text-sm font-medium mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-2  border border-[#C3C3C3]  rounded focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Preferred Training Locations */}
              <div className="col-span-1 md:col-span-1 lg:col-span-1">
                <label
                  htmlFor="preferredTrainingLocationsInput"
                  className="block text-sm font-medium mb-1"
                >
                  Preferred Training Locations
                </label>
                <div className="flex  items-center gap-2">
                  <input
                    type="text"
                    id="preferredTrainingLocationsInput"
                    name="currentPreferredLocationInput"
                    value={formData.currentPreferredLocationInput}
                    onChange={handleCurrentPreferredLocationInputChange}
                    className="flex-grow p-2  border border-[#C3C3C3]  rounded focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddPreferredLocation}
                    className="w-8 h-8 flex items-center justify-center border text-white rounded hover:bg-cyan-700 transition-colors text-xl leading-none"
                  >
                    +
                  </button>
                </div>
                {/* Display added locations */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.preferredTrainingLocations.map((location, index) => (
                    <span
                      key={index}
                      className="flex items-center bg-cyan-700 text-white px-3 py-1 rounded-full text-sm"
                    >
                      {location}
                      <button
                        type="button"
                        onClick={() => handleRemovePreferredLocation(index)}
                        className="ml-2 text-white hover:text-gray-200"
                      >
                        <FaTimes className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Per Hour Rate */}
              <div className="col-span-1 md:col-span-1 lg:col-span-1">
                <label htmlFor="perHourRate" className="block text-sm font-medium mb-1">
                  Per Hour Rate
                </label>
                <input
                  type="number"
                  id="perHourRate"
                  name="perHourRate"
                  value={formData.perHourRate}
                  onChange={handleChange}
                  className="w-full p-2  border border-[#C3C3C3]  rounded focus:outline-none focus:border-cyan-500"
                  min="0"
                />
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {/* Profile Picture Upload */}
              <div className="col-span-1 md:col-span-1 lg:col-span-1 row-span-2">
                <label className="block text-sm font-medium mb-1">Profile Picture</label>
                <div className="flex flex-col items-center justify-center w-full h-40 border-1 border-dashed border-[#C3C3C3]  rounded-lg cursor-pointer  hover:bg-gray-700 transition-colors">
                  <input
                    type="file"
                    id="profilePicture"
                    name="profilePicture"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="profilePicture" className="text-center text-gray-400 cursor-pointer">
                    <Image src="/icon/Download_light.svg" alt="Download Icon" width={93} height={93} />
                    <span className="block text-sm">Upload</span>
                    {formData.profilePicture && (
                      <span className="block text-xs mt-1 text-cyan-400">
                        {formData.profilePicture.name}
                      </span>
                    )}
                  </label>
                </div>
              </div>

              {/* Availability Calendar */}
              <div className="col-span-1 md:col-span-2 lg:col-span-1">
  <label className="block text-sm font-medium mb-1">Availability Date</label>
  <div className=" rounded-[13.64px] border border-[#DCDCDC] p-3 relative overflow-hidden">
    {/* Month header */}
    <div className="flex justify-between items-center mb-2 border-b border-[#DCDCDC] px-2 pb-3">
      <span className="font-bold text-[16px]">JANUARI 2025</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
        >
          <span className="text-white text-lg">&#8249;</span>
        </button>
        <button
          type="button"
          className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
        >
          <span className="text-white text-lg">&#8250;</span>
        </button>
      </div>
    </div>
    {/* Weekdays */}
    <div className="grid grid-cols-7 gap-1 text-center text-white text-[12px] font-medium mb-2">
      <span>Mon</span>
      <span>Tue</span>
      <span>Wed</span>
      <span>Thu</span>
      <span>Fri</span>
      <span>Sat</span>
      <span>Sun</span>
    </div>
    {/* Days grid */}
    <div className="grid grid-cols-7 gap-y-2 gap-x-1">
      {/* Empty cells for leading days */}
      {Array.from({ length: calendarStartOffset }).map((_, i) => (
        <div key={`empty-${i}`} className="w-10 h-10"></div>
      ))}
      {daysInMonth.map((day) => {
        const isAvailable = availableDates.includes(day);
        const isSelected = formData.availability.includes(day);
        return (
          <button
            key={day}
            type="button"
            onClick={() => handleDateSelect(day)}
            disabled={!isAvailable}
            className={`
              w-10 h-10 aspect-square flex items-center justify-center rounded-full font-bold text-[12px] transition
              ${isAvailable
                ? isSelected
                  ? "bg-cyan-500 text-[#343434]"
                  : "bg-[#71F50C] text-[#434343] hover:bg-green-600"
                : "bg-[#4A4A4A] text-[#676767] cursor-not-allowed"}
            `}
            style={{
              boxShadow: isSelected ? "0 0 0 2px #00C1C9" : undefined,
            }}
          >
            {day}
          </button>
        );
      })}
    </div>
  </div>
</div>

              {/* Time Slots */}
              <div className="col-span-1 md:col-span-2 lg:col-span-1">
                {formData.timeSlots.map((slot, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="time"
                      className="flex-grow p-2 ] border border-[#C3C3C3] rounded focus:outline-none focus:border-cyan-500"
                      value={slot.startTime}
                      onChange={(e) =>
                        handleTimeSlotChange(index, "startTime", e.target.value)
                      }
                      placeholder="Start Time"
                    />
                    <input
                      type="time"
                      className="flex-grow p-2  border border-[#C3C3C3] rounded focus:outline-none focus:border-cyan-500"
                      value={slot.endTime}
                      onChange={(e) =>
                        handleTimeSlotChange(index, "endTime", e.target.value)
                      }
                      placeholder="End Time"
                    />
                    {formData.timeSlots.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTimeSlot(index)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        <FaTimes />{" "}
                        {/* You mentioned trash can icon, but FaTimes is used, so keeping FaTimes as per original code. If you meant trash can icon, you might need FaTrash from react-icons/fa. */}
                      </button>
                    )}
                  </div>
                ))}
                <div className=" mt-4 ">
                  <button
                    type="button"
                    onClick={addTimeSlot}
                    className="w-full border px-48 py-2 flex items-center justify-center mx-auto rounded hover:bg-cyan-700 transition-colors text-xl leading-none"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Create Button */}
          <div className="col-span-full mt-4">
            <button
              type="submit"
              className="w-full mx-auto flex justify-center items-center rounded-full bg-cyan-400 hover:bg-cyan-300 text-white py-2 font-medium border-b-4 border-lime-400"
            >
              create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewTrainerModal;