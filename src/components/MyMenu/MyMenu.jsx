"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import EditItem from "./EditItem";
import AddItem from "./AddItem";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { API_CONFIG } from "../../lib/config";
import { qrService } from '../../lib/qrService';

import toast, { Toaster } from 'react-hot-toast';
import { myMenuService } from "@/lib/myMenueService";

// MyMenu Component
const MyMenu = ({ onBackClick, onAddClick }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const itemsPerPage = 25;
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [editingItem, setEditingItem] = useState(null);
  const [showAddItem, setShowAddItem] = useState(false);

  // Fetch menu items and categories on mount
  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      const [itemsResponse, categoriesResponse] = await Promise.all([
        myMenuService.getMenuItems(),
        myMenuService.getCategories()
      ]);

      if (itemsResponse.success && itemsResponse.data) {
        setMenuItems(itemsResponse.data);
      }

      if (categoriesResponse.success && categoriesResponse.data) {
        setCategories(categoriesResponse.data);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching menu data:', error);
      toast.error('Failed to load menu data');
      setLoading(false);
    }
  };

  // Filter menu items based on search term and selected category
  const filteredItems = menuItems.filter((item) => {
    const matchesSearchTerm = item.item_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || 
      item.hospitality_venue_menu_category?.name === selectedCategory;
    return matchesSearchTerm && matchesCategory;
  });

  // Calculate total pages based on filtered items
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Get current items based on filtered items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to handle opening the EditItem component
  const handleEditItem = (item) => {
    setEditingItem(item);
  };

  // Function to handle saving changes from EditItem
  const handleSaveItem = async (updatedItem) => {
    try {
      const response = await myMenuService.updateMenuItem(
        editingItem.id,
        {
          name: updatedItem.name,
          description: updatedItem.description,
          categoryId: updatedItem.categoryId,
          price: updatedItem.price,
          discountPercentage: updatedItem.discountPercentage,
          availability: updatedItem.available ? 'available' : 'unavailable',
          image: updatedItem.image
        }
      );

      if (response.success) {
        toast.success('Menu item updated successfully!');
        setEditingItem(null);
        fetchMenuData(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating menu item:', error);
      toast.error('Failed to update menu item');
    }
  };

  // Function to handle going back from EditItem without saving
  const handleBackFromEditItem = () => {
    setEditingItem(null);
  };

  // Function to handle adding a new item from AddItem
  const handleAddItem = async (newItem) => {
    try {
      const response = await myMenuService.createMenuItem({
        name: newItem.name,
        description: newItem.description,
        categoryId: newItem.categoryId,
        price: newItem.price,
        discountPercentage: newItem.discountPercentage || '0',
        calories: newItem.calories || '0',
        servingSize: newItem.servingSize || '1',
        availability: 'available',
        image: newItem.image
      });

      if (response.success) {
        toast.success('Menu item added successfully!');
        setShowAddItem(false);
        fetchMenuData(); // Refresh the list
      }
    } catch (error) {
      console.error('Error adding menu item:', error);
      toast.error('Failed to add menu item');
    }
  };

  // Function to handle deleting an item
  const handleDeleteItem = async (itemId) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await myMenuService.deleteMenuItem(itemId);
      toast.success('Menu item deleted successfully!');
      fetchMenuData(); // Refresh the list
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast.error('Failed to delete menu item');
    }
  };

  // Function to clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setCurrentPage(1);
  };

  // Function to render pagination numbers with ellipses
  const renderPagination = () => {
    const pageNumbers = [];
    const maxPageNumbersToShow = 5;

    if (totalPages <= maxPageNumbersToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= Math.floor(maxPageNumbersToShow / 2) + 1) {
        for (let i = 1; i <= maxPageNumbersToShow - 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (
        currentPage >=
        totalPages - Math.floor(maxPageNumbersToShow / 2)
      ) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (
          let i = totalPages - (maxPageNumbersToShow - 2);
          i <= totalPages;
          i++
        ) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (
          let i = currentPage - Math.floor(maxPageNumbersToShow / 2) + 1;
          i <= currentPage + Math.floor(maxPageNumbersToShow / 2) - 1;
          i++
        ) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers.map((number, index) => (
      <button
        key={index}
        onClick={() => typeof number === "number" && paginate(number)}
        className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium
          ${
            currentPage === number
              ? "bg-[#00C1C9] text-white"
              : "text-gray-400 hover:bg-[#2d2d2d]"
          }
          ${
            number === "..."
              ? "cursor-default bg-transparent hover:bg-transparent"
              : "border border-transparent"
          }
        `}
        disabled={number === "..."}
      >
        {number}
      </button>
    ));
  };

  const downloadQRCode = async () => {
    try {
      await qrService.downloadQRCode();
      toast.success('QR Code downloaded successfully!');
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast.error('Failed to download QR code');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#343434] text-white p-8 font-sans rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C1C9] mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* <Toaster position="top-right" /> */}
      {showAddItem ? (
          <AddItem
          onBackClick={() => setShowAddItem(false)}
          onAddItem={handleAddItem}
          categories={categories}
          onCategoryAdded={() => fetchMenuData()} // Add this
        />
      ) : editingItem ? (
        <EditItem
          item={editingItem}
          onSave={handleSaveItem}
          onBackClick={handleBackFromEditItem}
          onDelete={handleDeleteItem}
          categories={categories}
        />
      ) : (
        <div className="min-h-screen bg-[#343434] text-white p-8 font-sans rounded-lg">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <h1 className="text-2xl font-semibold">My Menu</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  className="flex items-center bg-[#4A4A4A] rounded-full px-4 py-2 text-sm font-medium hover:bg-[#5A5A5A]"
                  onClick={() => setShowAddItem(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add Item
                </button>
                <button
                  className="flex items-center bg-[#4A4A4A] rounded-full px-4 py-2 text-sm font-medium hover:bg-[#5A5A5A] transition-colors duration-200 active:bg-[#3A3A3A]"
                  onClick={downloadQRCode}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <rect width="5" height="5" x="3" y="3" rx="1" />
                    <rect width="5" height="5" x="16" y="3" rx="1" />
                    <rect width="5" height="5" x="3" y="16" rx="1" />
                    <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
                    <path d="M21 21v.01" />
                    <path d="M12 7v3a2 2 0 0 1-2 2H7" />
                    <path d="M3 12h.01" />
                    <path d="M12 3h.01" />
                    <path d="M12 16v.01" />
                    <path d="M16 12h1" />
                    <path d="M21 12v.01" />
                    <path d="M12 21v-1" />
                  </svg>
                  Download QR Code
                </button>
                <div className="relative">
                  <select
                    className="bg-[#4A4A4A] rounded-full px-4 py-2 text-sm font-medium appearance-none pr-8 cursor-pointer"
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option>All</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search"
                      className="pl-10 pr-4 py-2 bg-[#F3FAFA1A] rounded-tl-[7.04px] rounded-bl-[7.04px] border-[1px] border-[#0000001A] text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
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
                      <ellipse cx="7" />
                    </svg>
                  </button>
                </div>
                {(searchTerm !== "" || selectedCategory !== "All") && (
                  <button
                    onClick={handleClearFilters}
                    className="flex items-center bg-red-600 rounded-full px-4 py-2 text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {currentItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#1E1E1E] rounded-lg overflow-hidden shadow-lg border border-[#3A3A3A] hover:border-[#00C1C9] transition duration-200"
                >
                  <div className="relative h-32 w-full">
                    <img
                      src={item.image || "/placeholder-food.jpg"}
                      alt={item.item_name}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2 bg-[#1A1A1A] text-white text-xs px-2 py-1 rounded-full opacity-80">
                      {item.hospitality_venue_menu_category?.name || 'N/A'}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-1">{item.item_name}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                      <span className="text-[#FB6000]">
                        {item.hospitality_venue_menu_category?.name || 'N/A'}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          item.availability === 'available'
                            ? "bg-green-600 text-white"
                            : "bg-red-600 text-white"
                        }`}
                      >
                        {item.availability === 'available' ? "Available" : "Unavailable"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-[#00C1C9]">
                        ${item.price}
                      </span>
                      <button
                        className="p-1 rounded-full border border-[#C267FF] cursor-pointer"
                        onClick={() => handleEditItem(item)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M15 5.81445C15.391 5.81445 15.7047 5.98011 15.9766 6.1875C16.2345 6.38432 16.5176 6.669 16.8389 6.99023L17.0098 7.16113C17.331 7.48237 17.6157 7.76554 17.8125 8.02344C18.0199 8.29525 18.1855 8.60896 18.1855 9C18.1855 9.39104 18.0199 9.70475 17.8125 9.97656C17.6157 10.2345 17.331 10.5176 17.0098 10.8389L9.81641 18.0322C9.64435 18.2043 9.48277 18.3729 9.27734 18.4893C9.07186 18.6056 8.84448 18.6578 8.6084 18.7168L5.9541 19.3799C5.79316 19.4201 5.60594 19.4689 5.44824 19.4844C5.28312 19.5005 4.98347 19.4991 4.74219 19.2578C4.5009 19.0165 4.49947 18.7169 4.51562 18.5518C4.53105 18.3941 4.57988 18.2068 4.62012 18.0459L5.2832 15.3916C5.34222 15.1555 5.3944 14.9281 5.51074 14.7227C5.62711 14.5172 5.79572 14.3557 5.96777 14.1836L13.1611 6.99023C13.4824 6.669 13.7655 6.38432 14.0234 6.1875C14.2953 5.98011 14.609 5.81445 15 5.81445Z"
                            stroke="#C267FF"
                            strokeWidth="1.2"
                          />
                          <path
                            d="M12.5 7.5L16.5 11.5"
                            stroke="#C267FF"
                            strokeWidth="1.2"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Section */}
          <div className="flex justify-end items-center mt-6 gap-2 text-sm">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`w-8 h-8 flex items-center justify-center rounded border ${
                currentPage === 1
                  ? "cursor-not-allowed border-gray-700 text-gray-700"
                  : "hover:bg-[#2d2d2d] text-gray-400"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="8"
                height="15"
                viewBox="0 0 8 15"
                fill="none"
              >
                <path
                  d="M6.99995 13.4502C6.99995 13.4502 1.00001 9.03126 0.999999 7.45015C0.999986 5.86903 7 1.4502 7 1.4502"
                  stroke="#E2E2E2"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {renderPagination()}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`w-8 h-8 flex items-center rounded border justify-center ${
                currentPage === totalPages || totalPages === 0
                  ? "cursor-not-allowed border-gray-700 text-gray-700"
                  : "hover:bg-[#2d2d2d] text-gray-400"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="8"
                height="15"
                viewBox="0 0 8 15"
                fill="none"
              >
                <path
                  d="M1.00005 1.4502C1.00005 1.4502 6.99999 5.86913 7 7.45024C7.00001 9.03136 1 13.4502 1 13.4502"
                  stroke="#C8C8C8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MyMenu;