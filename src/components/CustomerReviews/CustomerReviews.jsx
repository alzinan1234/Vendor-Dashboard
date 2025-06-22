"use client";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
// Import necessary libraries and components
import React, { useState } from 'react';

// Main App component for Customer Reviews
export default function CustomerReviews() {
  // Sample data for customer reviews
  const [reviews, setReviews] = useState([
    {
      id: 1,
      rating: 5,
      comment: 'Great food!',
      reviewerName: 'Arlene McCoy',
      reviewerAvatar: 'https://placehold.co/40x40/FF5733/FFFFFF?text=AM', // Placeholder avatar
      date: 'April 2024',
    },
    {
      id: 2,
      rating: 4,
      comment: 'Loved the ambiance and service.',
      reviewerName: 'Kathryn Murphy',
      reviewerAvatar: 'https://placehold.co/40x40/33FF57/FFFFFF?text=KM',
      date: 'March 2024',
    },
    {
      id: 3,
      rating: 5,
      comment: 'Highly recommend this place!',
      reviewerName: 'Guy Hawkins',
      reviewerAvatar: 'https://placehold.co/40x40/3357FF/FFFFFF?text=GH',
      date: 'April 2024',
    },
    {
      id: 4,
      rating: 3,
      comment: 'Decent experience, good coffee.',
      reviewerName: 'Eleanor Pena',
      reviewerAvatar: 'https://placehold.co/40x40/FF33DA/FFFFFF?text=EP',
      date: 'February 2024',
    },
    {
      id: 5,
      rating: 5,
      comment: 'Fantastic service and delicious desserts!',
      reviewerName: 'Leslie Alexander',
      reviewerAvatar: 'https://placehold.co/40x40/DA33FF/FFFFFF?text=LA',
      date: 'May 2024',
    },
    {
      id: 6,
      rating: 4,
      comment: 'Enjoyed the live music, food was good.',
      reviewerName: 'Ronald Richards',
      reviewerAvatar: 'https://placehold.co/40x40/33FFD4/FFFFFF?text=RR',
      date: 'April 2024',
    },
    {
      id: 7,
      rating: 5,
      comment: 'The best experience!',
      reviewerName: 'Esther Howard',
      reviewerAvatar: 'https://placehold.co/40x40/FFD433/FFFFFF?text=EH',
      date: 'March 2024',
    },
    {
      id: 8,
      rating: 4,
      comment: 'Good value for money.',
      reviewerName: 'Wade Warren',
      reviewerAvatar: 'https://placehold.co/40x40/33A4FF/FFFFFF?text=WW',
      date: 'February 2024',
    },
    {
      id: 9,
      rating: 5,
      comment: 'Exquisite dishes and lovely staff.',
      reviewerName: 'Bessie Cooper',
      reviewerAvatar: 'https://placehold.co/40x40/A433FF/FFFFFF?text=BC',
      date: 'May 2024',
    },
    {
      id: 10,
      rating: 3,
      comment: 'A bit noisy but food was okay.',
      reviewerName: 'Robert Fox',
      reviewerAvatar: 'https://placehold.co/40x40/FF337A/FFFFFF?text=RF',
      date: 'April 2024',
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 4; // Number of review cards to display per page

  // Filter reviews based on search term
  const filteredReviews = reviews.filter(review =>
    Object.values(review).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReviews = filteredReviews.slice(startIndex, startIndex + itemsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle reply button click (placeholder for actual reply logic)
  const handleReply = (reviewId) => {
    alert(`Replying to review with ID: ${reviewId}`);
    // In a real application, this might open a modal or navigate to a reply form
  };

  // Function to render star ratings
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`w-3 h-3 ${i < rating ? 'text-[#FDA800]' : 'text-gray-500'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
        </svg>
      );
    }
    return stars;
  };

  return (
   <>
    <div className="min-h-screen bg-[#343434] rounded-lg  text-gray-100 p-4 font-sans flex flex-col items-center">
      <div className="w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4  rounded-t-lg">
          <h1 className="text-xl font-semibold text-white">Customer Reviews</h1>
          <div className="flex items-center ">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 bg-[#F3FAFA1A] rounded-tl-[7.04px] rounded-bl-[7.04px] border-[1px] border-[#0000001A] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={handleSearchChange}
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

        {/* Reviews Grid */}
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
          {currentReviews.length > 0 ? (
            currentReviews.map((review) => (
              <div
                key={review.id}
                className="w-full h-full p-[12px] rounded-[6.98px] border border-[1.16px] border-[#14EEF8] [background:linear-gradient(180deg,rgba(20,238,248,0.01)_0%,rgba(113,245,12,0.01)_100%)] [backdrop-blur-[23.52px]] flex flex-col justify-start items-start gap-[5.82px]"
              >
                <div className="w-full flex flex-col justify-start items-start gap-[12px]">
                  <div className="w-full flex flex-col justify-start items-start gap-[4px]">
                    <div className="w-full flex flex-col justify-start items-start gap-[8px]">
                      <div className="flex items-center gap-[2px]">
                        {renderStars(review.rating)}
                      </div>
                      <div className="w-full flex flex-col justify-center text-white text-[14px] font-roboto font-normal leading-[25.91px] tracking-[0.56px]" style={{wordWrap: 'break-word'}}>
                        {review.comment}
                      </div>
                    </div>
                    <div className="w-full h-0 border-t  border-[#3061a1] border-[0.58px] my-1" />
                    <div className="w-full flex flex-row justify-between items-center">
                      <div className="flex flex-wrap items-center gap-[6.4px] content-center">
                        <img
                          className="w-[22.68px] h-[22.68px] rounded-full"
                          src={review.reviewerAvatar}
                          alt={review.reviewerName}
                          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/23x23'; }}
                        />
                        <div className="flex flex-col justify-center text-white text-[12.19px] font-roboto font-medium capitalize leading-[13.49px] tracking-[0.43px]" style={{wordWrap: 'break-word'}}>
                          {review.reviewerName}
                        </div>
                      </div>
                      <div className="flex flex-col justify-center text-white text-[12px] font-roboto font-normal leading-[22.21px] tracking-[0.48px]" style={{wordWrap: 'break-word'}}>
                        {review.date}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleReply(review.id)}
                    className="h-[26px] px-[12px] py-[4px] [box-shadow:2px_2px_0px_#71F50C] rounded-[40px] border border-[#00C1C9] flex flex-wrap items-center content-center justify-center gap-[10px] text-[#00C1C9] text-[12px] font-roboto font-normal"
                  >
                    Reply
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 py-8">
              No reviews found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Pagination */}
    <div className="flex items-center justify-end p-4  rounded-b-lg">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 mx-1 rounded-full bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-200"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => handlePageChange(pageNumber)}
          className={`px-4 py-2 mx-1 rounded text-sm font-medium ${
            pageNumber === currentPage
              ? 'bg-[#00C1C9] text-white'
              : 'text-gray-200 hover:bg-gray-500'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          {pageNumber}
        </button>
      ))}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 mx-1 rounded-full bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-200"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
      {totalPages > 5 && (
        <>
          {currentPage < totalPages - 2 && <span className="mx-1 text-gray-300">....</span>}
          <button
            onClick={() => handlePageChange(totalPages)}
            className={`px-4 py-2 mx-1 rounded text-sm font-medium ${
              totalPages === currentPage
                ? 'bg-[#00C1C9] text-white'
                : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            {totalPages}
          </button>
        </>
      )}
    </div>
   </>
  );
}
   