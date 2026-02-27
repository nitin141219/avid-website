"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const SideContactPopup = dynamic(() => import("./SideContactPopup"), {
  ssr: false,
});

export default function LazySideContactPopup() {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (shouldRender) return;

    const reveal = () => setShouldRender(true);

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let idleId: number | undefined;

    const opts: AddEventListenerOptions = { once: true, passive: true };
    window.addEventListener("pointerdown", reveal, opts);
    window.addEventListener("keydown", reveal, opts);
    window.addEventListener("touchstart", reveal, opts);

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(reveal, { timeout: 1500 });
    } else {
      timeoutId = setTimeout(reveal, 1200);
    }

    return () => {
      window.removeEventListener("pointerdown", reveal);
      window.removeEventListener("keydown", reveal);
      window.removeEventListener("touchstart", reveal);
      if (idleId !== undefined && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [shouldRender]);

  if (!shouldRender) return null;

  return <SideContactPopup />;
}
