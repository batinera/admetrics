<template>
  <div class="export-dropdown">
    <button 
      class="export-btn" 
      @click="toggleDropdown"
      aria-label="Exportar dados"
      aria-haspopup="true"
      :aria-expanded="isOpen"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      <span>Exportar</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="chevron">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>
    
    <Transition name="dropdown">
      <div v-if="isOpen" class="dropdown-menu">
        <button class="dropdown-item" @click="exportAs('csv')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span>Exportar como CSV</span>
        </button>
        
        <button class="dropdown-item" @click="exportAs('json')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <span>Exportar como JSON</span>
        </button>
        
        <button class="dropdown-item" @click="exportAs('pdf')" disabled>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <span>Exportar como PDF</span>
          <span class="badge-soon">Em breve</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['export']);

const isOpen = ref(false);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const exportAs = (format) => {
  emit('export', format);
  isOpen.value = false;
};
</script>

<style scoped>
.export-dropdown {
  position: relative;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.875rem;
  transition: all var(--transition-base);
}

.export-btn:hover {
  border-color: var(--color-border-light);
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
}

.chevron {
  transition: transform var(--transition-base);
}

.export-btn:hover .chevron {
  transform: translateY(2px);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 220px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-xl);
  padding: 0.5rem;
  z-index: 1000;
}

.dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--color-text-primary);
  font-size: 0.875rem;
  font-weight: 500;
  text-align: left;
  transition: all var(--transition-fast);
  cursor: pointer;
}

.dropdown-item:hover:not(:disabled) {
  background: var(--color-surface-elevated);
}

.dropdown-item:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dropdown-item svg {
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.badge-soon {
  margin-left: auto;
  font-size: 0.6875rem;
  padding: 0.125rem 0.5rem;
  background: rgba(245, 158, 11, 0.15);
  color: var(--color-warning-light);
  border-radius: 9999px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all var(--transition-base);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
