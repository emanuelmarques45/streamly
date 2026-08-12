/**
 * Chaves do react-query em um módulo próprio: `AuthContext` e `useFavorites`
 * precisam das mesmas chaves e importar uma da outra criaria um ciclo.
 */
export const FAVORITES_QUERY_KEY = ["favorites"] as const;
export const SESSION_QUERY_KEY = ["session"] as const;
