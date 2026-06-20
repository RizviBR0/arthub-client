import React from "react";
import Link from "next/link";
import { FiInstagram, FiTwitter, FiGithub, FiMail } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-[#3d3029] text-white pt-16 pb-8 border-t-[8px] border-[#b07c5b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <span className="font-serif text-3xl font-bold tracking-tight text-white flex items-center">
                Art<span className="text-[#c9a88a]">Hub</span>
              </span>
            </Link>
            <p className="text-[#a89888] text-sm leading-relaxed mb-6">
              The premier marketplace for contemporary artists and collectors. Discover, buy, and sell exceptional digital and physical artworks.
            </p>
            <div className="flex items-center gap-4 text-[#d4c3b3]">
              <a href="#" className="hover:text-white transition-colors p-2 bg-[#5a4d42] rounded-full"><FiInstagram size={18} /></a>
              <a href="#" className="hover:text-white transition-colors p-2 bg-[#5a4d42] rounded-full"><FiTwitter size={18} /></a>
              <a href="#" className="hover:text-white transition-colors p-2 bg-[#5a4d42] rounded-full"><FiGithub size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-6 text-[#e8ddd1]">Explore</h4>
            <ul className="space-y-3 text-sm text-[#a89888]">
              <li><Link href="/artworks" className="hover:text-[#c9a88a] transition-colors">Discover Artworks</Link></li>
              <li><Link href="/artists" className="hover:text-[#c9a88a] transition-colors">Top Artists</Link></li>
              <li><Link href="/categories" className="hover:text-[#c9a88a] transition-colors">Categories</Link></li>
              <li><Link href="/pricing" className="hover:text-[#c9a88a] transition-colors">Pricing & Tiers</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-6 text-[#e8ddd1]">Support</h4>
            <ul className="space-y-3 text-sm text-[#a89888]">
              <li><Link href="/faq" className="hover:text-[#c9a88a] transition-colors">Help Center</Link></li>
              <li><Link href="/shipping" className="hover:text-[#c9a88a] transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/terms" className="hover:text-[#c9a88a] transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-[#c9a88a] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-6 text-[#e8ddd1]">Stay Inspired</h4>
            <p className="text-[#a89888] text-sm mb-4">
              Subscribe to our newsletter for exclusive interviews, new arrivals, and special promotions.
            </p>
            <form className="flex gap-2">
              <div className="relative flex-1">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a89888]" />
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full pl-10 pr-4 py-2.5 bg-[#5a4d42] border border-[#7a6e64] rounded-lg text-white text-sm focus:outline-none focus:border-[#c9a88a]"
                />
              </div>
              <button 
                type="submit" 
                className="px-4 py-2.5 bg-[#b07c5b] text-white rounded-lg text-sm font-medium hover:bg-[#9e6c4d] transition-colors shrink-0"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-[#5a4d42] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#a89888] text-sm">
            © {new Date().getFullYear()} ArtHub Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-[#a89888] text-sm">
            <span>Made with precision</span>
            <span>Based globally</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
