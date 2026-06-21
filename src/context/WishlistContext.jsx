"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session?.user) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
      setWishlistIds(new Set());
    }
  }, [session]);

  const fetchWishlist = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/api/wishlist`, {
        headers: {
          // Use the session cookie for auth
        },
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setWishlistItems(data);
        setWishlistIds(new Set(data.map(item => item._id)));
      }
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
    }
  };

  const toggleWishlist = async (artworkId) => {
    if (!session?.user) {
      toast.error("Please sign in to manage your wishlist");
      return;
    }

    // Optimistic UI update
    const newIds = new Set(wishlistIds);
    const isAdding = !newIds.has(artworkId);
    
    if (isAdding) {
      newIds.add(artworkId);
    } else {
      newIds.delete(artworkId);
    }
    setWishlistIds(newIds);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/api/wishlist/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ artworkId })
      });

      if (!res.ok) {
        throw new Error("Toggle failed");
      }
      
      const data = await res.json();
      if (data.isWishlisted) {
        toast.success("Added to wishlist");
      } else {
        toast.success("Removed from wishlist");
      }
      
      // Refresh full objects if needed (e.g., if we just added it and are on the wishlist page)
      fetchWishlist();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update wishlist");
      // Revert optimistic update
      fetchWishlist();
    }
  };

  const isWishlisted = (id) => wishlistIds.has(id);

  return (
    <WishlistContext.Provider value={{ wishlistItems, isWishlisted, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
