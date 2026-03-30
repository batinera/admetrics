<template>
  <div class="empty-state">
    <div class="empty-state__icon">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
    </div>
    <h3 class="empty-state__title">{{ title }}</h3>
    <p class="empty-state__message">{{ message }}</p>
    <button v-if="actionLabel" class="btn-primary" @click="$emit('action')">
      {{ actionLabel }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Nenhum dado encontrado'
  },
  message: {
    type: String,
    default: 'Não há dados disponíveis para o período selecionado.'
  },
  actionLabel: {
    type: String,
    default: ''
  }
});

defineEmits(['action']);
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3xl) var(--spacing-xl);
  text-align: center;
  min-height: 300px;
}

.empty-state__icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--color-surface-elevated);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-lg);
  color: var(--color-text-tertiary);
}

.empty-state__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-sm);
}

.empty-state__message {
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
  max-width: 400px;
  margin-bottom: var(--spacing-lg);
}
</style>
