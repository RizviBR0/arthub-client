

import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/ThemeProvider";
import { WishlistProvider } from "@/context/WishlistContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

import RoleGuard from "@/components/RoleGuard";

export const metadata = {
  title: "ArtHub | The Premier Artist Marketplace",
  description: "Discover, buy, and sell exceptional digital and physical artworks.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-[#faf8f5] text-[#3d3029] min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <WishlistProvider>
            <Toaster position="top-center" toastOptions={{
              style: {
                background: '#3d3029',
                color: '#fff',
                borderRadius: '8px',
              },
            }} />
            <Navbar />
            <main className="grow">
              <RoleGuard>
                {children}
              </RoleGuard>
            </main>
            <Footer />
          </WishlistProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
