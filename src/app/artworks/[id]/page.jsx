"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { FiArrowLeft, FiEdit2, FiTrash2, FiShoppingCart, FiClock, FiTag, FiCheckCircle } from "react-icons/fi";
import toast from "react-hot-toast";

export default function ArtworkDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

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
    if (!window.confirm("Are you sure you want to delete this artwork? This action cannot be undone.")) return;
    
    setIsDeleting(true);
    // Note: The actual delete API will be implemented in Step 9
    setTimeout(() => {
      toast.success("Artwork deleted successfully");
      router.push("/dashboard/artist");
    }, 1000);
  };

  const handlePurchase = () => {
    if (!user) {
      toast("Please log in to purchase artworks", { icon: "🔒" });
      router.push("/signin");
      return;
    }
    // Stripe checkout logic will be added in Step 11
    toast.success("Redirecting to secure checkout...");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 animate-pulse">
        <div className="w-24 h-6 bg-[#ece5de] rounded mb-8"></div>
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="w-full lg:w-3/5 aspect-[4/5] md:aspect-auto md:h-[600px] bg-[#ece5de] rounded-xl"></div>
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
      {/* Back navigation */}
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-[#7a6e64] hover:text-[#b07c5b] transition-colors mb-8 font-medium"
      >
        <FiArrowLeft /> Back to browsing
      </button>

      <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
        
        {/* Left Column: Image */}
        <div className="w-full lg:w-3/5">
          <div className="relative w-full rounded-xl overflow-hidden shadow-2xl bg-[#ece5de] flex items-center justify-center p-2 md:p-6 border border-[#e8ddd1]">
            <div className="relative w-full aspect-[4/5] md:aspect-auto md:h-[650px] shadow-inner bg-white">
              <Image
                src={artwork.image}
                alt={artwork.title}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="w-full lg:w-2/5 flex flex-col">
          {/* Header Info */}
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
              By <Link href={`/artists/${artwork.artistId}`} className="font-semibold text-[#b07c5b] hover:underline">{artwork.artistName}</Link>
            </p>
          </div>

          {/* Pricing */}
          <div className="mb-8">
            <p className="text-4xl font-semibold text-[#b07c5b]">
              ${artwork.price?.toLocaleString()}
            </p>
            <p className="text-[#a89888] text-sm mt-1 flex items-center gap-1">
              <FiTag size={14} /> Free global shipping included
            </p>
          </div>

          {/* Description */}
          <div className="mb-10 flex-1">
            <h3 className="font-bold text-[#3d3029] text-lg mb-3">About the Artwork</h3>
            <p className="text-[#5a4d42] leading-relaxed">
              {artwork.description || "No description provided by the artist."}
            </p>
            
            <div className="mt-6 flex items-center gap-2 text-sm text-[#7a6e64]">
              <FiClock /> Uploaded on {new Date(artwork.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-auto pt-6 border-t border-[#e8ddd1] space-y-4">
            
            {/* Purchase Button (For Buyers / Non-Owners) */}
            {!isOwner && (
              <button 
                onClick={handlePurchase}
                disabled={isSold}
                className={`w-full py-4 rounded-lg flex items-center justify-center gap-2 text-lg font-medium transition-all shadow-md ${
                  isSold 
                    ? "bg-[#ece5de] text-[#a89888] cursor-not-allowed border border-[#d4c3b3]"
                    : "bg-gradient-to-r from-[#c9a88a] to-[#b07c5b] hover:from-[#b8977a] hover:to-[#9e6c4d] text-white hover:shadow-xl transform hover:-translate-y-0.5"
                }`}
              >
                <FiShoppingCart size={20} />
                {isSold ? "Artwork Sold" : "Secure Checkout"}
              </button>
            )}

            {/* Artist Controls (For Owners) */}
            {isOwner && (
              <div className="flex gap-4">
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
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
