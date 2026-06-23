"use server";

import { headers } from "next/headers";

const baseURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export const subscription = async (data) => {
  try {
    const headersList = await headers();
    const cookieHeader = headersList.get("cookie") || "";

    const res = await fetch(`${baseURL}/api/subscription/fulfill`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieHeader, 
      },
      body: JSON.stringify(data), 
    });

    const resData = await res.json();
    if (!res.ok) {
      throw new Error(resData.msg || "Failed to fulfill subscription");
    }
    
    return resData;
  } catch (error) {
    console.error("Payment action error:", error);
    throw error;
  }
};
