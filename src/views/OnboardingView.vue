<template>
  <div class="onboarding-page">
    <div class="container onboarding-inner">
      <header class="onboarding-header">
        <h1>Ligar fonte de dados</h1>
        <p>
          Escolhe uma plataforma para importar métricas. O login do AdMetrics é independente —
          aqui só autorizas leitura das tuas contas de anúncios.
        </p>
      </header>

      <div class="source-grid">
        <article class="source-card card source-card--active">
          <div class="source-icon source-icon--meta">M</div>
          <h2>Meta Ads</h2>
          <p>Facebook e Instagram ads via Marketing API.</p>
          <button type="button" class="source-btn" @click="connectMeta">
            Conectar Meta
          </button>
        </article>

        <article class="source-card card source-card--soon">
          <div class="source-icon source-icon--tt">TT</div>
          <h2>TikTok Ads</h2>
          <p>Em breve.</p>
          <button type="button" class="source-btn" disabled>Indisponível</button>
        </article>

        <article class="source-card card source-card--soon">
          <div class="source-icon source-icon--gg">G</div>
          <h2>Google Ads</h2>
          <p>Em breve.</p>
          <button type="button" class="source-btn" disabled>Indisponível</button>
        </article>
      </div>

      <p v-if="integrations.length" class="existing-hint">
        Já tens integrações:
        <span v-for="i in integrations" :key="i.id" class="integration-pill">
          {{ i.provider }} — {{ i.status }}
        </span>
        <RouterLink v-if="hasActive" to="/" class="link-dash">Ir para o painel</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { apiUrl } from "../utils/apiBase";

const router = useRouter();
const integrations = ref([]);

const hasActive = computed(() =>
  integrations.value.some((i) => i.status === "active" && i.selectedAccountId),
);

async function loadIntegrations() {
  const r = await fetch(apiUrl("/integrations"), { credentials: "include" });
  if (!r.ok) return;
  const data = await r.json();
  integrations.value = data.integrations || [];
}

function connectMeta() {
  window.location.assign(apiUrl("/integrations/meta/connect"));
}

onMounted(async () => {
  await loadIntegrations();
  if (hasActive.value) {
    const id = integrations.value.find(
      (i) => i.status === "active" && i.selectedAccountId,
    )?.id;
    if (id) {
      localStorage.setItem("admetrics_integration_id", id);
      await router.replace("/");
    }
  }
});
</script>

<style scoped>
.onboarding-page {
  min-height: 100vh;
  background: var(--color-background);
  padding: var(--spacing-2xl) 0;
}

.onboarding-inner {
  max-width: 960px;
}

.onboarding-header {
  margin-bottom: var(--spacing-xl);
}

.onboarding-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.onboarding-header p {
  color: var(--color-text-secondary);
  line-height: 1.6;
  max-width: 640px;
}

.source-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--spacing-lg);
}

.source-card {
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.source-card--soon {
  opacity: 0.65;
}

.source-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1rem;
  color: white;
}

.source-icon--meta {
  background: linear-gradient(135deg, #0668e1, #1877f2);
}

.source-icon--tt {
  background: linear-gradient(135deg, #000, #333);
}

.source-icon--gg {
  background: linear-gradient(135deg, #4285f4, #34a853);
}

.source-card h2 {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.source-card p {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  flex: 1;
}

.source-btn {
  margin-top: var(--spacing-sm);
  padding: 0.625rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: var(--color-surface-elevated);
  color: var(--color-text-primary);
  font-weight: 600;
  cursor: pointer;
}

.source-card--active .source-btn {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  border: none;
  color: white;
}

.source-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.existing-hint {
  margin-top: var(--spacing-xl);
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.integration-pill {
  display: inline-block;
  margin-left: 0.5rem;
  padding: 0.25rem 0.5rem;
  background: var(--color-surface);
  border-radius: var(--radius-sm);
  text-transform: capitalize;
}

.link-dash {
  display: block;
  margin-top: var(--spacing-md);
  color: #818cf8;
  font-weight: 600;
}
</style>
