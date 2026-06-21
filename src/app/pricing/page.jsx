"use client";

import React, { useState } from "react";
import { FiCheck, FiStar, FiZap } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function PricingPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [loadingTier, setLoadingTier] = useState(null);

  React.useEffect(() => {
    if (!isPending && session?.user && session.user.role !== "user") {
      router.push("/");
    }
  }, [session, isPending, router]);

  // Don't render the pricing page for non-buyers while redirecting
  if (session?.user && session.user.role !== "user") {
    return null;
  }

  const handleSubscribe = async (tierId) => {
    if (!session) {
      toast("Please log in to upgrade your account", { icon: "🔒" });
      router.push("/signin");
      return;
    }

    setLoadingTier(tierId);
    const toastId = toast.loading("Preparing secure checkout...");
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/api/create-subscription-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ tier: tierId })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.msg || "Failed to initiate checkout");
      }

      toast.success("Redirecting to Stripe...", { id: toastId });
      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      toast.error(error.message, { id: toastId });
      setLoadingTier(null);
    }
  };

    const currentTier = "basic"; 
  return (
    <div className="bg-[#faf8f5] py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#3d3029] mb-4 font-serif">
            Elevate Your Art Career
          </h1>
          <p className="text-lg text-[#7a6e64]">
            Choose the perfect plan to discover, collect, and showcase your artwork while maximizing your potential.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          <div className="bg-white rounded-2xl border border-[#e8ddd1] p-8 shadow-sm flex flex-col">
            <h3 className="text-2xl font-bold text-[#3d3029] font-serif mb-2">Basic</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-[#3d3029]">$0</span>
              <span className="text-[#7a6e64]">/ forever</span>
            </div>
            <p className="text-[#5a4d42] mb-8 h-12">Essential tools to start selling your art online.</p>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-[#5a4d42]"><FiCheck className="text-green-500" /> Unlimited artwork uploads</li>
              <li className="flex items-center gap-3 text-[#5a4d42]"><FiCheck className="text-green-500" /> Standard gallery placement</li>
              <li className="flex items-center gap-3 text-[#5a4d42]"><FiCheck className="text-green-500" /> Buy up to 3 artworks</li>
              <li className="flex items-center gap-3 text-[#5a4d42]"><FiCheck className="text-green-500" /> 10% transaction fee</li>
            </ul>

            <button 
              disabled 
              className="w-full py-3 rounded-lg border-2 border-[#d4c3b3] text-[#7a6e64] font-medium bg-[#faf8f5] cursor-not-allowed"
            >
              Current Plan
            </button>
          </div>

          <div className="bg-white rounded-2xl border-2 border-[#b07c5b] p-8 shadow-xl relative flex flex-col md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#b07c5b] text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
              <FiStar /> MOST POPULAR
            </div>
            <h3 className="text-2xl font-bold text-[#3d3029] font-serif mb-2">Pro</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-[#b07c5b]">$9.99</span>
              <span className="text-[#7a6e64]">/ month</span>
            </div>
            <p className="text-[#5a4d42] mb-8 h-12">Stand out to buyers with premium visibility.</p>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-[#5a4d42]"><FiCheck className="text-green-500" /> All Basic features</li>
              <li className="flex items-center gap-3 font-semibold text-[#b07c5b]"><FiCheck className="text-green-500" /> &quot;Pro&quot; Profile Badge</li>
              <li className="flex items-center gap-3 font-semibold text-[#b07c5b]"><FiCheck className="text-green-500" /> Buy up to 9 artworks</li>
              <li className="flex items-center gap-3 text-[#5a4d42]"><FiCheck className="text-green-500" /> 5% transaction fee</li>
            </ul>

            <form action="/api/checkout_sessions" method="POST">
              <input type="hidden" name="tier" value="pro" />
              <button 
                type="submit"
                onClick={(e) => {
                  if (!session) {
                    e.preventDefault();
                    toast("Please log in to upgrade your account", { icon: "🔒" });
                    router.push("/signin");
                  }
                }}
                className="w-full py-3 rounded-lg bg-[#b07c5b] hover:bg-[#9e6c4d] text-white font-medium shadow-md transition-colors flex justify-center items-center gap-2"
              >
                Upgrade to Pro
              </button>
            </form>
          </div>

          <div className="bg-[#3d3029] text-white rounded-2xl border border-[#3d3029] p-8 shadow-xl flex flex-col">
            <h3 className="text-2xl font-bold font-serif mb-2 text-white">Premium</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-[#d4c3b3]">$19.99</span>
              <span className="text-[#a89888]">/ month</span>
            </div>
            <p className="text-[#e8ddd1] mb-8 h-12">For serious professionals maximizing their revenue.</p>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-[#e8ddd1]"><FiCheck className="text-green-400" /> All Pro features</li>
              <li className="flex items-center gap-3 font-semibold text-white"><FiCheck className="text-green-400" /> &quot;Premium&quot; Profile Badge</li>
              <li className="flex items-center gap-3 font-semibold text-white"><FiCheck className="text-green-400" /> Unlimited purchases</li>
              <li className="flex items-center gap-3 font-bold text-[#d4c3b3]"><FiZap className="text-yellow-400" /> 0% transaction fee</li>
            </ul>

            <form action="/api/checkout_sessions" method="POST">
              <input type="hidden" name="tier" value="premium" />
              <button 
                type="submit"
                onClick={(e) => {
                  if (!session) {
                    e.preventDefault();
                    toast("Please log in to upgrade your account", { icon: "🔒" });
                    router.push("/signin");
                  }
                }}
                className="w-full py-3 rounded-lg bg-white text-[#3d3029] hover:bg-[#faf5ef] font-bold shadow-md transition-colors flex justify-center items-center gap-2"
              >
                Go Premium
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
