"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { FiArrowLeft, FiEdit2, FiTrash2, FiShoppingCart, FiClock, FiTag, FiCheckCircle, FiX, FiShoppingBag } from "react-icons/fi";
import toast from "react-hot-toast";
import CommentsSection from "@/components/CommentsSection";
import ConfirmModal from "@/components/ConfirmModal";

export default function ArtworkDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const [confirmModalState, setConfirmModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    isDanger: true,
    onConfirm: () => {}
  });

  const closeConfirmModal = () => {
    setConfirmModalState(prev => ({ ...prev, isOpen: false }));
  };

  const tier = user?.subscriptionTier || "free";
  const count = user?.purchaseCount || 0;
  let limit = 3;
  if (tier === "pro") limit = 9;
  if (tier === "premium") limit = Infinity;
  const isQuotaReached = user?.role === "user" && count >= limit;

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/api/artworks/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
             setArtwork(null);
          }
          throw new Error("Failed to fetch");
        }
        const data = await res.json();
        setArtwork(data);
      } catch (error) {
        console.error("Error fetching artwork details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArtwork();
    }
  }, [id]);

  const handleDelete = async () => {
    setConfirmModalState({
      isOpen: true,
      title: "Delete Artwork",
      message: "Are you sure you want to delete this artwork? This action cannot be undone.",
      confirmText: "Delete",
      isDanger: true,
      onConfirm: async () => {
        setIsDeleting(true);
        setTimeout(() => {
          toast.success("Artwork deleted successfully");
          router.push("/dashboard/artist");
        }, 1000);
      }
    });
  };

  const handlePurchase = async () => {
    if (!user) {
      toast("Please log in to purchase artworks", { icon: "🔒" });
      router.push("/signin");
      return;
    }

    if (isQuotaReached) {
      setShowUpgradeModal(true);
      return;
    }

    const toastId = toast.loading("Preparing secure checkout...");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/api/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // For session cookie
        body: JSON.stringify({ artworkId: artwork._id })
      });

      const data = await res.json();
      
      if (!res.ok) {
        if (data.code === "LIMIT_REACHED") {
          toast.dismiss(toastId);
          setShowUpgradeModal(true);
          return;
        }
        throw new Error(data.msg || "Failed to initiate checkout");
      }

      toast.success("Redirecting to Stripe...", { id: toastId });
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      toast.error(error.message, { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 animate-pulse">
        <div className="w-24 h-6 bg-[#ece5de] rounded mb-8"></div>
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="w-full lg:w-3/5 aspect-4/5 md:aspect-auto md:h-150 bg-[#ece5de] rounded-xl"></div>
          <div className="w-full lg:w-2/5 space-y-6">
            <div className="h-10 bg-[#ece5de] rounded w-3/4"></div>
            <div className="h-6 bg-[#ece5de] rounded w-1/3"></div>
            <div className="h-12 bg-[#ece5de] rounded w-1/4"></div>
            <div className="space-y-3 mt-8">
              <div className="h-4 bg-[#ece5de] rounded w-full"></div>
              <div className="h-4 bg-[#ece5de] rounded w-full"></div>
              <div className="h-4 bg-[#ece5de] rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl font-serif font-bold text-[#3d3029] mb-4">Artwork Not Found</h1>
        <p className="text-[#7a6e64] mb-8">The artwork you are looking for does not exist or has been removed.</p>
        <Link href="/artworks" className="px-6 py-3 bg-[#b07c5b] text-white rounded-md hover:bg-[#9e6c4d] transition-colors">
          Return to Gallery
        </Link>
      </div>
    );
  }

  const isOwner = user?.role === "artist" && user?.id === artwork.artistId;
  const isSold = artwork.status === "sold";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-16">
            <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-[#7a6e64] hover:text-[#b07c5b] transition-colors mb-8 font-medium"
      >
        <FiArrowLeft /> Back to browsing
      </button>

      <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
        
                <div className="w-full lg:w-3/5">
          <div className="relative w-full rounded-xl overflow-hidden shadow-2xl bg-[#ece5de] flex items-center justify-center p-2 md:p-6 border border-[#e8ddd1]">
            <div className="relative w-full aspect-4/5 md:aspect-auto md:h-162.5 shadow-inner bg-white">
              <Image
                src={artwork.image}
                alt={artwork.title}
                fill
                className="object-contain"
                priority
                unoptimized
              />
            </div>
          </div>
        </div>

                <div className="w-full lg:w-2/5 flex flex-col">
                    <div className="mb-6 border-b border-[#e8ddd1] pb-6">
            <div className="flex items-center justify-between gap-4 mb-3">
              <span className="inline-block px-3 py-1 bg-[#ece5de] text-[#7a6e64] text-xs font-bold uppercase tracking-wider rounded-sm">
                {artwork.category}
              </span>
              
              {isSold && (
                <span className="flex items-center gap-1 text-red-600 font-bold text-sm bg-red-50 px-3 py-1 rounded-sm border border-red-100">
                  <FiCheckCircle /> SOLD OUT
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-[#3d3029] mb-3 leading-tight" style={{ fontFamily: "Georgia, serif" }}>
              {artwork.title}
            </h1>
            
            <p className="text-lg text-[#7a6e64]">
              By <Link href={`/artworks?search=${encodeURIComponent(artwork.artistName)}`} className="font-semibold text-[#b07c5b] hover:text-[#8f5f3d] hover:underline transition-colors">{artwork.artistName}</Link>
            </p>
          </div>

                    <div className="mb-8">
            <p className="text-4xl font-semibold text-[#b07c5b]">
              ${artwork.price?.toLocaleString()}
            </p>
            <p className="text-[#a89888] text-sm mt-1 flex items-center gap-1">
              <FiTag size={14} /> Free global shipping included
            </p>
          </div>

                    <div className="mb-10 flex-1">
            <h3 className="font-bold text-[#3d3029] text-lg mb-3">About the Artwork</h3>
            <p className="text-[#5a4d42] leading-relaxed">
              {artwork.description || "No description provided by the artist."}
            </p>
            
            <div className="mt-6 flex items-center gap-2 text-sm text-[#7a6e64]">
              <FiClock /> Uploaded on {artwork?.createdAt ? new Date(artwork.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently'}
            </div>
          </div>

                    <div className="mt-auto pt-6 border-t border-[#e8ddd1] space-y-4">
            
                        {(!user || user.role === "user") && (
              <button 
                onClick={handlePurchase}
                disabled={isSold}
                className={`w-full py-4 rounded-lg flex items-center justify-center gap-2 text-lg font-medium transition-all shadow-md ${
                  isSold 
                    ? "bg-[#ece5de] text-[#a89888] cursor-not-allowed border border-[#d4c3b3]"
                    : "bg-linear-to-r from-[#c9a88a] to-[#b07c5b] hover:from-[#b8977a] hover:to-[#9e6c4d] text-white hover:shadow-xl hover:-translate-y-0.5"
                }`}
              >
                <FiShoppingCart size={20} />
                {isSold ? "Artwork Sold" : (isQuotaReached ? "Upgrade Plan to Purchase" : "Secure Checkout")}
              </button>
            )}

                        {isOwner && (
              <div className="flex gap-4">
                {isSold ? (
                  <div className="w-full py-4 bg-[#f0e8df] text-[#7a6e64] rounded-lg flex items-center justify-center gap-2 font-medium border border-[#d4c3b3]">
                    <FiCheckCircle className="text-[#b07c5b]" /> This artwork is sold and can no longer be edited.
                  </div>
                ) : (
                  <>
                    <Link 
                      href={`/dashboard/artist/edit/${artwork._id}`}
                      className="flex-1 py-3 border-2 border-[#b07c5b] text-[#b07c5b] hover:bg-[#b07c5b] hover:text-white rounded-lg flex items-center justify-center gap-2 font-medium transition-colors"
                    >
                      <FiEdit2 /> Edit
                    </Link>
                    <button 
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="flex-1 py-3 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50"
                    >
                      <FiTrash2 /> {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      <CommentsSection artworkId={artwork._id} />

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 text-center relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 text-[#a89888] hover:text-[#3d3029] transition-colors"
            >
              <FiX size={24} />
            </button>
            
            <div className="w-16 h-16 bg-[#faf5ef] text-[#b07c5b] rounded-full flex items-center justify-center mx-auto mb-6">
              <FiShoppingBag size={32} />
            </div>
            
            <h2 className="text-2xl font-serif font-bold text-[#3d3029] mb-3">Purchase Limit Reached</h2>
            <p className="text-[#7a6e64] mb-8 leading-relaxed">
              You have reached the maximum number of artwork purchases ({limit}) for your {tier} plan. Upgrade to unlock more purchases and premium features!
            </p>
            
            <div className="flex flex-col gap-3">
              <Link 
                href="/pricing"
                className="w-full py-3.5 bg-[#b07c5b] text-white font-medium rounded-lg hover:bg-[#9e6c4d] transition-colors shadow-md"
              >
                View Upgrade Plans
              </Link>
              <button 
                onClick={() => setShowUpgradeModal(false)}
                className="w-full py-3.5 bg-transparent text-[#7a6e64] font-medium rounded-lg hover:bg-[#faf8f5] transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
      
      <ConfirmModal {...confirmModalState} onClose={closeConfirmModal} />
    </div>
  );
}
