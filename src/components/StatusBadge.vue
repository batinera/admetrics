<template>
  <span :class="['status-badge', `status-badge--${status}`]">
    <span class="status-dot"></span>
    <span>{{ label }}</span>
  </span>
</template>

<script setup>
const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['active', 'paused', 'completed', 'pending'].includes(value)
  },
  label: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.875rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all var(--transition-base);
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.status-badge--active {
  background: rgba(16, 185, 129, 0.15);
  color: var(--color-success-light);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.status-badge--active .status-dot {
  background: var(--color-success-light);
  box-shadow: 0 0 8px var(--color-success-light);
}

.status-badge--paused {
  background: rgba(245, 158, 11, 0.15);
  color: var(--color-warning-light);
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.status-badge--paused .status-dot {
  background: var(--color-warning-light);
}

.status-badge--completed {
  background: rgba(100, 116, 139, 0.15);
  color: var(--color-text-secondary);
  border: 1px solid rgba(100, 116, 139, 0.3);
}

.status-badge--completed .status-dot {
  background: var(--color-text-secondary);
}

.status-badge--pending {
  background: rgba(79, 70, 229, 0.15);
  color: var(--color-primary-light);
  border: 1px solid rgba(79, 70, 229, 0.3);
}

.status-badge--pending .status-dot {
  background: var(--color-primary-light);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}
</style>
