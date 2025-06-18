// ProfileManagement Component (original with integration)
"use client";

import { useState } from "react";
import EditProfileManagement from "./EditProfileManagement";
import Image from "next/image";

const ProfileManagement = () => {
  const [showEditForm, setShowEditForm] = useState(false);

  const toggleEditForm = () => {
    setShowEditForm(!showEditForm);
  };

  return (
    <>
      {showEditForm ? (
        <EditProfileManagement onBackClick={toggleEditForm} />
      ) : (
        <div className="min-h-screen bg-[#343434] text-white p-8 font-sans rounded-lg">
          <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6">Profile Management</h1>

            <div className="flex flex-col gap-6 mb-8">
              {/* Image Section */}
              <div className="relative w-full max-w-[349px] h-[222px] overflow-hidden rounded-[14px]">
                {/* Using a standard <img> tag as Next.js Image component requires Next.js environment */}
             <Image
  src="/image/Urban-Palate.jpg"
  alt="Restaurant Interior"
  width={349}
  height={222}
  className="w-full h-full object-cover rounded-[14px]"
  style={{ width: "100%", height: "100%" }} // Optional: ensures responsiveness
/>
                <div
                  className="absolute top-3 right-3 border bg-opacity-75 rounded-full p-2 cursor-pointer hover:bg-opacity-90"
                  onClick={toggleEditForm}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </div>
                <div className="absolute bottom-3 left-3  bg-opacity-75 rounded-full px-3 py-1 text-sm flex items-center space-x-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="21"
                    viewBox="0 0 13 21"
                    fill="none"
                  >
                    <path
                      d="M6.08398 12.8655L5.65137 12.8245C2.7484 12.55 0.476684 10.1051 0.476562 7.13013C0.476562 3.97088 3.03802 1.40942 6.19727 1.40942C9.3564 1.40955 11.917 3.97096 11.917 7.13013C11.9169 10.1052 9.64531 12.5502 6.74219 12.8245L6.31055 12.8655V19.8186C6.31055 19.8812 6.25983 19.9327 6.19727 19.9329C6.13459 19.9329 6.08398 19.8813 6.08398 19.8186V12.8655Z"
                      stroke="white"
                      strokeWidth="0.95341"
                    />
                    <path
                      d="M6.19727 5.54077C7.07475 5.54077 7.786 6.25219 7.78613 7.12964C7.78613 8.0072 7.07483 8.71851 6.19727 8.71851C5.31981 8.71837 4.6084 8.00712 4.6084 7.12964C4.60853 6.25227 5.3199 5.5409 6.19727 5.54077Z"
                      stroke="white"
                      strokeWidth="0.95341"
                    />
                    <path
                      opacity="0.3"
                      d="M6.19727 20.001C6.5467 20.001 6.83954 20.0731 7.02734 20.167C7.10373 20.2052 7.14567 20.2391 7.16992 20.2617C7.14575 20.2843 7.10422 20.319 7.02734 20.3574C6.83954 20.4513 6.5467 20.5234 6.19727 20.5234C5.84786 20.5234 5.55501 20.4513 5.36719 20.3574C5.28928 20.3185 5.24664 20.2844 5.22266 20.2617C5.24673 20.2391 5.28975 20.2057 5.36719 20.167C5.55501 20.0731 5.84783 20.001 6.19727 20.001Z"
                      fill="white"
                      stroke="white"
                      strokeWidth="0.95341"
                    />
                  </svg>
                  <span>Downtown LA</span>
                </div>
                <div className="absolute bottom-3 right-3  bg-opacity-75 rounded-full px-3 py-1 text-sm">
                  1.2 km away
                </div>
              </div>

              {/* Details Section */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Urban Palate</h2>
                <div className="flex flex-col md:flex-row md:items-start md:gap-24 text-gray-300">
                  <div className="flex flex-col gap-6 mb-6 md:mb-0">
                    <div className="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span>(808) 555-1234</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.5a2.5 2.5 0 10-5 0V12a9 9 0 109 9"
                        />
                      </svg>
                      <span>gmail.com</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>Mon-Sun</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>8:00 PM - 1:00 AM</span>
                    </div>
                  </div>
                </div>

                <ul className="list-disc list-inside text-gray-300 mt-6 space-y-2">
                  <li>Happy Hour: 5:00 - 7:00 PM | 2-for-1 Cocktails</li>
                  <li>NikoSafe Verified: Scan QR for Safe Entry - Certified by xxxx</li>
                  <li>Health Dept, 2025</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileManagement;