import { Orbitron, Inter } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "AI Object Detection",
  description: "Real-time object detection using TensorFlow.js and COCO-SSD",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${inter.variable}`}
    >
      <body className="bg-black text-white font-[family-name:var(--font-inter)] antialiased overflow-hidden">
        {children}
      </body>
    </html>
  );
}