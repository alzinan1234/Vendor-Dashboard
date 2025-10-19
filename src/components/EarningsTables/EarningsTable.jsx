// components/EarningsTable.js
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { earningsService } from "@/lib/earningsService";


const itemsPerPage = 10;

export default function EarningsTable() {
  const router = useRouter();
  const [selected, setSelected] = useState("monthly");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Data states
  const [data, setData] = useState([]);
  const [walletSummary, setWalletSummary] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch earnings data
  useEffect(() => {
    fetchEarnings();
  }, [selected]);

  const fetchEarnings = async () => {
    setLoading(true);
    setError(null);
    
    const params = {
      period: selected,
      earning_type: 'order'
    };

    const result = await earningsService.getEarningsOverview(params);

    if (result.success) {
      setData(result.data);
      setWalletSummary(result.wallet_summary || {});
      setCurrentPage(1);
    } else {
      setError(result.error);
      setData([]);
    }
    
    setLoading(false);
  };

  // Ensure `data` is an array before performing array operations
  const items = Array.isArray(data) ? data : [];

  const filteredData = items.filter((item) =>
    (item.user?.toLowerCase().includes(search.toLowerCase())) ||
    (item.serial?.toLowerCase().includes(search.toLowerCase())) ||
    (item.subscription?.toLowerCase().includes(search.toLowerCase())) ||
    (item.full_name?.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleViewDetails = (transaction) => {
    const transactionId = transaction.id || transaction.transaction_id || transaction.serial;
    router.push(`/dashboard/earnings/${transactionId}`);
  };

  const getTotalEarnings = () => {
    if (walletSummary && walletSummary.total_earnings) {
      return parseFloat(walletSummary.total_earnings).toFixed(2);
    }

    // Use safe items array for reduce
    return items.reduce((sum, item) => sum + (parseFloat(item.final_amount || item.amount) || 0), 0).toFixed(2);
  };

  return (
    <>
      <div className="bg-[#343434] text-white p-6 rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold">Earnings Overview</h2>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 bg-[#F3FAFA1A] rounded-tl-[7.04px] rounded-bl-[7.04px] border-[1px] border-[#0000001A] text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
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
        </div>

        {/* Revenue and Period Dropdown */}
        <div className="relative text-white flex flex-col justify-center items-center mb-6">
          <div className="mb-2 text-sm">
            {selected.charAt(0).toUpperCase() + selected.slice(1)} Revenue{" "}
            <span className="font-bold">
              ${getTotalEarnings()}
            </span>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-[8.31px] w-[100px] mb-5 h-[27px] pl-[6.65px] rounded-[18.28px] bg-white/10"
          >
            <span className="text-xs capitalize">{selected}</span>
            <ChevronDown
              size={16}
              className={`transform transition-transform duration-300 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`absolute top-full mt-1 w-[120px] rounded bg-white/20 backdrop-blur text-xs shadow-md z-10 transform transition-all duration-300 origin-top ${
              open
                ? "scale-y-100 opacity-100"
                : "scale-y-0 opacity-0 pointer-events-none"
            }`}
          >
            {['daily', 'monthly', 'yearly'].map((option) => (
              <div
                key={option}
                className="px-3 py-2 cursor-pointer hover:bg-white/30 capitalize"
                onClick={() => {
                  setSelected(option);
                  setOpen(false);
                }}
              >
                {option}
              </div>
            ))}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={fetchEarnings}
              className="mt-2 text-xs px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg text-center">
            <p className="text-blue-400 text-sm">Loading earnings data...</p>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#17787C] text-white text-center">
                <th className="py-3 px-4 text-left">Serial</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Subscription</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-700 hover:bg-gray-800 transition text-center"
                  >
                    <td className="py-3 px-4 text-left text-gray-300 text-xs">
                      {item.serial || item.id}
                    </td>
                    <td className="py-3 px-4 flex items-center gap-2 justify-center">
                      {item.user_image || item.image ? (
                        <Image
                          src={item.user_image || item.image}
                          alt="User"
                          width={24}
                          height={24}
                          className="rounded-full"
                          onError={(e) => {
                            e.target.src = '/default-user.png';
                          }}
                        />
                      ) : (
                        <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-xs text-gray-300">
                          U
                        </div>
                      )}
                      <span className="text-sm">{item.user || item.full_name || 'N/A'}</span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {item.subscription || item.service || 'Order'}
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      ${parseFloat(item.final_amount || item.amount || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      {new Date(item.date || item.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        (item.status || 'completed').toLowerCase() === 'completed' || 
                        (item.status || 'completed').toLowerCase() === 'paid'
                          ? 'bg-green-500/20 text-green-400'
                          : (item.status || 'completed').toLowerCase() === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {item.status || 'Completed'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleViewDetails(item)}
                        className="inline-flex items-center justify-center p-2 hover:bg-gray-700 rounded transition"
                        title="View Details"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 px-4 text-center text-gray-400">
                    {loading ? 'Loading...' : 'No earnings data found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center mt-6 gap-2 text-sm text-white">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center border rounded-full justify-center p-[10px] hover:bg-[#1f1f1f] disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="8"
              height="14"
              viewBox="0 0 8 14"
              fill="none"
            >
              <path
                d="M6.99995 13C6.99995 13 1.00001 8.58107 0.999999 6.99995C0.999986 5.41884 7 1 7 1"
                stroke="#E2E2E2"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNumber = index + 1;
            if (
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
            ) {
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`w-8 h-8 flex items-center justify-center rounded transition ${
                    currentPage === pageNumber
                      ? "bg-[#21F6FF] text-black font-bold"
                      : "hover:bg-[#1f1f1f]"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            } else if (
              (pageNumber === currentPage - 3 && currentPage > 4) ||
              (pageNumber === currentPage + 3 && currentPage < totalPages - 3)
            ) {
              return (
                <span key={pageNumber} className="px-1">
                  ...
                </span>
              );
            }
            return null;
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center border rounded-full justify-center hover:bg-[#1f1f1f] disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="8"
              height="14"
              viewBox="0 0 8 14"
              fill="none"
            >
              <path
                d="M1.00005 1C1.00005 1 6.99999 5.41893 7 7.00005C7.00001 8.58116 1 13 1 13"
                stroke="#C8C8C8"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}