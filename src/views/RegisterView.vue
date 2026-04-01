<template>
  <div class="auth-page">
    <div class="auth-card card">
      <div class="auth-brand">
        <h1>AdMetrics</h1>
        <p class="auth-sub">Cria a tua conta (sem ligação obrigatória ao Facebook)</p>
      </div>
      <form class="auth-form" @submit.prevent="submit">
        <label class="auth-label">
          <span>Email</span>
          <input v-model="email" type="email" required autocomplete="email" class="auth-input" />
        </label>
        <label class="auth-label">
          <span>Senha (mín. 8 caracteres)</span>
          <input
            v-model="password"
            type="password"
            required
            minlength="8"
            autocomplete="new-password"
            class="auth-input"
          />
        </label>
        <p v-if="formError" class="auth-error">{{ formError }}</p>
        <button type="submit" class="auth-submit" :disabled="submitting">
          {{ submitting ? "A criar conta…" : "Registar" }}
        </button>
      </form>
      <p class="auth-footer">
        Já tens conta?
        <RouterLink to="/login">Entrar</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";

const useMock = import.meta.env.VITE_USE_MOCK === "true";

const email = ref("");
const password = ref("");
const formError = ref("");
const submitting = ref(false);
const { register } = useAuth();
const router = useRouter();

async function submit() {
  formError.value = "";
  submitting.value = true;
  try {
    await register(email.value, password.value);
    if (!useMock) {
      await router.replace("/onboarding");
      return;
    }
    await router.replace("/");
  } catch (e) {
    formError.value = e.message || "Erro ao registar";
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  background: var(--color-background);
}

.auth-card {
  width: 100%;
  max-width: 400px;
  padding: var(--spacing-xl);
}

.auth-brand h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.auth-sub {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  line-height: 1.4;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.auth-label {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.auth-input {
  padding: 0.625rem 0.75rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-surface-elevated);
  color: var(--color-text-primary);
  font-size: 0.9375rem;
}

.auth-input:focus {
  outline: none;
  border-color: var(--color-accent);
}

.auth-error {
  color: #f87171;
  font-size: 0.8125rem;
}

.auth-submit {
  margin-top: var(--spacing-sm);
  padding: 0.75rem;
  border-radius: var(--radius-md);
  border: none;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.auth-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-footer {
  margin-top: var(--spacing-lg);
  text-align: center;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.auth-footer a {
  color: #818cf8;
  font-weight: 500;
}
</style>
