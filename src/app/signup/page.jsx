"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiImage,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import signupImage from "@/assets/signup_right_image.png";
import ImageUpload from "@/components/ImageUpload";

export default function SignUpPage() {
  const [imageFile, setImageFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("user"); // default is user (Buyer)
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Creating account...");
    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries());

    if (user.password !== user.confirmPassword) {
      toast.error("Passwords do not match", { id: toastId });
      setLoading(false);
      return;
    }

    try {
      let finalImageUrl = undefined;

      if (imageFile instanceof File) {
        toast.loading("Uploading profile image...", { id: toastId });
        const uploadData = new FormData();
        uploadData.append("image", imageFile);

        const imgbbKey =
          process.env.NEXT_PUBLIC_IMGBB_API_KEY ||
          process.env.NEXT_PUBLIC_IMGBB_KEY;
        const imgRes = await fetch(
          `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
          {
            method: "POST",
            body: uploadData,
          },
        );

        const imgJson = await imgRes.json();
        if (!imgJson.success) {
          throw new Error("Failed to upload image to ImgBB");
        }
        finalImageUrl = imgJson.data.display_url;
      }

      toast.loading("Finalizing registration...", { id: toastId });

      const { error } = await authClient.signUp.email({
        email: user.email,
        password: user.password,
        name: user.name,
        image: finalImageUrl || undefined,
        role: role,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Registration failed", { id: toastId });
      } else {
        toast.success("Account created successfully!", { id: toastId });
        router.push("/");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.", {
        id: toastId,
      });
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
    <div className="min-h-[calc(100vh-64px)] flex flex-row-reverse">
      {/* Right Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#f5f0eb]">
        {/* Removed redundant ArtHub logo since it's now in the Navbar */}
        <div className="w-full h-full relative">
          <Image
            src={signupImage}
            alt="Art Gallery"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Left Side - Form */}
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
              Join Our Community
            </p>
            <h2
              className="text-4xl font-bold text-[#2d2420] mb-3"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Create Account
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
              Sign up to start collecting masterpieces or selling your own
              artwork.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Profile Image Upload */}
            <div className="flex flex-col items-start">
              <label className="block text-sm font-medium text-[#4a3f37] mb-2 text-left">
                Profile Image{" "}
                <span className="text-[#a89888] font-normal">(Optional)</span>
              </label>
              <div className="flex mx-auto justify-center mb-4">
                <div className="w-32 sm:w-36 aspect-square">
                  <ImageUpload
                    value={imageFile}
                    onChange={setImageFile}
                    disabled={loading}
                    shape="circle"
                  />
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-[#4a3f37] mb-1">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a89888]">
                  <FiUser size={18} />
                </span>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter your full name"
                  className="w-full pl-11 pr-4 py-2.5 border border-[#ddd3c9] rounded-lg bg-white text-[#3d3029] placeholder-[#b5a99d] focus:outline-none focus:ring-2 focus:ring-[#c9a88a] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#4a3f37] mb-1">
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
                  className="w-full pl-11 pr-4 py-2.5 border border-[#ddd3c9] rounded-lg bg-white text-[#3d3029] placeholder-[#b5a99d] focus:outline-none focus:ring-2 focus:ring-[#c9a88a] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#4a3f37] mb-1">
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
                  placeholder="Create a password"
                  className="w-full pl-11 pr-12 py-2.5 border border-[#ddd3c9] rounded-lg bg-white text-[#3d3029] placeholder-[#b5a99d] focus:outline-none focus:ring-2 focus:ring-[#c9a88a] focus:border-transparent transition-all"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-[#4a3f37] mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a89888]">
                  <FiLock size={18} />
                </span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  placeholder="Confirm your password"
                  className="w-full pl-11 pr-12 py-2.5 border border-[#ddd3c9] rounded-lg bg-white text-[#3d3029] placeholder-[#b5a99d] focus:outline-none focus:ring-2 focus:ring-[#c9a88a] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#a89888] hover:text-[#7a6e64] transition-colors"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff size={18} />
                  ) : (
                    <FiEye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-[#4a3f37] mb-2">
                Join as
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole("user")}
                  className={`py-3 px-4 rounded-lg border text-center font-medium transition-all cursor-pointer ${
                    role === "user"
                      ? "border-[#b07c5b] bg-[#fdfaf7] text-[#b07c5b] shadow-sm"
                      : "border-[#ddd3c9] bg-white text-[#7a6e64] hover:bg-[#faf8f5]"
                  }`}
                >
                  <p className="text-sm font-bold">Buyer</p>
                  <p className="text-xs text-[#a89888] mt-0.5 font-normal">
                    Discover & purchase art
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("artist")}
                  className={`py-3 px-4 rounded-lg border text-center font-medium transition-all cursor-pointer ${
                    role === "artist"
                      ? "border-[#b07c5b] bg-[#fdfaf7] text-[#b07c5b] shadow-sm"
                      : "border-[#ddd3c9] bg-white text-[#7a6e64] hover:bg-[#faf8f5]"
                  }`}
                >
                  <p className="text-sm font-bold">Artist</p>
                  <p className="text-xs text-[#a89888] mt-0.5 font-normal">
                    Showcase & sell art
                  </p>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 rounded-lg text-white font-semibold text-base bg-linear-to-r from-[#c9a88a] to-[#b07c5b] hover:from-[#b8977a] hover:to-[#9e6c4d] transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
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
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
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
            Sign up with Google
          </button>

          {/* Sign In Link */}
          <p className="text-center mt-6 text-sm text-[#7a6e64]">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-[#b07c5b] font-semibold hover:text-[#8f5f3d] transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
