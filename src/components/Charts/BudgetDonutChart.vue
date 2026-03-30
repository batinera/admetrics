<template>
  <div class="chart-container card">
    <div class="chart-header">
      <h3>Orçamento vs. Gasto</h3>
    </div>
    <div class="chart-wrapper">
      <Doughnut :data="chartData" :options="chartOptions" />
      <div class="chart-center-label">
        <div class="center-value">{{ usedPercent }}%</div>
        <div class="center-label">Utilizado</div>
      </div>
    </div>
    <div class="budget-stats">
      <div class="budget-stat">
        <span class="stat-label">Total Gasto</span>
        <span class="stat-value stat-value--spent">{{ formatCurrency(totalSpent) }}</span>
      </div>
      <div class="budget-stat">
        <span class="stat-label">Restante</span>
        <span class="stat-value stat-value--remaining">{{ formatCurrency(totalBudget - totalSpent) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps({
  totalBudget: {
    type: Number,
    required: true
  },
  totalSpent: {
    type: Number,
    required: true
  }
});

const usedPercent = computed(() => {
  return ((props.totalSpent / props.totalBudget) * 100).toFixed(1);
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const chartData = computed(() => ({
  labels: ['Gasto', 'Disponível'],
  datasets: [{
    data: [props.totalSpent, props.totalBudget - props.totalSpent],
    backgroundColor: [
      'rgba(124, 58, 237, 0.8)',
      'rgba(100, 116, 139, 0.2)'
    ],
    borderColor: [
      '#7c3aed',
      '#475569'
    ],
    borderWidth: 2,
    hoverOffset: 8
  }]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '75%',
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: '#1a1f35',
      titleColor: '#f8fafc',
      bodyColor: '#94a3b8',
      borderColor: '#2d3548',
      borderWidth: 1,
      padding: 12,
      displayColors: true,
      boxPadding: 6,
      callbacks: {
        label: function(context) {
          const label = context.label || '';
          const value = context.parsed;
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${label}: R$ ${value.toFixed(2)} (${percentage}%)`;
        }
      }
    }
  }
};
</script>

<style scoped>
.chart-container {
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.chart-header {
  margin-bottom: var(--spacing-lg);
}

.chart-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.chart-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 240px;
}

.chart-center-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}

.center-value {
  font-size: 2.5rem;
  font-weight: 800;
  font-family: var(--font-display);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.center-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-top: 0.5rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.budget-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

.budget-stat {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-label {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  font-family: var(--font-display);
}

.stat-value--spent {
  color: var(--color-secondary-light);
}

.stat-value--remaining {
  color: var(--color-success-light);
}
</style>
