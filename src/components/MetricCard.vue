<template>
  <article class="metric-card card" role="article" :aria-label="`${label}: ${formattedValue}`">
    <div class="metric-card__header">
      <div class="metric-card__icon" :style="{ background: iconGradient }" role="img" :aria-label="`Ícone de ${label}`">
        <component :is="iconComponent" />
      </div>
      <div class="metric-card__header-actions">
        <div class="metric-card__change" :class="changeClass" role="status" :aria-label="`Variação de ${Math.abs(change)}%`">
          <svg v-if="trend === 'up'" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 3L13 8L11.6 9.4L9 6.8V13H7V6.8L4.4 9.4L3 8L8 3Z" fill="currentColor"/>
          </svg>
          <svg v-if="trend === 'down'" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 13L3 8L4.4 6.6L7 9.2V3H9V9.2L11.6 6.6L13 8L8 13Z" fill="currentColor"/>
          </svg>
          <span>{{ Math.abs(change) }}%</span>
        </div>
        <button 
          v-if="removable && metricId"
          type="button"
          class="metric-card__remove-btn"
          @click="emit('remove', metricId)"
          aria-label="Remover métrica"
          title="Remover métrica"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
    
    <div class="metric-card__content">
      <h4 class="metric-card__label">{{ label }}</h4>
      <div class="metric-card__value" role="text">{{ formattedValue }}</div>
      <div v-if="subtitle" class="metric-card__subtitle">{{ subtitle }}</div>
    </div>
    
    <div v-if="sparklineData" class="metric-card__sparkline" role="img" :aria-label="`Gráfico de tendência de ${label}`">
      <svg :width="sparklineWidth" :height="sparklineHeight" :viewBox="`0 0 ${sparklineWidth} ${sparklineHeight}`">
        <defs>
          <linearGradient id="gradient-success" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#10b981" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#10b981" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="gradient-danger" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ef4444" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#ef4444" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="gradient-primary" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#6366f1" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#6366f1" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <path :d="sparklinePath" :stroke="sparklineColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path :d="sparklinePath + ` L ${sparklineWidth} ${sparklineHeight} L 0 ${sparklineHeight} Z`" :fill="sparklineFillGradient" opacity="0.2"/>
      </svg>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';
import IconChart from './IconChart.vue';
import IconUsers from './IconUsers.vue';
import IconEye from './IconEye.vue';
import IconDollar from './IconDollar.vue';
import IconClick from './IconClick.vue';
import IconTarget from './IconTarget.vue';
import IconCalendar from './IconCalendar.vue';
import IconTrending from './IconTrending.vue';

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  change: {
    type: Number,
    default: 0
  },
  trend: {
    type: String,
    default: 'neutral',
    validator: (value) => ['up', 'down', 'neutral'].includes(value)
  },
  icon: {
    type: String,
    default: 'chart'
  },
  format: {
    type: String,
    default: 'number'
  },
  subtitle: {
    type: String,
    default: ''
  },
  sparklineData: {
    type: Array,
    default: null
  },
  metricId: {
    type: String,
    default: ''
  },
  removable: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['remove']);

const iconComponent = computed(() => {
  const icons = {
    chart: IconChart,
    users: IconUsers,
    eye: IconEye,
    dollar: IconDollar,
    click: IconClick,
    target: IconTarget,
    calendar: IconCalendar,
    trending: IconTrending
  };
  return icons[props.icon] || IconChart;
});

const iconGradient = computed(() => {
  const gradients = {
    chart: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    users: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    eye: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
    dollar: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    click: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    target: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
    calendar: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    trending: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)'
  };
  return gradients[props.icon] || gradients.chart;
});

const changeClass = computed(() => {
  if (props.trend === 'up') return 'metric-card__change--positive';
  if (props.trend === 'down') return 'metric-card__change--negative';
  return 'metric-card__change--neutral';
});

const formattedValue = computed(() => {
  const val = props.value;
  
  if (props.format === 'currency') {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(val);
  }
  
  if (props.format === 'percent') {
    return `${val}%`;
  }
  
  if (props.format === 'decimal') {
    return parseFloat(val).toFixed(2);
  }
  
  if (typeof val === 'number' && val >= 1000) {
    return new Intl.NumberFormat('pt-BR').format(val);
  }
  
  return val;
});

const sparklineWidth = 120;
const sparklineHeight = 40;

const sparklinePath = computed(() => {
  if (!props.sparklineData || props.sparklineData.length === 0) return '';
  
  const data = props.sparklineData;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * sparklineWidth;
    const y = sparklineHeight - ((value - min) / range) * sparklineHeight;
    return `${x},${y}`;
  });
  
  return `M ${points.join(' L ')}`;
});

const sparklineColor = computed(() => {
  if (props.trend === 'up') return '#10b981';
  if (props.trend === 'down') return '#ef4444';
  return '#6366f1';
});

const sparklineFillGradient = computed(() => {
  if (props.trend === 'up') return 'url(#gradient-success)';
  if (props.trend === 'down') return 'url(#gradient-danger)';
  return 'url(#gradient-primary)';
});
</script>

<style scoped>
.metric-card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  min-height: 140px;
  position: relative;
  background: var(--color-surface);
  cursor: pointer;
}

.metric-card:active {
  transform: translateY(-1px) scale(0.99);
}

.metric-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-sm);
}

.metric-card__header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  margin-left: auto;
}

.metric-card__icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
  flex-shrink: 0;
  transition: all var(--transition-base);
}

.metric-card:hover .metric-card__icon {
  transform: scale(1.05) rotate(2deg);
  box-shadow: var(--shadow-lg);
}

.metric-card__remove-btn {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.35);
  border: none;
  border-radius: var(--radius-sm);
  color: var(--color-text-tertiary);
  cursor: pointer;
  opacity: 0;
  transition: all var(--transition-fast);
  backdrop-filter: blur(4px);
}

.metric-card:hover .metric-card__remove-btn {
  opacity: 1;
}

.metric-card__remove-btn:hover {
  background: rgba(239, 68, 68, 0.3);
  color: #ef4444;
  transform: scale(1.05);
}

.metric-card__remove-btn:active {
  transform: scale(0.95);
}

.metric-card__icon svg {
  width: 20px;
  height: 20px;
  color: white;
}

.metric-card__change {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: var(--font-display);
}

.metric-card__change--positive {
  background: rgba(16, 185, 129, 0.15);
  color: var(--color-success-light);
}

.metric-card__change--negative {
  background: rgba(239, 68, 68, 0.15);
  color: var(--color-danger-light);
}

.metric-card__change--neutral {
  background: rgba(100, 116, 139, 0.15);
  color: var(--color-text-secondary);
}

.metric-card__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.metric-card__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-family: var(--font-body);
}

.metric-card__value {
  font-size: 1.5rem;
  font-weight: 800;
  font-family: var(--font-display);
  color: var(--color-text-primary);
  line-height: 1;
  letter-spacing: -0.02em;
  transition: all var(--transition-base);
}

.metric-card:hover .metric-card__value {
  transform: scale(1.02);
}

.metric-card__subtitle {
  font-size: 0.8125rem;
  color: var(--color-text-tertiary);
  margin-top: -0.25rem;
}

.metric-card__sparkline {
  margin-top: auto;
  opacity: 0.8;
}

.metric-card:hover .metric-card__sparkline {
  opacity: 1;
}
</style>
