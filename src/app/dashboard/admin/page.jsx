"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  FiUsers, FiShield, FiStar, FiUser, FiImage, FiDollarSign,
  FiTrash2, FiTrendingUp, FiBarChart2, FiChevronDown
} from "react-icons/fi";
import ConfirmModal from "@/components/ConfirmModal";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [analytics, setAnalytics] = useState(null);

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
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const API = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

  useEffect(() => {
    if (isPending) return;
    if (!session || session.user.role !== "admin") {
      router.push("/");
      toast.error("Access denied. Admin only.");
      return;
    }
    fetchAll();
  }, [session, isPending, router]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [usersRes, artworksRes, transactionsRes, analyticsRes] = await Promise.all([
        fetch(`${API}/api/admin/users`, { credentials: "include" }),
        fetch(`${API}/api/admin/artworks`, { credentials: "include" }),
        fetch(`${API}/api/admin/transactions`, { credentials: "include" }),
        fetch(`${API}/api/admin/analytics`, { credentials: "include" }),
      ]);

      if (usersRes.ok) setUsers(await usersRes.json());
      if (artworksRes.ok) setArtworks(await artworksRes.json());
      if (transactionsRes.ok) setTransactions(await transactionsRes.json());
      if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    setConfirmModalState({
      isOpen: true,
      title: "Change User Role",
      message: `Change this user's role to "${newRole}"?`,
      confirmText: "Update Role",
      isDanger: false,
      onConfirm: async () => {
        setUpdatingId(userId);
        const toastId = toast.loading("Updating role...");
        try {
          const res = await fetch(`${API}/api/admin/users/${userId}/role`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ role: newRole }),
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.msg || "Failed to update role");
          }
          setUsers(users.map((u) => ((u.id || u._id) === userId ? { ...u, role: newRole } : u)));
          toast.success(`Role updated to ${newRole}`, { id: toastId });
        } catch (error) {
          toast.error(error.message, { id: toastId });
        } finally {
          setUpdatingId(null);
        }
      }
    });
  };

  const handleDeleteArtwork = async (artworkId) => {
    setConfirmModalState({
      isOpen: true,
      title: "Delete Artwork",
      message: "Permanently delete this artwork?",
      confirmText: "Delete",
      isDanger: true,
      onConfirm: async () => {
        const toastId = toast.loading("Deleting artwork...");
        try {
          const res = await fetch(`${API}/api/admin/artworks/${artworkId}`, {
            method: "DELETE",
            credentials: "include",
          });
          if (!res.ok) throw new Error("Failed to delete artwork");
          setArtworks(artworks.filter((a) => a._id !== artworkId));
          toast.success("Artwork deleted", { id: toastId });
        } catch (error) {
          toast.error(error.message, { id: toastId });
        }
      }
    });
  };

  const getRoleBadge = (role) => {
    const styles = {
      admin: "bg-purple-100 text-purple-800",
      artist: "bg-[#faf5ef] text-[#b07c5b]",
      user: "bg-gray-100 text-gray-800",
    };
    const icons = { admin: <FiShield size={12} />, artist: <FiStar size={12} />, user: <FiUser size={12} /> };
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[role] || styles.user}`}>
        {icons[role] || icons.user} {role === "user" ? "Buyer" : (role?.charAt(0).toUpperCase() + role?.slice(1))}
      </span>
    );
  };

  if (isPending || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-[#ece5de] rounded w-64"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (<div key={i} className="h-24 bg-[#ece5de] rounded-xl"></div>))}
          </div>
          <div className="h-64 bg-[#ece5de] rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (session?.user?.role !== "admin") return null;

  const tabs = [
    { id: "users", label: "Users", icon: <FiUsers size={16} />, count: users.length },
    { id: "artworks", label: "Artworks", icon: <FiImage size={16} />, count: artworks.length },
    { id: "transactions", label: "Transactions", icon: <FiDollarSign size={16} />, count: transactions.length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#3d3029] flex items-center gap-3">
            <FiShield className="text-[#b07c5b]" /> Admin Dashboard
          </h1>
          <p className="text-[#7a6e64] mt-1">Manage users, artworks, and view transactions.</p>
        </div>
        <Link
          href="/dashboard/admin/analytics"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#b07c5b] text-white rounded-lg font-medium hover:bg-[#9e6c4d] transition-colors shadow-sm w-fit"
        >
          <FiBarChart2 size={16} /> View Analytics
        </Link>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total Users", value: analytics.totalUsers, icon: <FiUsers />, color: "text-blue-600 bg-blue-50" },
            { label: "Artists", value: analytics.totalArtists, icon: <FiStar />, color: "text-[#b07c5b] bg-[#faf5ef]" },
            { label: "Artworks", value: analytics.totalArtworks, icon: <FiImage />, color: "text-green-600 bg-green-50" },
            { label: "Transactions", value: analytics.totalTransactions, icon: <FiBarChart2 />, color: "text-purple-600 bg-purple-50" },
            { label: "Revenue", value: `$${analytics.totalRevenue.toLocaleString()}`, icon: <FiTrendingUp />, color: "text-emerald-600 bg-emerald-50" },
          ].map((card) => (
            <div key={card.label} className="bg-white rounded-xl border border-[#e8ddd1] p-5 shadow-sm">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${card.color}`}>
                {card.icon}
              </div>
              <p className="text-2xl font-bold text-[#3d3029]">{card.value}</p>
              <p className="text-xs text-[#7a6e64] mt-0.5">{card.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[#e8ddd1]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === tab.id
                ? "border-[#b07c5b] text-[#b07c5b]"
                : "border-transparent text-[#7a6e64] hover:text-[#3d3029]"
            }`}
          >
            {tab.icon} {tab.label}
            <span className="text-xs bg-[#ece5de] text-[#5a4d42] px-2 py-0.5 rounded-full">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-[#e8ddd1] shadow-sm overflow-hidden">
        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#faf8f5] border-b border-[#e8ddd1] text-[#7a6e64] text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                  <th className="px-6 py-4 font-medium text-right">Change Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8ddd1]">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center text-[#7a6e64]">No users found.</td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id || u._id} className="hover:bg-[#faf8f5] transition-colors">
                      <td className="px-6 py-4 font-medium text-[#3d3029]">{u.name}</td>
                      <td className="px-6 py-4 text-[#5a4d42] text-sm">{u.email}</td>
                      <td className="px-6 py-4">{getRoleBadge(u.role || "user")}</td>
                      <td className="px-6 py-4 text-[#7a6e64] text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="relative inline-block w-full sm:w-auto">
                          <select
                            className="appearance-none w-full text-sm border border-[#d4c3b3] rounded-md px-2 py-1.5 pr-8 focus:outline-none focus:border-[#b07c5b] bg-white text-[#5a4d42]"
                            value={u.role || "user"}
                            onChange={(e) => handleUpdateRole(u.id || u._id, e.target.value)}
                            disabled={updatingId === (u.id || u._id) || (u.id || u._id) === session.user.id}
                          >
                            <option value="user">Buyer</option>
                            <option value="artist">Artist</option>
                            <option value="admin">Admin</option>
                          </select>
                          <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7a6e64] pointer-events-none" size={14} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Artworks Tab */}
        {activeTab === "artworks" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#faf8f5] border-b border-[#e8ddd1] text-[#7a6e64] text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Image</th>
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Artist</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8ddd1]">
                {artworks.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-16 text-center text-[#7a6e64]">No artworks found.</td>
                  </tr>
                ) : (
                  artworks.map((a) => (
                    <tr key={a._id} className="hover:bg-[#faf8f5] transition-colors">
                      <td className="px-6 py-3">
                        <div className="w-12 h-12 relative rounded-md overflow-hidden bg-[#ece5de]">
                          {a.image && (
                            <Image src={a.image} alt={a.title} fill className="object-cover" unoptimized />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-[#3d3029] max-w-[200px] truncate">{a.title}</td>
                      <td className="px-6 py-4 text-[#5a4d42] text-sm">{a.artistName || "Unknown"}</td>
                      <td className="px-6 py-4 text-[#7a6e64] text-sm capitalize">{a.category}</td>
                      <td className="px-6 py-4 text-[#3d3029] font-medium">${a.price}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          a.sold ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                        }`}>
                          {a.sold ? "Sold" : "Available"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDeleteArtwork(a._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete artwork"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#faf8f5] border-b border-[#e8ddd1] text-[#7a6e64] text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Transaction ID</th>
                  <th className="px-6 py-4 font-medium">Buyer</th>
                  <th className="px-6 py-4 font-medium">Artwork</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8ddd1]">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center text-[#7a6e64]">No transactions yet.</td>
                  </tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={t._id} className="hover:bg-[#faf8f5] transition-colors">
                      <td className="px-6 py-4 text-[#7a6e64] text-xs font-mono">
                        {t._id.toString().slice(-8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-[#3d3029] text-sm">{t.buyerName || t.buyerEmail || "N/A"}</td>
                      <td className="px-6 py-4 text-[#5a4d42] text-sm max-w-[200px] truncate">{t.artworkTitle || "N/A"}</td>
                      <td className="px-6 py-4 text-[#3d3029] font-medium">${t.amount || 0}</td>
                      <td className="px-6 py-4 text-[#7a6e64] text-sm">
                        {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          t.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {t.status || "pending"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ConfirmModal {...confirmModalState} onClose={closeConfirmModal} />
    </div>
  );
}
