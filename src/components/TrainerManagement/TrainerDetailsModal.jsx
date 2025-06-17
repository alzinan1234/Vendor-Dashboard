// components/TrainerDetailsModal.jsx
"use client";

import React from "react";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";

const TrainerDetailsModal = ({ isOpen, onClose, trainer }) => {
  if (!isOpen || !trainer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative bg-[#343434] p-6 rounded-lg shadow-lg w-[700px] text-white max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
          aria-label="Close"
        >
          <FaTimes className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-semibold mb-6">Trainer Details</h2>

        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-white">
            <Image
              src={trainer.avatar}
              alt={`${trainer.name}'s avatar`}
              width={96}
              height={96}
              objectFit="cover"
            />
          </div>
          <h3 className="text-2xl font-bold">{trainer.name}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className=" p-3 rounded border border-[#C3C3C3]">
            <p className="text-sm text-gray-400">Email Address</p>
            <p className="text-base">{trainer.email}</p>
          </div>
          <div className=" p-3 rounded border border-[#C3C3C3]">
            <p className="text-sm text-gray-400">Trainer ID</p>
            <p className="text-base">{trainer.id}</p>
          </div>
          <div className=" p-3 rounded border border-[#C3C3C3]">
            <p className="text-sm text-gray-400">Years of Experience</p>
            <p className="text-base">{trainer.yearsExperience}</p>
          </div>
          <div className=" p-3 rounded border border-[#C3C3C3]">
            <p className="text-sm text-gray-400">Per Hour Rate</p>
            <p className="text-base">${trainer.perHourRate}</p>
          </div>
          <div className="md:col-span-2  p-3 rounded border border-[#C3C3C3]">
            <p className="text-sm text-gray-400">Coaching Expertise</p>
            <p className="text-base">{trainer.coachingExpertise}</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium mb-1">Bio:</p>
          <div className=" p-3 rounded border border-[#C3C3C3] h-[100px] overflow-y-auto">
            <p className="text-sm">{trainer.bio}</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium mb-1">Achievements:</p>
          <ul className=" p-3 rounded border border-[#C3C3C3] list-disc list-inside h-[150px] overflow-y-auto">
            {trainer.achievements.map((achievement, index) => (
              <li key={index} className="text-sm">
                {achievement}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-3 rounded border border-[#C3C3C3]">
            <p className="text-sm text-gray-400">Location</p>
            <p className="text-base">{trainer.location}</p>
          </div>
          <div className=" p-3 rounded border border-[#C3C3C3]">
            <p className="text-sm text-gray-400">Preferred Training Locations</p>
            <p className="text-base">
              {trainer.preferredTrainingLocations.join(", ")}
            </p>
          </div>
          <div className=" p-3 rounded border border-[#C3C3C3]">
            <p className="text-sm text-gray-400">Availability (Date)</p>
            <p className="text-base">{trainer.availability}</p>
          </div>
          <div className=" p-3 rounded border border-[#C3C3C3]">
            <p className="text-sm text-gray-400">Time slots</p>
            {trainer.timeSlots.map((slot, index) => (
              <p key={index} className="text-base">
                {slot}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDetailsModal;