"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  FiMenu,
  FiX,
  FiChevronDown,
  FiLogOut,
  FiUser,
  FiGrid,
  FiCheckCircle,
  FiHeart,
  FiSun,
  FiMoon
} from "react-icons/fi";
import { useTheme } from "next-themes";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { data: session } = authClient.useSession();
  const user = session?.user;
  const pathname = usePathname();
  const router = useRouter();

  const [dbUser, setDbUser] = useState(null);

  // Calculate subscription and limits
  const tier = dbUser?.subscriptionTier || user?.subscriptionTier || "free";
  const count = typeof dbUser?.purchaseCount === "number" ? dbUser.purchaseCount : (user?.purchaseCount || 0);
  let limit = 3;
  if (tier === "pro") limit = 9;
  if (tier === "premium") limit = "∞";

  const remaining = limit === "∞" ? "Unlimited" : Math.max(0, limit - count);

  // Navbar is now globally visible as requested

  // For dark mode
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    const fetchDbUser = async () => {
      try {
        const { getUserDetails } = await import("@/lib/api/user");
        const details = await getUserDetails();
        setDbUser(details);
      } catch (error) {
        console.error("Error fetching user details in Navbar:", error);
      }
    };

    if (user) {
      fetchDbUser();
    } else {
      setDbUser(null);
    }
  }, [user]);

  const handleSignOut = async () => {
    await authClient.signOut();
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    toast.success("Logged out successfully");
    window.location.href = "/";
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Browse Artworks", href: "/artworks" },
  ];

  // Only show Pricing to unauthenticated users or buyers
  if (!user || user.role === "user") {
    navLinks.push({ label: "Pricing", href: "/pricing" });
  }

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const getDashboardHref = () => {
    if (!user) return "/signin";
    if (user.role === "admin") return "/dashboard/admin";
    if (user.role === "artist") return "/dashboard/artist";
    return "/dashboard/user";
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#e8ddd1] bg-[#faf8f5]/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Left — Logo + Desktop Nav */}
        <div className="flex items-center gap-8">
          {/* Hamburger (Mobile) */}
          <button
            className="md:hidden text-[#3d3029] hover:text-[#b07c5b] transition-colors cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <h1
              className="text-2xl font-bold text-[#3d3029]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              ArtHub
            </h1>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(link.href)
                      ? "text-[#b07c5b] bg-[#b07c5b]/10"
                      : "text-[#5a4d42] hover:text-[#b07c5b] hover:bg-[#b07c5b]/5"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — Auth */}
        <div className="flex items-center gap-3">
          
          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full text-[#5a4d42] hover:bg-[#e8ddd1] transition-colors dark:text-gray-300 dark:hover:bg-gray-700"
              aria-label="Toggle Dark Mode"
            >
              {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
          )}

          {!user && (
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/signin"
                className="px-4 py-2 text-sm font-medium text-[#5a4d42] hover:text-[#b07c5b] transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-linear-to-r from-[#c9a88a] to-[#b07c5b] hover:from-[#b8977a] hover:to-[#9e6c4d] transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Sign Up
              </Link>
            </div>
          )}

          {user && (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-full border border-[#e8ddd1] hover:border-[#c9a88a] bg-white hover:bg-[#fdfaf7] transition-all duration-200 cursor-pointer"
              >
                {/* Avatar */}
                <div className="relative w-8 h-8 rounded-full bg-linear-to-br from-[#c9a88a] to-[#b07c5b] flex items-center justify-center text-white text-sm font-bold overflow-hidden">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    user.name?.charAt(0)?.toUpperCase() || "U"
                  )}
                </div>
                <span className="hidden sm:block text-sm font-medium text-[#3d3029] max-w-25 truncate">
                  {user.name?.split(" ")[0]}
                </span>
                <FiChevronDown
                  size={14}
                  className={`text-[#7a6e64] transition-duration-200 ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-[#e8ddd1] shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User Info */}
                    <div className="px-3 py-3 border-b border-[#f0e8df]">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full bg-linear-to-br from-[#c9a88a] to-[#b07c5b] flex items-center justify-center text-white text-base font-bold overflow-hidden shrink-0">
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt={user.name}
                              fill
                              className="object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            user.name?.charAt(0)?.toUpperCase() || "U"
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#3d3029] truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-[#a89888] truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <span className="inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#b07c5b] bg-[#b07c5b]/10 rounded-full">
                          {user.role === "user" ? "buyer" : user.role}
                        </span>

                        {(!user.role || user.role === "user") && (
                          <span
                            className={`inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full ${
                              tier === "free"
                                ? "text-[#7a6e64] bg-[#ece5de]"
                                : tier === "pro"
                                  ? "text-blue-700 bg-blue-100"
                                  : "text-purple-700 bg-purple-100"
                            }`}
                          >
                            {tier}
                            {tier !== "free" && (
                              <FiCheckCircle size={10} className="ml-0.5" />
                            )}
                          </span>
                        )}
                      </div>

                      {(!user.role || user.role === "user") && (
                        <div className="mt-3 bg-[#faf8f5] rounded-lg p-2 border border-[#e8ddd1]">
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-[11px] font-medium text-[#7a6e64]">
                              Purchase Quota
                            </span>
                            <span className="text-[11px] font-bold text-[#3d3029]">
                              {remaining} left
                            </span>
                          </div>
                          {limit !== "Unlimited" && (
                            <div className="w-full bg-[#ece5de] rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-1.5 rounded-full transition-all duration-500 ${count >= limit ? "bg-red-500" : "bg-[#b07c5b]"}`}
                                style={{
                                  width: `${Math.min(100, (count / limit) * 100)}%`,
                                }}
                              ></div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        href={getDashboardHref()}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#5a4d42] hover:bg-[#faf5ef] transition-colors"
                      >
                        <FiGrid size={16} />
                        Dashboard
                      </Link>
                      {(!user.role || user.role === "user") && (
                        <Link
                          href="/wishlist"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#5a4d42] hover:bg-[#faf5ef] transition-colors"
                        >
                          <FiHeart size={16} />
                          My Wishlist
                        </Link>
                      )}
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#5a4d42] hover:bg-[#faf5ef] transition-colors"
                      >
                        <FiUser size={16} />
                        Profile
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-[#f0e8df] py-1">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <FiLogOut size={16} />
                        Log Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-[#e8ddd1] md:hidden bg-[#faf8f5]">
          <ul className="flex flex-col gap-1 p-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.href)
                      ? "text-[#b07c5b] bg-[#b07c5b]/10"
                      : "text-[#5a4d42] hover:text-[#b07c5b] hover:bg-[#b07c5b]/5"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {user && (
              <li>
                <Link
                  href={getDashboardHref()}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    pathname.includes("dashboard")
                      ? "text-[#b07c5b] bg-[#b07c5b]/10"
                      : "text-[#5a4d42] hover:text-[#b07c5b] hover:bg-[#b07c5b]/5"
                  }`}
                >
                  Dashboard
                </Link>
              </li>
            )}

            {/* Mobile Auth */}
            {!user && (
              <li className="mt-3 flex flex-col gap-2 border-t border-[#e8ddd1] pt-4">
                <Link
                  href="/signin"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-lg text-sm font-medium text-[#5a4d42] hover:text-[#b07c5b] hover:bg-[#b07c5b]/5 transition-all"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-lg text-sm font-semibold text-center text-white bg-linear-to-r from-[#c9a88a] to-[#b07c5b] hover:from-[#b8977a] hover:to-[#9e6c4d] transition-all"
                >
                  Sign Up
                </Link>
              </li>
            )}

            {user && (
              <li className="mt-3 border-t border-[#e8ddd1] pt-4">
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <FiLogOut size={16} />
                  Log Out
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
