import React from "react";
import Link from "next/link";
import { FiAlertCircle, FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#faf8f5] px-4">
      <div className="w-24 h-24 bg-[#fcede8] rounded-full flex items-center justify-center mb-6">
        <FiAlertCircle className="text-[#b07c5b] w-12 h-12" />
      </div>
      <h1 className="text-5xl font-serif font-bold text-[#3d3029] mb-4">404</h1>
      <h2 className="text-2xl font-serif font-bold text-[#3d3029] mb-2">Page Not Found</h2>
      <p className="text-[#7a6e64] text-center max-w-md mb-8">
        The artwork or page you are looking for has either been moved, deleted, or never existed in the first place.
      </p>
      
      <Link 
        href="/"
        className="flex items-center gap-2 px-8 py-3 bg-[#b07c5b] text-white rounded-lg font-medium hover:bg-[#9e6c4d] transition-colors shadow-md"
      >
        <FiArrowLeft /> Return to Gallery
      </Link>
    </div>
  );
}
