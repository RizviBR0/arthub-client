"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FiHeart } from "react-icons/fi";

const ArtworkCard = ({ artwork }) => {
    const title = artwork?.title || "Untitled Masterpiece";
  const artistName = artwork?.artistName || "Unknown Artist";
  const price = artwork?.price || 150;
  const image = artwork?.image || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=600";
  const id = artwork?._id || "1";

  return (
    <Link href={`/artworks/${id}`} className="group block w-full">
      <div className="relative overflow-hidden rounded-md bg-[#ece5de] aspect-4/5 mb-4">
                <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/70 backdrop-blur-md text-[#5a4d42] hover:text-red-500 hover:bg-white transition-all opacity-0 group-hover:opacity-100 shadow-sm" aria-label="Add to Wishlist">
          <FiHeart size={18} />
        </button>

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
