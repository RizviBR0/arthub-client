"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { FiUser, FiShoppingBag, FiStar, FiCheck, FiLogOut } from "react-icons/fi";
import toast from "react-hot-toast";

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

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(session.user.name);

    const fetchPurchases = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/api/user/purchases`, {
          credentials: "include"
        });
        
        if (!res.ok) throw new Error("Failed to fetch");
        
        const data = await res.json();
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
    setUpdatingProfile(true);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/api/user/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name })
      });

      if (!res.ok) throw new Error("Failed to update profile");
      
      toast.success("Profile updated successfully! Please log in again to see changes.");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating profile");
    } finally {
      setUpdatingProfile(false);
    }
  };


  if (isPending || loading) {
    return <div className="p-8 animate-pulse flex space-x-4"><div className="flex-1 space-y-6 py-1"><div className="h-2 bg-slate-200 rounded"></div><div className="space-y-3"><div className="h-2 bg-slate-200 rounded col-span-2"></div></div></div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#3d3029]">My Account</h1>
        <p className="text-[#7a6e64] mt-1">Manage your profile and view your collected artworks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
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
                className="w-full py-2.5 bg-[#3d3029] text-white rounded-md font-medium hover:bg-[#2d2522] transition-colors disabled:opacity-70 mt-2"
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

                <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-[#e8ddd1] shadow-sm overflow-hidden h-full">
            <div className="px-6 py-5 border-b border-[#e8ddd1] flex items-center gap-2">
              <FiShoppingBag className="text-[#b07c5b]" />
              <h2 className="text-xl font-bold text-[#3d3029] font-serif">Purchase History</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#faf8f5] text-[#7a6e64] text-sm uppercase tracking-wider">
                    <th className="px-6 py-4 font-medium">Order ID</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Artist ID</th>
                    <th className="px-6 py-4 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8ddd1]">
                  {purchases.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-16 text-center text-[#7a6e64]">
                        <FiShoppingBag size={32} className="mx-auto mb-3 opacity-50" />
                        You haven&apos;t purchased any artworks yet.
                      </td>
                    </tr>
                  ) : (
                    purchases.map((purchase) => (
                      <tr key={purchase._id} className="hover:bg-[#faf8f5] transition-colors">
                        <td className="px-6 py-4 font-mono text-sm text-[#5a4d42]">
                          #{purchase.stripeSessionId.slice(-8)}
                        </td>
                        <td className="px-6 py-4 text-[#5a4d42]">
                          {new Date(purchase.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-[#5a4d42] truncate max-w-37.5">
                          {purchase.artistId}
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
    </div>
  );
}
