"use client"; // This directive is required for client-side functionality in App Router components

import Link from "next/link";
import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility
  const router = useRouter();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true); // Indicate loading state

    // --- Client-side validation ---
    if (!email || !password) {
      setError("Please enter both email and password.");
      toast.error("Please enter both email and password.");
      setLoading(false);
      return;
    }

    // Basic email format validation (can be more robust)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    // --- Simulate API Call (Replace with your actual backend call) ---
    console.log("Attempting to log in with:", { email, password, rememberMe });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay

      let success = false;
      let redirectPath = '/';
      let token = ''; // To store the token for setting in cookie

      // --- Simulated Admin Login ---
      if (email === "admin@example.com" && password === "admin123") {
        console.log("Admin Login successful!");
        toast.success("Admin Login Successful! (Simulated)");
        token = 'ADMIN_TOKEN_SECRET'; // Set admin token
        redirectPath = '/admin'; // Redirect admin to /admin
        success = true;
      }
      // --- Simulated Regular User Login ---
      else if (email === "user@example.com" && password === "password123") {
        console.log("User Login successful!");
        toast.success("User Login Successful! (Simulated)");
        token = 'USER_TOKEN_SECRET'; // Set regular user token
        redirectPath = '/admin'; // This was `/` previously. Changed to `/admin` as per your input.
        success = true;
      }
      // --- Simulated Failed Login ---
      else {
        setError("Invalid email or password. (Simulated)");
        toast.error("Invalid email or password. (Simulated)");
      }

      if (success) {
        document.cookie = `token=${token}; path=/; max-age=${rememberMe ? 60 * 60 * 24 * 30 : 60 * 30}; SameSite=Lax`;
        router.push(redirectPath);
      }

    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="backdrop-blur-custom p-[40px] rounded-2xl w-[554px] border border-[#FFFFFF4D]">

        <div className="flex justify-center py-[20px] mb-[20px]">
          <Image src="/dreckks-logo.png" alt="" width={190} height={40} />
        </div>
        <div className="w-[312px] mx-auto">
        
          <h2 className="text-white text-[24px] font-bold text-center mb-[18px]">
            Login to Account
          </h2>
          <p className="text-[#DBDBDB] font-[400px] text-center mb-8">
            Please enter your email and password to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-[#ffffff] text-sm font-normal mb-2"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 text-white rounded-lg border border-[#DBDBDB] focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-[#ffffff] text-sm font-normal mb-2"
            >
              Password
            </label>
            {/* Password input with show/hide toggle */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full p-3 pr-10 text-white rounded-[6px] border border-[#DBDBDB] focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={handleTogglePassword}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                
              >
                {/* Conditional rendering of open eye or closed eye SVG */}
                {/* {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-[#DBDBDB] cursor-pointer"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.173.18.54.18.54 0 1.08C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.173z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-[#B0B0B0] cursor-pointer" // Corrected color for closed eye to match fill in original path
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.981 18.067A10.03 10.03 0 0 0 12 21.75c4.638 0 8.573-3.007 9.963-7.173a1.012 1.012 0 0 0 0-.639C20.577 7.51 16.64 4.5 12 4.5c-1.126 0-2.204.168-3.207.477M4.5 12.75a7.5 7.5 0 0 1 10.94-7.864M12 11.25a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-9-9"
                    />
                  </svg>
                )} */}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                className="h-4 w-4 text-teal-500 rounded border-[#DBDBDB] focus:ring-teal-500"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-[#FFFFFF] text-sm"
              >
                Remember Password
              </label>
            </div>
            <Link
              href="/Forgot-Password"
              className="text-[#FF0000] text-[12px] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            style={{
              width: "112px",
              height: "40px",
              boxShadow: "1.5px 1.5px 0px 0px #71F50C",
              background: "#00C1C9",
              borderRadius: "4px",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className={`text-white flex items-center justify-center mx-auto font-semibold transition duration-300 ease-in-out
              ${loading ? "bg-gray-600 cursor-not-allowed" : ""}
            `}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}