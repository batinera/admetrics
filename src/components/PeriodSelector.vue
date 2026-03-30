<template>
  <div class="period-selector">
    <button
      v-for="period in periods"
      :key="period.value"
      @click="selectPeriod(period.value)"
      :class="['period-btn', { active: modelValue === period.value }]"
    >
      {{ period.label }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const periods = [
  { label: '1d', value: '1' },
  { label: '7d', value: '7' },
  { label: '14d', value: '14' },
  { label: '30d', value: '30' },
  { label: '60d', value: '60' },
  { label: '90d', value: '90' }
];

const selectPeriod = (value) => {
  emit('update:modelValue', value);
};
</script>

<style scoped>
.period-selector {
  display: flex;
  gap: 0.25rem;
  background: var(--color-background-secondary);
  padding: 0.25rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.period-btn {
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
  font-family: var(--font-display);
}

.period-btn.active {
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--shadow-sm);
}

.period-btn:hover:not(.active) {
  color: var(--color-text-primary);
  background: var(--color-surface);
}

@media (max-width: 768px) {
  .period-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.8125rem;
  }
}
</style>
