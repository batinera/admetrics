import { createRouter, createWebHistory } from "vue-router";
import { apiUrl } from "../utils/apiBase";

const useMock = import.meta.env.VITE_USE_MOCK === "true";

function hasIntegration() {
  return !!localStorage.getItem("admetrics_integration_id");
}

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
      meta: { guest: true },
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/RegisterView.vue"),
      meta: { guest: true },
    },
    {
      path: "/onboarding",
      name: "onboarding",
      component: () => import("../views/OnboardingView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/onboarding/meta-callback",
      name: "meta-callback",
      component: () => import("../views/MetaCallbackView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/",
      name: "dashboard",
      component: () => import("../views/DashboardView.vue"),
      meta: { requiresAuth: true, requiresIntegration: true },
    },
  ],
});

router.beforeEach(async (to) => {
  if (useMock) {
    if (
      to.path === "/login" ||
      to.path === "/register" ||
      to.path === "/onboarding" ||
      to.path.startsWith("/onboarding/")
    ) {
      return { name: "dashboard" };
    }
    return true;
  }

  const r = await fetch(apiUrl("/auth/me"), { credentials: "include" });
  const data = await r.json().catch(() => ({}));
  const loggedIn = !!data.user;

  if (to.meta.requiresAuth && !loggedIn) {
    return {
      name: "login",
      query: { redirect: to.fullPath },
    };
  }

  if (to.meta.guest && loggedIn) {
    if (useMock || hasIntegration()) {
      return { name: "dashboard" };
    }
    return { name: "onboarding" };
  }

  if (to.meta.requiresIntegration && !useMock && !hasIntegration()) {
    return { name: "onboarding" };
  }

  return true;
});
