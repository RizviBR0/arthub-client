"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FiHeart } from "react-icons/fi";
import { useWishlist } from "@/context/WishlistContext";
import { authClient } from "@/lib/auth-client";

const ArtworkCard = ({ artwork }) => {
    const title = artwork?.title || "Untitled Masterpiece";
  const artistName = artwork?.artistName || "Unknown Artist";
  const price = artwork?.price || 150;
  const image = artwork?.image || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=600";
  const id = artwork?._id || "1";
  const isSold = artwork?.status === "sold";
  
  // Use wishlist context safely, defaulting to empty state if outside provider
  const wishlistContext = useWishlist();
  const isWishlisted = wishlistContext?.isWishlisted(id) || false;
  const toggleWishlist = wishlistContext?.toggleWishlist || (() => {});

  const { data: session } = authClient.useSession();
  const user = session?.user;
  const showWishlistButton = !user || user.role === "user";

  const handleWishlistClick = (e) => {
    e.preventDefault(); // Prevent navigating to the artwork page
    toggleWishlist(id);
  };

  return (
    <Link href={`/artworks/${id}`} className="group block w-full">
      <div className="relative overflow-hidden rounded-md bg-[#ece5de] aspect-4/5 mb-4">
        {showWishlistButton && (
          <button 
            onClick={handleWishlistClick}
            className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
              isWishlisted 
                ? "bg-white text-red-500 opacity-100" 
                : "bg-white/70 text-[#5a4d42] hover:text-red-500 hover:bg-white opacity-0 group-hover:opacity-100"
            }`} 
            aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <FiHeart size={18} className={isWishlisted ? "fill-current" : ""} />
          </button>
        )}

        {isSold && (
          <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-black/70 backdrop-blur-md text-white text-xs font-bold rounded-full uppercase tracking-wider">
            Sold
          </div>
        )}

        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-duration-700 ease-in-out group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          quality={85}
        />
        
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-[#3d3029] truncate font-serif">{title}</h3>
        <p className="text-sm text-[#7a6e64]">{artistName}</p>
        <p className="text-base font-medium text-[#b07c5b] mt-1">${price}</p>
      </div>
    </Link>
  );
};

export default ArtworkCard;
