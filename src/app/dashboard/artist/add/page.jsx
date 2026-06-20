"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiSave, FiImage } from "react-icons/fi";
import Link from "next/link";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function AddArtworkPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "painting",
    price: "",
    description: "",
    image: "" // Standard URL input for now (Step 10 will replace with imgBB upload)
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session || session.user.role !== "artist") {
      toast.error("Unauthorized");
      return;
    }

    if (!formData.title || !formData.price || !formData.image) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/api/artworks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Failed to create artwork");

      toast.success("Artwork added to portfolio!");
      router.push("/dashboard/artist");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while adding artwork");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <Link 
        href="/dashboard/artist" 
        className="flex items-center gap-2 text-[#7a6e64] hover:text-[#b07c5b] transition-colors mb-8 font-medium w-fit"
      >
        <FiArrowLeft /> Back to Dashboard
      </Link>

      <div className="bg-white rounded-xl border border-[#e8ddd1] shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-[#e8ddd1] bg-[#faf8f5]">
          <h1 className="text-2xl font-bold text-[#3d3029] font-serif">Add New Artwork</h1>
          <p className="text-[#7a6e64] text-sm mt-1">Fill in the details to list your masterpiece.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-[#3d3029] font-medium mb-2">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Starry Night"
                className="w-full px-4 py-3 border border-[#d4c3b3] rounded-lg focus:outline-none focus:border-[#b07c5b] focus:ring-1 focus:ring-[#b07c5b] transition-colors"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-[#3d3029] font-medium mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#d4c3b3] rounded-lg focus:outline-none focus:border-[#b07c5b] focus:ring-1 focus:ring-[#b07c5b] transition-colors bg-white"
              >
                <option value="painting">Painting</option>
                <option value="digital">Digital Art</option>
                <option value="sculpture">Sculpture</option>
                <option value="photography">Photography</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-[#3d3029] font-medium mb-2">Price ($) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g., 500"
                min="1"
                className="w-full px-4 py-3 border border-[#d4c3b3] rounded-lg focus:outline-none focus:border-[#b07c5b] focus:ring-1 focus:ring-[#b07c5b] transition-colors"
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-[#3d3029] font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell the story behind your artwork..."
                rows="4"
                className="w-full px-4 py-3 border border-[#d4c3b3] rounded-lg focus:outline-none focus:border-[#b07c5b] focus:ring-1 focus:ring-[#b07c5b] transition-colors resize-none"
              ></textarea>
            </div>

            {/* Image URL Placeholder (Before imgBB Step) */}
            <div className="md:col-span-2">
              <label className="block text-[#3d3029] font-medium mb-2 flex items-center gap-2">
                <FiImage /> Image URL *
              </label>
              <p className="text-xs text-[#7a6e64] mb-2">
                Note: In Step 10, this will be replaced with an actual image upload button.
              </p>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-4 py-3 border border-[#d4c3b3] rounded-lg focus:outline-none focus:border-[#b07c5b] focus:ring-1 focus:ring-[#b07c5b] transition-colors"
                required
              />
            </div>

          </div>

          <div className="pt-6 border-t border-[#e8ddd1] flex justify-end gap-4">
            <Link 
              href="/dashboard/artist"
              className="px-6 py-3 border border-[#d4c3b3] text-[#5a4d42] rounded-lg font-medium hover:bg-[#faf8f5] transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#b07c5b] text-white rounded-lg font-medium hover:bg-[#9e6c4d] transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {loading ? "Saving..." : <><FiSave /> Publish Artwork</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
