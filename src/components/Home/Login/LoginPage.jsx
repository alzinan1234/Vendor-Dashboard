"use client"; // This directive is required for client-side functionality in App Router components

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react"; // Importing icons from lucide-react
import { authService, tokenManager } from "@/lib/authService";
 // Import our auth service

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true); // Indicate loading state

    // --- Client-side validation ---
    if (!email || !password) {
      const errorMessage = "Please enter both email and password.";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      return;
    }

    // Basic email format validation (can be more robust)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const errorMessage = "Please enter a valid email address.";
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      return;
    }

    try {
      console.log("Attempting to log in with:", { email, password, rememberMe });

      // Call the API through our auth service
      const result = await authService.login({
        email: email,
        password: password
      });

      if (result.success) {
        // console.log("Login successful!", result.data);
        // console.log("Login successful zzzzz!", result?.data?.data?.access);
        toast.success("Login Successful!");
        
        // Store the token
        tokenManager.setToken(result?.data?.data?.access, rememberMe);
        
        // Determine redirect path based on user role/type
        let redirectPath = "/vendor"; // Default redirect
        
        // You can customize redirect logic based on API response
        if (result.user && result.user.role === 'admin') {
          redirectPath = "/admin";
        } else if (result.user && result.user.role === 'vendor') {
          redirectPath = "/vendor";
        }
        // Add more role-based redirections as needed

        // Redirect using window.location.href
        window.location.href = redirectPath;
      } else {
        // Handle API error
        const errorMessage = result.error || "Login failed. Please try again.";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Toaster component for displaying beautiful notifications */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className="backdrop-blur-custom p-[40px] rounded-2xl w-[554px] border border-[#FFFFFF4D]">
        <div className="flex justify-center py-[20px] mb-[20px]">
          {/* Reverting to a standard <img> tag with a placeholder image as next/image caused compilation issues */}
          <img
            src="dreckks-logo.png"
            alt="Dreckks Logo"
            width={190}
            height={40}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/190x40/000000/FFFFFF?text=Logo%20Fallback";
            }}
          />
        </div>
        <div className="w-[312px] mx-auto">
          <h2 className="text-white text-[24px] font-bold text-center mb-[18px]">
            Login to Account
          </h2>
          <p className="text-[#DBDBDB] font-[400px] text-center mb-8">
            Please enter your email and password to continue
          </p>
        </div>

        <div className="space-y-6">
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
              className="w-full p-3 text-white rounded-lg border border-[#DBDBDB] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
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
                className="w-full p-3 pr-10 text-white rounded-[6px] border border-[#DBDBDB] focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={handleTogglePassword}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {/* Conditional rendering of Eye or EyeOff icon from lucide-react */}
                {showPassword ? (
                  <Eye className="w-5 h-5 text-[#DBDBDB] cursor-pointer" />
                ) : (
                  <EyeOff className="w-5 h-5 text-[#B0B0B0] cursor-pointer" />
                )}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                className="h-4 w-4 text-teal-500 rounded border-[#DBDBDB] focus:ring-teal-500 bg-transparent"
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
            {/* Using a standard <a> tag for navigation */}
            <a
              href="/Forgot-Password"
              className="text-[#FF0000] text-[12px] hover:underline"
            >
              Forgot Password?
            </a>
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            onClick={handleSubmit}
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
        </div>
      </div>
    </div>
  );
}