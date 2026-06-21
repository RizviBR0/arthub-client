"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiBarChart2 } from "react-icons/fi";
import toast from "react-hot-toast";
import {
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const COLORS = ["#b07c5b", "#c9a88a", "#7a6e64", "#3d3029", "#d4c3b3", "#9e6c4d"];

const API = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#e8ddd1] rounded-lg shadow-lg px-4 py-3">
        <p className="text-sm font-medium text-[#3d3029]">{label}</p>
        {payload.map((entry, idx) => (
          <p key={idx} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.name === "revenue" ? `$${entry.value}` : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [chartData, setChartData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isPending) return;
    if (!session || session.user.role !== "admin") {
      router.push("/");
      toast.error("Access denied. Admin only.");
      return;
    }

    const fetchData = async () => {
      try {
        const [chartsRes, analyticsRes] = await Promise.all([
          fetch(`${API}/api/admin/analytics/charts`, { credentials: "include" }),
          fetch(`${API}/api/admin/analytics`, { credentials: "include" }),
        ]);

        if (chartsRes.ok) setChartData(await chartsRes.json());
        if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, isPending, router]);

  if (isPending || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-[#ece5de] rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (<div key={i} className="h-72 bg-[#ece5de] rounded-xl"></div>))}
          </div>
        </div>
      </div>
    );
  }

  if (session?.user?.role !== "admin") return null;

  if (session?.user?.role !== "admin") return null;

  const hasData = chartData && (
    chartData.categoryData?.length > 0 ||
    chartData.roleData?.length > 0 ||
    chartData.monthlyArtworks?.length > 0 ||
    chartData.monthlyTransactions?.length > 0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 min-h-screen">
      <Link
        href="/dashboard/admin"
        className="flex items-center gap-2 text-[#7a6e64] hover:text-[#b07c5b] transition-colors mb-8 font-medium w-fit"
      >
        <FiArrowLeft /> Back to Admin Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#3d3029] flex items-center gap-3">
          <FiBarChart2 className="text-[#b07c5b]" /> Analytics & Insights
        </h1>
        <p className="text-[#7a6e64] mt-1">Visual breakdown of platform performance.</p>
      </div>

      {!hasData ? (
        <div className="bg-white rounded-xl border border-[#e8ddd1] shadow-sm p-16 text-center">
          <FiBarChart2 size={48} className="mx-auto mb-4 text-[#d4c3b3]" />
          <h3 className="text-xl font-serif font-bold text-[#3d3029] mb-2">No Data Yet</h3>
          <p className="text-[#7a6e64] max-w-md mx-auto">
            Charts will appear once users start adding artworks and making transactions on the platform.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Distribution (Pie Chart) */}
          {chartData.categoryData?.length > 0 && (
            <div className="bg-white rounded-xl border border-[#e8ddd1] shadow-sm p-6">
              <h3 className="text-lg font-bold text-[#3d3029] mb-4 font-serif">Artwork Categories</h3>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart margin={{ top: 20, right: 30, bottom: 30, left: 30 }}>
                  <Pie
                    data={chartData.categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    innerRadius={45}
                    paddingAngle={3}
                    label={({ name, value }) => `${name} (${value})`}
                    labelLine={true}
                  >
                    {chartData.categoryData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* User Roles (Pie Chart) */}
          {chartData.roleData?.length > 0 && (
            <div className="bg-white rounded-xl border border-[#e8ddd1] shadow-sm p-6">
              <h3 className="text-lg font-bold text-[#3d3029] mb-4 font-serif">User Roles</h3>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart margin={{ top: 20, right: 30, bottom: 30, left: 30 }}>
                  <Pie
                    data={chartData.roleData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    innerRadius={45}
                    paddingAngle={3}
                    label={({ name, value }) => `${name} (${value})`}
                    labelLine={true}
                  >
                    {chartData.roleData.map((_, idx) => (
                      <Cell key={idx} fill={["#b07c5b", "#7a6e64", "#9e6c4d"][idx % 3]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Price Distribution (Bar Chart) */}
          {chartData.priceRanges?.length > 0 && (
            <div className="bg-white rounded-xl border border-[#e8ddd1] shadow-sm p-6">
              <h3 className="text-lg font-bold text-[#3d3029] mb-4 font-serif">Price Distribution</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData.priceRanges} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8ddd1" />
                  <XAxis dataKey="range" tick={{ fill: "#7a6e64", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#7a6e64", fontSize: 12 }} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#b07c5b" radius={[6, 6, 0, 0]} name="Artworks" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Monthly Artworks (Area Chart) */}
          {chartData.monthlyArtworks?.length > 0 && (
            <div className="bg-white rounded-xl border border-[#e8ddd1] shadow-sm p-6">
              <h3 className="text-lg font-bold text-[#3d3029] mb-4 font-serif">Monthly Artworks</h3>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={chartData.monthlyArtworks} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="artworkGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#b07c5b" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#b07c5b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8ddd1" />
                  <XAxis dataKey="month" tick={{ fill: "#7a6e64", fontSize: 12 }} />
                  <YAxis tick={{ fill: "#7a6e64", fontSize: 12 }} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="artworks"
                    stroke="#b07c5b"
                    fill="url(#artworkGradient)"
                    strokeWidth={2}
                    name="Artworks"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Monthly Revenue (Area Chart) */}
          {chartData.monthlyTransactions?.length > 0 && (
            <div className="bg-white rounded-xl border border-[#e8ddd1] shadow-sm p-6 md:col-span-2">
              <h3 className="text-lg font-bold text-[#3d3029] mb-4 font-serif">Monthly Revenue & Transactions</h3>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={chartData.monthlyTransactions} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3d3029" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3d3029" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="transGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#b07c5b" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#b07c5b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8ddd1" />
                  <XAxis dataKey="month" tick={{ fill: "#7a6e64", fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fill: "#7a6e64", fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: "#7a6e64", fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3d3029"
                    fill="url(#revenueGradient)"
                    strokeWidth={2}
                    name="revenue"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="transactions"
                    stroke="#b07c5b"
                    fill="url(#transGradient)"
                    strokeWidth={2}
                    name="transactions"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
