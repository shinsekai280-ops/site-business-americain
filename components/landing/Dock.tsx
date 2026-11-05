"use client";

import { useEffect, useState } from "react";

/** Sticky bar at the bottom of the screen, appears after scrolling. */
export function Dock({ fromPrice }: { fromPrice: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      className={`fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 transition duration-500 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <div className="flex items-center gap-4 rounded-full border border-white/70 bg-white/85 py-2 pl-6 pr-2 shadow-float backdrop-blur-xl">
        <p className="hidden text-[14px] sm:block">
          <strong className="font-semibold">Your brand in 48 hours</strong>
          <span className="text-muted"> · from {fromPrice} · Money-back guarantee</span>
        </p>
        <a href="#pricing" className="rounded-full bg-ink px-5 py-2.5 text-[14px] font-medium text-white shadow-pill transition hover:bg-black">
          Start my brand
        </a>
      </div>
    </div>
  );
}
