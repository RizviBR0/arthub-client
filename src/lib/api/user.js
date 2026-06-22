const baseURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export const getUserPurchases = async () => {
  const res = await fetch(`${baseURL}/api/user/purchases`, {
    credentials: "include"
  });
  
  if (!res.ok) {
    throw new Error("Failed to fetch user purchases");
  }
  
  const data = await res.json();
  return data;
};

export const getUserAuthMethods = async () => {
  const res = await fetch(`${baseURL}/api/user/auth-methods`, {
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to fetch auth methods");
  return res.json();
};

export const getUserDetails = async () => {
  const res = await fetch(`${baseURL}/api/user/details`, {
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to fetch user details");
  return res.json();
};
