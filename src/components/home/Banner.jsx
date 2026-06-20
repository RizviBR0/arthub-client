"use client";

import React, { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import Image from "next/image";

// Dummy trending images for the floating frames (classical/fine art vibe)
const trendingArtworks = [
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=400", // Classic portrait
  "https://images.unsplash.com/photo-1578301978693-85f6516d2524?auto=format&fit=crop&q=80&w=400", // Landscape
  "https://images.unsplash.com/photo-1576769267415-9642010aa962?auto=format&fit=crop&q=80&w=400", // Classical art
  "https://images.unsplash.com/photo-1580136608260-4eb11f4b24fe?auto=format&fit=crop&q=80&w=400", // Abstract/Painting
  "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&q=80&w=400", // Classic
  "https://images.unsplash.com/photo-1582201942988-13e60cb38da6?auto=format&fit=crop&q=80&w=400", // Portrait
];

// 3 Banner contents
const banners = [
  {
    id: 1,
    title: (
      <>
        Discover & Buy <br /> Original Art
      </>
    ),
    subtitle: "Curated original artworks from emerging and established artists around the world.",
    buttonText: "Browse Artworks",
    link: "/artworks",
  },
  {
    id: 2,
    title: (
      <>
        Support Independent <br /> Artists
      </>
    ),
    subtitle: "Connect directly with creators and invest in unique pieces that tell a story.",
    buttonText: "Meet the Artists",
    link: "/artworks",
  },
  {
    id: 3,
    title: (
      <>
        Transform Your <br /> Space
      </>
    ),
    subtitle: "Find the perfect masterpiece to elevate your home or office interior.",
    buttonText: "Explore Collections",
    link: "/artworks",
  },
];

export default function Banner() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 6000, stopOnInteraction: false }),
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

  // Framed image component
  const FloatingFrame = ({ src, className, animationDelay }) => (
    <div
      className={`absolute hidden md:block z-0 ${className} drop-shadow-2xl transition-transform duration-1000 ease-in-out hover:scale-105`}
      style={{
        animation: `float 6s ease-in-out infinite`,
        animationDelay: animationDelay,
      }}
    >
      <div className="relative border-[8px] border-[#d4c3b3] shadow-inner bg-white p-1">
        <div className="relative border border-[#a89888] overflow-hidden">
          <Image
            src={src}
            alt="Trending Artwork"
            width={200}
            height={250}
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full overflow-hidden bg-[#faf8f5]">
      {/* Soft gradient background to mimic studio lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/60 via-[#faf8f5] to-[#f0e8df] pointer-events-none" />

      {/* Floating Artworks (Static in background, outside carousel so they don't slide) */}
      <div className="absolute inset-0 w-full max-w-7xl mx-auto pointer-events-none">
        {/* Top Left */}
        <FloatingFrame
          src={trendingArtworks[0]}
          className="top-[10%] left-[5%] w-40 h-48 lg:w-48 lg:h-56"
          animationDelay="0s"
        />
        {/* Mid Left */}
        <FloatingFrame
          src={trendingArtworks[1]}
          className="top-[45%] left-[-2%] w-32 h-32 lg:w-40 lg:h-40"
          animationDelay="1s"
        />
        {/* Bottom Left */}
        <FloatingFrame
          src={trendingArtworks[2]}
          className="bottom-[10%] left-[8%] w-48 h-36 lg:w-56 lg:h-44"
          animationDelay="2s"
        />

        {/* Top Right */}
        <FloatingFrame
          src={trendingArtworks[3]}
          className="top-[15%] right-[5%] w-36 h-36 lg:w-44 lg:h-44"
          animationDelay="0.5s"
        />
        {/* Mid Right */}
        <FloatingFrame
          src={trendingArtworks[4]}
          className="top-[40%] right-[10%] w-44 h-56 lg:w-52 lg:h-64"
          animationDelay="1.5s"
        />
        {/* Bottom Right */}
        <FloatingFrame
          src={trendingArtworks[5]}
          className="bottom-[15%] right-[3%] w-36 h-48 lg:w-44 lg:h-56"
          animationDelay="2.5s"
        />
      </div>

      {/* Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="flex-[0_0_100%] min-w-0 relative flex flex-col items-center justify-center min-h-[600px] lg:min-h-[750px] px-6 text-center"
            >
              <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
                <h1
                  className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-medium text-[#3d3029] tracking-tight leading-[1.1] mb-6"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {banner.title}
                </h1>
                <p className="text-lg sm:text-xl text-[#5a4d42] mb-10 max-w-xl mx-auto leading-relaxed">
                  {banner.subtitle}
                </p>
                <Link
                  href={banner.link}
                  className="px-8 py-3.5 bg-[#b07c5b] hover:bg-[#9e6c4d] text-white rounded text-lg transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5 inline-block"
                >
                  {banner.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-20">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === selectedIndex ? "bg-[#b07c5b] w-8" : "bg-[#d4c3b3] hover:bg-[#a89888]"
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
