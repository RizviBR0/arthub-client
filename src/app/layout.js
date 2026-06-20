import dns from "node:dns";
dns.setServers(["1.1.1.1", "1.0.0.1"]);

import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "ArtHub - Online Art Marketplace",
  description:
    "Discover & buy original artworks from talented artists worldwide. ArtHub connects art lovers with creators.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Toaster position="top-right" />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

