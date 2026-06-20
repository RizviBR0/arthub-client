"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { FiUsers, FiShield, FiStar, FiUser, FiMoreVertical } from "react-icons/fi";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (isPending) return;
    
    // Strict admin check
    if (!session || session.user.role !== "admin") {
      router.push("/");
      toast.error("Access denied. Admin only.");
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/api/admin/users`, {
          credentials: "include"
        });
        
        if (!res.ok) throw new Error("Failed to fetch users");
        
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast.error("Failed to load user list");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [session, isPending, router]);

  const handleUpdateRole = async (userId, newRole) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    
    setUpdatingId(userId);
    const toastId = toast.loading("Updating role...");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"}/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role: newRole })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.msg || "Failed to update role");
      }
      
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success(`Role updated to ${newRole}`, { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error(error.message, { id: toastId });
    } finally {
      setUpdatingId(null);
    }
  };

  const getRoleBadge = (role) => {
    switch(role) {
      case "admin":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"><FiShield size={12}/> Admin</span>;
      case "artist":
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#faf5ef] text-[#b07c5b]"><FiStar size={12}/> Artist</span>;
      default:
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><FiUser size={12}/> User</span>;
    }
  };

  if (isPending || loading) {
    return <div className="p-8 animate-pulse flex space-x-4"><div className="flex-1 space-y-6 py-1"><div className="h-2 bg-slate-200 rounded"></div><div className="space-y-3"><div className="h-2 bg-slate-200 rounded col-span-2"></div></div></div></div>;
  }

  // Prevent rendering anything if somehow they bypassed the redirect but aren't admin
  if (session?.user?.role !== "admin") return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#3d3029] flex items-center gap-3">
            <FiShield className="text-[#b07c5b]" /> Admin Dashboard
          </h1>
          <p className="text-[#7a6e64] mt-1">Manage platform users and their roles.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#e8ddd1] shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-[#e8ddd1] bg-[#faf8f5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiUsers className="text-[#b07c5b]" />
            <h2 className="text-lg font-bold text-[#3d3029]">Registered Users ({users.length})</h2>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#faf8f5] border-y border-[#e8ddd1] text-[#7a6e64] text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Current Role</th>
                <th className="px-6 py-4 font-medium">Join Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8ddd1]">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center text-[#7a6e64]">
                    <FiUsers size={32} className="mx-auto mb-3 opacity-50" />
                    No users found in the database.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id || u._id} className="hover:bg-[#faf8f5] transition-colors">
                    <td className="px-6 py-4 font-medium text-[#3d3029]">
                      {u.name}
                    </td>
                    <td className="px-6 py-4 text-[#5a4d42] text-sm">
                      {u.email}
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(u.role || "user")}
                    </td>
                    <td className="px-6 py-4 text-[#7a6e64] text-sm">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* Simple Role Toggles */}
                      <select 
                        className="text-sm border border-[#d4c3b3] rounded-md px-2 py-1.5 focus:outline-none focus:border-[#b07c5b] bg-white text-[#5a4d42]"
                        value={u.role || "user"}
                        onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                        disabled={updatingId === u.id || (u.id === session.user.id)}
                      >
                        <option value="user">User</option>
                        <option value="artist">Artist</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
