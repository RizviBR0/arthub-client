"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

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
    image: "https://images.unsplash.com/photo-1582561424760-0321d6daa242?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "photography",
    name: "Photography",
    description: "Captivating moments captured through lenses",
    image: "https://images.unsplash.com/photo-1516801708819-2708b79b2da3?auto=format&fit=crop&q=80&w=600"
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
    image: "https://images.unsplash.com/photo-1544268069-450fbf821bd5?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "prints",
    name: "Fine Art Prints",
    description: "Limited edition silkscreens and lithographs",
    image: "https://images.unsplash.com/photo-1560573994-399042b5ba4d?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "textile",
    name: "Textile Arts",
    description: "Weaving, embroidery, and fabric creations",
    image: "https://images.unsplash.com/photo-1584488824147-321200e00f91?auto=format&fit=crop&q=80&w=600"
  }
];

const ArtCategories = () => {
  return (
    <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-[#3d3029] mb-4" style={{ fontFamily: "Georgia, serif" }}>
          Explore by Category
        </h2>
        <p className="text-[#7a6e64] max-w-2xl mx-auto text-lg">
          Find exactly what you're looking for by browsing our curated collections.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link 
            key={category.id} 
            href={`/artworks?category=${category.id}`}
            className="group relative h-[350px] rounded-xl overflow-hidden block"
          >
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
            />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
            
                        <div className="absolute bottom-0 left-0 w-full p-6 text-left">
              <h3 className="text-2xl font-bold text-white mb-2 font-serif tracking-wide">{category.name}</h3>
              <p className="text-white/80 text-sm transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                {category.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ArtCategories;
