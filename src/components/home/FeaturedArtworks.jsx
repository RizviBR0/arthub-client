"use client";

import React, { useEffect, useState } from "react";
import ArtworkCard from "../ArtworkCard";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

const FeaturedArtworks = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/api/artworks/featured`);
        const data = await res.json();
        if (data && data.length > 0) {
          setArtworks(data);
        }
      } catch (error) {
        console.error("Error fetching featured artworks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#3d3029] mb-3" style={{ fontFamily: "Georgia, serif" }}>
            Featured Artworks
          </h2>
          <p className="text-[#7a6e64] max-w-2xl text-lg">
            Handpicked original pieces from our most trending and talented creators.
          </p>
        </div>
        
        <Link 
          href="/artworks" 
          className="group flex items-center gap-2 text-[#b07c5b] font-medium hover:text-[#9e6c4d] transition-colors"
        >
          View All Collection 
          <FiArrowRight className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex flex-col gap-3">
              <div className="w-full aspect-[4/5] bg-[#ece5de] rounded-md"></div>
              <div className="h-5 bg-[#ece5de] rounded w-3/4"></div>
              <div className="h-4 bg-[#ece5de] rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
          {artworks.map((artwork) => (
            <ArtworkCard key={artwork._id} artwork={artwork} />
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedArtworks;
