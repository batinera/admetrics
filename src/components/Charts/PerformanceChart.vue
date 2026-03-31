<template>
  <div class="chart-container card">
    <div class="chart-header">
      <h3>Performance ao Longo do Tempo</h3>
      <div class="chart-legend">
        <button 
          v-for="metric in metrics" 
          :key="metric.key"
          @click="toggleMetric(metric.key)"
          :class="['legend-item', { active: activeMetrics.includes(metric.key) }]"
          :style="{ '--legend-color': metric.color }"
        >
          <span class="legend-dot"></span>
          <span class="legend-label">{{ metric.label }}</span>
        </button>
      </div>
    </div>
    <div class="chart-wrapper">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { format, parseISO } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const props = defineProps({
  timeSeriesData: {
    type: Array,
    required: true
  }
});

const metrics = [
  { key: 'results', label: 'Resultados', color: '#4f46e5' },
  { key: 'reach', label: 'Alcance', color: '#06b6d4' },
  { key: 'impressions', label: 'Impressões', color: '#8b5cf6' }
];

const activeMetrics = ref(['results', 'reach', 'impressions']);

const toggleMetric = (key) => {
  const index = activeMetrics.value.indexOf(key);
  if (index > -1) {
    if (activeMetrics.value.length > 1) {
      activeMetrics.value.splice(index, 1);
    }
  } else {
    activeMetrics.value.push(key);
  }
};

const chartData = computed(() => {
  const labels = props.timeSeriesData.map(d => 
    format(parseISO(d.date), 'dd/MM')
  );
  
  const datasets = metrics
    .filter(m => activeMetrics.value.includes(m.key))
    .map(metric => ({
      label: metric.label,
      data: props.timeSeriesData.map(d => d[metric.key]),
      borderColor: metric.color,
      backgroundColor: metric.color + '20',
      borderWidth: 2.5,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: metric.color,
      pointHoverBorderColor: '#fff',
      pointHoverBorderWidth: 2,
      tension: 0.4,
      fill: true
    }));
  
  return { labels, datasets };
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
      usePointStyle: true,
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          label += new Intl.NumberFormat('pt-BR').format(context.parsed.y);
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
          if (value >= 1000) {
            return (value / 1000).toFixed(0) + 'k';
          }
          return value;
        }
      }
    }
  }
};
</script>

<style scoped>
.chart-container {
  min-height: 380px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.chart-header h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.chart-legend {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius-md);
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 0.8125rem;
  font-weight: 500;
  transition: all var(--transition-base);
  opacity: 0.5;
}

.legend-item.active {
  opacity: 1;
  border-color: var(--legend-color);
  background: color-mix(in srgb, var(--legend-color) 10%, transparent);
}

.legend-item:hover {
  opacity: 1;
  border-color: var(--legend-color);
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--legend-color);
  transition: all var(--transition-base);
}

.legend-item.active .legend-dot {
  box-shadow: 0 0 8px var(--legend-color);
}

.chart-wrapper {
  height: 300px;
  position: relative;
}

@media (max-width: 900px) {
  .chart-container {
    min-height: 340px;
  }
  
  .chart-wrapper {
    height: 260px;
  }
  
  .legend-item {
    font-size: 0.75rem;
    padding: 0.3125rem 0.625rem;
  }
}

@media (max-width: 600px) {
  .chart-container {
    min-height: 300px;
  }
  
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .chart-header h3 {
    font-size: 1rem;
  }
  
  .chart-legend {
    width: 100%;
    gap: 0.375rem;
  }
  
  .legend-item {
    flex: 1;
    justify-content: center;
    font-size: 0.6875rem;
    padding: 0.3125rem 0.5rem;
  }
  
  .legend-dot {
    width: 6px;
    height: 6px;
  }
  
  .chart-wrapper {
    height: 220px;
  }
}
</style>
