import { Orbitron, Inter } from "next/font/google";
import "./globals.css";

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

export const metadata = {
  title: "AI Vision",
  description:
    "Real-time AI object detection and image recognition using TensorFlow.js",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${inter.variable} h-full scroll-smooth`}
    >
      <body
        className="
          min-h-screen
          bg-black
          text-white
          font-[family-name:var(--font-inter)]
          antialiased
          overflow-x-hidden
          overflow-y-auto
        "
      >
        <main className="min-h-screen w-full">
          {children}
        </main>
      </body>
    </html>
  );
}