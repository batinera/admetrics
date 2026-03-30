<template>
  <div class="error-state card">
    <div class="error-icon">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
    </div>
    <h3 class="error-title">Ops! Algo deu errado</h3>
    <p class="error-message">{{ message || 'Não foi possível carregar os dados. Tente novamente.' }}</p>
    <button class="btn-primary" @click="$emit('retry')">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
      </svg>
      <span>Tentar Novamente</span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: ''
  }
});

defineEmits(['retry']);
</script>

<style scoped>
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3xl) var(--spacing-xl);
  text-align: center;
  min-height: 400px;
  background: var(--color-surface);
}

.error-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-lg);
  color: var(--color-danger-light);
}

.error-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.error-message {
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
  max-width: 400px;
  margin-bottom: var(--spacing-xl);
  line-height: 1.6;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
