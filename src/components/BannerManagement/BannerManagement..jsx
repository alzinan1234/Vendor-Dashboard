"use client";

import React, { useState, useEffect } from "react";
import AddBannerModal from "./AddBannerModal";
import Pagination from "./Pagination";
import BannerCard from "./BannerCard";
import Image from "next/image";
import { FaSearch } from "react-icons/fa";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function BannerManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [banners, setBanners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const bannersPerPage = 8; // Adjust as needed based on your layout

  // Dummy data for demonstration
  const dummyBanners = [
    {
      id: 1,
      title: "Celebrate Taco Tuesday!",
      description: "Details: 'Buy 1 Get 1 Free on Tacos from 5-9 PM'",
      imageUrl: "/bannerImage/tacos.jpg", // Make sure this path exists or use a placeholder
      startDate: "2025-05-10",
      startTime: "8:00 PM",
      endDate: "2025-05-10",
      endTime: "1:00 AM",
      link: "#",
      location: "Luna Lounge, Downtown LA",
    },
    {
      id: 2,
      title: "Summer Music Fest",
      description: "Enjoy live music and great food all weekend!",
      imageUrl: "/bannerImage/Summer-Music-Fest.jpg", // Make sure this path exists or use a placeholder
      startDate: "2025-07-15",
      startTime: "10:00 AM",
      endDate: "2025-07-17",
      endTime: "11:00 PM",
      link: "#",
      location: "Central Park",
    },
    {
      id: 3,
      title: "Art Exhibition",
      description: "Explore contemporary art from local artists.",
      imageUrl: "/bannerImage/Art-Exhibition.jpg", // Make sure this path exists or use a placeholder
      startDate: "2025-06-20",
      startTime: "09:00 AM",
      endDate: "2025-06-30",
      endTime: "06:00 PM",
      link: "#",
      location: "City Gallery",
    },
    {
      id: 4,
      title: "Tech Conference 2025",
      description: "Innovate and network with industry leaders.",
      imageUrl: "/BannerImage/TechConference.jpg", // Make sure this path exists or use a placeholder
      startDate: "2025-09-01",
      startTime: "09:00 AM",
      endDate: "2025-09-03",
      endTime: "05:00 PM",
      link: "#",
      location: "Convention Center",
    },
    {
      id: 5,
      title: "Food Truck Rally",
      description: "A culinary adventure with various food trucks.",
      imageUrl: "/bannerImage/Food-Truck.jpg", // Make sure this path exists or use a placeholder
      startDate: "2025-08-05",
      startTime: "11:00 AM",
      endDate: "2025-08-05",
      endTime: "09:00 PM",
      link: "#",
      location: "Park Square",
    },
    {
      id: 6,
      title: "Community Cleanup Day",
      description: "Help make our community cleaner and greener.",
      imageUrl: "/BannerImage/TechConference.jpg", // Make sure this path exists or use a placeholder
      startDate: "2025-07-10",
      startTime: "09:00 AM",
      endDate: "2025-07-10",
      endTime: "01:00 PM",
      link: "#",
      location: "Riverside Park",
    },
  ];

  useEffect(() => {
    // In a real app, you'd fetch banners from your API here
    // For now, use dummy data
    setBanners(dummyBanners);
  }, []);

  const handleAddBanner = (newBannerData) => {
    // In a real application, you would send this data to your backend API
    // Example: await fetch('/api/banners', { method: 'POST', body: JSON.stringify(newBannerData) });
    // Then, refetch banners or update state locally.
    console.log("Saving new banner:", newBannerData);
    setBanners((prev) => [
      ...prev,
      { ...newBannerData, id: prev.length + 1 }, // Assign a simple ID for dummy data
    ]);
    setIsModalOpen(false);
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    if (searchTerm === "") {
      setBanners(dummyBanners); // Reset to all banners if search is cleared
    } else {
      const filteredBanners = dummyBanners.filter(
        (banner) =>
          banner.title.toLowerCase().includes(searchTerm) ||
          banner.description.toLowerCase().includes(searchTerm) ||
          banner.location.toLowerCase().includes(searchTerm)
      );
      setBanners(filteredBanners);
    }
    setCurrentPage(1); // Reset to first page on search
  };

  // Pagination logic
  const indexOfLastBanner = currentPage * bannersPerPage;
  const indexOfFirstBanner = indexOfLastBanner - bannersPerPage;
  const currentBanners = banners.slice(indexOfFirstBanner, indexOfLastBanner);
  const totalPages = Math.ceil(banners.length / bannersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className=" bg-[#2E2E2E] min-h-screen rounded p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-white">Banner Management</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 pl-[2px] pr-[13px] py-1"
            style={{
              borderRadius: "22px",
              background: "rgba(255,255,255,0.10)",
            }}
          >
            <span className="w-[27px] h-[27px] flex items-center justify-center text-black rounded-full bg-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 27 27"
                fill="none"
              >
                <path
                  d="M13.49 6.75L13.49 20.25"
                  stroke="#6A6A6A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M20.24 13.5L6.73999 13.5"
                  stroke="#6A6A6A"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="text-white font-medium text-[12px]">
             Add New Banner
            </span>
          </button>

          <div className="flex items-center ">
            {/* Search Icon */}
            <div className="relative ">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>

            {/* Search Input Field */}
            <input
              type="text"
              className="pl-10 pr-4 py-2 bg-[#F3FAFA1A] rounded-tl-[7.04px] rounded-bl-[7.04px] border-[1px] border-[#0000001A]  text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Search"
              aria-label="Search input"
              onChange={handleSearch}
            />

            {/* Filter/Search Button (right side of search input) */}
            <button className=" hover:bg-gray-700 transition-colors bg-[#2A2A2A] p-[7px]">
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
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <path
                  d="M4 16.5L14 16.5"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <ellipse
                  cx="7"
                  cy="8.5"
                  rx="3"
                  ry="3"
                  transform="rotate(90 7 8.5)"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <ellipse
                  cx="17"
                  cy="16.5"
                  rx="3"
                  ry="3"
                  transform="rotate(90 17 16.5)"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentBanners.map((banner) => (
          <BannerCard key={banner.id} banner={banner} />
        ))}
      </div>

      {/* {banners.length > bannersPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )} */}

      <AddBannerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddBanner}
      />
    </div>
  );
}
