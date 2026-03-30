<template>
  <div class="campaign-table-container card">
    <div class="table-header">
      <h3>Campanhas Ativas</h3>
      <div class="table-filters">
        <button 
          v-for="filter in filters" 
          :key="filter.value"
          @click="currentFilter = filter.value"
          :class="['filter-btn', { active: currentFilter === filter.value }]"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>
    
    <div class="table-wrapper">
      <table class="campaign-table">
        <thead>
          <tr>
            <th @click="sortBy('name')" class="sortable">
              <span>Campanha</span>
              <IconSort :active="sortKey === 'name'" :direction="sortDirection" />
            </th>
            <th @click="sortBy('status')" class="sortable">
              <span>Status</span>
              <IconSort :active="sortKey === 'status'" :direction="sortDirection" />
            </th>
            <th @click="sortBy('results')" class="sortable text-right">
              <span>Resultados</span>
              <IconSort :active="sortKey === 'results'" :direction="sortDirection" />
            </th>
            <th @click="sortBy('reach')" class="sortable text-right">
              <span>Alcance</span>
              <IconSort :active="sortKey === 'reach'" :direction="sortDirection" />
            </th>
            <th @click="sortBy('impressions')" class="sortable text-right">
              <span>Impressões</span>
              <IconSort :active="sortKey === 'impressions'" :direction="sortDirection" />
            </th>
            <th @click="sortBy('clicks')" class="sortable text-right">
              <span>Cliques</span>
              <IconSort :active="sortKey === 'clicks'" :direction="sortDirection" />
            </th>
            <th @click="sortBy('cpm')" class="sortable text-right">
              <span>CPM</span>
              <IconSort :active="sortKey === 'cpm'" :direction="sortDirection" />
            </th>
            <th @click="sortBy('costPerResult')" class="sortable text-right">
              <span>Custo/Resultado</span>
              <IconSort :active="sortKey === 'costPerResult'" :direction="sortDirection" />
            </th>
            <th @click="sortBy('spend')" class="sortable text-right">
              <span>Gasto</span>
              <IconSort :active="sortKey === 'spend'" :direction="sortDirection" />
            </th>
            <th class="text-right">Orçamento</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="campaign in sortedCampaigns" :key="campaign.id" class="table-row">
            <td class="campaign-name">
              <div class="name-wrapper">
                <span class="name-text">{{ campaign.name }}</span>
                <span class="objective-badge">{{ campaign.objective }}</span>
              </div>
            </td>
            <td>
              <span :class="['status-badge', `status-badge--${campaign.status}`]">
                {{ statusLabels[campaign.status] }}
              </span>
            </td>
            <td class="text-right metric-value">{{ formatNumber(campaign.totals.results) }}</td>
            <td class="text-right metric-value">{{ formatNumber(campaign.totals.reach) }}</td>
            <td class="text-right metric-value">{{ formatNumber(campaign.totals.impressions) }}</td>
            <td class="text-right metric-value">{{ formatNumber(campaign.totals.clicks) }}</td>
            <td class="text-right metric-value">{{ formatCurrency(campaign.totals.cpm) }}</td>
            <td class="text-right metric-value">{{ formatCurrency(campaign.totals.costPerResult) }}</td>
            <td class="text-right metric-value metric-value--highlight">{{ formatCurrency(campaign.totals.spend) }}</td>
            <td class="text-right">
              <div class="budget-cell">
                <span class="budget-value">{{ formatCurrency(campaign.budget) }}</span>
                <div class="budget-bar">
                  <div 
                    class="budget-bar-fill" 
                    :style="{ width: campaign.totals.budgetUsedPercent + '%' }"
                    :class="getBudgetBarClass(campaign.totals.budgetUsedPercent)"
                  ></div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import IconSort from './IconSort.vue';

const props = defineProps({
  campaigns: {
    type: Array,
    required: true
  }
});

const filters = [
  { label: 'Todas', value: 'all' },
  { label: 'Ativas', value: 'active' },
  { label: 'Pausadas', value: 'paused' },
  { label: 'Concluídas', value: 'completed' }
];

const statusLabels = {
  active: 'Ativa',
  paused: 'Pausada',
  completed: 'Concluída'
};

const currentFilter = ref('active');
const sortKey = ref('spend');
const sortDirection = ref('desc');

const filteredCampaigns = computed(() => {
  if (currentFilter.value === 'all') {
    return props.campaigns;
  }
  return props.campaigns.filter(c => c.status === currentFilter.value);
});

const sortedCampaigns = computed(() => {
  const campaigns = [...filteredCampaigns.value];
  
  campaigns.sort((a, b) => {
    let aVal, bVal;
    
    if (sortKey.value === 'name') {
      aVal = a.name;
      bVal = b.name;
    } else if (sortKey.value === 'status') {
      aVal = a.status;
      bVal = b.status;
    } else {
      aVal = a.totals[sortKey.value];
      bVal = b.totals[sortKey.value];
    }
    
    if (typeof aVal === 'string') {
      return sortDirection.value === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    
    return sortDirection.value === 'asc' ? aVal - bVal : bVal - aVal;
  });
  
  return campaigns;
});

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortDirection.value = 'desc';
  }
};

const formatNumber = (value) => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  }).format(value);
};

const getBudgetBarClass = (percent) => {
  if (percent >= 90) return 'budget-bar-fill--danger';
  if (percent >= 75) return 'budget-bar-fill--warning';
  return 'budget-bar-fill--success';
};
</script>

<style scoped>
.campaign-table-container {
  width: 100%;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.table-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.table-filters {
  display: flex;
  gap: 0.5rem;
  background: var(--color-background-secondary);
  padding: 0.25rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.filter-btn {
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
}

.filter-btn.active {
  background: var(--color-surface);
  color: var(--color-text-primary);
  box-shadow: var(--shadow-sm);
}

.filter-btn:hover:not(.active) {
  color: var(--color-text-primary);
}

.table-wrapper {
  overflow-x: auto;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.campaign-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.campaign-table thead {
  background: var(--color-background-secondary);
  border-bottom: 2px solid var(--color-border);
}

.campaign-table th {
  padding: var(--spacing-md);
  text-align: left;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.75rem;
  white-space: nowrap;
}

.campaign-table th.sortable {
  cursor: pointer;
  user-select: none;
  transition: color var(--transition-fast);
}

.campaign-table th.sortable:hover {
  color: var(--color-text-primary);
}

.campaign-table th span {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.campaign-table td {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-primary);
}

.table-row {
  transition: background-color var(--transition-fast);
}

.table-row:hover {
  background: var(--color-surface-elevated);
}

.campaign-name {
  min-width: 200px;
}

.name-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.name-text {
  font-weight: 600;
  color: var(--color-text-primary);
}

.objective-badge {
  font-size: 0.6875rem;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
}

.status-badge {
  display: inline-flex;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-badge--active {
  background: rgba(16, 185, 129, 0.15);
  color: var(--color-success-light);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.status-badge--paused {
  background: rgba(245, 158, 11, 0.15);
  color: var(--color-warning-light);
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.status-badge--completed {
  background: rgba(100, 116, 139, 0.15);
  color: var(--color-text-secondary);
  border: 1px solid rgba(100, 116, 139, 0.3);
}

.metric-value {
  font-family: var(--font-display);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.metric-value--highlight {
  color: var(--color-secondary-light);
}

.text-right {
  text-align: right;
}

.budget-cell {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
}

.budget-value {
  font-family: var(--font-display);
  font-weight: 600;
}

.budget-bar {
  width: 100px;
  height: 6px;
  background: var(--color-background-secondary);
  border-radius: 9999px;
  overflow: hidden;
}

.budget-bar-fill {
  height: 100%;
  border-radius: 9999px;
  transition: width var(--transition-slow);
}

.budget-bar-fill--success {
  background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
}

.budget-bar-fill--warning {
  background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%);
}

.budget-bar-fill--danger {
  background: linear-gradient(90deg, #ef4444 0%, #f87171 100%);
}

@media (max-width: 1024px) {
  .table-wrapper {
    overflow-x: auto;
  }
  
  .campaign-table {
    min-width: 1000px;
  }
}

@media (max-width: 768px) {
  .table-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .table-filters {
    width: 100%;
  }
  
  .filter-btn {
    flex: 1;
    text-align: center;
  }
}
</style>
