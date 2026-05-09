"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isRecog = pathname === "/";
  const isImage = pathname === "/recog";

  return (
    <nav className="fixed top-4 right-4 z-50">
      <div className="flex gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2">

        {/* Show Image button only if you're in video page */}
        {isRecog && (
          <Link
            href="/recog"
            className="px-4 py-2 text-sm rounded-xl bg-cyan-400 text-black font-bold hover:opacity-90 transition"
          >
            Image
          </Link>
        )}

        {/* Show Video button only if you're in image page */}
        {isImage && (
          <Link
            href="/"
            className="px-4 py-2 text-sm rounded-xl bg-cyan-400 text-black font-bold hover:opacity-90 transition"
          >
            Video
          </Link>
        )}

        {/* Optional fallback (if on other routes) */}
        {!isRecog && !isImage && (
          <>
            <Link
              href="/"
              className="px-4 py-2 text-sm rounded-xl bg-white/10 hover:bg-white/20 transition"
            >
              Video
            </Link>

            <Link
              href="/recog"
              className="px-4 py-2 text-sm rounded-xl bg-white/10 hover:bg-white/20 transition"
            >
              Image
            </Link>
          </>
        )}

      </div>
    </nav>
  );
}