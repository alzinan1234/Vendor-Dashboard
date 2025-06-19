"use client";

import React, { useState, useRef } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'; // Import for the search icon
import Image from 'next/image';
import EditItem from './EditItem';

// MyMenu Component
const MyMenu = ({ onBackClick , onAddClick }) => {
  const [menuItems, setMenuItems] = useState([ // Using useState for initial data, but filtering will be done on this
    {
      id: 1,
      image: '/bannerImage/tacos.jpg',
      name: 'Cheese Nachos',
      category: 'Starter',
      price: '$49.99',
      available: true,
    },
    {
      id: 2,
      image: '/menu/image1.jpg',
      name: 'Spicy Tacos',
      category: 'Main Course',
      price: '$12.50',
      available: true,
    },
    {
      id: 3,
      image: '/menu/image17.jpg',
      name: 'Chocolate Lava Cake',
      category: 'Dessert',
      price: '$8.00',
      available: false,
    },
    {
      id: 4,
      image: '/menu/image3.jpg',
      name: 'Caesar Salad',
      category: 'Starter',
      price: '$9.25',
      available: true,
    },
    {
      id: 5,
      image: '/bannerImage/tacos.jpg',
      name: 'Pepperoni Pizza',
      category: 'Main Course',
      price: '$15.75',
      available: true,
    },
    {
      id: 6,
      image: '/menu/image4.jpg',
      name: 'Vanilla Ice Cream',
      category: 'Dessert',
      price: '$6.50',
      available: true,
    },
    {
      id: 7,
      image: '/menu/image20.jpg',
      name: 'Garlic Bread',
      category: 'Starter',
      price: '$5.00',
      available: true,
    },
    {
      id: 8,
      image: '/menu/image1.jpg',
      name: 'Beef Burger',
      category: 'Main Course',
      price: '$14.00',
      available: true,
    },
    {
      id: 9,
      image: '/bannerImage/tacos.jpg',
      name: 'Cheesecake',
      category: 'Dessert',
      price: '$9.00',
      available: true,
    },
    {
      id: 10,
      image: '/menu/image20.jpg',
      name: 'Onion Rings',
      category: 'Starter',
      price: '$7.00',
      available: true,
    },
    {
      id: 11,
      image: '/bannerImage/tacos.jpg',
      name: 'Fish and Chips',
      category: 'Main Course',
      price: '$17.00',
      available: true,
    },
    {
      id: 12,
      image: '/menu/image1.jpg',
      name: 'Apple Pie',
      category: 'Dessert',
      price: '$7.50',
      available: true,
    },
    {
      id: 13,
      image: '/menu/image10.jpg',
      name: 'Spring Rolls',
      category: 'Starter',
      price: '$6.00',
      available: true,
    },
    {
      id: 14,
      image: '/menu/image11.jpg',
      name: 'Chicken Alfredo',
      category: 'Main Course',
      price: '$16.00',
      available: true,
    },
    {
      id: 15,
      image: '/menu/image12.jpg',
      name: 'Brownie Sundae',
      category: 'Dessert',
      price: '$9.50',
      available: true,
    },
    {
      id: 16,
      image: '/menu/image21.jpg',
      name: 'Mozzarella Sticks',
      category: 'Starter',
      price: '$8.00',
      available: true,
    },
    {
      id: 17,
      image: '/menu/image14.jpg',
      name: 'Veggie Pizza',
      category: 'Main Course',
      price: '$14.50',
      available: true,
    },
    {
      id: 18,
      image: '/menu/image15.jpg',
      name: 'Fruit Salad',
      category: 'Dessert',
      price: '$7.00',
      available: true,
    },
    {
      id: 19,
      image: '/menu/image21.jpg',
      name: 'Calamari',
      category: 'Starter',
      price: '$10.00',
      available: true,
    },
    {
      id: 20,
      image: '/menu/image17.jpg',
      name: 'Grilled Salmon',
      category: 'Main Course',
      price: '$20.00',
      available: true,
    },
    {
      id: 21,
      image: '/menu/image23.webp',
      name: 'Tiramisu',
      category: 'Dessert',
      price: '$10.00',
      available: true,
    },
    {
      id: 22,
      image: '/menu/image15.jpg',
      name: 'Hummus Plate',
      category: 'Starter',
      price: '$7.50',
      available: true,
    },
    {
      id: 23,
      image: '/menu/image23.webp',
      name: 'Lamb Chops',
      category: 'Main Course',
      price: '$25.00',
      available: true,
    },
    {
      id: 24,
      image: '/menu/image8.webp',
      name: 'Panna Cotta',
      category: 'Dessert',
      price: '$8.50',
      available: true,
    },
    {
      id: 25,
      image: '/menu/image21.jpg',
      name: 'Shrimp Scampi',
      category: 'Main Course',
      price: '$19.00',
      available: true,
    },
    {
      id: 26,
      image: 'https://placehold.co/200x120/555555/FFFFFF?text=Nachos',
      name: 'Chicken Wings',
      category: 'Starter',
      price: '$11.00',
      available: true,
    },
    {
      id: 27,
      image: '/menu/image1.jpg',
      name: 'New York Cheesecake',
      category: 'Dessert',
      price: '$9.50',
      available: true,
    },
    {
      id: 28,
      image: '/image/menu-img.png',
      name: 'Sushi Platter',
      category: 'Main Course',
      price: '$28.00',
      available: true,
    },
    {
      id: 29,
      image: '/menu/image1.jpg',
      name: 'French Fries',
      category: 'Starter',
      price: '$4.50',
      available: true,
    },
    {
      id: 30,
      image: '/image/menu-img.png',
      name: 'Ravioli',
      category: 'Main Course',
      price: '$16.50',
      available: true,
    },
  ]);
const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All'); // New state for category filter
  const itemsPerPage = 25; // As per the screenshot, there are 25 items on the first page

  const [editingItem, setEditingItem] = useState(null); // State to hold the item being edited

  // Filter menu items based on search term and selected category
  const filteredItems = menuItems.filter(item => {
    const matchesSearchTerm = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
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
  const handleSaveItem = (updatedItem) => {
    setMenuItems(prevItems =>
      prevItems.map(item => (item.id === updatedItem.id ? { ...item, ...updatedItem } : item))
    );
    setEditingItem(null); // Close the EditItem component
  };

  // Function to handle going back from EditItem without saving
  const handleBackFromEditItem = () => {
    setEditingItem(null); // Close the EditItem component
  };

  // Function to render pagination numbers with ellipses
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbersToShow = 5; // Adjust as needed

    if (totalPages <= maxPageNumbersToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= Math.floor(maxPageNumbersToShow / 2) + 1) {
        for (let i = 1; i <= maxPageNumbersToShow - 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - Math.floor(maxPageNumbersToShow / 2)) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - (maxPageNumbersToShow - 2); i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - Math.floor(maxPageNumbersToShow / 2) + 1; i <= currentPage + Math.floor(maxPageNumbersToShow / 2) - 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers.map((number, index) => (
      <button
        key={index}
        onClick={() => typeof number === 'number' && paginate(number)}
        className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium
          ${currentPage === number ? 'bg-[#00C1C9] text-white' : 'text-gray-400 hover:bg-[#2d2d2d]'}
          ${number === '...' ? 'cursor-default bg-transparent hover:bg-transparent' : 'border border-transparent'}
        `}
        disabled={number === '...'}
      >
        {number}
      </button>
    ));
  };

return (
    <>
      {editingItem ? (
        <EditItem item={editingItem} onSave={handleSaveItem} onBackClick={handleBackFromEditItem} />
      ) : (
        <div className="min-h-screen bg-[#343434] text-white p-8 font-sans rounded-lg">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <button onClick={onBackClick} className="mr-4 p-2 rounded-full hover:bg-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <h1 className="text-2xl font-semibold">My Menu</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  className="flex items-center bg-[#4A4A4A] rounded-full px-4 py-2 text-sm font-medium hover:bg-[#5A5A5A]"
                  onClick={onAddClick} // Call onAddClick prop when "Add Item" is clicked
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Item
                </button>
                <div className="relative">
                  <select
                    className="bg-[#4A4A4A] rounded-full px-4 py-2 text-sm font-medium appearance-none pr-8 cursor-pointer"
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(1); // Reset to first page on category change
                    }}
                  >
                    <option>All</option>
                    <option>Starter</option>
                    <option>Main Course</option>
                    <option>Dessert</option>
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
                {/* Search Input and Button Group */}
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
                        setCurrentPage(1); // Reset to first page on search
                      }}
                    />
                  </div>

                  <button className="hover:bg-gray-700 transition-colors bg-[#2A2A2A] p-[5px] rounded-tr-[7.04px] rounded-br-[7.04px]"> {/* Added rounded corners */}
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

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {currentItems.map((item) => (
                <div key={item.id} className="bg-[#1E1E1E] rounded-lg overflow-hidden shadow-lg border border-[#3A3A3A] hover:border-[#00C1C9] transition duration-200">
                  <div className="relative h-32 w-full">
                    <img // Changed from Image to img for broader compatibility outside Next.js
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2 bg-[#1A1A1A] text-white text-xs px-2 py-1 rounded-full opacity-80">
                      {item.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                      <span className='text-[#FB6000]'>{item.category}</span> {/* Changed to dynamic category */}
                      <span className={`px-2 py-0.5 rounded-full text-xs ${item.available ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                        {item.available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-[#00C1C9]">{item.price}</span>
                      <button
                        className="p-1 rounded-full border border-[#C267FF] cursor-pointer"
                        onClick={() => handleEditItem(item)} // Attach handler to open EditItem
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M15 5.81445C15.391 5.81445 15.7047 5.98011 15.9766 6.1875C16.2345 6.38432 16.5176 6.669 16.8389 6.99023L17.0098 7.16113C17.331 7.48237 17.6157 7.76554 17.8125 8.02344C18.0199 8.29525 18.1855 8.60896 18.1855 9C18.1855 9.39104 18.0199 9.70475 17.8125 9.97656C17.6157 10.2345 17.331 10.5176 17.0098 10.8389L9.81641 18.0322C9.64435 18.2043 9.48277 18.3729 9.27734 18.4893C9.07186 18.6056 8.84448 18.6578 8.6084 18.7168L5.9541 19.3799C5.79316 19.4201 5.60594 19.4689 5.44824 19.4844C5.28312 19.5005 4.98347 19.4991 4.74219 19.2578C4.5009 19.0165 4.49947 18.7169 4.51562 18.5518C4.53105 18.3941 4.57988 18.2068 4.62012 18.0459L5.2832 15.3916C5.34222 15.1555 5.3944 14.9281 5.51074 14.7227C5.62711 14.5172 5.79572 14.3557 5.96777 14.1836L13.1611 6.99023C13.4824 6.669 13.7655 6.38432 14.0234 6.1875C14.2953 5.98011 14.609 5.81445 15 5.81445Z" stroke="#C267FF" strokeWidth="1.2"/>
                          <path d="M12.5 7.5L16.5 11.5" stroke="#C267FF" strokeWidth="1.2"/>
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
              className={`w-8 h-8 flex items-center justify-center rounded-full border ${currentPage === 1 ? 'cursor-not-allowed border-gray-700 text-gray-700' : 'hover:bg-[#2d2d2d] text-gray-400'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="8" height="15" viewBox="0 0 8 15" fill="none">
                <path d="M6.99995 13.4502C6.99995 13.4502 1.00001 9.03126 0.999999 7.45015C0.999986 5.86903 7 1.4502 7 1.4502" stroke="#E2E2E2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg> {/* Left arrow */}
            </button>

            {renderPageNumbers()}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`w-8 h-8 flex items-center rounded-full border justify-center ${currentPage === totalPages || totalPages === 0 ? 'cursor-not-allowed border-gray-700 text-gray-700' : 'hover:bg-[#2d2d2d] text-gray-400'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="8" height="15" viewBox="0 0 8 15" fill="none">
                <path d="M1.00005 1.4502C1.00005 1.4502 6.99999 5.86913 7 7.45024C7.00001 9.03136 1 13.4502 1 13.4502" stroke="#C8C8C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg> {/* Right arrow */}
            </button>
          </div>

        </div>
      )}
    </>
  );
};
export default MyMenu;