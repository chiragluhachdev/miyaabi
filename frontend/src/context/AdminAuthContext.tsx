"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { adminFetch } from "@/lib/adminApi";

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
    // The httpOnly cookie isn't readable from JS — ask the server who we are.
    adminFetch<{ admin: Admin }>("/auth/me")
      .then((d) => setAdmin(d.admin))
      .catch(() => setAdmin(null))
      .finally(() => setReady(true));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await adminFetch<{ admin: Admin }>("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    setAdmin(data.admin);
  }, []);

  const logout = useCallback(async () => {
    await adminFetch("/auth/logout", { method: "POST" }).catch(() => {});
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
