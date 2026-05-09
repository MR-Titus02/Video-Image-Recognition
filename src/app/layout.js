import { Orbitron, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${inter.variable} h-full scroll-smooth`}>
      <body className="min-h-screen bg-black text-white antialiased overflow-x-hidden overflow-y-auto">

        <Navbar />

        <main className="min-h-screen w-full">
          {children}
        </main>

      </body>
    </html>
  );
}