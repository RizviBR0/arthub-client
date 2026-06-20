"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ArtworkCard from "@/components/ArtworkCard";
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const categories = [
  { id: "all", label: "All Categories" },
  { id: "painting", label: "Painting" },
  { id: "digital", label: "Digital Art" },
  { id: "sculpture", label: "Sculpture" },
  { id: "photography", label: "Photography" },
];

const sortOptions = [
  { id: "newest", label: "Newest Arrivals" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
];

function ArtworksBrowser() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  // Filters State
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);

  // Mobile filters toggle
  const [showFilters, setShowFilters] = useState(false);

  const fetchArtworks = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: "8",
      });
      if (search) queryParams.append("search", search);
      if (category && category !== "all") queryParams.append("category", category);
      if (minPrice) queryParams.append("minPrice", minPrice);
      if (maxPrice) queryParams.append("maxPrice", maxPrice);
      if (sort) queryParams.append("sort", sort);

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/api/artworks?${queryParams.toString()}`);
      const data = await res.json();
      
      if (data.artworks) {
        setArtworks(data.artworks);
        setPagination(data.pagination);
      } else {
        // Fallback placeholder data if DB connection fails / is empty, to showcase UI
        const mockArtworks = [
            { _id: "1", title: "Golden Horizon", artistName: "Elena Rostova", price: 450, image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=600" },
            { _id: "2", title: "Urban Dreams", artistName: "Marcus Chen", price: 280, image: "https://images.unsplash.com/photo-1576769267415-9642010aa962?auto=format&fit=crop&q=80&w=600" },
            { _id: "3", title: "Silent Echoes", artistName: "Sarah Jenkins", price: 850, image: "https://images.unsplash.com/photo-1578301978693-85f6516d2524?auto=format&fit=crop&q=80&w=600" },
            { _id: "4", title: "Abstract Motion", artistName: "David Kim", price: 320, image: "https://images.unsplash.com/photo-1580136608260-4eb11f4b24fe?auto=format&fit=crop&q=80&w=600" },
        ];
        setArtworks(mockArtworks);
        setPagination({ currentPage: 1, totalPages: 1, totalItems: 4, limit: 8 });
      }
    } catch (error) {
      console.error("Failed to fetch artworks", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks();
    // Update URL silently
    const queryParams = new URLSearchParams();
    if (search) queryParams.append("search", search);
    if (category && category !== "all") queryParams.append("category", category);
    if (minPrice) queryParams.append("minPrice", minPrice);
    if (maxPrice) queryParams.append("maxPrice", maxPrice);
    if (sort !== "newest") queryParams.append("sort", sort);
    if (page > 1) queryParams.append("page", page.toString());
    
    router.replace(`/artworks?${queryParams.toString()}`, { scroll: false });
  }, [search, category, minPrice, maxPrice, sort, page]);

  // Debounce search input
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handleFilterChange = () => {
    setPage(1);
    fetchArtworks();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className={`w-full md:w-64 shrink-0 ${showFilters ? "block" : "hidden md:block"}`}>
        <div className="sticky top-24 space-y-8 p-6 bg-[#faf8f5] rounded-xl border border-[#e8ddd1]">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#3d3029] mb-4">Categories</h3>
            <div className="flex flex-col gap-3">
              {categories.map(c => (
                <label key={c.id} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${category === c.id ? 'bg-[#b07c5b] border-[#b07c5b]' : 'border-[#d4c3b3] group-hover:border-[#b07c5b]'}`}>
                    {category === c.id && <div className="w-2 h-2 bg-white rounded-sm" />}
                  </div>
                  <input 
                    type="radio" 
                    name="category" 
                    className="hidden" 
                    checked={category === c.id} 
                    onChange={() => { setCategory(c.id); setPage(1); }} 
                  />
                  <span className={`text-sm ${category === c.id ? 'text-[#3d3029] font-medium' : 'text-[#7a6e64] group-hover:text-[#b07c5b]'}`}>
                    {c.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-serif text-xl font-bold text-[#3d3029] mb-4">Price Range</h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                onBlur={handleFilterChange}
                className="w-full px-3 py-2 bg-white border border-[#e8ddd1] rounded-md text-sm focus:outline-none focus:border-[#b07c5b] text-[#3d3029]"
              />
              <span className="text-[#a89888]">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                onBlur={handleFilterChange}
                className="w-full px-3 py-2 bg-white border border-[#e8ddd1] rounded-md text-sm focus:outline-none focus:border-[#b07c5b] text-[#3d3029]"
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Top Bar: Search & Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="relative w-full sm:max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a89888]" />
            <input
              type="text"
              placeholder="Search artworks or artists..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e8ddd1] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b07c5b]/20 focus:border-[#b07c5b] text-[#3d3029] shadow-sm"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              className="md:hidden px-4 py-2.5 border border-[#e8ddd1] rounded-lg flex items-center gap-2 text-sm font-medium text-[#5a4d42] bg-white shadow-sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiFilter /> Filters
            </button>

            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className="w-full sm:w-auto px-4 py-2.5 bg-white border border-[#e8ddd1] rounded-lg text-sm text-[#5a4d42] focus:outline-none focus:border-[#b07c5b] shadow-sm cursor-pointer"
            >
              {sortOptions.map(option => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Info */}
        <p className="text-[#7a6e64] text-sm mb-6">
          Showing <span className="font-semibold text-[#3d3029]">{artworks.length}</span> results
        </p>

        {/* Artwork Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="flex flex-col gap-3">
                <div className="w-full aspect-[4/5] bg-[#ece5de] rounded-md"></div>
                <div className="h-5 bg-[#ece5de] rounded w-3/4"></div>
                <div className="h-4 bg-[#ece5de] rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : artworks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-[#faf8f5] rounded-xl border border-dashed border-[#e8ddd1]">
            <h3 className="text-2xl font-serif font-bold text-[#3d3029] mb-2">No artworks found</h3>
            <p className="text-[#7a6e64]">Try adjusting your search or filters to find what you're looking for.</p>
            <button 
              onClick={() => { setSearch(""); setCategory("all"); setMinPrice(""); setMaxPrice(""); }}
              className="mt-6 px-6 py-2 bg-white border border-[#d4c3b3] text-[#b07c5b] font-medium rounded-md hover:bg-[#faf5ef] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
            {artworks.map(artwork => (
              <ArtworkCard key={artwork._id} artwork={artwork} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-16">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="p-2 border border-[#e8ddd1] rounded-md bg-white text-[#5a4d42] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#faf5ef] transition-colors"
            >
              <FiChevronLeft />
            </button>
            
            {Array.from({ length: pagination.totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-md text-sm font-medium transition-colors ${
                  page === i + 1 
                    ? "bg-[#b07c5b] text-white" 
                    : "border border-[#e8ddd1] bg-white text-[#5a4d42] hover:bg-[#faf5ef]"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={page === pagination.totalPages}
              onClick={() => setPage(page + 1)}
              className="p-2 border border-[#e8ddd1] rounded-md bg-white text-[#5a4d42] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#faf5ef] transition-colors"
            >
              <FiChevronRight />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function BrowseArtworksPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-[#7a6e64]">Loading collection...</div>}>
      <ArtworksBrowser />
    </Suspense>
  );
}
