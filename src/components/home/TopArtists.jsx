"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FiArrowRight } from "react-icons/fi";

const TopArtists = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopArtists = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/api/artists/top`);
        const data = await res.json();
        if (data && data.length > 0) {
          setArtists(data);
        }
      } catch (error) {
        console.error("Error fetching top artists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopArtists();
  }, []);
  if (!loading && artists.length === 0) return null;

  return (
    <section className="w-full bg-[#faf8f5] py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#3d3029] mb-4 tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
              Top Artists
            </h2>
            <p className="text-[#7a6e64] max-w-xl text-lg leading-relaxed">
              Meet the visionary creators behind our most beloved masterpieces.
            </p>
          </div>
          <Link 
            href="/artworks" 
            className="inline-flex items-center gap-2 text-[#b07c5b] font-semibold hover:text-[#3d3029] transition-colors group"
          >
            Discover Artists 
            <FiArrowRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-wrap justify-center gap-10 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col items-center gap-4 w-64">
                <div className="w-40 h-40 rounded-full bg-[#ece5de]"></div>
                <div className="h-5 bg-[#ece5de] rounded w-1/2"></div>
                <div className="h-4 bg-[#ece5de] rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-10 lg:gap-16">
            {artists.map((artist) => (
              <div key={artist._id} className="group flex flex-col items-center text-center">
                <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden mb-5 border-4 border-white shadow-lg transition-duration-500 group-hover:-translate-y-2 group-hover:shadow-xl">
                  <Image
                    src={artist.image}
                    alt={artist.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 160px, 192px"
                    quality={85}
                  />
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-xl font-bold text-[#3d3029] font-serif">{artist.name}</h3>
                <p className="text-[#b07c5b] font-medium mt-1">
                  {artist.sales ? `${artist.sales} Artworks Sold` : "Top Creator"}
                </p>
                <Link 
                  href={`/artists/${artist._id}`}
                  className="mt-4 px-5 py-2 rounded-full border border-[#d4c3b3] text-[#5a4d42] text-sm font-medium hover:bg-[#b07c5b] hover:text-white hover:border-[#b07c5b] transition-all flex items-center gap-2"
                >
                  View Profile <FiArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TopArtists;
