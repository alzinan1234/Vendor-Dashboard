"use client";
import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import toast, { Toaster } from "react-hot-toast";
import { promotionService } from "@/lib/promotionService";
import PromotionSetupModal from "./PromotionSetupModal";
import PromotionCard from "./PromotionCard";

const PromotionSetupPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [filteredPromotions, setFilteredPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPromotion, setEditingPromotion] = useState(null);

  // Fetch promotions on component mount
  useEffect(() => {
    fetchPromotions();
  }, []);

  // Filter promotions when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPromotions(promotions);
    } else {
      const filtered = promotions.filter(
        (promotion) =>
          promotion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          promotion.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPromotions(filtered);
    }
  }, [searchTerm, promotions]);

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const result = await promotionService.getPromotions(1); // venueId = 1
      
      if (result.success) {
        setPromotions(result.data);
        setFilteredPromotions(result.data);
        if (result.data.length > 0) {
          toast.success(`Loaded ${result.data.length} promotion(s) successfully!`, {
            duration: 2000,
            icon: '📋',
          });
        }
      } else {
        toast.error(result.error || 'Failed to load promotions', {
          duration: 4000,
          icon: '❌',
        });
        setPromotions([]);
        setFilteredPromotions([]);
      }
    } catch (error) {
      console.error('Error fetching promotions:', error);
      toast.error('An error occurred while loading promotions', {
        duration: 4000,
        icon: '❌',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePromotion = async (promotionData) => {
    try {
      if (editingPromotion) {
        // UPDATE existing promotion
        console.log('Updating promotion:', editingPromotion.id);
        
        toast.loading('Updating promotion...', { id: 'save-promotion' });
        
        const result = await promotionService.updatePromotion(editingPromotion.id, promotionData);
        
        if (result.success) {
          toast.success('Promotion updated successfully!', {
            id: 'save-promotion',
            duration: 3000,
            icon: '✅',
          });
          setIsModalOpen(false);
          setEditingPromotion(null);
          fetchPromotions();
        } else {
          toast.error(result.error || 'Failed to update promotion', {
            id: 'save-promotion',
            duration: 4000,
            icon: '❌',
          });
        }
      } else {
        // CREATE new promotion
        console.log('Creating new promotion');
        
        toast.loading('Creating promotion...', { id: 'save-promotion' });
        
        const result = await promotionService.createPromotion(promotionData);
        
        if (result.success) {
          toast.success('Promotion created successfully!', {
            id: 'save-promotion',
            duration: 3000,
            icon: '✅',
          });
          setIsModalOpen(false);
          fetchPromotions();
        } else {
          toast.error(result.error || 'Failed to create promotion', {
            id: 'save-promotion',
            duration: 4000,
            icon: '❌',
          });
        }
      }
    } catch (error) {
      console.error('Error saving promotion:', error);
      toast.error('An error occurred while saving promotion', {
        id: 'save-promotion',
        duration: 4000,
        icon: '❌',
      });
    }
  };

  const handleDeletePromotion = async (promotionId) => {
    try {
      console.log('Deleting promotion with ID:', promotionId);
      
      if (!promotionId) {
        toast.error('Promotion ID is missing', {
          duration: 3000,
          icon: '⚠️',
        });
        return;
      }

      toast.loading('Deleting promotion...', { id: 'delete-promotion' });
      
      const result = await promotionService.deletePromotion(promotionId);
      
      if (result.success) {
        toast.success('Promotion deleted successfully!', {
          id: 'delete-promotion',
          duration: 3000,
          icon: '🗑️',
        });
        fetchPromotions();
      } else {
        toast.error(result.error || 'Failed to delete promotion', {
          id: 'delete-promotion',
          duration: 4000,
          icon: '❌',
        });
      }
    } catch (error) {
      console.error('Error deleting promotion:', error);
      toast.error('An error occurred while deleting promotion', {
        id: 'delete-promotion',
        duration: 4000,
        icon: '❌',
      });
    }
  };

  const handleOpenAddModal = () => {
    setEditingPromotion(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (promotion) => {
    console.log('Opening edit modal for promotion:', promotion);
    toast('Opening editor...', {
      icon: '✏️',
      duration: 1000,
    });
    setEditingPromotion(promotion);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPromotion(null);
  };

  return (
    <div className="min-h-screen bg-[#343434] text-gray-100 p-6 rounded-lg">
      <Toaster position="top-center" />

      {/* Header */}
      <header className="flex items-center justify-between pb-6 mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold text-white">Promotion Setup</h1>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleOpenAddModal}
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
              Add New Promotion
            </span>
          </button>
          
          <div className="flex items-center">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 bg-[#F3FAFA1A] rounded-tl-[7.04px] rounded-bl-[7.04px] border-[1px] border-[#0000001A] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button className="hover:bg-gray-700 transition-colors bg-[#2A2A2A] p-[5px] rounded-tr-[7.04px] rounded-br-[7.04px]">
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
      </header>

      {/* Main Content Area */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <p className="col-span-full text-center text-gray-400">Loading promotions...</p>
        ) : filteredPromotions.length > 0 ? (
          filteredPromotions.map((promotion) => (
            <PromotionCard
              key={promotion.id}
              promotion={promotion}
              onEdit={handleOpenEditModal}
              onDelete={handleDeletePromotion}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-400">
            {searchTerm ? 'No promotions found.' : 'Create your first promotion!'}
          </p>
        )}
      </main>

      {/* Promotion Setup Modal */}
      {isModalOpen && (
        <PromotionSetupModal
          onClose={handleCloseModal}
          onSave={handleSavePromotion}
          initialData={editingPromotion}
        />
      )}
    </div>
  );
};

export default PromotionSetupPage;