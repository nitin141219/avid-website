"use client";

import { useEffect, useState } from "react";
import { Toaster } from "@/components/AvidToast";
import TopLoader from "@/components/top-loader/Toploader";
import ThirdPartyCookie from "./Cookie";

export default function DeferredClientWidgets() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let idleId: number | undefined;

    const load = () => setReady(true);

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(load, { timeout: 1200 });
    } else {
      timeoutId = setTimeout(load, 800);
    }

    return () => {
      if (idleId !== undefined && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  if (!ready) return null;

  return (
    <>
      <TopLoader />
      <Toaster />
      <ThirdPartyCookie />
    </>
  );
}
