<template>
  <div class="tooltip-wrapper">
    <slot></slot>
    <div class="tooltip" :class="{ visible: isVisible }">
      {{ text }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  text: {
    type: String,
    required: true
  }
});

const isVisible = ref(false);
</script>

<style scoped>
.tooltip-wrapper {
  position: relative;
  display: inline-flex;
}

.tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  background: var(--color-surface-elevated);
  color: var(--color-text-primary);
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.8125rem;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-border);
  z-index: 1000;
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: var(--color-surface-elevated);
}

.tooltip-wrapper:hover .tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.tooltip.visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
</style>
