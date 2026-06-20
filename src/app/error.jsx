"use client";

import React, { useEffect } from "react";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("ArtHub Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#faf8f5] px-4">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
        <FiAlertTriangle className="text-red-500 w-10 h-10" />
      </div>
      
      <h2 className="text-3xl font-serif font-bold text-[#3d3029] mb-3 text-center">
        Something went wrong!
      </h2>
      
      <p className="text-[#7a6e64] text-center max-w-md mb-8">
        We encountered an unexpected error while loading this page. Our team has been notified.
      </p>
      
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 px-6 py-3 bg-[#b07c5b] text-white rounded-lg font-medium hover:bg-[#9e6c4d] transition-colors shadow-sm"
        >
          <FiRefreshCw /> Try Again
        </button>
        
        <button
          onClick={() => window.location.href = '/'}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-[#d4c3b3] text-[#5a4d42] rounded-lg font-medium hover:bg-[#faf5ef] transition-colors shadow-sm"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
