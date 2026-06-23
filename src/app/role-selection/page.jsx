"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function RoleSelectionPage() {
  const { data: session, isPending } = authClient.useSession();
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // If they already have a role, send them away
    if (!isPending && session?.user?.role) {
      router.push("/");
    }
    // If not logged in, send to signin
    if (!isPending && !session) {
      router.push("/signin");
    }
  }, [session, isPending, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${""}/api/user/set-initial-role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.msg || "Failed to set role");
      }

      toast.success("Account finalized successfully!");
      
      // Force token/session refresh so the new role is applied in the client
      await authClient.updateUser({ name: session?.user?.name || "User" });
      
      // Redirect to homepage via hard reload to absolutely guarantee fresh session state
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isPending || (session && session.user.role)) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#f5f0eb] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-[#3d3029] mb-2">Almost there!</h2>
          <p className="text-[#7a6e64]">
            Please complete your profile by selecting how you want to use ArtHub.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-8">
            <button
              type="button"
              onClick={() => setRole("user")}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                role === "user"
                  ? "border-[#b07c5b] bg-[#fdfaf7]"
                  : "border-[#e8ddd1] hover:border-[#d4c3b3]"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className={`font-bold text-lg ${role === "user" ? "text-[#b07c5b]" : "text-[#3d3029]"}`}>
                    Buyer
                  </h3>
                  <p className="text-sm text-[#7a6e64] mt-1">
                    I want to discover and purchase amazing artworks.
                  </p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${role === "user" ? "border-[#b07c5b]" : "border-[#d4c3b3]"}`}>
                  {role === "user" && <div className="w-3 h-3 bg-[#b07c5b] rounded-full" />}
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole("artist")}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                role === "artist"
                  ? "border-[#b07c5b] bg-[#fdfaf7]"
                  : "border-[#e8ddd1] hover:border-[#d4c3b3]"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className={`font-bold text-lg ${role === "artist" ? "text-[#b07c5b]" : "text-[#3d3029]"}`}>
                    Artist
                  </h3>
                  <p className="text-sm text-[#7a6e64] mt-1">
                    I want to showcase my portfolio and sell my artworks.
                  </p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${role === "artist" ? "border-[#b07c5b]" : "border-[#d4c3b3]"}`}>
                  {role === "artist" && <div className="w-3 h-3 bg-[#b07c5b] rounded-full" />}
                </div>
              </div>
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#b07c5b] text-white rounded-lg font-medium hover:bg-[#9e6c4d] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Complete Setup"}
          </button>
        </form>
      </div>
    </div>
  );
}
