"use client"

import WithdrawRequestComponent from '@/components/Withdraws/WithdrawRequestComponent'
import WithdrawsComponent from '@/components/Withdraws/WithdrawsComponent'
import { useState } from 'react';
import React from 'react'

const Page = () => {
  const [showWithdrawRequest, setShowWithdrawRequest] = useState(false);
  return (
    <div className="min-h-screen bg-[#343434] text-gray-100 p-4 rounded-lg  font-inter">
      <div className="w-full  p-6 sm:p-8">
        {showWithdrawRequest ? (
          <WithdrawRequestComponent onBack={() => setShowWithdrawRequest(false)} />
        ) : (
          <WithdrawsComponent onWithdrawClick={() => setShowWithdrawRequest(true)} />
        )}
      </div>
    </div>
  )
}

export default Page