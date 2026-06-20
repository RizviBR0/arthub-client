import dns from "node:dns";
dns.setServers(["1.1.1.1", "1.0.0.1"]);

import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata = {
  title: "ArtHub | The Premier Artist Marketplace",
  description: "Discover, buy, and sell exceptional digital and physical artworks.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-[#faf8f5] text-[#3d3029] min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Toaster position="top-center" toastOptions={{
            style: {
              background: '#3d3029',
              color: '#fff',
              borderRadius: '8px',
            },
          }} />
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
