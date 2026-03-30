<template>
  <svg 
    width="14" 
    height="14" 
    viewBox="0 0 14 14" 
    fill="none" 
    :class="['sort-icon', { active: active }]"
    :style="{ transform: active && direction === 'desc' ? 'rotate(180deg)' : 'none' }"
  >
    <path 
      d="M7 3L10 6H4L7 3Z" 
      :fill="active ? 'currentColor' : 'none'" 
      :stroke="active ? 'none' : 'currentColor'" 
      stroke-width="1.5"
    />
    <path 
      d="M7 11L4 8H10L7 11Z" 
      :fill="active ? 'currentColor' : 'none'" 
      :stroke="active ? 'none' : 'currentColor'" 
      stroke-width="1.5"
    />
  </svg>
</template>

<script setup>
defineProps({
  active: {
    type: Boolean,
    default: false
  },
  direction: {
    type: String,
    default: 'asc'
  }
});
</script>

<style scoped>
.sort-icon {
  transition: all var(--transition-base);
  opacity: 0.5;
  color: var(--color-text-secondary);
}

.sort-icon.active {
  opacity: 1;
  color: var(--color-primary-light);
}
</style>
