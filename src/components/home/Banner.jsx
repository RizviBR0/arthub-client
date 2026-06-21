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

const FloatingFrame = ({ artwork, className, animationDelay, baseWidth }) => {
  if (!artwork || !artwork.image) return null;     
  return (
    <Link
      href={`/artworks/${artwork._id}`}
      className={`absolute hidden lg:block z-20 transition-duration-1000 ease-in-out hover:scale-105 hover:z-30 pointer-events-auto ${className}`}
      style={{
        animation: `float 6s ease-in-out infinite`,
        animationDelay: animationDelay,
      }}
    >
      <div className="relative border-4 border-[#a28b75] shadow-[0_15px_35px_-5px_rgba(0,0,0,0.2)] bg-[#3d3029] inline-block rounded-xs overflow-hidden">
        <div className="relative flex">
          <Image
            src={artwork.image}
            alt={artwork.title || "Trending Artwork"}
            width={300}
            height={300}
            className="object-cover max-h-65 object-center"
            style={{ width: baseWidth, height: "auto" }}
            sizes="(max-width: 1024px) 0px, 250px"
            quality={70}
          />
        </div>
      </div>
    </Link>
  );
};

export default function Banner() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 6000, stopOnInteraction: false }),
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dynamicArtworks, setDynamicArtworks] = useState([]);

  useEffect(() => {
    const fetchTrendingArtworks = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/api/artworks/featured`);
        const data = await res.json();
        if (data && data.length > 0) {
          setDynamicArtworks(data.filter(a => a.image));
        }
      } catch (error) {
        console.error("Error fetching trending artworks:", error);
      }
    };
    
    fetchTrendingArtworks();
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

  return (
    <div className="relative w-full h-150 md:h-175 lg:h-200 overflow-hidden bg-[#faf8f5]">
      
            <div className="absolute inset-0 w-full max-w-[1600px] mx-auto pointer-events-none z-20">
        {dynamicArtworks.length > 0 && (
          <>
            <FloatingFrame artwork={dynamicArtworks[0]} className="top-[6%] left-[16%]" baseWidth="170px" animationDelay="0s" />
            
            <FloatingFrame artwork={dynamicArtworks[1]} className="top-[45%] right-[18%]" baseWidth="130px" animationDelay="1s" />
            
            <FloatingFrame artwork={dynamicArtworks[2]} className="bottom-[22%] left-[10%]" baseWidth="200px" animationDelay="2s" />
            
            <FloatingFrame artwork={dynamicArtworks[3]} className="bottom-[4%] left-[24%]" baseWidth="120px" animationDelay="0.5s" />

            <FloatingFrame artwork={dynamicArtworks[4]} className="top-[6%] right-[22%]" baseWidth="140px" animationDelay="0.3s" />
            
            <FloatingFrame artwork={dynamicArtworks[5]} className="top-[18%] right-[4%]" baseWidth="160px" animationDelay="1.5s" />
            
            <FloatingFrame artwork={dynamicArtworks[6]} className="bottom-[18%] right-[10%]" baseWidth="220px" animationDelay="2.5s" />
            
            <FloatingFrame artwork={dynamicArtworks[7]} className="bottom-[5%] right-[25%]" baseWidth="130px" animationDelay="1.2s" />
          </>
        )}
      </div>

            <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="flex-[0_0_100%] min-w-0 relative flex flex-col items-center justify-center h-full px-6 text-center"
            >
                            <div className="absolute inset-0 z-0">
                <Image
                  src={banner.image}
                  alt={`Banner ${banner.id}`}
                  fill
                  className="object-cover object-center"
                  priority={banner.id === 1}
                  sizes="100vw"
                  quality={90}
                />
                {/* Dark Mode Overlay */}
                <div className="absolute inset-0 bg-black/50 hidden dark:block"></div>
              </div>

                            <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center pt-10">
                <h1
                  className="text-5xl sm:text-6xl lg:text-[5.5rem] font-medium text-[#2d2522] tracking-tight leading-[1.05] mb-6"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {banner.title}
                </h1>
                <p className="text-base sm:text-lg text-[#4a3f38] mb-10 max-w-125 mx-auto leading-relaxed">
                  {banner.subtitle}
                </p>
                <Link
                  href={banner.link}
                  className="px-8 py-3.5 bg-[#c46f53] hover:bg-[#a85a40] text-white font-medium rounded-sm text-[15px] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 inline-block"
                >
                  {banner.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

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
