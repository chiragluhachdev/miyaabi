"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import {
  adminFetch,
  getToken,
  setToken,
  clearToken,
} from "@/lib/adminApi";

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  admin: Admin | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const Ctx = createContext<AuthState | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setReady(true);
      return;
    }
    adminFetch<{ admin: Admin }>("/auth/me")
      .then((d) => setAdmin(d.admin))
      .catch(() => clearToken())
      .finally(() => setReady(true));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await adminFetch<{ token: string; admin: Admin }>("/auth/login", {
      method: "POST",
      auth: false,
      body: { email, password },
    });
    setToken(data.token);
    setAdmin(data.admin);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setAdmin(null);
  }, []);

  return (
    <Ctx.Provider value={{ admin, ready, login, logout }}>{children}</Ctx.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
