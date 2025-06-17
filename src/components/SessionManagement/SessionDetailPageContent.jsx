// components/SessionDetailPageContent.jsx
"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import { FaArrowLeft } from "react-icons/fa"; // Import a back arrow icon

const SessionDetailPageContent = ({ sessionData }) => {
  const router = useRouter(); // Initialize router

  if (!sessionData) {
    return <p className="text-center text-red-400">Session data is not available.</p>;
  }

  const handleGoBack = () => {
    router.back(); // Navigate back to the previous page in history
  };

  return (
    <div className="bg-[#343434] p-6 rounded-lg shadow-lg text-white max-w-4xl mx-auto my-8 relative">
      {/* Back Button */}
      <button
        onClick={handleGoBack}
        className="absolute top-4 left-4 text-gray-400 hover:text-gray-200 flex items-center gap-2 px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
        aria-label="Go back"
      >
        <FaArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Back</span> {/* Show "Back" text on larger screens */}
      </button>

      <h1 className="text-3xl font-bold mb-6 text-center">{sessionData.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Thumbnail</h3>
            <div className="relative w-full h-48 bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
              {sessionData.thumbnail ? (
                <Image
                  src={sessionData.thumbnail}
                  alt="Session Thumbnail"
                  layout="fill"
                  objectFit="cover"
                  className="object-cover"
                />
              ) : (
                <span className="text-gray-400">No Thumbnail Available</span>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">About Therapy Session</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {sessionData.aboutTherapySession}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">About Doctor</h3>
            <p className="text-gray-300 text-sm font-medium">
              {sessionData.aboutDoctor.name}
            </p>
            <p className="text-gray-300 text-sm leading-relaxed mt-1">
              {sessionData.aboutDoctor.description}
            </p>
          </div>

          

          <div>
            <h3 className="text-lg font-medium mb-2">Availability</h3>
            <p className="text-gray-300">{sessionData.availability}</p>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Time slots</h3>
            <p className="text-gray-300">{sessionData.time}</p>
            {/* If there were multiple time slots, you'd iterate here */}
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Location</h3>
            <p className="text-gray-300">{sessionData.location}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Per session fee</h3>
            <p className="text-gray-300">${sessionData.perSessionFee}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Therapy Type</h3>
            <p className="text-gray-300">{sessionData.therapyType}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Therapist</h3>
            <div className="flex items-center gap-2">
              <Image
                src="/images/john-smith-avatar.png" // Placeholder for therapist avatar
                alt="Therapist Avatar"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <p className="text-gray-300">{sessionData.therapist}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Therapist Certificates</h3>
            <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
              {sessionData.aboutDoctor.certificates.map((cert, index) => (
                <li key={index}>{cert}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetailPageContent;