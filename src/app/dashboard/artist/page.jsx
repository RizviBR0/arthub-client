"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FiPlus, FiEdit2, FiTrash2, FiDollarSign, FiTrendingUp } from "react-icons/fi";
import ConfirmModal from "@/components/ConfirmModal";
import toast from "react-hot-toast";

export default function ArtistDashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModalState, setConfirmModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    isDanger: true,
    onConfirm: () => {}
  });

  const closeConfirmModal = () => {
    setConfirmModalState(prev => ({ ...prev, isOpen: false }));
  };

  const totalArtworks = artworks.length;
  const soldArtworks = artworks.filter(a => a.status === "sold").length;
  const totalEarnings = soldArtworks * 450; // Mock earnings

  useEffect(() => {
    if (isPending) return;
    if (!session || session.user.role !== "artist") {
      toast.error("Unauthorized access");
      router.push("/");
      return;
    }

    const fetchMyArtworks = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/api/artist/artworks`, {
          headers: {
                                                                                        },
                    credentials: "include"
        });
        
                if (!res.ok) {
           throw new Error("Failed to fetch");
        }
        
        const data = await res.json();
        setArtworks(data);
      } catch (error) {
        console.error("Failed to fetch artworks:", error);
        setArtworks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyArtworks();
  }, [session, isPending, router]);

  const handleDelete = async (id) => {
    setConfirmModalState({
      isOpen: true,
      title: "Delete Artwork",
      message: "Delete this artwork?",
      confirmText: "Delete",
      isDanger: true,
      onConfirm: async () => {
        setArtworks(prev => prev.filter(a => a._id !== id));
        toast.success("Artwork deleted!");
        
        try {
          await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/api/artworks/${id}`, {
             method: "DELETE",
             credentials: "include"
           });
        } catch (err) {
           console.error(err);
        }
      }
    });
  };

  if (isPending || loading) {
    return <div className="p-8 animate-pulse flex space-x-4"><div className="flex-1 space-y-6 py-1"><div className="h-2 bg-slate-200 rounded"></div><div className="space-y-3"><div className="grid grid-cols-3 gap-4"><div className="h-2 bg-slate-200 rounded col-span-2"></div><div className="h-2 bg-slate-200 rounded col-span-1"></div></div><div className="h-2 bg-slate-200 rounded"></div></div></div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#3d3029]">Artist Dashboard</h1>
          <p className="text-[#7a6e64] mt-1">Welcome back, {session?.user?.name}. Manage your portfolio and sales.</p>
        </div>
        <Link 
          href="/dashboard/artist/add"
          className="flex items-center gap-2 bg-[#b07c5b] hover:bg-[#9e6c4d] text-white px-6 py-2.5 rounded-md font-medium transition-colors shadow-sm self-start md:self-auto"
        >
          <FiPlus size={18} /> Add New Artwork
        </Link>
      </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl border border-[#e8ddd1] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-[#faf5ef] rounded-full flex items-center justify-center text-[#b07c5b]">
            <FiPlus size={24} />
          </div>
          <div>
            <p className="text-sm text-[#7a6e64] font-medium">Total Artworks</p>
            <p className="text-2xl font-bold text-[#3d3029]">{totalArtworks}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#e8ddd1] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-[#faf5ef] rounded-full flex items-center justify-center text-[#b07c5b]">
            <FiTrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-[#7a6e64] font-medium">Artworks Sold</p>
            <p className="text-2xl font-bold text-[#3d3029]">{soldArtworks}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-[#e8ddd1] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-[#faf5ef] rounded-full flex items-center justify-center text-[#b07c5b]">
            <FiDollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-[#7a6e64] font-medium">Total Earnings</p>
            <p className="text-2xl font-bold text-[#3d3029]">${totalEarnings.toLocaleString()}</p>
          </div>
        </div>
      </div>

            <div className="bg-white rounded-xl border border-[#e8ddd1] shadow-sm overflow-hidden mb-12">
        <div className="px-6 py-5 border-b border-[#e8ddd1]">
          <h2 className="text-xl font-bold text-[#3d3029] font-serif">Manage Portfolio</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#faf8f5] text-[#7a6e64] text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Artwork</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8ddd1]">
              {artworks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-[#7a6e64]">
                    You haven&apos;t uploaded any artworks yet.
                  </td>
                </tr>
              ) : (
                artworks.map((art) => (
                  <tr key={art._id} className="hover:bg-[#faf8f5] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 relative rounded overflow-hidden bg-[#ece5de] shrink-0 border border-[#e8ddd1]">
                          <Image src={art.image} alt={art.title} fill className="object-cover" />
                        </div>
                        <span className="font-semibold text-[#3d3029]">{art.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#5a4d42] capitalize">{art.category}</td>
                    <td className="px-6 py-4 text-[#3d3029] font-medium">${art.price.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-sm uppercase ${
                        art.status === "sold" ? "bg-red-50 text-red-600 border border-red-100" : "bg-green-50 text-green-600 border border-green-100"
                      }`}>
                        {art.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {art.status === "sold" ? (
                          <span className="text-xs text-[#a89888] italic mr-2">No actions</span>
                        ) : (
                          <>
                            <Link 
                              href={`/dashboard/artist/edit/${art._id}`}
                              className="p-2 text-[#7a6e64] hover:text-[#b07c5b] hover:bg-[#faf5ef] rounded transition-colors"
                              title="Edit"
                            >
                              <FiEdit2 size={18} />
                            </Link>
                            <button 
                              onClick={() => handleDelete(art._id)}
                              className="p-2 text-[#7a6e64] hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                              title="Delete"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

            <div className="bg-white rounded-xl border border-[#e8ddd1] shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-[#e8ddd1]">
          <h2 className="text-xl font-bold text-[#3d3029] font-serif">Recent Sales History</h2>
        </div>
        <div className="px-6 py-12 text-center text-[#7a6e64]">
          <p>Sales tracking and transaction history will be available after Stripe integration.</p>
        </div>
      </div>
      <ConfirmModal {...confirmModalState} onClose={closeConfirmModal} />
    </div>
  );
}
