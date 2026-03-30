<template>
  <footer class="dashboard-footer">
    <div class="footer-content">
      <div class="footer-left">
        <span class="footer-text">AdMetrics Dashboard</span>
        <span class="footer-divider">•</span>
        <span class="footer-text">Desenvolvido com Vue 3</span>
      </div>
      <div class="footer-right">
        <span class="footer-text">Última atualização: {{ lastUpdate }}</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { format } from 'date-fns';

const lastUpdate = ref('');

onMounted(() => {
  lastUpdate.value = format(new Date(), "dd/MM/yyyy 'às' HH:mm");
});
</script>

<style scoped>
.dashboard-footer {
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  padding: var(--spacing-lg) var(--spacing-xl);
  margin-top: var(--spacing-3xl);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.footer-left,
.footer-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.footer-text {
  font-size: 0.8125rem;
  color: var(--color-text-tertiary);
}

.footer-divider {
  color: var(--color-border-light);
}

@media (max-width: 768px) {
  .dashboard-footer {
    padding: var(--spacing-md);
  }
  
  .footer-content {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
