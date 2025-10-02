"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { forgotPasswordService } from "@/lib/forgotPasswordService";

export default function ForgotPasswordPage() {
  const [currentStep, setCurrentStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  // Step 1: Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    if (!email) {
      setError("Please enter your email address.");
      toast.error("Please enter your email address.");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      console.log("Requesting OTP for:", email);
      const result = await forgotPasswordService.sendOTP(email);

      if (result.success) {
        setSuccessMessage("OTP sent successfully! Please check your email.");
        toast.success("OTP sent successfully! Please check your email.");
        setCurrentStep(2); // Move to OTP verification step
      } else {
        setError(result.error || "Failed to send OTP. Please try again.");
        toast.error(result.error || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.error("OTP request error:", err);
      setError("An unexpected error occurred. Please try again.");
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!otp) {
      setError("Please enter the OTP.");
      toast.error("Please enter the OTP.");
      setLoading(false);
      return;
    }

    try {
      console.log(`Verifying OTP: ${otp} for email: ${email}`);
      const result = await forgotPasswordService.verifyOTP(email, otp);

      if (result.success) {
        toast.success("OTP verified successfully!");
        setCurrentStep(3); // Move to set new password step
      } else {
        setError(result.error || "Invalid OTP. Please try again.");
        toast.error(result.error || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setError("An error occurred during OTP verification.");
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Set New Password
  const handleSetNewPassword = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!newPassword || !confirmPassword) {
      setError("Please enter both new password and confirm password.");
      toast.error("Please enter both new password and confirm password.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      toast.error("New password and confirm password do not match.");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      toast.error("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      console.log("Setting new password for:", email);
      // Pass email, otp, newPassword, and confirmPassword to the API
      const result = await forgotPasswordService.setNewPassword(email, otp, newPassword, confirmPassword);

      if (result.success) {
        toast.success("Password updated successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setError(result.error || "Failed to update password. Please try again.");
        toast.error(result.error || "Failed to update password. Please try again.");
      }
    } catch (err) {
      console.error("Password update error:", err);
      setError("An unexpected error occurred. Please try again.");
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP function
  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const result = await forgotPasswordService.sendOTP(email);
      if (result.success) {
        toast.success("OTP resent successfully!");
      } else {
        toast.error("Failed to resend OTP. Please try again.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Email Input
  const renderEmailStep = () => (
    <div className="backdrop-blur-custom p-8 rounded-2xl w-[562px] border border-[#FFFFFF4D]">
      <div className="flex justify-center py-[20px] mb-[20px]">
        <Image 
          src="/dreckks-logo.png" 
          alt="Dreckks Logo" 
          width={190} 
          height={40}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/190x40/000000/FFFFFF?text=Logo";
          }}
        />
      </div>
      <h2 className="text-white text-3xl font-bold text-center mb-8">
        Forgot Password
      </h2>

      <div className="space-y-6">
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
            className="w-full p-3 text-white rounded-[6px] border border-[#DCDCDC] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
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
          onClick={handleSendOTP}
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
          className={`mx-auto text-[#00C1C9] font-semibold transition duration-300 ease-in-out
            ${loading ? "bg-gray-600 cursor-not-allowed" : "hover:opacity-90"}
          `}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </div>
    </div>
  );

  // Step 2: OTP Verification
  const renderOTPStep = () => (
    <div className="backdrop-blur-custom p-8 rounded-2xl w-[562px] border border-[#FFFFFF4D] text-white text-center">
      <div className="flex justify-center py-[20px] mb-[20px]">
        <Image 
          src="/dreckks-logo.png" 
          alt="Dreckks Logo" 
          width={190} 
          height={40}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/190x40/000000/FFFFFF?text=Logo";
          }}
        />
      </div>
      <h2 className="text-3xl font-bold mb-4">OTP Verification</h2>
      <p className="text-gray-300 mb-6">
        An OTP has been sent to <span className="font-semibold">{email}</span>.
        Please enter it below to proceed.
      </p>

      <div className="space-y-6">
        <div>
          <label htmlFor="otp" className="block text-gray-400 text-sm font-medium mb-2">
            Enter OTP
          </label>
          <input
            type="text"
            id="otp"
            className="w-full p-3 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-widest text-xl bg-transparent"
            placeholder="______"
            maxLength="6"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center">
            {error}
          </p>
        )}

        <button
          onClick={handleVerifyOTP}
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
            background: loading ? '#4B5563' : '#00C1C9',
          }}
          className={`mx-auto text-white font-semibold transition duration-300 ease-in-out
            ${loading ? 'cursor-not-allowed' : 'hover:opacity-90'}
          `}
          disabled={loading}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </div>

      <p className="mt-6 text-gray-400 text-sm">
        Didn&apos;t receive the OTP?{' '}
        <button
          onClick={handleResendOTP}
          className="text-blue-400 hover:underline"
          disabled={loading}
        >
          Resend OTP
        </button>
      </p>
    </div>
  );

  // Step 3: Set New Password
  const renderPasswordStep = () => (
    <div className="backdrop-blur-custom p-8 rounded-2xl w-[562px] border border-[#FFFFFF4D] text-white text-center">
      <div className="flex justify-center py-[20px] mb-[20px]">
        <Image 
          src="/dreckks-logo.png" 
          alt="Dreckks Logo" 
          width={190} 
          height={40}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/190x40/000000/FFFFFF?text=Logo";
          }}
        />
      </div>
      <h2 className="text-3xl font-bold mb-4">Set a New Password</h2>
      <p className="text-gray-300 text-sm mb-8">
        Create a new password. Ensure it differs from previous ones for security.
      </p>

      <div className="space-y-6">
        <div>
          <label htmlFor="newPassword" className="block text-white text-sm font-normal mb-2 text-left">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              id="newPassword"
              className="w-full p-3 text-white rounded-lg border border-[#DBDBDB] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 focus:outline-none"
              onClick={() => setShowNewPassword(!showNewPassword)}
              aria-label={showNewPassword ? "Hide password" : "Show password"}
            >
              {showNewPassword ? (
                <Eye className="h-5 w-5" />
              ) : (
                <EyeOff className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-white text-sm font-normal mb-2 text-left">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              className="w-full p-3 text-white rounded-lg border border-[#DBDBDB] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 focus:outline-none"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
                <Eye className="h-5 w-5" />
              ) : (
                <EyeOff className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <button
          onClick={handleSetNewPassword}
          style={{
            width: "180px",
            height: "40px",
            boxShadow: "1.5px 1.5px 0px 0px #71F50C",
            border: "1px solid #00C1C9",
            borderRadius: "4px",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className={`mx-auto text-[#00C1C9] font-semibold transition duration-300 ease-in-out
            ${loading ? "bg-gray-600 cursor-not-allowed opacity-70" : "hover:opacity-90"}
          `}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Toaster position="top-center" reverseOrder={false} />
      
      {currentStep === 1 && renderEmailStep()}
      {currentStep === 2 && renderOTPStep()}
      {currentStep === 3 && renderPasswordStep()}
    </div>
  );
}