<template>
  <div class="chart-container card">
    <div class="chart-header">
      <h3>Análise de Custos</h3>
      <div class="chart-period">
        <span class="period-label">Últimos {{ timeSeriesData.length }} dias</span>
      </div>
    </div>
    <div class="chart-wrapper">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { format, parseISO } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const props = defineProps({
  timeSeriesData: {
    type: Array,
    required: true
  }
});

const chartData = computed(() => {
  const labels = props.timeSeriesData.map(d => 
    format(parseISO(d.date), 'dd/MM')
  );
  
  return {
    labels,
    datasets: [
      {
        label: 'CPM (R$)',
        data: props.timeSeriesData.map(d => d.cpm),
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
        borderColor: '#f59e0b',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      },
      {
        label: 'Custo por Resultado (R$)',
        data: props.timeSeriesData.map(d => d.costPerResult),
        backgroundColor: 'rgba(124, 58, 237, 0.8)',
        borderColor: '#7c3aed',
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      }
    ]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      display: true,
      position: 'top',
      align: 'end',
      labels: {
        color: '#94a3b8',
        font: {
          family: 'DM Sans',
          size: 12,
          weight: 500
        },
        padding: 16,
        usePointStyle: true,
        pointStyle: 'circle'
      }
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
      usePointStyle: true,
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          label += 'R$ ' + context.parsed.y.toFixed(2);
          return label;
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false
      },
      ticks: {
        color: '#64748b',
        font: {
          family: 'DM Sans',
          size: 11
        }
      }
    },
    y: {
      grid: {
        color: '#2d3548',
        drawBorder: false
      },
      ticks: {
        color: '#64748b',
        font: {
          family: 'DM Sans',
          size: 11
        },
        callback: function(value) {
          return 'R$ ' + value.toFixed(2);
        }
      }
    }
  }
};
</script>

<style scoped>
.chart-container {
  min-height: 400px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.chart-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.period-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  padding: 0.5rem 1rem;
  background: var(--color-surface-elevated);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.chart-wrapper {
  height: 320px;
  position: relative;
}
</style>
