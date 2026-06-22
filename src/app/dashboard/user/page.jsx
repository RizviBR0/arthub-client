"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { FiUser, FiShoppingBag, FiStar, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";
import { getUserPurchases } from "@/lib/api/user";

export default function UserDashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [name, setName] = useState("");
  const [updatingProfile, setUpdatingProfile] = useState(false);

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.push("/signin");
      return;
    }

    setName(session.user.name || "");

    const fetchPurchases = async () => {
      try {
        const data = await getUserPurchases();
        setPurchases(data);
      } catch (error) {
        console.error("Failed to fetch purchases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [session, isPending, router]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    setUpdatingProfile(true);
    const toastId = toast.loading("Updating name...");
    
    try {
      const { error } = await authClient.updateUser({
        name: name,
      });

      if (error) {
        throw new Error(error.message || "Failed to update profile");
      }
      
      toast.success("Profile updated successfully!", { id: toastId });
      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "An error occurred while updating profile", { id: toastId });
    } finally {
      setUpdatingProfile(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-[#ece5de] rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-48 bg-[#ece5de] rounded-xl col-span-1"></div>
            <div className="h-48 bg-[#ece5de] rounded-xl col-span-2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#3d3029]">My Account</h1>
        <p className="text-[#7a6e64] mt-1">Manage your profile and view your collected artworks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column — Profile details & subscription */}
        <div className="lg:col-span-1 space-y-8">
          
          <div className="bg-white rounded-xl border border-[#e8ddd1] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#e8ddd1] bg-[#faf8f5] flex items-center gap-2">
              <FiUser className="text-[#b07c5b]" />
              <h2 className="text-lg font-bold text-[#3d3029]">Profile Details</h2>
            </div>
            <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#5a4d42] mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-[#d4c3b3] rounded-md focus:outline-none focus:border-[#b07c5b] focus:ring-1 focus:ring-[#b07c5b]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#5a4d42] mb-1">Email Address</label>
                <input
                  type="email"
                  value={session.user.email}
                  disabled
                  className="w-full px-4 py-2 border border-[#e8ddd1] bg-[#faf8f5] text-[#a89888] rounded-md cursor-not-allowed"
                />
                <p className="text-xs text-[#a89888] mt-1">Email cannot be changed.</p>
              </div>
              <button
                type="submit"
                disabled={updatingProfile}
                className="w-full py-2.5 bg-[#3d3029] text-white rounded-md font-medium hover:bg-[#2d2522] transition-colors disabled:opacity-70 mt-2 cursor-pointer"
              >
                {updatingProfile ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>

          {session.user.role === "user" && (
            <div className="bg-[#3d3029] rounded-xl shadow-sm p-6 text-white space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#b07c5b] rounded-full flex items-center justify-center">
                  <FiCheck size={20} />
                </div>
                <div>
                  <p className="text-sm text-[#e8ddd1]">Current Plan</p>
                  <p className="text-xl font-bold font-serif capitalize">
                    {session.user.subscriptionTier || "Free"} Member
                  </p>
                </div>
              </div>
              
              <div className="bg-[#2d2522] rounded-lg p-4 border border-[#5a4d42]">
                <p className="text-sm text-[#e8ddd1] mb-1">Purchase Quota</p>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-bold text-[#b07c5b]">
                    {(() => {
                      const tier = session.user.subscriptionTier || "free";
                      const count = session.user.purchaseCount || 0;
                      let limit = 3;
                      if (tier === "pro") limit = 9;
                      if (tier === "premium") return "Unlimited";
                      return `${Math.max(0, limit - count)} remaining`;
                    })()}
                  </p>
                  {session.user.subscriptionTier !== "premium" && (
                    <p className="text-xs text-[#a89888]">
                      {session.user.purchaseCount || 0} used
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column — Purchase History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-[#e8ddd1] shadow-sm overflow-hidden h-full">
            <div className="px-6 py-5 border-b border-[#e8ddd1] flex items-center gap-2 bg-[#faf8f5]">
              <FiShoppingBag className="text-[#b07c5b]" />
              <h2 className="text-xl font-bold text-[#3d3029] font-serif">Purchase History</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#faf8f5] border-b border-[#e8ddd1] text-[#7a6e64] text-sm uppercase tracking-wider">
                    <th className="px-6 py-4 font-medium">Artwork Name</th>
                    <th className="px-6 py-4 font-medium">Artist</th>
                    <th className="px-6 py-4 font-medium">Purchase Date</th>
                    <th className="px-6 py-4 font-medium text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8ddd1]">
                  {purchases.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-16 text-center text-[#7a6e64]">
                        You haven&apos;t purchased any artworks yet.
                      </td>
                    </tr>
                  ) : (
                    purchases.map((purchase) => (
                      <tr key={purchase._id} className="hover:bg-[#faf8f5] transition-colors">
                        <td className="px-6 py-4 font-semibold text-[#5a4d42]">
                          {purchase.artworkTitle || "Unknown Artwork"}
                        </td>
                        <td className="px-6 py-4 text-[#5a4d42] truncate max-w-37.5">
                          {purchase.artwork?.artistName || "Unknown Artist"}
                        </td>
                        <td className="px-6 py-4 text-[#7a6e64] text-sm">
                          {new Date(purchase.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-[#3d3029]">
                          ${purchase.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-[#3d3029] font-serif mb-6 flex items-center gap-2">
          <FiStar className="text-[#b07c5b]" /> Bought Artworks Gallery
        </h2>
        {purchases.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-[#e8ddd1] shadow-sm">
            <p className="text-[#7a6e64]">No artworks to display.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {purchases.map(purchase => purchase.artwork && (
              <div key={purchase._id} className="bg-white rounded-xl border border-[#e8ddd1] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col animate-in fade-in duration-200">
                <div className="aspect-4/5 relative bg-[#ece5de] overflow-hidden">
                  <img src={purchase.artwork.image} alt={purchase.artwork.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 flex flex-col flex-1 justify-between bg-white">
                  <div>
                    <h3 className="font-bold text-[#3d3029] truncate">{purchase.artwork.title}</h3>
                    <p className="text-xs text-[#7a6e64] mt-0.5">by {purchase.artwork.artistName}</p>
                  </div>
                  <button 
                    onClick={() => router.push(`/artworks/${purchase.artwork._id}`)} 
                    className="mt-4 pt-2 pb-2 w-full border border-[#b07c5b] text-[#b07c5b] rounded-lg text-sm font-medium hover:bg-[#b07c5b] hover:text-white transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
