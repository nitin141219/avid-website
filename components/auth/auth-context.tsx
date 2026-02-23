"use client";

import { useRouter } from "@/i18n/navigation";
import { createContext, useContext } from "react";

type AuthContextType = {
  user: any | null;
  isLoggedIn: boolean;
  logout: () => Promise<void>;
  refreshAuth: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  logout: async () => {},
  refreshAuth: () => {},
});

export function AuthProvider({ user, children }: { user: any | null; children: React.ReactNode }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh(); // 🔥 re-run SERVER layout
  }

  function refreshAuth() {
    router.refresh(); // 🔥 re-fetch getAuthUser()
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
