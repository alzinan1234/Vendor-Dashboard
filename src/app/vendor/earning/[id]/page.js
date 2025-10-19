// app/dashboard/earnings/[id]/page.js
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

import { ChevronLeft, Download, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { earningsService } from '@/lib/earningsService';

export default function TransactionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const transactionId = params.id;

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState(null);

  useEffect(() => {
    fetchTransactionDetail();
  }, [transactionId]);

  const fetchTransactionDetail = async () => {
    setLoading(true);
    setError(null);
    
    const result = await earningsService.getTransactionDetail(transactionId);
    
    if (result.success) {
      setTransaction(result.data);
    } else {
      setError(result.error || 'Failed to fetch transaction details');
    }
    
    setLoading(false);
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(field);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const handleDownload = () => {
    // Create a document for download
    const doc = `
Transaction Details Report
============================
Generated: ${new Date().toLocaleString()}

TRANSACTION INFORMATION
${transaction?.transaction_id ? `Transaction ID: ${transaction.transaction_id}` : ''}
${transaction?.serial || transaction?.id ? `Serial: ${transaction.serial || transaction.id}` : ''}
Date: ${transaction?.date || transaction?.created_at || 'N/A'}
Status: ${transaction?.status || 'Completed'}

CUSTOMER INFORMATION
Full Name: ${transaction?.full_name || transaction?.customer_name || 'N/A'}
Email: ${transaction?.email || 'N/A'}
Phone: ${transaction?.phone || 'N/A'}

PAYMENT DETAILS
Amount Received: $${transaction?.received_amount || transaction?.amount || '0.00'}
Deduction Percentage: ${transaction?.detect_percentage || '0'}%
Final Amount: $${transaction?.final_amount || transaction?.amount || '0.00'}
Account Number: ${transaction?.account_number || 'N/A'}
Account Holder: ${transaction?.account_holder_name || 'N/A'}

SERVICE DETAILS
Service: ${transaction?.subscription || transaction?.service || 'N/A'}
User: ${transaction?.user || transaction?.customer || 'N/A'}
${transaction?.user_type ? `Type: ${transaction.user_type}` : ''}
    `;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(doc));
    element.setAttribute('download', `transaction-${transactionId}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#21F6FF] mx-auto mb-4"></div>
          <p>Loading transaction details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#21F6FF] hover:text-white mb-6 transition"
          >
            <ChevronLeft size={20} />
            Back
          </button>
          
          <div className="bg-[#343434] rounded-lg p-6 border border-red-500/20 flex items-start gap-4">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-1" size={24} />
            <div>
              <h2 className="text-white font-semibold mb-2">Error Loading Transaction</h2>
              <p className="text-gray-300">{error}</p>
              <button
                onClick={fetchTransactionDetail}
                className="mt-4 px-4 py-2 bg-[#21F6FF] text-black rounded hover:bg-cyan-300 transition font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#21F6FF] hover:text-white mb-6 transition"
          >
            <ChevronLeft size={20} />
            Back
          </button>
          <div className="bg-[#343434] rounded-lg p-8 text-center">
            <p className="text-gray-300">No transaction data found</p>
          </div>
        </div>
      </div>
    );
  }

  const statusColor = {
    completed: 'bg-green-500/20 border-green-500/50',
    pending: 'bg-yellow-500/20 border-yellow-500/50',
    cancelled: 'bg-red-500/20 border-red-500/50',
    paid: 'bg-green-500/20 border-green-500/50',
  };

  const statusBgClass = statusColor[transaction?.status?.toLowerCase()] || statusColor.completed;

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[#21F6FF] hover:text-white transition"
            >
              <ChevronLeft size={24} />
              <span>Back</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Transaction Details</h1>
              <p className="text-gray-400 mt-1">ID: {transaction?.transaction_id || transaction?.id || transactionId}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-[#21F6FF] text-black rounded-lg hover:bg-cyan-300 transition font-medium"
            >
              <Download size={18} />
              Download
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Transaction Overview */}
          <div className="lg:col-span-2">
            {/* Status Card */}
            <div className={`rounded-lg p-6 border mb-6 ${statusBgClass}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm mb-2">Transaction Status</p>
                  <p className="text-2xl font-bold text-white capitalize">
                    {transaction?.status || 'Completed'}
                  </p>
                </div>
                <CheckCircle size={48} className="text-green-500" />
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-[#343434] rounded-lg p-6 mb-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">Customer Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  {transaction?.user_image || transaction?.image ? (
                    <Image
                      src={transaction.user_image || transaction.image}
                      alt="Customer"
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-600 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-2xl">?</span>
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <p className="text-white font-semibold text-lg">
                      {transaction?.full_name || transaction?.customer_name || 'N/A'}
                    </p>
                    <p className="text-gray-400">{transaction?.user || transaction?.customer || 'N/A'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-4 border-t border-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Email:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{transaction?.email || 'N/A'}</span>
                      {transaction?.email && (
                        <button
                          onClick={() => handleCopy(transaction.email, 'email')}
                          className="text-[#21F6FF] hover:text-white transition"
                        >
                          {copyFeedback === 'email' ? <CheckCircle size={16} /> : <Copy size={16} />}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Phone:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{transaction?.phone || 'N/A'}</span>
                      {transaction?.phone && (
                        <button
                          onClick={() => handleCopy(transaction.phone, 'phone')}
                          className="text-[#21F6FF] hover:text-white transition"
                        >
                          {copyFeedback === 'phone' ? <CheckCircle size={16} /> : <Copy size={16} />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-[#343434] rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">Payment Details</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#2a2a2a] rounded p-4">
                    <p className="text-gray-400 text-sm mb-2">Amount Received</p>
                    <p className="text-2xl font-bold text-white">
                      ${(transaction?.received_amount || transaction?.amount || 0).toFixed(2)}
                    </p>
                  </div>

                  <div className="bg-[#2a2a2a] rounded p-4">
                    <p className="text-gray-400 text-sm mb-2">Deduction</p>
                    <p className="text-lg font-semibold text-red-400">
                      {transaction?.detect_percentage || 0}%
                    </p>
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded p-4">
                  <p className="text-gray-400 text-sm mb-2">Final Amount (After Deduction)</p>
                  <p className="text-3xl font-bold text-green-400">
                    ${(transaction?.final_amount || 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Additional Details */}
          <div className="space-y-6">
            {/* Transaction Info */}
            <div className="bg-[#343434] rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4">Transaction Info</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Serial Number</p>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-mono text-sm">
                      {transaction?.serial || transaction?.id || 'N/A'}
                    </p>
                    {transaction?.serial && (
                      <button
                        onClick={() => handleCopy(transaction.serial || transaction.id, 'serial')}
                        className="text-[#21F6FF] hover:text-white transition"
                      >
                        {copyFeedback === 'serial' ? <CheckCircle size={14} /> : <Copy size={14} />}
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 text-xs mb-1">Date & Time</p>
                  <p className="text-white font-mono text-sm">
                    {new Date(transaction?.date || transaction?.created_at).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-xs mb-1">Service Type</p>
                  <p className="text-white font-semibold">
                    {transaction?.subscription || transaction?.service || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="bg-[#343434] rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4">Bank Account</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Account Holder</p>
                  <p className="text-white font-semibold text-sm">
                    {transaction?.account_holder_name || 'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-xs mb-1">Account Number</p>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-mono text-sm">
                      {transaction?.account_number || transaction?.acc_number || 'N/A'}
                    </p>
                    {transaction?.account_number && (
                      <button
                        onClick={() => handleCopy(transaction.account_number || transaction.acc_number, 'account')}
                        className="text-[#21F6FF] hover:text-white transition"
                      >
                        {copyFeedback === 'account' ? <CheckCircle size={14} /> : <Copy size={14} />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-br from-[#21F6FF]/10 to-cyan-500/10 border border-cyan-500/30 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-4">Quick Summary</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Received:</span>
                  <span className="text-white font-semibold">
                    ${(transaction?.received_amount || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-red-400">
                  <span>Deduction:</span>
                  <span>-${((transaction?.received_amount || 0) * ((transaction?.detect_percentage || 0) / 100)).toFixed(2)}</span>
                </div>
                <div className="border-t border-cyan-500/30 pt-2 mt-2 flex justify-between">
                  <span className="text-gray-200 font-semibold">Net Amount:</span>
                  <span className="text-green-400 font-bold">
                    ${(transaction?.final_amount || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}