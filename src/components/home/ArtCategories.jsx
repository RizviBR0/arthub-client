"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FiArrowUpRight } from "react-icons/fi";

const categories = [
  {
    id: "painting",
    name: "Painting",
    description: "Oil, watercolor, and acrylic masterpieces",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "digital",
    name: "Digital Art",
    description: "Modern digital illustrations and designs",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "sculpture",
    name: "Sculpture",
    description: "3D artworks in clay, metal, and stone",
    image: "/categories/sculpture_cat_1781986165814.png"
  },
  {
    id: "photography",
    name: "Photography",
    description: "Captivating moments captured through lenses",
    image: "/categories/photography_cat_1781986182296.png"
  },
  {
    id: "drawing",
    name: "Drawing",
    description: "Pencil, charcoal, and ink illustrations",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "mixed-media",
    name: "Mixed Media",
    description: "Innovative combinations of various materials",
    image: "/categories/mixed_media_cat_1781986192972.png"
  },
  {
    id: "prints",
    name: "Fine Art Prints",
    description: "Limited edition silkscreens and lithographs",
    image: "/categories/prints_cat_1781986202495.png"
  },
  {
    id: "textile",
    name: "Textile Arts",
    description: "Weaving, embroidery, and fabric creations",
    image: "/categories/textile_cat_1781986212924.png"
  }
];

const getGridClass = (index) => {
  const classes = [
    "col-span-1 md:col-span-2 row-span-2 h-[350px] md:h-[624px]", // Painting (Big)
    "col-span-1 md:col-span-2 h-[250px] md:h-[300px]",                     // Digital Art (Wide)
    "col-span-1 md:col-span-1 h-[250px] md:h-[300px]",                     // Sculpture
    "col-span-1 md:col-span-1 h-[250px] md:h-[300px]",                     // Photography
    "col-span-1 md:col-span-4 h-[250px] md:h-[300px]",                     // Drawing (Very Wide Bottom)
  ];
  return classes[index] || "col-span-1 md:col-span-4 h-[300px]";
};

const ArtCategories = () => {
  const displayCategories = categories.slice(0, 5);

  return (
    <section className="w-full bg-[#faf8f5] py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#3d3029] mb-4 tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
            Explore Collections
          </h2>
          <p className="text-[#7a6e64] max-w-xl text-lg leading-relaxed">
            Discover a curated world of creativity. Find exactly what speaks to your soul across our diverse range of artistic mediums.
          </p>
        </div>
        <Link 
          href="/artworks" 
          className="inline-flex items-center gap-2 text-[#b07c5b] font-semibold hover:text-[#3d3029] transition-colors group"
        >
          View All Artworks
          <FiArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-min">
        {displayCategories.map((category, index) => (
          <Link 
            key={category.id} 
            href={`/artworks?category=${category.id}`}
            className={`group relative rounded-2xl overflow-hidden block shadow-sm hover:shadow-2xl transition-all duration-500 ${getGridClass(index)}`}
          >
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover transition-duration-1000 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={85}
            />
            
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#2d2522]/90 opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="absolute top-6 right-6 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100 border border-white/20">
              <FiArrowUpRight className="text-white" size={20} />
            </div>

            <div className="absolute bottom-0 left-0 w-full p-6 lg:p-8 text-left">
              <div className="translate-y-4 group-hover:translate-y-0 transition-duration-500">
                <span className="inline-block px-3 py-1 mb-3 text-[10px] font-bold uppercase tracking-widest text-[#2d2522] bg-white/90 backdrop-blur-sm rounded-sm">
                  {category.name}
                </span>
                <h3 className="text-2xl xl:text-3xl font-bold text-white mb-2 font-serif tracking-wide drop-shadow-md">
                  {category.name}
                </h3>
                <p className="text-white/80 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  {category.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      </div>
    </section>
  );
};

export default ArtCategories;
