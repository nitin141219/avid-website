// "use client";
// import { usePathname, useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";

// export function useHash() {
//   const [hash, setHash] = useState("");
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     const updateHash = () => setHash(window.location.hash);

//     // Initial load
//     updateHash();

//     // Detect hash changes
//     window.addEventListener("hashchange", updateHash);

//     return () => {
//       window.removeEventListener("hashchange", updateHash);
//     };
//   }, [pathname, searchParams]);

//   return hash;
// }
"use client";

import { useEffect, useState } from "react";

export function useHash() {
  // Always initialize as empty string for SSR to avoid hydration mismatch
  const [hash, setHash] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => {
      setTimeout(() => {
        setHash(window.location.hash);
      }, 0);
    };

    // initial
    update();

    // Browser events
    window.addEventListener("hashchange", update);
    window.addEventListener("popstate", update);

    // store originals
    const originalPush = history.pushState;
    const originalReplace = history.replaceState;

    const emitLocationChange = () => {
      window.dispatchEvent(new Event("locationchange"));
    };

    // patch pushState once (safe)
    history.pushState = function (...args) {
      const result = originalPush.apply(this, args);
      emitLocationChange();
      return result;
    };

    // patch replaceState once (safe)
    history.replaceState = function (...args) {
      const result = originalReplace.apply(this, args);
      emitLocationChange();
      return result;
    };

    // custom event
    window.addEventListener("locationchange", update);

    return () => {
      window.removeEventListener("hashchange", update);
      window.removeEventListener("popstate", update);
      window.removeEventListener("locationchange", update);

      // restore original functions
      history.pushState = originalPush;
      history.replaceState = originalReplace;
    };
  }, []);

  return hash;
}
