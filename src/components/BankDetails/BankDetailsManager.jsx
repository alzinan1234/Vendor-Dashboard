'use client';
import React, { useState } from 'react';
import BankDetailsComponent from './BankDetailsComponent';
import EditBankDetailsComponent from './EditBankDetailsComponent';


const BankDetailsManager = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentBankDetails, setCurrentBankDetails] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleEditClick = (bankDetails, hasBankDetails) => {
    setCurrentBankDetails(bankDetails);
    setIsCreating(!hasBankDetails);
    setIsEditing(true);
  };

  const handleBackClick = () => {
    setIsEditing(false);
    setCurrentBankDetails(null);
    setIsCreating(false);
  };

  const handleSuccess = (updatedData) => {
    // Update the current bank details with the new data
    setCurrentBankDetails({
      accountNumber: updatedData.account_number,
      routingNumber: updatedData.routing_number,
      bankName: updatedData.bank_name,
      bankholderName: updatedData.bankholder_name,
      bankAddress: updatedData.bank_address,
    });
    // Go back to view mode
    setIsEditing(false);
    setIsCreating(false);
  };

  return (
    <>
      {isEditing ? (
        <EditBankDetailsComponent
          initialData={currentBankDetails}
          isCreating={isCreating}
          onBackClick={handleBackClick}
          onSuccess={handleSuccess}
        />
      ) : (
        <BankDetailsComponent onEditClick={handleEditClick} />
      )}
    </>
  );
};

export default BankDetailsManager;