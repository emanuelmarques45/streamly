/**
 * URL base do site, sempre sem barra no final.
 *
 * `APP_URL` pode vir com barra final do painel de deploy — concatenar `/rota`
 * direto gerava `https://site//rota` no sitemap, no robots e no metadataBase.
 */
export const SITE_URL = (
  process.env.APP_URL ?? "http://localhost:5173"
).replace(/\/+$/, "");
