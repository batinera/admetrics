<template>
  <header class="dashboard-header">
    <div class="header-content">
      <div class="header-left">
        <div class="logo-section">
          <div class="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="url(#logo-gradient)"/>
              <path d="M16 8L22 14L20 16L17 13V24H15V13L12 16L10 14L16 8Z" fill="white"/>
              <defs>
                <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stop-color="#4f46e5"/>
                  <stop offset="100%" stop-color="#7c3aed"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div class="logo-text">
            <h1>AdMetrics</h1>
            <span class="subtitle">Facebook Ads Dashboard</span>
          </div>
        </div>
      </div>
      
      <div class="header-right">
        <MetricsFilter v-model="selectedMetrics" />
        <CampaignFilter v-model="selectedCampaigns" :campaigns="allCampaigns" />
        <DateRangePicker v-model="dateRange" />
        <PeriodSelector v-model="selectedPeriod" />
        
        <ExportButton @export="handleExport" />
        
        <button class="refresh-btn" @click="handleRefresh" aria-label="Atualizar dados">
          <IconRefresh :class="{ spinning: isRefreshing }" />
          <span>Atualizar</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, watch } from 'vue';
import PeriodSelector from './PeriodSelector.vue';
import ExportButton from './ExportButton.vue';
import CampaignFilter from './CampaignFilter.vue';
import DateRangePicker from './DateRangePicker.vue';
import MetricsFilter from './MetricsFilter.vue';
import IconRefresh from './IconRefresh.vue';

const props = defineProps({
  allCampaigns: {
    type: Array,
    default: () => []
  },
  visibleMetrics: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['period-change', 'refresh', 'export', 'campaigns-change', 'daterange-change', 'metrics-change']);

const selectedPeriod = ref('30');
const selectedCampaigns = ref([]);
const dateRange = ref(null);
const selectedMetrics = ref([...props.visibleMetrics]);
const isRefreshing = ref(false);

watch(selectedPeriod, (newValue) => {
  emit('period-change', newValue);
});

watch(selectedCampaigns, (newValue) => {
  emit('campaigns-change', newValue);
});

watch(dateRange, (newValue) => {
  emit('daterange-change', newValue);
});

watch(selectedMetrics, (newValue) => {
  emit('metrics-change', newValue);
});

watch(() => props.visibleMetrics, (newValue) => {
  selectedMetrics.value = [...newValue];
}, { deep: true });

const handleRefresh = async () => {
  isRefreshing.value = true;
  emit('refresh');
  setTimeout(() => {
    isRefreshing.value = false;
  }, 1000);
};

const handleExport = (format) => {
  emit('export', format);
};
</script>

<style scoped>
.dashboard-header {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: var(--spacing-lg) var(--spacing-xl);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  background: rgba(26, 31, 53, 0.95);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.logo-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.logo {
  flex-shrink: 0;
}

.logo-text h1 {
  font-size: 1.5rem;
  font-weight: 800;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.subtitle {
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}


.refresh-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: var(--gradient-primary);
  color: white;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.875rem;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
}

.refresh-btn:hover {
  box-shadow: var(--shadow-md), var(--shadow-glow);
  transform: translateY(-1px);
}

.refresh-btn:active {
  transform: translateY(0);
}

.refresh-btn svg {
  width: 16px;
  height: 16px;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1024px) {
  .dashboard-header {
    padding: var(--spacing-md) var(--spacing-lg);
  }
  
  .header-right {
    gap: var(--spacing-sm);
  }
}

@media (max-width: 900px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-md);
  }
  
  .header-right {
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }
  
  .logo-text h1 {
    font-size: 1.25rem;
  }
  
  .subtitle {
    font-size: 0.6875rem;
  }
}

@media (max-width: 600px) {
  .dashboard-header {
    padding: var(--spacing-sm) var(--spacing-md);
  }
  
  .logo-section {
    gap: var(--spacing-sm);
  }
  
  .logo svg {
    width: 28px;
    height: 28px;
  }
  
  .logo-text h1 {
    font-size: 1.125rem;
  }
  
  .refresh-btn span {
    display: none;
  }
  
  .refresh-btn {
    padding: 0.625rem;
  }
}
</style>
