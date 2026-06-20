"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import loginImage from "@/assets/login_left_image.png";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries());

    try {
      const { error } = await authClient.signIn.email({
        email: user.email,
        password: user.password,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Invalid credentials");
      } else {
        toast.success("Logged in successfully!");
        router.push("/");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      toast.error("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#f5f0eb]">
        <div className="absolute top-8 left-8 z-10">
          <Link href="/">
            <h1
              className="text-3xl font-bold text-[#3d3029]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              ArtHub
            </h1>
            <p className="text-xs tracking-[0.3em] text-[#b07c5b] uppercase mt-1">
              Discover & Buy Original Art
            </p>
          </Link>
        </div>
        <div className="w-full h-full relative">
          <Image
            src={loginImage}
            alt="Art Gallery"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-[#faf8f5]">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/">
              <h1
                className="text-3xl font-bold text-[#3d3029]"
                style={{ fontFamily: "Georgia, serif" }}
              >
                ArtHub
              </h1>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <p
              className="text-[#b07c5b] text-sm mb-2"
              style={{ fontFamily: "Georgia, serif", fontStyle: "italic" }}
            >
              Welcome Back
            </p>
            <h2
              className="text-4xl font-bold text-[#2d2420] mb-3"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Log in to ArtHub
            </h2>
            <div className="flex items-center justify-center gap-1 mb-4">
              <span className="w-6 h-[1px] bg-[#c9a88a]"></span>
              <svg
                width="16"
                height="10"
                viewBox="0 0 16 10"
                className="text-[#c9a88a]"
              >
                <path
                  d="M2 5 C4 2, 6 2, 8 5 C10 8, 12 8, 14 5"
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="1.5"
                />
              </svg>
              <span className="w-6 h-[1px] bg-[#c9a88a]"></span>
            </div>
            <p className="text-[#7a6e64] text-sm">
              Access your account to discover, collect,
              <br />
              and manage original artworks.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#4a3f37] mb-1.5">
                Email
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a89888]">
                  <FiMail size={18} />
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Enter your email"
                  className="w-full pl-11 pr-4 py-3 border border-[#ddd3c9] rounded-lg bg-white text-[#3d3029] placeholder-[#b5a99d] focus:outline-none focus:ring-2 focus:ring-[#c9a88a] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#4a3f37] mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a89888]">
                  <FiLock size={18} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-3 border border-[#ddd3c9] rounded-lg bg-white text-[#3d3029] placeholder-[#b5a99d] focus:outline-none focus:ring-2 focus:ring-[#c9a88a] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a89888] hover:text-[#7a6e64] transition-colors"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-white font-semibold text-base bg-gradient-to-r from-[#c9a88a] to-[#b07c5b] hover:from-[#b8977a] hover:to-[#9e6c4d] transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-[1px] bg-[#ddd3c9]"></div>
            <span className="text-sm text-[#a89888]">or</span>
            <div className="flex-1 h-[1px] bg-[#ddd3c9]"></div>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full py-3 rounded-lg border border-[#ddd3c9] bg-white text-[#4a3f37] font-medium flex items-center justify-center gap-3 hover:bg-[#f5f0eb] hover:border-[#c9a88a] transition-all duration-300 cursor-pointer"
          >
            <FcGoogle size={22} />
            Continue with Google
          </button>

          {/* Sign Up Link */}
          <p className="text-center mt-8 text-sm text-[#7a6e64]">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-[#b07c5b] font-semibold hover:text-[#8f5f3d] transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
