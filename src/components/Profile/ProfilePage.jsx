
"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import ChangePasswordForm from "./ChangePasswordForm";
import { profileService } from "@/lib/profileService";


export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("changePassword");
  const [profileImage, setProfileImage] = useState("/image/userImage.png");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const fileInputRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    venueName: "",
    email: "",
    mobileNumber: "",
    location: "",
    capacity: "",
    hoursOfOperation: "",
    hospitalityVenueType: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const result = await profileService.getProfile();
    
    if (result.success) {
      const profileData = result.data;
      setFormData({
        venueName: profileData.venue_name || "",
        email: profileData.email || "",
        mobileNumber: profileData.mobile_number || "",
        location: profileData.location || "",
        capacity: profileData.capacity || "",
        hoursOfOperation: profileData.hours_of_operation || "",
        hospitalityVenueType: profileData.hospitality_venue_type || ""
      });
      
      if (profileData.profile_picture) {
        setProfileImage(profileData.profile_picture);
      }
    } else {
      setMessage(result.error);
      setMessageType("error");
    }
    setLoading(false);
  };

  const handleBackClick = () => {
    router.back();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setMessage("Please upload a valid image file (JPG, JPEG, or PNG)");
        setMessageType("error");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setMessage("Image size should be less than 5MB");
        setMessageType("error");
        return;
      }

      const newImageUrl = URL.createObjectURL(file);
      setProfileImage(newImageUrl);
      setProfileImageFile(file);
      setMessage("");
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setMessageType("");

    const updateData = {
      venueName: formData.venueName,
      email: formData.email,
      mobileNumber: formData.mobileNumber,
      location: formData.location,
      capacity: formData.capacity,
      hoursOfOperation: formData.hoursOfOperation,
      hospitalityVenueType: formData.hospitalityVenueType,
    };

    if (profileImageFile) {
      updateData.profilePicture = profileImageFile;
    }

    const result = await profileService.updateProfile(updateData);

    if (result.success) {
      setMessage(result.message || "Profile updated successfully!");
      setMessageType("success");
      setProfileImageFile(null);
      await fetchProfile();
    } else {
      setMessage(result.error || "Failed to update profile");
      setMessageType("error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#343434] text-white flex justify-center items-start pt-8 pb-8 rounded-lg">
      <div
        className="flex items-center gap-4 cursor-pointer ml-5"
        onClick={handleBackClick}
      >
        <div>
          <ArrowLeft className="text-white bg-[#FFFFFF1A] rounded-full p-2" size={40} />
        </div>
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>
      
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="p-6">
          <div className="flex justify-center gap-[18px] items-center mb-6">
            <div
              className="relative rounded-full border-4 border-gray-600 cursor-pointer"
              onClick={handleImageClick}
            >
              <div className="w-[100px] h-[100px] rounded-full overflow-hidden">
                <Image
                  src={profileImage}
                  alt="User Profile"
                  width={100}
                  height={100}
                  className="rounded-full"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <span className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 border-2 border-[#343434]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M13.586 3.586a2 2 0 112.828 2.828l-7.793 7.793a.5.5 0 01-.128.093l-3 1a.5.5 0 01-.611-.611l1-3a.5.5 0 01.093-.128l7.793-7.793zM10.707 6.293a1 1 0 00-1.414 1.414L12 9.414l1.293-1.293a1 1 0 00-1.414-1.414L10.707 6.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
            <div className="flex flex-col gap-[12px]">
              <h2 className="text-[24px] font-bold mt-3 text-white">
                {formData.venueName || "User Name"}
              </h2>
              <p className="text-white font-[400] text-xl">Admin</p>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <button
              className={`py-2 px-6 text-[16px] font-semibold ${
                activeTab === "editProfile"
                  ? "border-b-2 border-[#17787C] text-[#17787C]"
                  : "text-white hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("editProfile")}
            >
              Edit Profile
            </button>
            <button
              className={`py-2 px-6 text-[16px] font-semibold ${
                activeTab === "changePassword"
                  ? "border-b-2 border-[#17787C] text-[#17787C]"
                  : "text-white hover:text-gray-300"
              }`}
              onClick={() => setActiveTab("changePassword")}
            >
              Change Password
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: "none" }}
            accept="image/png, image/jpeg, image/jpg"
          />

          {activeTab === "editProfile" && (
            <div className="p-6 flex flex-col items-center">
              {message && (
                <div
                  className={`w-full max-w-[982px] mb-4 p-3 rounded ${
                    messageType === "success"
                      ? "bg-green-500/20 text-green-400 border border-green-500"
                      : "bg-red-500/20 text-red-400 border border-red-500"
                  }`}
                >
                  {message}
                </div>
              )}

              <form className="w-full max-w-[982px]" onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="venueName"
                    className="block text-white text-sm font-bold mb-2"
                  >
                    Venue Name
                  </label>
                  <input
                    type="text"
                    id="venueName"
                    name="venueName"
                    className="shadow appearance-none rounded w-full h-[50px] py-3 px-4 bg-transparent leading-tight focus:outline-none focus:shadow-outline border border-[#C3C3C3] text-white"
                    value={formData.venueName}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-white text-sm font-bold mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="shadow appearance-none rounded w-full h-[50px] py-3 px-4 bg-transparent leading-tight focus:outline-none focus:shadow-outline border border-[#C3C3C3] text-white"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="mobileNumber"
                    className="block text-white text-sm font-bold mb-2"
                  >
                    Contact No
                  </label>
                  <input
                    type="tel"
                    id="mobileNumber"
                    name="mobileNumber"
                    className="shadow appearance-none rounded w-full h-[50px] py-3 px-4 bg-transparent leading-tight focus:outline-none focus:shadow-outline border border-[#C3C3C3] text-white"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="location"
                    className="block text-white text-sm font-bold mb-2"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className="shadow appearance-none rounded w-full h-[50px] py-3 px-4 bg-transparent leading-tight focus:outline-none focus:shadow-outline border border-[#C3C3C3] text-white"
                    value={formData.location}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="capacity"
                    className="block text-white text-sm font-bold mb-2"
                  >
                    Capacity
                  </label>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    className="shadow appearance-none rounded w-full h-[50px] py-3 px-4 bg-transparent leading-tight focus:outline-none focus:shadow-outline border border-[#C3C3C3] text-white"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="hoursOfOperation"
                    className="block text-white text-sm font-bold mb-2"
                  >
                    Hours of Operation
                  </label>
                  <input
                    type="text"
                    id="hoursOfOperation"
                    name="hoursOfOperation"
                    className="shadow appearance-none rounded w-full h-[50px] py-3 px-4 bg-transparent leading-tight focus:outline-none focus:shadow-outline border border-[#C3C3C3] text-white"
                    value={formData.hoursOfOperation}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>

                <div className="flex items-center justify-center mt-6">
                  <button
                    type="submit"
                    className="bg-[#00C1C9] hover:bg-opacity-80 text-white font-bold w-full py-3 px-4 rounded-[4px] focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      boxShadow: "3px 3px 0px 0px #71F50C",
                    }}
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "changePassword" && <ChangePasswordForm />}
        </div>
      </div>
    </div>
  );
}