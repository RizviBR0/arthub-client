"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FiUploadCloud, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

export default function ImageUpload({ value, onChange, disabled, shape = "rectangle" }) {
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

  const previewClasses = shape === "circle" 
    ? "relative w-full rounded-full overflow-hidden border border-[#d4c3b3] bg-[#ece5de] aspect-square group flex items-center justify-center"
    : "relative w-full rounded-xl overflow-hidden border border-[#d4c3b3] bg-[#ece5de] aspect-video group flex items-center justify-center";

  const placeholderClasses = shape === "circle"
    ? `relative w-full rounded-full border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-4 text-center cursor-pointer aspect-square`
    : `relative w-full rounded-xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-8 text-center cursor-pointer min-h-[200px]`;

  return (
    <div className="w-full">
      {previewUrl ? (
        <div className={previewClasses}>
          <Image 
            src={previewUrl} 
            alt="Uploaded preview" 
            fill 
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              type="button"
              onClick={clearImage}
              disabled={disabled}
              className="bg-white text-red-500 p-3 rounded-full font-medium flex items-center justify-center hover:bg-red-50 transition-colors shadow-lg"
              title="Remove Image"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>
      ) : (
        <div 
          className={`${placeholderClasses}
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
          
          <div className={`${shape === "circle" ? "w-10 h-10 mb-2" : "w-16 h-16 mb-4"} bg-white rounded-full shadow-sm flex shrink-0 items-center justify-center text-[#b07c5b]`}>
            <FiUploadCloud size={shape === "circle" ? 20 : 32} />
          </div>
          
          {shape === "circle" ? (
            <div className="flex flex-col items-center">
              <span className="font-bold text-[#3d3029] text-sm leading-tight text-center px-2">Upload Photo</span>
            </div>
          ) : (
            <>
              <h3 className="font-bold text-[#3d3029] text-lg mb-1">
                Click or drag image to upload
              </h3>
              <p className="text-[#7a6e64] text-sm max-w-xs">
                Supports JPG, PNG, GIF up to 5MB. High resolution recommended.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
