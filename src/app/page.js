import Banner from "@/components/home/Banner";
import FeaturedArtworks from "@/components/home/FeaturedArtworks";
import TopArtists from "@/components/home/TopArtists";
import ArtCategories from "@/components/home/ArtCategories";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <Banner />

      {/* Featured Artworks Section */}
      <FeaturedArtworks />

      {/* Top Artists Section */}
      <TopArtists />

      {/* Art Categories Section */}
      <ArtCategories />
    </div>
  );
}
