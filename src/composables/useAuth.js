import { ref, computed } from "vue";
import { apiUrl } from "../utils/apiBase";

const user = ref(null);
const loading = ref(true);

async function parseJsonSafe(r) {
  try {
    return await r.json();
  } catch {
    return {};
  }
}

export async function fetchMe() {
  loading.value = true;
  try {
    const r = await fetch(apiUrl("/auth/me"), { credentials: "include" });
    const data = await parseJsonSafe(r);
    user.value = data.user || null;
  } finally {
    loading.value = false;
  }
}

export function useAuth() {
  const isAuthenticated = computed(() => !!user.value);

  async function login(email, password) {
    const r = await fetch(apiUrl("/auth/login"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await parseJsonSafe(r);
    if (!r.ok) {
      throw new Error(data.error || "Falha no login");
    }
    user.value = data.user;
    return data.user;
  }

  async function register(email, password) {
    const r = await fetch(apiUrl("/auth/register"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await parseJsonSafe(r);
    if (!r.ok) {
      throw new Error(data.error || "Falha no registo");
    }
    user.value = data.user;
    return data.user;
  }

  async function logout() {
    await fetch(apiUrl("/auth/logout"), {
      method: "POST",
      credentials: "include",
    });
    user.value = null;
    localStorage.removeItem("admetrics_integration_id");
  }

  return {
    user,
    loading,
    isAuthenticated,
    fetchMe,
    login,
    register,
    logout,
  };
}
