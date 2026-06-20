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
        
        if (!data || data.length === 0) {
          setArtists([
            { _id: "1", name: "Elena Rostova", sales: 124, image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop" },
            { _id: "2", name: "Marcus Chen", sales: 98, image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop" },
            { _id: "3", name: "Sarah Jenkins", sales: 85, image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop" }
          ]);
        } else {
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

  return (
    <section className="py-20 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#3d3029] mb-4" style={{ fontFamily: "Georgia, serif" }}>
            Top Artists This Month
          </h2>
          <p className="text-[#7a6e64] max-w-2xl mx-auto text-lg">
            Meet the creators behind our most beloved masterpieces.
          </p>
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
                <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden mb-5 border-[4px] border-white shadow-lg transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-xl">
                  <Image
                    src={artist.image || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop"}
                    alt={artist.name}
                    fill
                    className="object-cover"
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
