const baseURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export const getArtistArtworks = async () => {
  const res = await fetch(`${baseURL}/api/artist/artworks`, {
    credentials: "include"
  });
  
  if (!res.ok) {
    throw new Error("Failed to fetch artist artworks");
  }
  
  const data = await res.json();
  return data;
};

export const getArtistSales = async () => {
  const res = await fetch(`${baseURL}/api/artist/sales`, {
    credentials: "include"
  });
  
  if (!res.ok) {
    throw new Error("Failed to fetch artist sales");
  }
  
  const data = await res.json();
  return data;
};
