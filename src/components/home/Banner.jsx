"use client";

import React, { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import Image from "next/image";

import banner1 from "@/assets/banner1.png";
import banner2 from "@/assets/banner2.png";
import banner3 from "@/assets/banner3.png";

// 3 Banner contents
const banners = [
  {
    id: 1,
    image: banner1,
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
    image: banner2,
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
    image: banner3,
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
  const [dynamicArtworks, setDynamicArtworks] = useState([]);

  // Simulate fetching dynamic artworks from backend
  useEffect(() => {
    // In the future, this will be: fetch('/api/artworks/trending')...
    const fetchTrendingArtworks = async () => {
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setDynamicArtworks([
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=400", // 1. Top Left Portrait
        "https://images.unsplash.com/photo-1576769267415-9642010aa962?auto=format&fit=crop&q=80&w=400", // 2. Mid Left Flowers
        "https://images.unsplash.com/photo-1578301978693-85f6516d2524?auto=format&fit=crop&q=80&w=400", // 3. Bottom Left Landscape
        "https://images.unsplash.com/photo-1580136608260-4eb11f4b24fe?auto=format&fit=crop&q=80&w=400", // 4. Bottom Inner Left Abstract
        "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&q=80&w=400", // 5. Top Right Landscape
        "https://images.unsplash.com/photo-1582201942988-13e60cb38da6?auto=format&fit=crop&q=80&w=400", // 6. Mid Right Portrait
        "https://images.unsplash.com/photo-1576769267415-9642010aa962?auto=format&fit=crop&q=80&w=400", // 7. Bottom Right Flowers (using same for placeholder)
        "https://images.unsplash.com/photo-1533158388470-9a56699990c6?auto=format&fit=crop&q=80&w=400", // 8. Bottom Inner Right Woman
      ]);
    };
    
    fetchTrendingArtworks();
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

  // Framed image component
  const FloatingFrame = ({ src, className, animationDelay, baseWidth }) => {
    if (!src) return null; // Don't render until dynamic data is loaded
    
    return (
      <div
        className={`absolute hidden lg:block z-20 transition-transform duration-1000 ease-in-out hover:scale-105 shadow-xl ${className}`}
        style={{
          animation: `float 6s ease-in-out infinite`,
          animationDelay: animationDelay,
        }}
      >
        <div className="relative border-[6px] border-[#c2b2a1] shadow-inner bg-[#ece5de] p-1 inline-block">
          <div className="relative border border-[#8a7a6c] flex">
            {/* Auto-height image so frame tightly wraps the artwork without arbitrary cropping */}
            <Image
              src={src}
              alt="Trending Artwork"
              width={300}
              height={300}
              className="object-cover max-h-[260px] object-center"
              style={{ width: baseWidth, height: "auto" }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden bg-[#faf8f5]">
      
      {/* Dynamic Floating Artworks (Outside carousel so they don't slide, perfectly positioned) */}
      <div className="absolute inset-0 w-full max-w-[1600px] mx-auto pointer-events-none z-20">
        {dynamicArtworks.length > 0 && (
          <>
            {/* Top Left */}
            <FloatingFrame src={dynamicArtworks[0]} className="top-[10%] left-[12%]" baseWidth="160px" animationDelay="0s" />
            
            {/* Mid Left */}
            <FloatingFrame src={dynamicArtworks[1]} className="top-[35%] left-[6%]" baseWidth="130px" animationDelay="1s" />
            
            {/* Bottom Left */}
            <FloatingFrame src={dynamicArtworks[2]} className="bottom-[20%] left-[8%]" baseWidth="200px" animationDelay="2s" />
            
            {/* Bottom Inner Left */}
            <FloatingFrame src={dynamicArtworks[3]} className="bottom-[8%] left-[24%]" baseWidth="120px" animationDelay="0.5s" />

            {/* Top Right Inner */}
            <FloatingFrame src={dynamicArtworks[4]} className="top-[8%] right-[25%]" baseWidth="130px" animationDelay="0.3s" />
            
            {/* Top Right Outer */}
            <FloatingFrame src={dynamicArtworks[5]} className="top-[18%] right-[6%]" baseWidth="150px" animationDelay="1.5s" />
            
            {/* Bottom Right */}
            <FloatingFrame src={dynamicArtworks[6]} className="bottom-[22%] right-[10%]" baseWidth="180px" animationDelay="2.5s" />
            
            {/* Bottom Inner Right */}
            <FloatingFrame src={dynamicArtworks[7]} className="bottom-[10%] right-[28%]" baseWidth="120px" animationDelay="1.2s" />
          </>
        )}
      </div>

      {/* Carousel */}
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="flex-[0_0_100%] min-w-0 relative flex flex-col items-center justify-center h-full px-6 text-center"
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={banner.image}
                  alt={`Banner ${banner.id}`}
                  fill
                  className="object-cover object-center"
                  priority={banner.id === 1}
                />
              </div>

              {/* Text Content */}
              <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center pt-10">
                <h1
                  className="text-5xl sm:text-6xl lg:text-[5.5rem] font-medium text-[#2d2522] tracking-tight leading-[1.05] mb-6"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {banner.title}
                </h1>
                <p className="text-base sm:text-lg text-[#4a3f38] mb-10 max-w-[500px] mx-auto leading-relaxed">
                  {banner.subtitle}
                </p>
                <Link
                  href={banner.link}
                  className="px-8 py-3.5 bg-[#c46f53] hover:bg-[#a85a40] text-white font-medium rounded-sm text-[15px] transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 inline-block"
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
