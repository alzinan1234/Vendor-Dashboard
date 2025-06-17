"use client"; // This directive is required for client-side functionality in App Router components

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import toast, { Toaster } from 'react-hot-toast'; // ONLY ADDITION: Import toast and Toaster
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter(); // Initialize router

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous inline errors
    setSuccessMessage(""); // Clear previous inline success messages
    setLoading(true);

    // --- Client-side validation ---
    if (!email) {
      setError("Please enter your email address.");
      toast.error("Please enter your email address."); // ONLY ADDITION: Toast for validation error
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      toast.error("Please enter a valid email address."); // ONLY ADDITION: Toast for validation error
      setLoading(false);
      return;
    }

    // --- Simulate API Call to Send OTP ---
    console.log("Requesting OTP for:", email);

    try {
      // In a real application, you would send this email to your backend:
      // const response = await fetch('/api/request-otp', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ email }),
      // });

      // const data = await response.json();

      // if (response.ok) {
      //   setSuccessMessage(data.message || 'OTP sent to your email.');
      //   toast.success(data.message || 'OTP sent successfully! Please check your email.'); // ONLY ADDITION: Success toast
      //   // Navigate to OTP verification page
      //   router.push(`/otp-verification?email=${encodeURIComponent(email)}`);
      // } else {
      //   setError(data.message || 'Failed to send OTP. Please try again.'); 
      //   toast.error(data.message || 'Failed to send OTP. Please try again.'); // ONLY ADDITION: Error toast
      // }

      // --- Simulation for demonstration ---
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay

      if (email === "test@example.com") {
        setSuccessMessage("OTP sent successfully! Redirecting...");
        toast.success("OTP sent successfully! Please check your email."); // ONLY ADDITION: Success toast
        router.push(`/Otp-Verification?email=${encodeURIComponent(email)}`);
      } else {
        setError("Email not found or failed to send OTP. (Simulated)");
        toast.error("Email not found or failed to send OTP."); // ONLY ADDITION: Error toast
      }
    } catch (err) {
      console.error("OTP request error:", err);
      setError("An unexpected error occurred. Please try again.");
      toast.error("An unexpected error occurred. Please try again."); // ONLY ADDITION: Catch-all error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* ONLY ADDITION: Toaster component */}
      <Toaster position="top-center" reverseOrder={false} /> 

      <div className="backdrop-blur-custom p-8 rounded-2xl w-[562px] border border-[#FFFFFF4D]">

         <div className="flex justify-center py-[20px] mb-[20px]">
                  <Image src="/dreckks-logo.png" alt="" width={190} height={40} />
                </div>
        <h2 className="text-white text-3xl font-bold text-center mb-8">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-white text-sm font-medium mb-2"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 text-white rounded-[6px] border border-[#DCDCDC]focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          {successMessage && (
            <p className="text-green-400 text-sm text-center">
              {successMessage}
            </p>
          )}

          <button
            style={{
              width: "112px",
              height: "40px",
              boxShadow: "1.5px 1.5px 0px 0px #71F50C",
              border: "1px solid #00C1C9",
              borderRadius: "4px",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            type="submit"
            className={`mx-auto text-[#00C1C9] font-semibold transition duration-300 ease-in-out
              ${loading ? "bg-gray-600 cursor-not-allowed" : ""}
            `}
            disabled={loading}
          >
            {loading ? "Sending OTP ..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}