"use client";
import { useEffect } from "react";
import { asset } from "@/lib/base";

/** Registers the service worker (generated into out/sw.js at build time) in production only. */
export default function SWRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    const register = () => navigator.serviceWorker.register(asset("/sw.js"), { scope: asset("/") }).catch(() => {});
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);
  return null;
}
