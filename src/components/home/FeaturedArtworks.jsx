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
        
        // If DB is empty, use mock data to show design
        if (!data || data.length === 0) {
          setArtworks([
            { _id: "1", title: "Golden Horizon", artistName: "Elena Rostova", price: 450, image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=600" },
            { _id: "2", title: "Urban Dreams", artistName: "Marcus Chen", price: 280, image: "https://images.unsplash.com/photo-1576769267415-9642010aa962?auto=format&fit=crop&q=80&w=600" },
            { _id: "3", title: "Silent Echoes", artistName: "Sarah Jenkins", price: 850, image: "https://images.unsplash.com/photo-1578301978693-85f6516d2524?auto=format&fit=crop&q=80&w=600" },
            { _id: "4", title: "Abstract Motion", artistName: "David Kim", price: 320, image: "https://images.unsplash.com/photo-1580136608260-4eb11f4b24fe?auto=format&fit=crop&q=80&w=600" },
            { _id: "5", title: "Winter Solstice", artistName: "Amina Al-Fayed", price: 550, image: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&q=80&w=600" },
            { _id: "6", title: "Midnight Portrait", artistName: "Leo Vanguard", price: 920, image: "https://images.unsplash.com/photo-1582201942988-13e60cb38da6?auto=format&fit=crop&q=80&w=600" }
          ]);
        } else {
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
