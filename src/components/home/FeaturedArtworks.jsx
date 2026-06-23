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
        const res = await fetch(`${""}/api/artworks/featured`);
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
    <section className="w-full bg-white py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#3d3029] mb-4 tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
            Featured Artworks
          </h2>
          <p className="text-[#7a6e64] max-w-xl text-lg leading-relaxed">
            Handpicked original pieces from our most trending and talented creators.
          </p>
        </div>
        
        <Link 
          href="/artworks" 
          className="inline-flex items-center gap-2 text-[#b07c5b] font-semibold hover:text-[#3d3029] transition-colors group"
        >
          View All Artworks 
          <FiArrowRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex flex-col gap-3">
              <div className="w-full aspect-4/5 bg-[#ece5de] rounded-md"></div>
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
      </div>
    </section>
  );
};

export default FeaturedArtworks;
