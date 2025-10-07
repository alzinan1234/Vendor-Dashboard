"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const BannerCard = ({ banner, onEdit, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    
    // Confirmation toast with promise
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="font-semibold">Delete Banner?</p>
        <p className="text-sm text-gray-600">
          Are you sure you want to delete "{banner.title || banner.banner_title}"?
        </p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              setIsDeleting(true);
              await onDelete(banner.id);
              setIsDeleting(false);
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 10000,
      position: 'top-center',
    });
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    toast('Opening editor...', {
      duration: 1000,
      icon: '✏️',
    });
    onEdit(banner);
  };

  // Get image URL from banner data
  const imageUrl = banner.imageUrl || banner.image || "https://via.placeholder.com/400x200";

  return (
    <div className="relative w-full max-w-sm md:h-[249px] rounded-[42px] overflow-hidden shadow-lg text-white group">
      {/* Background Image */}
      <Image
        src={imageUrl}
        alt={banner.title || banner.banner_title}
        fill
        className="w-full h-full object-cover"
        priority
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#00000080] p-4 flex flex-col justify-end rounded-2xl">
        {/* Edit and Delete Icons */}
        <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleEdit}
            className="bg-[#00C1C9] hover:bg-[#00A1A9] p-2 rounded-full transition-colors"
            title="Edit Banner"
          >
            <Pencil className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`bg-red-500 hover:bg-red-600 p-2 rounded-full transition-colors ${
              isDeleting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Delete Banner"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold">
            {banner.title || banner.banner_title}
          </h3>
          <p className="text-sm text-white">
            {banner.description || banner.banner_description}
          </p>
          
          <div className="flex items-center text-sm text-white mt-2 space-x-4">
            {/* Date */}
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>
                {new Date(banner.startDate || banner.start_date).toLocaleDateString()}
              </span>
            </div>
            
            {/* Time */}
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                {banner.startTime || banner.start_time} - {banner.endTime || banner.end_time}
              </span>
            </div>
          </div>
        </div>
        
        {/* Location */}
        <div className="flex items-center text-sm text-white mt-2">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{banner.location}</span>
        </div>
      </div>
    </div>
  );
};

export default BannerCard;