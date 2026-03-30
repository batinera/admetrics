<template>
  <div class="skeleton-grid">
    <div v-for="i in count" :key="i" class="skeleton-card" :class="`stagger-${i}`">
      <div class="skeleton-header">
        <div class="skeleton-icon"></div>
        <div class="skeleton-badge"></div>
      </div>
      <div class="skeleton-content">
        <div class="skeleton-label"></div>
        <div class="skeleton-value"></div>
      </div>
      <div class="skeleton-sparkline"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    default: 9
  }
});
</script>

<style scoped>
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
}

.skeleton-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  min-height: 180px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  animation: fadeIn var(--transition-slow) ease-out forwards;
  opacity: 0;
}

.skeleton-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.skeleton-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: var(--color-surface-elevated);
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-badge {
  width: 60px;
  height: 24px;
  border-radius: 9999px;
  background: var(--color-surface-elevated);
  animation: pulse 1.5s ease-in-out infinite;
  animation-delay: 0.1s;
}

.skeleton-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skeleton-label {
  width: 80px;
  height: 14px;
  border-radius: var(--radius-sm);
  background: var(--color-surface-elevated);
  animation: pulse 1.5s ease-in-out infinite;
  animation-delay: 0.2s;
}

.skeleton-value {
  width: 120px;
  height: 32px;
  border-radius: var(--radius-sm);
  background: var(--color-surface-elevated);
  animation: pulse 1.5s ease-in-out infinite;
  animation-delay: 0.3s;
}

.skeleton-sparkline {
  width: 100%;
  height: 40px;
  border-radius: var(--radius-sm);
  background: var(--color-surface-elevated);
  animation: pulse 1.5s ease-in-out infinite;
  animation-delay: 0.4s;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@media (max-width: 1400px) {
  .skeleton-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .skeleton-grid {
    grid-template-columns: 1fr;
  }
}
</style>
