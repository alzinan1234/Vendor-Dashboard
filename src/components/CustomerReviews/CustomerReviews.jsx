"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect, useMemo } from "react";
import { reviewService } from "@/lib/reviewService";
import toast from "react-hot-toast";
import ReplyModal from "./ReplyModal";
import { venueService, venueServiceUserID } from "@/lib/venueService";

export default function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [statistics, setStatistics] = useState({
    total_reviews: 0,
    average_rating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [filterRating, setFilterRating] = useState(0);
  const [sortOrder, setSortOrder] = useState("newest");
  const itemsPerPage = 8;

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect( () =>{
    const test = async () => {
      const venueId = await venueServiceUserID.getMyVenueUserId();
      console.log("🔍 Venue User ID:", venueId);
    }
    test();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const venueId = await venueService.getMyVenueId();
      console.log("🔍 Venue ID:", venueId);
      const result = await reviewService.getDashboardReviews();
      console.log("🔍 API Result:", result); // ADD THIS

      if (result.success) {
        const reviewsData = Array.isArray(result.data) ? result.data : [];
        setReviews(reviewsData);
        setStatistics(
          result.statistics || {
            total_reviews: reviewsData.length,
            average_rating: 0,
          }
        );

        if (reviewsData.length > 0) {
          toast.success(`Loaded ${reviewsData.length} reviews`);
        }
      } else {
        toast.error(result.error || "Failed to load reviews");
        setReviews([]);
        setStatistics({ total_reviews: 0, average_rating: 0 });
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("An unexpected error occurred");
      setReviews([]);
      setStatistics({ total_reviews: 0, average_rating: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Enhanced filter and sort logic
  const filteredAndSortedReviews = useMemo(() => {
    let result = [...reviews];

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((review) => {
        const text = review.text?.toLowerCase() || "";
        const userName = review.user?.name?.toLowerCase() || "";
        const userEmail = review.user?.email?.toLowerCase() || "";
        const venueReply = review.venue_reply?.toLowerCase() || "";
        const venueName =
          review.hospitality_venue?.venue_name?.toLowerCase() || "";

        return (
          text.includes(searchLower) ||
          userName.includes(searchLower) ||
          userEmail.includes(searchLower) ||
          venueReply.includes(searchLower) ||
          venueName.includes(searchLower)
        );
      });
    }

    // Filter by rating
    if (filterRating > 0) {
      result = result.filter((review) => {
        const rateValue = review.rate?.rate || 0;
        return rateValue === filterRating;
      });
    }

    // Sort reviews
    result.sort((a, b) => {
      const rateA = a.rate?.rate || 0;
      const rateB = b.rate?.rate || 0;
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);

      switch (sortOrder) {
        case "oldest":
          return dateA - dateB;
        case "highest":
          return rateB - rateA;
        case "lowest":
          return rateA - rateB;
        case "newest":
        default:
          return dateB - dateA;
      }
    });

    return result;
  }, [reviews, searchTerm, filterRating, sortOrder]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedReviews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentReviews = filteredAndSortedReviews.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Calculate local statistics from filtered reviews
  const displayStats = useMemo(() => {
    const total = filteredAndSortedReviews.length;
    const replied = filteredAndSortedReviews.filter(
      (r) => r.venue_reply
    ).length;
    const pending = total - replied;

    let avgRating = 0;
    if (total > 0) {
      const totalRating = filteredAndSortedReviews.reduce(
        (sum, r) => sum + (r.rate?.rate || 0),
        0
      );
      avgRating = (totalRating / total).toFixed(1);
    }

    return {
      total,
      avgRating,
      replied,
      pending,
      globalTotal: statistics.total_reviews || total,
      globalAvgRating: statistics.average_rating || avgRating,
    };
  }, [filteredAndSortedReviews, statistics]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (rating) => {
    setFilterRating(rating);
    setCurrentPage(1);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
    setCurrentPage(1);
  };

  const handleReply = (review) => {
    setSelectedReview(review);
    setShowReplyModal(true);
  };

  const handleReplySubmit = async (replyText) => {
    if (!selectedReview) return;

    try {
      const result = await reviewService.replyToReview(
        selectedReview.id,
        replyText
      );

      if (result.success) {
        toast.success("Reply sent successfully");
        setShowReplyModal(false);
        setSelectedReview(null);
        await fetchReviews();
      } else {
        toast.error(result.error || "Failed to send reply");
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const renderStars = (rating) => {
    const rateValue = rating?.rate || rating || 0;
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-3 h-3 ${
          i < rateValue ? "text-[#FDA800]" : "text-gray-500"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const names = name.trim().split(" ");
    if (names.length === 0) return "?";
    return names
      .map((n) => n.charAt(0).toUpperCase())
      .join("")
      .substring(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  const getUserDisplayName = (user) => {
    if (user?.name && user.name.trim()) {
      return user.name;
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "Anonymous";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#343434] rounded-lg text-gray-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C1C9] mx-auto mb-4"></div>
          <p className="text-gray-300">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#343434] rounded-lg text-gray-100 p-4 font-sans">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#2A2A2A] p-4 rounded-lg border border-[#00C1C9]/30">
            <p className="text-gray-400 text-sm">Total Reviews</p>
            <p className="text-2xl font-bold text-white">
              {searchTerm || filterRating
                ? displayStats.total
                : displayStats.globalTotal}
            </p>
            {(searchTerm || filterRating) &&
              displayStats.total !== displayStats.globalTotal && (
                <p className="text-xs text-gray-500 mt-1">
                  of {displayStats.globalTotal} total
                </p>
              )}
          </div>
          <div className="bg-[#2A2A2A] p-4 rounded-lg border border-[#00C1C9]/30">
            <p className="text-gray-400 text-sm">Average Rating</p>
            <p className="text-2xl font-bold text-[#FDA800]">
              {searchTerm || filterRating
                ? displayStats.avgRating
                : displayStats.globalAvgRating}{" "}
              ⭐
            </p>
          </div>
          <div className="bg-[#2A2A2A] p-4 rounded-lg border border-[#00C1C9]/30">
            <p className="text-gray-400 text-sm">Replied</p>
            <p className="text-2xl font-bold text-green-500">
              {displayStats.replied}
            </p>
          </div>
          <div className="bg-[#2A2A2A] p-4 rounded-lg border border-[#00C1C9]/30">
            <p className="text-gray-400 text-sm">Pending</p>
            <p className="text-2xl font-bold text-yellow-500">
              {displayStats.pending}
            </p>
          </div>
        </div>

        {/* Header with Search and Filters */}
        <div className="bg-[#2A2A2A] p-4 rounded-lg mb-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h1 className="text-xl font-semibold text-white">
              Customer Reviews
            </h1>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  className="w-full pl-10 pr-4 py-2 bg-[#343434] rounded-lg border border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C1C9] focus:border-transparent"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>

              {/* Rating Filter */}
              <select
                value={filterRating}
                onChange={(e) => handleFilterChange(Number(e.target.value))}
                className="px-4 py-2 bg-[#343434] rounded-lg border border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C1C9] cursor-pointer"
              >
                <option value={0}>All Ratings</option>
                <option value={5}>5 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={2}>2 Stars</option>
                <option value={1}>1 Star</option>
              </select>

              {/* Sort Order */}
              <select
                value={sortOrder}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 bg-[#343434] rounded-lg border border-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C1C9] cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>

              {/* Refresh Button */}
              <button
                onClick={fetchReviews}
                disabled={loading}
                className="px-4 py-2 bg-[#00C1C9] text-white rounded-lg hover:bg-[#00A8B0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                title="Refresh reviews"
              >
                <svg
                  className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        {currentReviews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {currentReviews.map((review) => (
              <div
                key={review.id}
                className="p-4 rounded-lg border border-[#14EEF8] bg-gradient-to-b from-[#14EEF8]/5 to-[#71F50C]/5 backdrop-blur-sm flex flex-col gap-3 hover:shadow-lg hover:shadow-[#00C1C9]/20 transition-all"
              >
                {/* Rating and Review Text */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1">
                    {renderStars(review.rate)}
                  </div>
                  <p className="text-white text-sm leading-relaxed break-words">
                    {review.text || "No comment provided"}
                  </p>
                </div>

                <div className="border-t border-[#3061a1]/50 pt-2" />

                {/* User Info and Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full ${getAvatarColor(
                        getUserDisplayName(review.user)
                      )} flex items-center justify-center text-white text-xs font-semibold`}
                    >
                      {getInitials(getUserDisplayName(review.user))}
                    </div>
                    <span
                      className="text-xs text-gray-300 font-medium truncate max-w-[100px]"
                      title={getUserDisplayName(review.user)}
                    >
                      {getUserDisplayName(review.user)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatDate(review.created_at)}
                  </span>
                </div>

                {/* Reply Section */}
                {review.venue_reply ? (
                  <div className="p-2 bg-[#00C1C9]/10 rounded border border-[#00C1C9]/30">
                    <p className="text-xs text-gray-300 mb-1">
                      <span className="font-semibold text-[#00C1C9]">
                        Your Reply:
                      </span>
                    </p>
                    <p className="text-xs text-gray-300 break-words">
                      {review.venue_reply}
                    </p>
                    {review.venue_replied_at && (
                      <p className="text-[10px] text-gray-400 mt-1">
                        {formatDate(review.venue_replied_at)}
                      </p>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => handleReply(review)}
                    className="px-4 py-2 rounded-full border border-[#00C1C9] text-[#00C1C9] text-xs font-medium shadow-[2px_2px_0px_#71F50C] hover:bg-[#00C1C9] hover:text-white transition-all"
                  >
                    Reply to Review
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-12 bg-[#2A2A2A] rounded-lg">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-lg font-medium mb-2">
              {searchTerm || filterRating > 0
                ? "No reviews found"
                : "No reviews yet"}
            </p>
            <p className="text-sm">
              {searchTerm || filterRating > 0
                ? "Try adjusting your search or filter criteria"
                : "Reviews from customers will appear here"}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 bg-[#2A2A2A] p-4 rounded-lg">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <polyline
                  points="15 18 9 12 15 6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></polyline>
              </svg>
            </button>

            {/* Page Numbers */}
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNumber) => {
                  // Show first page, last page, current page, and pages around current
                  const showPage =
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 &&
                      pageNumber <= currentPage + 1);

                  const showEllipsis =
                    (pageNumber === currentPage - 2 && currentPage > 3) ||
                    (pageNumber === currentPage + 2 &&
                      currentPage < totalPages - 2);

                  if (showEllipsis) {
                    return (
                      <span
                        key={pageNumber}
                        className="px-3 py-2 text-gray-400"
                      >
                        ...
                      </span>
                    );
                  }

                  if (!showPage) return null;

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        pageNumber === currentPage
                          ? "bg-[#00C1C9] text-white"
                          : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                }
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-gray-600 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <polyline
                  points="9 18 15 12 9 6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></polyline>
              </svg>
            </button>

            {/* Page Info */}
            <span className="ml-4 text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {showReplyModal && selectedReview && (
        <ReplyModal
          review={selectedReview}
          onClose={() => {
            setShowReplyModal(false);
            setSelectedReview(null);
          }}
          onSubmit={handleReplySubmit}
        />
      )}
    </>
  );
}
