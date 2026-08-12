/**
 * React Query keys live in their own module: `AuthContext` and `useFavorites`
 * need the same keys, and importing one from the other would create a cycle.
 */
export const FAVORITES_QUERY_KEY = ["favorites"] as const;
export const SESSION_QUERY_KEY = ["session"] as const;
