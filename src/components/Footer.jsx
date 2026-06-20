"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaFacebook } from "react-icons/fa";
import { BsInstagram, BsTwitter } from "react-icons/bs";
import { LiaLinkedin } from "react-icons/lia";
import { FiSend } from "react-icons/fi";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on dashboard, signin, signup pages
  if (
    pathname.includes("dashboard") ||
    pathname === "/signin" ||
    pathname === "/signup"
  ) {
    return null;
  }

  return (
    <footer className="mt-16 border-t border-[#e8ddd1] bg-[#faf8f5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block">
              <h2
                className="text-2xl font-bold text-[#3d3029]"
                style={{ fontFamily: "Georgia, serif" }}
              >
                ArtHub
              </h2>
            </Link>

            <p className="mt-3 text-sm text-[#7a6e64] leading-relaxed">
              Discover original artworks from talented artists worldwide.
              ArtHub connects art lovers with creators in a seamless
              marketplace.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <Link
                href="#"
                className="rounded-full border border-[#e8ddd1] p-2 text-[#7a6e64] transition-all hover:bg-[#b07c5b] hover:text-white hover:border-[#b07c5b]"
                aria-label="Facebook"
              >
                <FaFacebook className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="rounded-full border border-[#e8ddd1] p-2 text-[#7a6e64] transition-all hover:bg-[#b07c5b] hover:text-white hover:border-[#b07c5b]"
                aria-label="Instagram"
              >
                <BsInstagram className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="rounded-full border border-[#e8ddd1] p-2 text-[#7a6e64] transition-all hover:bg-[#b07c5b] hover:text-white hover:border-[#b07c5b]"
                aria-label="Twitter"
              >
                <BsTwitter className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="rounded-full border border-[#e8ddd1] p-2 text-[#7a6e64] transition-all hover:bg-[#b07c5b] hover:text-white hover:border-[#b07c5b]"
                aria-label="LinkedIn"
              >
                <LiaLinkedin className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#3d3029]">
              Explore
            </h3>
            <ul className="space-y-3 text-sm text-[#7a6e64]">
              <li>
                <Link
                  href="/artworks"
                  className="hover:text-[#b07c5b] transition-colors"
                >
                  Browse Artworks
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-[#b07c5b] transition-colors"
                >
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-[#b07c5b] transition-colors"
                >
                  Featured Artists
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-[#b07c5b] transition-colors"
                >
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#3d3029]">
              Support
            </h3>
            <ul className="space-y-3 text-sm text-[#7a6e64]">
              <li>
                <Link
                  href="#"
                  className="hover:text-[#b07c5b] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-[#b07c5b] transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-[#b07c5b] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-[#b07c5b] transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#3d3029]">
              Newsletter
            </h3>
            <p className="text-sm text-[#7a6e64] mb-4">
              Subscribe to get the latest art collections and exclusive offers.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex gap-2"
            >
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 text-sm border border-[#ddd3c9] rounded-lg bg-white text-[#3d3029] placeholder-[#b5a99d] focus:outline-none focus:ring-2 focus:ring-[#c9a88a] focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-lg text-white bg-gradient-to-r from-[#c9a88a] to-[#b07c5b] hover:from-[#b8977a] hover:to-[#9e6c4d] transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
                aria-label="Subscribe"
              >
                <FiSend size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-[#e8ddd1] py-6 text-center text-sm text-[#a89888] md:flex-row">
          <p>© {new Date().getFullYear()} ArtHub. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-[#b07c5b] transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-[#b07c5b] transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-[#b07c5b] transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
