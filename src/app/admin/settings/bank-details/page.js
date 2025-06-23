// app/admin/settings/bank-details/page.js (or wherever you render this in your Next.js app)
'use client';
import React, { useState } from 'react';
 // Adjust path if necessary
import { useRouter } from 'next/navigation'; // Import useRouter
import EditBankDetailsComponent from '@/components/BankDetails/EditBankDetailsComponent';
import BankDetailsComponent from '@/components/BankDetails/BankDetailsComponent';

const BankDetailsPage = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [currentBankDetails, setCurrentBankDetails] = useState({
    accountNumber: '1234567890',
    routingNumber: '021000021',
    bankName: 'Atlantic Federal Bank',
    bankholderName: 'John D. Harper',
    bankAddress: '101 Main Street, New York, NY 10001, USA',
  });

  // Handler for when "Edit Bank Details" button is clicked
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // Handler for when "Save & Change" button is clicked in EditBankDetailsComponent
  const handleSaveClick = (updatedData) => {
    // In a real application, you would send updatedData to your backend API here
    console.log("Saving updated bank details:", updatedData);
    setCurrentBankDetails(updatedData); // Update the state with new data
    setIsEditing(false); // Switch back to view mode
  };

  // Handler for when the back arrow is clicked in EditBankDetailsComponent
  const handleBackClick = () => {
    setIsEditing(false); // Switch back to view mode without saving changes
  };

  // Handler for the back arrow in BankDetailsComponent to go back to settings
 

  return (
    <>
      {isEditing ? (
        <EditBankDetailsComponent
          initialData={currentBankDetails} // Pass current data to edit form
          onSaveClick={handleSaveClick}
          onBackClick={handleBackClick} // Pass the back handler for the arrow
        />
      ) : (
        <BankDetailsComponent
          bankDetails={currentBankDetails} // Pass current data to display component
          onEditClick={handleEditClick}
           // Pass handler for back to settings
        />
      )}
    </>
  );
};

export default BankDetailsPage;