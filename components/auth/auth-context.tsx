"use client";

import { useRouter } from "@/i18n/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";

type AuthContextType = {
  user: any | null;
  isLoggedIn: boolean;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  logout: async () => {},
  refreshAuth: async () => {},
});

export function AuthProvider({
  user: initialUser,
  children,
}: {
  user: any | null;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState(initialUser);
  const hasHydratedRef = useRef(false);
  const authRefreshStartedRef = useRef(false);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  async function fetchCurrentUser() {
    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json().catch(() => null);
      setUser(data?.user?.data || data?.user || null);
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    if (hasHydratedRef.current) return;
    hasHydratedRef.current = true;

    if (initialUser) return;

    const startDeferredAuthRefresh = () => {
      if (authRefreshStartedRef.current) return;
      authRefreshStartedRef.current = true;
      cleanup();
      void fetchCurrentUser();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        startDeferredAuthRefresh();
      }
    };

    const interactionEvents: (keyof WindowEventMap)[] = ["pointerdown", "keydown", "focus"];
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let idleId: number | undefined;

    const cleanup = () => {
      interactionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, startDeferredAuthRefresh);
      });
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (timeoutId) clearTimeout(timeoutId);
      if (idleId !== undefined && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
    };

    interactionEvents.forEach((eventName) => {
      window.addEventListener(eventName, startDeferredAuthRefresh, { once: true, passive: true });
    });
    document.addEventListener("visibilitychange", onVisibilityChange);

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(startDeferredAuthRefresh, { timeout: 4000 });
    } else {
      timeoutId = globalThis.setTimeout(startDeferredAuthRefresh, 3000);
    }

    return cleanup;
  }, [initialUser]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.refresh(); // 🔥 re-run SERVER layout
  }

  async function refreshAuth() {
    await fetchCurrentUser();
    router.refresh();
  }

  // useEffect(() => {
  //   if (!user) logout();
  // }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, logout, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
