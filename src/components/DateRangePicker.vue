<template>
  <div class="date-range-picker" ref="pickerRef">
    <button 
      class="date-trigger"
      @click="toggleDropdown"
      :aria-expanded="isOpen"
      aria-haspopup="true"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
      <span>{{ displayText }}</span>
    </button>
    
    <div v-if="isOpen" class="dropdown-panel">
      <div class="shortcuts">
        <button 
          v-for="shortcut in shortcuts" 
          :key="shortcut.label"
          @click="applyShortcut(shortcut)"
          class="shortcut-btn"
        >
          {{ shortcut.label }}
        </button>
      </div>
      
      <div class="date-inputs">
        <div class="date-input-group">
          <label class="input-label">Data Início</label>
          <input 
            type="date" 
            v-model="startDateLocal"
            :max="endDateLocal"
            class="date-input"
          />
        </div>
        
        <div class="date-input-group">
          <label class="input-label">Data Fim</label>
          <input 
            type="date" 
            v-model="endDateLocal"
            :min="startDateLocal"
            :max="todayString"
            class="date-input"
          />
        </div>
      </div>
      
      <div class="dropdown-footer">
        <button @click="cancel" class="btn-secondary">
          Cancelar
        </button>
        <button @click="apply" class="btn-primary">
          Aplicar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { format, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => null
  }
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const startDateLocal = ref('');
const endDateLocal = ref('');
const pickerRef = ref(null);

const todayString = computed(() => format(new Date(), 'yyyy-MM-dd'));

const shortcuts = [
  { label: 'Hoje', days: 0 },
  { label: 'Últimos 7 dias', days: 7 },
  { label: 'Últimos 14 dias', days: 14 },
  { label: 'Últimos 30 dias', days: 30 },
  { label: 'Este mês', type: 'month' },
  { label: 'Esta semana', type: 'week' }
];

const displayText = computed(() => {
  if (!props.modelValue || !props.modelValue.start || !props.modelValue.end) {
    return 'Selecionar período';
  }
  
  const start = format(new Date(props.modelValue.start), 'dd/MM/yyyy');
  const end = format(new Date(props.modelValue.end), 'dd/MM/yyyy');
  return `${start} - ${end}`;
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    initializeDates();
  }
};

const initializeDates = () => {
  if (props.modelValue && props.modelValue.start && props.modelValue.end) {
    startDateLocal.value = props.modelValue.start;
    endDateLocal.value = props.modelValue.end;
  } else {
    const end = new Date();
    const start = subDays(end, 30);
    startDateLocal.value = format(start, 'yyyy-MM-dd');
    endDateLocal.value = format(end, 'yyyy-MM-dd');
  }
};

const applyShortcut = (shortcut) => {
  const today = new Date();
  let start, end;
  
  if (shortcut.type === 'month') {
    start = startOfMonth(today);
    end = endOfMonth(today);
  } else if (shortcut.type === 'week') {
    start = startOfWeek(today, { weekStartsOn: 0 });
    end = endOfWeek(today, { weekStartsOn: 0 });
  } else {
    end = today;
    start = subDays(today, shortcut.days);
  }
  
  startDateLocal.value = format(start, 'yyyy-MM-dd');
  endDateLocal.value = format(end, 'yyyy-MM-dd');
  apply();
};

const apply = () => {
  emit('update:modelValue', {
    start: startDateLocal.value,
    end: endDateLocal.value
  });
  isOpen.value = false;
};

const cancel = () => {
  isOpen.value = false;
  initializeDates();
};

const handleClickOutside = (event) => {
  if (pickerRef.value && !pickerRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.date-range-picker {
  position: relative;
}

.date-trigger {
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

.date-trigger:hover {
  border-color: var(--color-border-light);
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
}

.dropdown-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 360px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  z-index: 1000;
  padding: var(--spacing-md);
}

.shortcuts {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.shortcut-btn {
  padding: 0.625rem;
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);
  font-size: 0.8125rem;
  font-weight: 500;
  transition: all var(--transition-fast);
  text-align: center;
}

.shortcut-btn:hover {
  background: var(--color-surface-elevated);
  color: var(--color-text-primary);
  border-color: var(--color-primary);
}

.date-inputs {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.date-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.date-input {
  padding: 0.625rem 1rem;
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: 0.875rem;
  font-family: var(--font-body);
  transition: all var(--transition-fast);
}

.date-input:focus {
  outline: none;
  border-color: var(--color-primary);
  background: var(--color-surface);
}

.date-input::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}

.dropdown-footer {
  display: flex;
  gap: var(--spacing-sm);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

.btn-secondary {
  flex: 1;
  padding: 0.625rem 1rem;
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.875rem;
  transition: all var(--transition-base);
}

.btn-secondary:hover {
  background: var(--color-surface-elevated);
  color: var(--color-text-primary);
  border-color: var(--color-border-light);
}

.btn-primary {
  flex: 1;
  padding: 0.625rem 1rem;
  background: var(--gradient-primary);
  color: white;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.875rem;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
}

.btn-primary:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .dropdown-panel {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    min-width: auto;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  }
  
  .shortcuts {
    grid-template-columns: 1fr;
  }
}
</style>
