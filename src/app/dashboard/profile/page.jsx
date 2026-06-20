"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { FiUser, FiSave, FiEdit3 } from "react-icons/fi";
import toast from "react-hot-toast";
import ImageUpload from "@/components/ImageUpload";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    bio: "",
  });

  const API = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.push("/");
      return;
    }

    // Initialize form data from session
    setFormData({
      name: session.user.name || "",
      image: session.user.image || "",
      bio: session.user.bio || "",
    });
  }, [session, isPending, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Updating profile...");

    try {
      let finalImageUrl = formData.image;

      // Handle image upload to ImgBB if a new file was selected
      if (formData.image instanceof File) {
        toast.loading("Uploading profile image...", { id: toastId });
        
        const uploadData = new FormData();
        uploadData.append("image", formData.image);
        
        const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || process.env.NEXT_PUBLIC_IMGBB_KEY;
        const imgRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
          method: "POST",
          body: uploadData,
        });

        const imgJson = await imgRes.json();
        if (!imgJson.success) {
          throw new Error("Failed to upload image to ImgBB");
        }
        
        finalImageUrl = imgJson.data.display_url;
      }

      toast.loading("Saving changes...", { id: toastId });

      // Update core user info via BetterAuth client
      const { error: authError } = await authClient.updateUser({
        name: formData.name,
        image: finalImageUrl,
      });

      if (authError) {
        throw new Error(authError.message || "Failed to update core profile");
      }

      // Update custom additional fields (bio) via our Express backend
      const res = await fetch(`${API}/api/user/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ bio: formData.bio }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.msg || "Failed to update custom profile info");
      }

      toast.success("Profile updated successfully!", { id: toastId });
      
      // Refresh the page or session to reflect changes globally
      window.location.reload();

    } catch (error) {
      console.error(error);
      toast.error(error.message || "An error occurred", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-6 bg-white p-8 rounded-xl border border-[#e8ddd1]">
          <div className="h-8 bg-[#ece5de] rounded w-1/3"></div>
          <div className="h-32 bg-[#ece5de] rounded-xl"></div>
          <div className="h-12 bg-[#ece5de] rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#3d3029] flex items-center gap-3">
          <FiUser className="text-[#b07c5b]" /> My Profile
        </h1>
        <p className="text-[#7a6e64] mt-1">Manage your personal information and public presence.</p>
      </div>

      <div className="bg-white rounded-xl border border-[#e8ddd1] shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          
          {/* Avatar Section */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/3">
              <label className="block text-[#3d3029] font-medium mb-3 flex items-center gap-2">
                <FiUser /> Profile Picture
              </label>
              <div className="aspect-square w-full max-w-[200px] mx-auto rounded-full overflow-hidden border-2 border-dashed border-[#d4c3b3] p-1">
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <ImageUpload 
                    value={formData.image} 
                    onChange={(url) => setFormData({ ...formData, image: url })}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <div className="w-full md:w-2/3 space-y-6">
              {/* Name */}
              <div>
                <label className="block text-[#3d3029] font-medium mb-2">Display Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-[#d4c3b3] rounded-lg focus:outline-none focus:border-[#b07c5b] focus:ring-1 focus:ring-[#b07c5b] transition-colors"
                  required
                />
              </div>

              {/* Email (Read Only) */}
              <div>
                <label className="block text-[#3d3029] font-medium mb-2 text-opacity-70">Email Address</label>
                <input
                  type="email"
                  value={session?.user?.email || ""}
                  disabled
                  className="w-full px-4 py-3 border border-[#e8ddd1] bg-[#faf8f5] text-[#7a6e64] rounded-lg cursor-not-allowed"
                />
                <p className="text-xs text-[#b07c5b] mt-1">Email address cannot be changed.</p>
              </div>
              
              {/* Role Indicator */}
              <div>
                <label className="block text-[#3d3029] font-medium mb-2">Account Role</label>
                <div className="px-4 py-3 border border-[#e8ddd1] bg-[#faf8f5] rounded-lg flex items-center gap-2 text-[#5a4d42] capitalize font-medium">
                  {session?.user?.role} Account
                </div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="pt-6 border-t border-[#e8ddd1]">
            <label className="block text-[#3d3029] font-medium mb-2 flex items-center gap-2">
              <FiEdit3 /> Bio / About Me
            </label>
            <p className="text-sm text-[#7a6e64] mb-3">
              Share a little bit about yourself. If you are an artist, this will appear on your public profile.
            </p>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={loading}
              rows="4"
              className="w-full px-4 py-3 border border-[#d4c3b3] rounded-lg focus:outline-none focus:border-[#b07c5b] focus:ring-1 focus:ring-[#b07c5b] transition-colors resize-y"
              placeholder="Tell the world your story..."
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-[#e8ddd1] flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#b07c5b] text-white rounded-lg font-medium hover:bg-[#9e6c4d] transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? "Saving Changes..." : <><FiSave /> Save Profile</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
