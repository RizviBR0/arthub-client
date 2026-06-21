"use client";

import React from "react";
import ArtworkCard from "@/components/ArtworkCard";
import { useWishlist } from "@/context/WishlistContext";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const { wishlistItems } = useWishlist();
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  if (isPending) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-serif font-bold text-[#3d3029] mb-4">
          Your Wishlist
        </h1>
        <p className="text-[#7a6e64] mb-8">
          Please sign in to view and manage your wishlist.
        </p>
        <button
          onClick={() => router.push("/signin")}
          className="px-8 py-3 bg-[#b07c5b] text-white rounded-full font-medium hover:bg-[#8c6046] transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-serif font-bold text-[#3d3029] mb-4">
        My Wishlist
      </h1>
      <p className="text-[#7a6e64] mb-12">Artworks you've saved for later.</p>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-[#e8ddd1]">
          <h2 className="text-2xl font-serif font-medium text-[#3d3029] mb-3">
            Your wishlist is empty
          </h2>
          <p className="text-[#7a6e64] mb-8">
            Discover beautiful artworks and add them to your wishlist.
          </p>
          <button
            onClick={() => router.push("/artworks")}
            className="px-8 py-3 bg-[#3d3029] text-white rounded-full font-medium hover:bg-[#2a211c] transition-colors"
          >
            Browse Artworks
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {wishlistItems.map((artwork) => (
            <div key={artwork._id} className="flex flex-col">
              <ArtworkCard artwork={artwork} />
              <button
                onClick={() => router.push(`/artworks/${artwork._id}`)}
                className="mt-3 w-full py-2.5 border-2 border-[#b07c5b] text-[#b07c5b] rounded-full font-medium hover:bg-[#b07c5b] hover:text-white transition-colors"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
