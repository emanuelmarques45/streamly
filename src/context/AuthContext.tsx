"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, type User } from "@/services/auth";
import { FAVORITES_QUERY_KEY, SESSION_QUERY_KEY } from "@/lib/queryKeys";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  // The session becomes a query like any other: no useState + useEffect, and
  // requests are deduped across every component that reads the user.
  const { data, isLoading } = useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: async ({ signal }) => {
      const res = await getMe({ signal });
      return res.ok ? res.data : null;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const refreshUser = useCallback(async () => {
    // Signing in or out changes who the cached favorites belong to.
    queryClient.removeQueries({ queryKey: FAVORITES_QUERY_KEY });
    await queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEY });
  }, [queryClient]);

  const value = useMemo(
    () => ({ user: data ?? null, loading: isLoading, refreshUser }),
    [data, isLoading, refreshUser]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
