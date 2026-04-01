<template>
  <div class="callback-page">
    <div class="callback-card card">
      <h1>Ligar conta Meta</h1>
      <p v-if="loadError" class="err">{{ loadError }}</p>
      <p v-else-if="loading">A carregar contas de anúncios…</p>
      <template v-else>
        <label class="field">
          <span>Conta de anúncios</span>
          <select v-model="selectedId" class="select">
            <option value="" disabled>Escolhe uma conta</option>
            <option v-for="a in accounts" :key="a.id" :value="a.id">
              {{ a.name }} ({{ a.id }})
            </option>
          </select>
        </label>
        <p v-if="saveError" class="err">{{ saveError }}</p>
        <button
          type="button"
          class="btn-primary"
          :disabled="!selectedId || saving"
          @click="confirm"
        >
          {{ saving ? "A guardar…" : "Confirmar e abrir painel" }}
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { setActiveIntegrationId } from "../composables/useMetrics";
import { apiUrl } from "../utils/apiBase";

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const loadError = ref("");
const saveError = ref("");
const saving = ref(false);
const accounts = ref([]);
const selectedId = ref("");
const integrationId = ref("");

onMounted(async () => {
  const err = route.query.error;
  if (err) {
    loadError.value =
      typeof err === "string"
        ? `Erro na autorização: ${err}`
        : "Erro na autorização.";
    loading.value = false;
    return;
  }
  const iid = route.query.integration_id;
  if (!iid || typeof iid !== "string") {
    loadError.value = "Pedido inválido (falta integration_id).";
    loading.value = false;
    return;
  }
  integrationId.value = iid;

  const r = await fetch(apiUrl(`/integrations/${iid}/meta/ad-accounts`), {
    credentials: "include",
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    loadError.value = data.error || "Não foi possível listar contas.";
    loading.value = false;
    return;
  }
  accounts.value = data.accounts || [];
  if (accounts.value.length === 1) {
    selectedId.value = accounts.value[0].id;
  }
  loading.value = false;
});

async function confirm() {
  saveError.value = "";
  saving.value = true;
  try {
    const r = await fetch(apiUrl(`/integrations/${integrationId.value}`), {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selectedAccountId: selectedId.value }),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      throw new Error(data.error || "Falha ao guardar");
    }
    setActiveIntegrationId(integrationId.value);
    await router.replace("/");
  } catch (e) {
    saveError.value = e.message;
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.callback-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  background: var(--color-background);
}

.callback-card {
  width: 100%;
  max-width: 440px;
  padding: var(--spacing-xl);
}

.callback-card h1 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: var(--spacing-md);
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
}

.select {
  padding: 0.625rem 0.75rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-surface-elevated);
  color: var(--color-text-primary);
}

.btn-primary {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.err {
  color: #f87171;
  font-size: 0.875rem;
  margin-bottom: var(--spacing-md);
}
</style>
