"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FiUploadCloud, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

export default function ImageUpload({ value, onChange, disabled }) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!value) {
      setPreviewUrl("");
      return;
    }
    // If value is a File, create a local preview URL
    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    // If value is a string, it's an existing URL from the DB
    if (typeof value === "string") {
      setPreviewUrl(value);
    }
  }, [value]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (disabled) return;

    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPEG, PNG, etc.)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    onChange(file);
  };

  const clearImage = () => {
    if (disabled) return;
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      {previewUrl ? (
        <div className="relative w-full rounded-xl overflow-hidden border border-[#d4c3b3] bg-[#ece5de] aspect-video group flex items-center justify-center">
          <Image 
            src={previewUrl} 
            alt="Artwork preview" 
            fill 
            className="object-contain"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              type="button"
              onClick={clearImage}
              disabled={disabled}
              className="bg-white text-red-500 px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-red-50 transition-colors shadow-lg"
            >
              <FiX /> Remove Image
            </button>
          </div>
        </div>
      ) : (
        <div 
          className={`relative w-full rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-8 text-center cursor-pointer min-h-[200px]
            ${dragActive ? "border-[#b07c5b] bg-[#faf5ef]" : "border-[#d4c3b3] bg-[#faf8f5] hover:border-[#b07c5b] hover:bg-white"}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleChange}
            accept="image/*"
            className="hidden"
            disabled={disabled}
          />
          
          <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-[#b07c5b]">
            <FiUploadCloud size={32} />
          </div>
          
          <h3 className="font-bold text-[#3d3029] text-lg mb-1">
            Click or drag image to upload
          </h3>
          <p className="text-[#7a6e64] text-sm max-w-xs">
            Supports JPG, PNG, GIF up to 5MB. High resolution recommended.
          </p>
        </div>
      )}
    </div>
  );
}
