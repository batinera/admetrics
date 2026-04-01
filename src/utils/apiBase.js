/**
 * Base URL for API requests. Empty in dev → same origin + proxy do Vite.
 * Em produção com API noutro host: VITE_API_BASE_URL=https://api.teudominio.com
 */
export function apiUrl(path) {
  const base = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${p}` : p;
}
