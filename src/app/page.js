import Banner from "@/components/home/Banner";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <Banner />

      {/* Placeholder for future sections */}
      <div className="py-20 text-center">
        <h2 className="text-3xl font-bold text-[#3d3029] mb-4" style={{ fontFamily: "Georgia, serif" }}>
          More content coming soon...
        </h2>
        <p className="text-[#7a6e64]">Featured Artworks, Top Artists, and Categories will be placed here.</p>
      </div>
    </div>
  );
}
