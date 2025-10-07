"use client";

import React, { useState, useEffect } from "react";
import AddBannerModal from "./AddBannerModal";
import BannerCard from "./BannerCard";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import toast, { Toaster } from "react-hot-toast";
import { bannerService } from "@/lib/bannerService";

export default function BannerManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [banners, setBanners] = useState([]);
  const [filteredBanners, setFilteredBanners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editingBanner, setEditingBanner] = useState(null);
  const bannersPerPage = 8;

  // Fetch banners on component mount
  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const result = await bannerService.getBanners(1); // venueId = 1
      
      if (result.success) {
        setBanners(result.data);
        setFilteredBanners(result.data);
        if (result.data.length > 0) {
          toast.success(`Loaded ${result.data.length} banner(s) successfully!`, {
            duration: 2000,
            icon: '📋',
          });
        }
      } else {
        toast.error(result.error || 'Failed to load banners', {
          duration: 4000,
          icon: '❌',
        });
        setBanners([]);
        setFilteredBanners([]);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast.error('An error occurred while loading banners', {
        duration: 4000,
        icon: '❌',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddBanner = async (newBannerData) => {
    try {
      toast.loading('Creating banner...', { id: 'create-banner' });
      
      const result = await bannerService.createBanner(newBannerData);
      
      if (result.success) {
        toast.success('Banner created successfully!', {
          id: 'create-banner',
          duration: 3000,
          icon: '✅',
        });
        setIsModalOpen(false);
        fetchBanners(); // Refresh the list
      } else {
        toast.error(result.error || 'Failed to create banner', {
          id: 'create-banner',
          duration: 4000,
          icon: '❌',
        });
      }
    } catch (error) {
      console.error('Error creating banner:', error);
      toast.error('An error occurred while creating banner', {
        id: 'create-banner',
        duration: 4000,
        icon: '❌',
      });
    }
  };

  const handleEditBanner = async (bannerData) => {
    try {
      console.log('Editing banner with data:', bannerData);
      
      if (!bannerData.id) {
        toast.error('Banner ID is missing', {
          duration: 4000,
          icon: '⚠️',
        });
        return;
      }

      toast.loading('Updating banner...', { id: 'update-banner' });

      const result = await bannerService.updateBanner(bannerData.id, bannerData);
      
      if (result.success) {
        toast.success('Banner updated successfully!', {
          id: 'update-banner',
          duration: 3000,
          icon: '✅',
        });
        setIsModalOpen(false);
        setEditingBanner(null);
        fetchBanners(); // Refresh the list
      } else {
        toast.error(result.error || 'Failed to update banner', {
          id: 'update-banner',
          duration: 4000,
          icon: '❌',
        });
      }
    } catch (error) {
      console.error('Error updating banner:', error);
      toast.error('An error occurred while updating banner', {
        id: 'update-banner',
        duration: 4000,
        icon: '❌',
      });
    }
  };

  const handleDeleteBanner = async (bannerId) => {
    try {
      console.log('Deleting banner with ID:', bannerId);
      
      if (!bannerId) {
        toast.error('Banner ID is missing', {
          duration: 4000,
          icon: '⚠️',
        });
        return;
      }

      toast.loading('Deleting banner...', { id: 'delete-banner' });

      const result = await bannerService.deleteBanner(bannerId);
      
      if (result.success) {
        toast.success('Banner deleted successfully!', {
          id: 'delete-banner',
          duration: 3000,
          icon: '🗑️',
        });
        fetchBanners(); // Refresh the list
      } else {
        toast.error(result.error || 'Failed to delete banner', {
          id: 'delete-banner',
          duration: 4000,
          icon: '❌',
        });
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast.error('An error occurred while deleting banner', {
        id: 'delete-banner',
        duration: 4000,
        icon: '❌',
      });
    }
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    if (searchTerm === "") {
      setFilteredBanners(banners);
    } else {
      const filtered = banners.filter(
        (banner) =>
          (banner.banner_title || "").toLowerCase().includes(searchTerm) ||
          (banner.banner_description || "").toLowerCase().includes(searchTerm) ||
          (banner.location || "").toLowerCase().includes(searchTerm)
      );
      setFilteredBanners(filtered);
    }
    setCurrentPage(1);
  };

  const openEditModal = (banner) => {
    setEditingBanner(banner);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingBanner(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingBanner(null);
  };

  const handleModalSave = (bannerData) => {
    if (editingBanner) {
      handleEditBanner(bannerData);
    } else {
      handleAddBanner(bannerData);
    }
  };

  // Pagination logic
  const indexOfLastBanner = currentPage * bannersPerPage;
  const indexOfFirstBanner = indexOfLastBanner - bannersPerPage;
  const currentBanners = filteredBanners.slice(indexOfFirstBanner, indexOfLastBanner);
  const totalPages = Math.ceil(filteredBanners.length / bannersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-[#2E2E2E] min-h-screen rounded p-8">
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-white">Banner Management</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={openCreateModal}
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

          <div className="flex items-center">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>

            <input
              type="text"
              className="pl-10 pr-4 py-2 bg-[#F3FAFA1A] rounded-tl-[7.04px] rounded-bl-[7.04px] border-[1px] border-[#0000001A] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Search"
              aria-label="Search input"
              onChange={handleSearch}
            />

            <button className="hover:bg-gray-700 transition-colors bg-[#2A2A2A] p-[7px]">
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
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-white text-lg">Loading banners...</div>
        </div>
      ) : currentBanners.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-64">
          <div className="text-gray-400 text-lg mb-4">No banners found</div>
          <button
            onClick={openCreateModal}
            className="bg-[#00C1C9] text-white px-6 py-2 rounded-full hover:bg-[#00A1A9] transition-colors"
          >
            Create Your First Banner
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentBanners.map((banner) => (
            <BannerCard
              key={banner.id}
              banner={banner}
              onEdit={openEditModal}
              onDelete={handleDeleteBanner}
            />
          ))}
        </div>
      )}

      <AddBannerModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        editBanner={editingBanner}
      />
    </div>
  );
}