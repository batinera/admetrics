<template>
  <div class="preset-manager" ref="managerRef">
    <button 
      class="preset-trigger"
      @click="toggleDropdown"
      :aria-expanded="isOpen"
      aria-haspopup="true"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
      <span>Visualizações</span>
      <span v-if="activePresetName" class="active-badge">{{ activePresetName }}</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="chevron">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>
    
    <div v-if="isOpen" class="dropdown-panel">
      <div class="dropdown-header">
        <button @click="showSaveDialog" class="save-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          Salvar Visualização Atual
        </button>
      </div>
      
      <div class="presets-list">
        <div 
          class="preset-item"
          :class="{ active: activePresetId === 'default' }"
        >
          <div class="preset-info">
            <span class="preset-name">Padrão</span>
            <span class="preset-meta">12 métricas</span>
          </div>
          <button @click="applyPreset('default')" class="apply-btn">
            Aplicar
          </button>
        </div>
        
        <div 
          v-for="preset in presets" 
          :key="preset.id"
          class="preset-item"
          :class="{ active: activePresetId === preset.id }"
        >
          <div class="preset-info">
            <span class="preset-name">{{ preset.name }}</span>
            <span class="preset-meta">{{ preset.metrics.length }} métricas</span>
          </div>
          <div class="preset-actions">
            <button @click="applyPreset(preset.id)" class="apply-btn" title="Aplicar preset">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
            <button @click="showRenameDialog(preset)" class="edit-btn" title="Renomear">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button @click="confirmDelete(preset)" class="delete-btn" title="Deletar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <div v-if="presets.length === 0" class="empty-presets">
          Nenhuma visualização salva ainda
        </div>
      </div>
    </div>
    
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3>{{ modalTitle }}</h3>
        <input 
          v-model="presetName" 
          placeholder="Nome da visualização"
          class="preset-input"
          @keyup.enter="saveCurrentPreset"
          ref="inputRef"
        />
        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
        <div class="modal-actions">
          <button @click="closeModal" class="cancel-btn">Cancelar</button>
          <button @click="saveCurrentPreset" :disabled="!presetName.trim()" class="confirm-btn">
            Salvar
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="showDeleteConfirm" class="modal-overlay" @click="closeDeleteConfirm">
      <div class="modal-content" @click.stop>
        <h3>Confirmar Exclusão</h3>
        <p>Tem certeza que deseja deletar a visualização "{{ presetToDelete?.name }}"?</p>
        <div class="modal-actions">
          <button @click="closeDeleteConfirm" class="cancel-btn">Cancelar</button>
          <button @click="deletePreset" class="danger-btn">Deletar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';

const props = defineProps({
  visibleMetrics: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['preset-applied', 'preset-saved', 'preset-deleted']);

const STORAGE_KEY = 'admetrics_metric_presets';
const DEFAULT_METRICS = ['results', 'reach', 'frequency', 'costPerResult', 'budget', 'spend', 'impressions', 'cpm', 'clicks', 'cpc', 'ctr', 'engagement'];
const MAX_PRESETS = 10;

const isOpen = ref(false);
const showModal = ref(false);
const showDeleteConfirm = ref(false);
const presetName = ref('');
const presets = ref([]);
const activePresetId = ref(null);
const managerRef = ref(null);
const inputRef = ref(null);
const modalTitle = ref('');
const modalMode = ref('save');
const editingPresetId = ref(null);
const presetToDelete = ref(null);
const errorMessage = ref('');

const activePresetName = computed(() => {
  if (activePresetId.value === 'default') return 'Padrão';
  const preset = presets.value.find(p => p.id === activePresetId.value);
  return preset ? preset.name : null;
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const showSaveDialog = () => {
  modalMode.value = 'save';
  modalTitle.value = 'Salvar Visualização';
  presetName.value = '';
  errorMessage.value = '';
  showModal.value = true;
  nextTick(() => {
    inputRef.value?.focus();
  });
};

const showRenameDialog = (preset) => {
  modalMode.value = 'rename';
  modalTitle.value = 'Renomear Visualização';
  presetName.value = preset.name;
  editingPresetId.value = preset.id;
  errorMessage.value = '';
  showModal.value = true;
  nextTick(() => {
    inputRef.value?.focus();
  });
};

const closeModal = () => {
  showModal.value = false;
  presetName.value = '';
  editingPresetId.value = null;
  errorMessage.value = '';
};

const saveCurrentPreset = () => {
  const trimmedName = presetName.value.trim();
  
  if (!trimmedName) {
    errorMessage.value = 'Nome não pode ser vazio';
    return;
  }
  
  if (modalMode.value === 'save') {
    const duplicate = presets.value.find(p => p.name.toLowerCase() === trimmedName.toLowerCase());
    if (duplicate) {
      errorMessage.value = 'Já existe uma visualização com este nome';
      return;
    }
    
    if (presets.value.length >= MAX_PRESETS) {
      errorMessage.value = `Limite de ${MAX_PRESETS} visualizações atingido`;
      return;
    }
    
    const newPreset = {
      id: `preset_${Date.now()}`,
      name: trimmedName,
      metrics: [...props.visibleMetrics],
      createdAt: new Date().toISOString()
    };
    
    presets.value.push(newPreset);
    activePresetId.value = newPreset.id;
    savePresetsToStorage();
    emit('preset-saved', newPreset);
    closeModal();
  } else if (modalMode.value === 'rename') {
    const duplicate = presets.value.find(p => 
      p.id !== editingPresetId.value && 
      p.name.toLowerCase() === trimmedName.toLowerCase()
    );
    
    if (duplicate) {
      errorMessage.value = 'Já existe uma visualização com este nome';
      return;
    }
    
    const preset = presets.value.find(p => p.id === editingPresetId.value);
    if (preset) {
      preset.name = trimmedName;
      savePresetsToStorage();
      closeModal();
    }
  }
};

const applyPreset = (presetId) => {
  let metricsToApply;
  
  if (presetId === 'default') {
    metricsToApply = [...DEFAULT_METRICS];
  } else {
    const preset = presets.value.find(p => p.id === presetId);
    if (!preset) return;
    metricsToApply = [...preset.metrics];
  }
  
  activePresetId.value = presetId;
  savePresetsToStorage();
  emit('preset-applied', metricsToApply);
  isOpen.value = false;
};

const confirmDelete = (preset) => {
  presetToDelete.value = preset;
  showDeleteConfirm.value = true;
};

const closeDeleteConfirm = () => {
  showDeleteConfirm.value = false;
  presetToDelete.value = null;
};

const deletePreset = () => {
  if (!presetToDelete.value) return;
  
  const index = presets.value.findIndex(p => p.id === presetToDelete.value.id);
  if (index !== -1) {
    presets.value.splice(index, 1);
    
    if (activePresetId.value === presetToDelete.value.id) {
      activePresetId.value = null;
    }
    
    savePresetsToStorage();
    emit('preset-deleted', presetToDelete.value.id);
  }
  
  closeDeleteConfirm();
};

const loadPresetsFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      presets.value = data.presets || [];
      activePresetId.value = data.activePresetId || null;
    }
  } catch (e) {
    console.error('Error loading presets from localStorage:', e);
  }
};

const savePresetsToStorage = () => {
  try {
    const data = {
      presets: presets.value,
      activePresetId: activePresetId.value
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving presets to localStorage:', e);
  }
};

const handleClickOutside = (event) => {
  if (managerRef.value && !managerRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  loadPresetsFromStorage();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.preset-manager {
  position: relative;
}

.preset-trigger {
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

.preset-trigger:hover {
  border-color: var(--color-border-light);
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
}

.active-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.5rem;
  background: var(--gradient-primary);
  color: white;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 700;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chevron {
  transition: transform var(--transition-base);
}

.dropdown-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 380px;
  max-width: 450px;
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

.save-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.875rem;
  transition: all var(--transition-fast);
}

.save-btn:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.presets-list {
  overflow-y: auto;
  max-height: 380px;
  padding: var(--spacing-sm);
}

.preset-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  transition: all var(--transition-fast);
  margin-bottom: var(--spacing-xs);
}

.preset-item:hover {
  background: var(--color-surface-elevated);
  border-color: var(--color-border);
}

.preset-item.active {
  background: rgba(99, 102, 241, 0.1);
  border-color: var(--color-primary);
}

.preset-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.preset-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.preset-meta {
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
}

.preset-actions {
  display: flex;
  gap: 0.375rem;
}

.apply-btn,
.edit-btn,
.delete-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.apply-btn:hover {
  background: rgba(16, 185, 129, 0.1);
  border-color: #10b981;
  color: #10b981;
}

.edit-btn:hover {
  background: rgba(99, 102, 241, 0.1);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
  color: #ef4444;
}

.empty-presets {
  padding: var(--spacing-xl);
  text-align: center;
  color: var(--color-text-tertiary);
  font-size: 0.875rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  min-width: 400px;
  max-width: 500px;
  box-shadow: var(--shadow-2xl);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-content h3 {
  margin: 0 0 var(--spacing-lg) 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.modal-content p {
  margin: 0 0 var(--spacing-lg) 0;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.preset-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: 0.9375rem;
  font-family: var(--font-body);
  transition: all var(--transition-fast);
  margin-bottom: var(--spacing-md);
}

.preset-input:focus {
  outline: none;
  border-color: var(--color-primary);
  background: var(--color-surface);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.error-message {
  color: #ef4444;
  font-size: 0.8125rem;
  margin-bottom: var(--spacing-md);
  margin-top: calc(-1 * var(--spacing-sm));
}

.modal-actions {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: flex-end;
}

.cancel-btn,
.confirm-btn,
.danger-btn {
  padding: 0.625rem 1.25rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.875rem;
  transition: all var(--transition-fast);
  border: none;
  cursor: pointer;
}

.cancel-btn {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}

.cancel-btn:hover {
  background: var(--color-surface-elevated);
  color: var(--color-text-primary);
}

.confirm-btn {
  background: var(--gradient-primary);
  color: white;
}

.confirm-btn:hover:not(:disabled) {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.confirm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.danger-btn {
  background: #ef4444;
  color: white;
}

.danger-btn:hover {
  background: #dc2626;
  box-shadow: var(--shadow-md);
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
  
  .modal-content {
    min-width: auto;
    width: 90%;
    max-width: 400px;
  }
}
</style>
