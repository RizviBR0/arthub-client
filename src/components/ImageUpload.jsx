"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { FiUploadCloud, FiX, FiImage } from "react-icons/fi";
import toast from "react-hot-toast";

export default function ImageUpload({ value, onChange, disabled }) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled || uploading) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadImage(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    if (disabled || uploading) return;

    if (e.target.files && e.target.files[0]) {
      await uploadImage(e.target.files[0]);
    }
  };

  const uploadImage = async (file) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPEG, PNG, etc.)");
      return;
    }

    // Limit to 5MB (imgBB limit is 32MB, but 5MB is safer for fast uploads)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploading(true);
    const toastId = toast.loading("Uploading image to ImgBB...");

    try {
      const formData = new FormData();
      formData.append("image", file);

      // Using the ImgBB API key from env
      const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      
      if (!imgbbKey) {
         toast.dismiss(toastId);
         toast.error("ImgBB API key is missing in .env");
         setUploading(false);
         return;
      }

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Image uploaded successfully!", { id: toastId });
        onChange(data.data.display_url);
      } else {
        throw new Error(data.error?.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("ImgBB Upload Error:", error);
      toast.error(error.message || "Failed to upload image. Please try again.", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const clearImage = () => {
    if (disabled || uploading) return;
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      {value ? (
        <div className="relative w-full rounded-xl overflow-hidden border border-[#d4c3b3] bg-[#ece5de] aspect-video group flex items-center justify-center">
          <Image 
            src={value} 
            alt="Uploaded artwork" 
            fill 
            className="object-contain"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              type="button"
              onClick={clearImage}
              disabled={disabled || uploading}
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
            ${disabled || uploading ? "opacity-50 cursor-not-allowed" : ""}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleChange}
            accept="image/*"
            className="hidden"
            disabled={disabled || uploading}
          />
          
          <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-[#b07c5b]">
            {uploading ? (
              <div className="w-8 h-8 border-4 border-[#e8ddd1] border-t-[#b07c5b] rounded-full animate-spin"></div>
            ) : (
              <FiUploadCloud size={32} />
            )}
          </div>
          
          <h3 className="font-bold text-[#3d3029] text-lg mb-1">
            {uploading ? "Uploading to ImgBB..." : "Click or drag image to upload"}
          </h3>
          <p className="text-[#7a6e64] text-sm max-w-xs">
            {uploading ? "Please wait, generating URL..." : "Supports JPG, PNG, GIF up to 5MB. High resolution recommended."}
          </p>
        </div>
      )}
    </div>
  );
}
