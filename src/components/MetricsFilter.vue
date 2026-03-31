<template>
  <div class="metrics-filter" ref="filterRef">
    <button 
      class="filter-trigger"
      @click="toggleDropdown"
      :aria-expanded="isOpen"
      aria-haspopup="true"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 3h18v18H3zM9 9h6v6H9z"></path>
        <path d="M9 3v6M15 3v6M9 15v6M15 15v6M3 9h6M3 15h6M15 9h6M15 15h6"></path>
      </svg>
      <span>Métricas</span>
      <span v-if="selectedCount > 0" class="selected-badge">{{ selectedCount }}</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="chevron">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>
    
    <div v-if="isOpen" class="dropdown-panel">
      <div class="dropdown-header">
        <input 
          type="text" 
          v-model="searchQuery"
          placeholder="Buscar métrica..."
          class="search-input"
        />
      </div>
      
      <div class="dropdown-actions">
        <button @click="selectAll" class="action-btn">
          Selecionar Todas
        </button>
        <button @click="clearAll" class="action-btn">
          Limpar
        </button>
      </div>
      
      <div class="metrics-list">
        <label 
          v-for="metric in filteredMetrics" 
          :key="metric.id"
          class="metric-item"
        >
          <input 
            type="checkbox"
            :value="metric.id"
            v-model="selectedMetricsLocal"
            @change="updateSelection"
            class="metric-checkbox"
          />
          <div class="metric-info">
            <span class="metric-name">{{ metric.label }}</span>
            <span class="metric-description">{{ metric.description }}</span>
          </div>
        </label>
        
        <div v-if="filteredMetrics.length === 0" class="empty-search">
          Nenhuma métrica encontrada
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const searchQuery = ref('');
const selectedMetricsLocal = ref([...props.modelValue]);
const filterRef = ref(null);

const availableMetrics = [
  { id: 'results', label: 'Resultados', description: 'Total de conversões' },
  { id: 'reach', label: 'Alcance', description: 'Pessoas alcançadas' },
  { id: 'frequency', label: 'Frequência', description: 'Vezes por pessoa' },
  { id: 'costPerResult', label: 'Custo por Resultado', description: 'Gasto por conversão' },
  { id: 'budget', label: 'Orçamento Total', description: 'Orçamento disponível' },
  { id: 'spend', label: 'Valor Gasto', description: 'Total investido' },
  { id: 'impressions', label: 'Impressões', description: 'Visualizações do anúncio' },
  { id: 'cpm', label: 'CPM', description: 'Custo por mil impressões' },
  { id: 'clicks', label: 'Cliques no Link', description: 'Cliques totais' },
  { id: 'cpc', label: 'CPC', description: 'Custo por clique' },
  { id: 'ctr', label: 'CTR', description: 'Taxa de cliques' },
  { id: 'engagement', label: 'Engajamento', description: 'Taxa de conversão' }
];

const filteredMetrics = computed(() => {
  if (!searchQuery.value) return availableMetrics;
  
  const query = searchQuery.value.toLowerCase();
  return availableMetrics.filter(m => 
    m.label.toLowerCase().includes(query) || 
    m.description.toLowerCase().includes(query)
  );
});

const selectedCount = computed(() => {
  return selectedMetricsLocal.value.length;
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectAll = () => {
  selectedMetricsLocal.value = availableMetrics.map(m => m.id);
  updateSelection();
};

const clearAll = () => {
  selectedMetricsLocal.value = [];
  updateSelection();
};

const updateSelection = () => {
  emit('update:modelValue', selectedMetricsLocal.value);
};

const handleClickOutside = (event) => {
  if (filterRef.value && !filterRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

watch(() => props.modelValue, (newValue) => {
  selectedMetricsLocal.value = [...newValue];
}, { deep: true });

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.metrics-filter {
  position: relative;
}

.filter-trigger {
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
  white-space: nowrap;
}

.filter-trigger:hover {
  border-color: var(--color-border-light);
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
}

.selected-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 0.375rem;
  background: var(--gradient-primary);
  color: white;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
}

.chevron {
  transition: transform var(--transition-base);
}

.dropdown-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 360px;
  max-width: 420px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  z-index: 1000;
  max-height: 500px;
  display: flex;
  flex-direction: column;
}

.dropdown-header {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.search-input {
  width: 100%;
  padding: 0.625rem 1rem;
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: 0.875rem;
  font-family: var(--font-body);
  transition: all var(--transition-fast);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  background: var(--color-surface);
}

.search-input::placeholder {
  color: var(--color-text-tertiary);
}

.dropdown-actions {
  display: flex;
  gap: 0.5rem;
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.action-btn {
  flex: 1;
  padding: 0.5rem;
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);
  font-size: 0.8125rem;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.action-btn:hover {
  background: var(--color-surface-elevated);
  color: var(--color-text-primary);
  border-color: var(--color-border-light);
}

.metrics-list {
  overflow-y: auto;
  max-height: 360px;
  padding: var(--spacing-sm);
}

.metric-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.metric-item:hover {
  background: var(--color-surface-elevated);
}

.metric-checkbox {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 2px solid var(--color-border);
  cursor: pointer;
  flex-shrink: 0;
  accent-color: var(--color-primary);
}

.metric-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.metric-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.metric-description {
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
}

.empty-search {
  padding: var(--spacing-xl);
  text-align: center;
  color: var(--color-text-tertiary);
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .dropdown-panel {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    max-width: none;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    max-height: 70vh;
  }
}
</style>
