"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { FiUser, FiSave, FiEdit3 } from "react-icons/fi";
import toast from "react-hot-toast";
import ImageUpload from "@/components/ImageUpload";
import { getUserAuthMethods, getUserDetails } from "@/lib/api/user";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    bio: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [hasPassword, setHasPassword] = useState(true);

  const API = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.push("/");
      return;
    }

    // Initialize form data from session
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData({
      name: session.user.name || "",
      image: session.user.image || "",
      bio: session.user.bio || "",
    });

    const fetchDetails = async () => {
      try {
        const details = await getUserDetails();
        setFormData((prev) => ({ ...prev, bio: details.bio || "" }));
      } catch (err) {
        console.error("Failed to fetch user details", err);
      }
    };
    fetchDetails();

    getUserAuthMethods()
      .then((data) => setHasPassword(data.hasPassword))
      .catch((err) => console.error("Failed to fetch auth methods", err));
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

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setChangingPassword(true);
    const toastId = toast.loading("Changing password...");

    try {
      const { error } = await authClient.changePassword({
        newPassword: passwordData.newPassword,
        currentPassword: passwordData.currentPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        throw new Error(error.message || "Failed to change password");
      }

      toast.success("Password changed successfully!", { id: toastId });
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error(error);
      toast.error(error.message || "An error occurred", { id: toastId });
    } finally {
      setChangingPassword(false);
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

      <div className="bg-white rounded-xl border border-[#e8ddd1] shadow-sm overflow-hidden mb-8">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          
          {/* Avatar Section */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/3">
              <label className="text-[#3d3029] font-medium mb-3 flex items-center gap-2">
                <FiUser /> Profile Picture
              </label>
              <div className="aspect-square w-full max-w-50 mx-auto rounded-full overflow-hidden border-2 border-dashed border-[#d4c3b3] p-1">
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <ImageUpload 
                    value={formData.image} 
                    onChange={(url) => setFormData({ ...formData, image: url })}
                    disabled={loading}
                    shape="circle"
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
                <label className="block text-[#3d3029] font-medium mb-2">Email Address</label>
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
            <label className="text-[#3d3029] font-medium mb-2 flex items-center gap-2">
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

      <div className="bg-white rounded-xl border border-[#e8ddd1] shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-[#e8ddd1] bg-[#faf8f5]">
          <h2 className="text-xl font-serif font-bold text-[#3d3029]">Security & Password</h2>
          <p className="text-sm text-[#7a6e64] mt-1">Keep your account secure by updating your password regularly.</p>
        </div>
        {!hasPassword ? (
          <div className="p-6 md:p-8 text-[#7a6e64]">
            <p>Your account is linked via a third-party provider (e.g., Google). Password management is handled by your provider.</p>
          </div>
        ) : (
          <form onSubmit={handlePasswordChange} className="p-6 md:p-8 space-y-6">
            <div className="max-w-md space-y-5">
              <div>
                <label className="block text-[#3d3029] font-medium mb-2 text-sm">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  disabled={changingPassword}
                  className="w-full px-4 py-2.5 border border-[#d4c3b3] rounded-lg focus:outline-none focus:border-[#b07c5b] focus:ring-1 focus:ring-[#b07c5b] transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-[#3d3029] font-medium mb-2 text-sm">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  disabled={changingPassword}
                  className="w-full px-4 py-2.5 border border-[#d4c3b3] rounded-lg focus:outline-none focus:border-[#b07c5b] focus:ring-1 focus:ring-[#b07c5b] transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-[#3d3029] font-medium mb-2 text-sm">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  disabled={changingPassword}
                  className="w-full px-4 py-2.5 border border-[#d4c3b3] rounded-lg focus:outline-none focus:border-[#b07c5b] focus:ring-1 focus:ring-[#b07c5b] transition-colors"
                  required
                />
              </div>
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                disabled={changingPassword}
                className="px-6 py-2.5 bg-[#3d3029] text-white rounded-lg font-medium hover:bg-[#2a211c] transition-colors disabled:opacity-70 shadow-sm"
              >
                {changingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
