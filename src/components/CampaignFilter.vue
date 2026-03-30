<template>
  <div class="campaign-filter" ref="filterRef">
    <button 
      class="filter-trigger"
      @click="toggleDropdown"
      :aria-expanded="isOpen"
      aria-haspopup="true"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
      </svg>
      <span>Campanhas</span>
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
          placeholder="Buscar campanha..."
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
      
      <div class="campaigns-list">
        <label 
          v-for="campaign in filteredCampaigns" 
          :key="campaign.id"
          class="campaign-item"
        >
          <input 
            type="checkbox"
            :value="campaign.id"
            v-model="selectedCampaignsLocal"
            @change="updateSelection"
            class="campaign-checkbox"
          />
          <div class="campaign-info">
            <span class="campaign-name">{{ campaign.name }}</span>
            <span :class="['campaign-status', `campaign-status--${campaign.status}`]">
              {{ statusLabels[campaign.status] }}
            </span>
          </div>
        </label>
        
        <div v-if="filteredCampaigns.length === 0" class="empty-search">
          Nenhuma campanha encontrada
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  campaigns: {
    type: Array,
    required: true
  },
  modelValue: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const searchQuery = ref('');
const selectedCampaignsLocal = ref([...props.modelValue]);
const filterRef = ref(null);

const statusLabels = {
  active: 'Ativa',
  paused: 'Pausada',
  completed: 'Concluída'
};

const filteredCampaigns = computed(() => {
  if (!searchQuery.value) return props.campaigns;
  
  const query = searchQuery.value.toLowerCase();
  return props.campaigns.filter(c => 
    c.name.toLowerCase().includes(query)
  );
});

const selectedCount = computed(() => {
  return selectedCampaignsLocal.value.length;
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectAll = () => {
  selectedCampaignsLocal.value = props.campaigns.map(c => c.id);
  updateSelection();
};

const clearAll = () => {
  selectedCampaignsLocal.value = [];
  updateSelection();
};

const updateSelection = () => {
  emit('update:modelValue', selectedCampaignsLocal.value);
};

const handleClickOutside = (event) => {
  if (filterRef.value && !filterRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

watch(() => props.modelValue, (newValue) => {
  selectedCampaignsLocal.value = [...newValue];
}, { deep: true });

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.campaign-filter {
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
  min-width: 320px;
  max-width: 400px;
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

.campaigns-list {
  overflow-y: auto;
  max-height: 320px;
  padding: var(--spacing-sm);
}

.campaign-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.campaign-item:hover {
  background: var(--color-surface-elevated);
}

.campaign-checkbox {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 2px solid var(--color-border);
  cursor: pointer;
  flex-shrink: 0;
  accent-color: var(--color-primary);
}

.campaign-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.campaign-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.campaign-status {
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.campaign-status--active {
  color: var(--color-success-light);
}

.campaign-status--paused {
  color: var(--color-warning-light);
}

.campaign-status--completed {
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
