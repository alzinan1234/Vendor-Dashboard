"use client";

import React, { useState } from "react";
import { CalendarDaysIcon, EyeIcon, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const PromotionCard = ({ promotion, onEdit, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="font-semibold">Delete Promotion?</p>
        <p className="text-sm text-gray-600">
          Are you sure you want to delete "{promotion.title}"?
        </p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              setIsDeleting(true);
              await onDelete(promotion.id);
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
    onEdit(promotion);
  };

  // Calculate date range display
  const getSchedule = () => {
    if (promotion.start_date && promotion.end_date) {
      const startDate = new Date(promotion.start_date).toLocaleDateString();
      const endDate = new Date(promotion.end_date).toLocaleDateString();
      return `${startDate} - ${endDate}`;
    }
    return promotion.schedule || 'No schedule set';
  };

  return (
    <div className="bg-[#FFFFFF1A] rounded-lg shadow-lg p-6 flex flex-col space-y-4 group relative">
      {/* Edit and Delete Icons */}
      <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={handleEdit}
          className="bg-[#00C1C9] hover:bg-[#00A1A9] p-2 rounded-full transition-colors"
          title="Edit Promotion"
          disabled={isDeleting}
        >
          <Pencil className="w-4 h-4 text-white" />
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={`bg-red-500 hover:bg-red-600 p-2 rounded-full transition-colors ${
            isDeleting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          title="Delete Promotion"
        >
          <Trash2 className="w-4 h-4 text-white" />
        </button>
      </div>

      <div className="flex items-start justify-between">
        <h2 className="text-lg font-semibold text-white pr-16">{promotion.title}</h2>
      </div>
      
      <p className="text-sm text-[#C2C2C2] leading-relaxed">
        {promotion.description}
      </p>
      
      <div className="flex items-center space-x-2 text-[#FFFFFF] text-xs">
        <CalendarDaysIcon className="h-4 w-4" />
        <span>{getSchedule()}</span>
      </div>
      
      <div className="flex items-center space-x-2 text-[#FFFFFF] text-xs font-bold">
        <EyeIcon className="h-4 w-4" />
        <span>Views: {(promotion.views || 0).toLocaleString()}</span>
      </div>
    </div>
  );
};

export default PromotionCard;