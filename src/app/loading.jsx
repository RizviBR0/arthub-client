import React from "react";
import { FiLoader } from "react-icons/fi";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#faf8f5] px-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-[#e8ddd1] border-t-[#b07c5b] animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-[#faf8f5] shadow-sm flex items-center justify-center">
            <FiLoader className="text-[#b07c5b] animate-pulse" size={16} />
          </div>
        </div>
      </div>
      <h2 className="mt-6 text-xl font-serif font-bold text-[#3d3029]">Loading...</h2>
      <p className="text-[#7a6e64] mt-2">Preparing your ArtHub experience.</p>
    </div>
  );
}
