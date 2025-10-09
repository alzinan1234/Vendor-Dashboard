"use client";

import React, { useState, useEffect } from 'react';
import { withdrawalService, earningsService } from '@/lib/withdrawalService';
import toast from 'react-hot-toast';

const WithdrawsComponent = ({ onWithdrawClick }) => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    setLoading(true);
    const result = await withdrawalService.getWithdrawalRequests();
    
    if (result.success) {
      setWithdrawals(result.data.withdrawals || []);
      setStatistics(result.data.statistics || null);
    } else {
      toast.error(result.error || 'Failed to load withdrawals');
      setWithdrawals([]);
    }
    
    setLoading(false);
  };

  // Calculate pagination
  const totalPages = Math.ceil(withdrawals.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentWithdrawals = withdrawals.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusStyle = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'confirmed':
      case 'completed':
        return 'text-[#71F50C]';
      case 'pending':
        return 'text-[#FB6000]';
      case 'failed':
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-gray-400';
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtonsToShow = 5;

    if (totalPages <= maxButtonsToShow) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <span
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-1 rounded-md cursor-pointer transition-colors ${
              currentPage === i ? 'bg-[#21F6FF] text-white' : 'text-gray-400 hover:bg-gray-700'
            }`}
          >
            {i}
          </span>
        );
      }
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2));
      let endPage = Math.min(totalPages, startPage + maxButtonsToShow - 1);

      if (endPage - startPage + 1 < maxButtonsToShow) {
        startPage = Math.max(1, endPage - maxButtonsToShow + 1);
      }

      if (startPage > 1) {
        buttons.push(
          <span 
            key="1" 
            onClick={() => handlePageChange(1)} 
            className="text-gray-400 px-3 py-1 rounded-md hover:bg-gray-700 cursor-pointer transition-colors"
          >
            1
          </span>
        );
        if (startPage > 2) {
          buttons.push(<span key="dots-start" className="text-gray-400">...</span>);
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        buttons.push(
          <span
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-1 rounded-md cursor-pointer transition-colors ${
              currentPage === i ? 'bg-[#21F6FF] text-white' : 'text-gray-400 hover:bg-gray-700'
            }`}
          >
            {i}
          </span>
        );
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          buttons.push(<span key="dots-end" className="text-gray-400">...</span>);
        }
        buttons.push(
          <span 
            key={totalPages} 
            onClick={() => handlePageChange(totalPages)} 
            className="text-gray-400 px-3 py-1 rounded-md hover:bg-gray-700 cursor-pointer transition-colors"
          >
            {totalPages}
          </span>
        );
      }
    }
    return buttons;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00C1C9] mx-auto mb-4"></div>
          <p className="text-gray-300">Loading withdrawals...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-100">Withdrawals</h2>

        {/* Balance Card */}
        <div className="relative rounded-2xl p-8 mb-8 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
            <img
              src="/image/withdraw-bgImage.png"
              alt="Background pattern"
              className="rounded-2xl opacity-60 w-full h-full object-cover object-center"
              style={{ position: 'absolute', inset: 0 }}
            />
          </div>
          {/* Balance Info */}
          <div className="relative z-10">
            <p className="text-white text-sm font-normal mb-2">Your Balance</p>
            <h2 className="text-[40px] font-bold text-white mb-6">
              ${statistics?.total_amount_withdrawn?.toFixed(2) || '0.00'}
            </h2>
            <button
              onClick={onWithdrawClick}
              className="flex flex-col justify-center items-center gap-[8.425px] flex-shrink-0 w-[226px] h-[33px] border border-white rounded-[52px] text-white font-medium hover:bg-white hover:text-teal-600 transition-colors"
              style={{ background: 'linear-gradient(180deg, #2A3D45 0%, #1F2C33 100%)' }}
            >
              Withdraw
            </button>
          </div>
        </div>

        {/* Statistics Summary */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#2A2A2A] rounded-lg p-4">
              <p className="text-gray-400 text-sm">Total Pending</p>
              <p className="text-white text-2xl font-bold">{statistics.total_pending || 0}</p>
            </div>
            <div className="bg-[#2A2A2A] rounded-lg p-4">
              <p className="text-gray-400 text-sm">Total Completed</p>
              <p className="text-white text-2xl font-bold">{statistics.total_completed || 0}</p>
            </div>
            <div className="bg-[#2A2A2A] rounded-lg p-4">
              <p className="text-gray-400 text-sm">Total Amount</p>
              <p className="text-white text-2xl font-bold">
                ${statistics.total_amount_withdrawn?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        )}

        {/* Withdrawal History Table */}
        {withdrawals.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No withdrawal history found.</p>
            <p className="text-sm mt-2">Create your first withdrawal request to get started.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg">
              <table className="min-w-full rounded-lg">
                <thead>
                  <tr className="bg-[#00C1C980] text-white text-left">
                    <th className="px-4 py-3 rounded-tl-lg text-center">Date</th>
                    <th className="px-4 py-3 text-center">Time</th>
                    <th className="px-4 py-3 text-center">Amount</th>
                    <th className="px-4 py-3 rounded-tr-lg text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentWithdrawals.map((withdrawal, index) => (
                    <tr key={withdrawal.id || index} className="border-b border-gray-600 last:border-b-0">
                      <td className="px-4 py-3 text-gray-300 text-center">
                        {formatDate(withdrawal.created_at || withdrawal.date)}
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-center">
                        {formatTime(withdrawal.created_at || withdrawal.time)}
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-center">
                        ${parseFloat(withdrawal.amount || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyle(withdrawal.status)}`}
                        >
                          {withdrawal.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-end items-center mt-6 space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1 rounded-full text-gray-400 border hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>
                {renderPaginationButtons()}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded-full border text-gray-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WithdrawsComponent;