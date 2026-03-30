<template>
  <div class="quick-stats">
    <div class="stat-item fade-in-up stagger-1">
      <div class="stat-icon stat-icon--primary">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="9" y1="3" x2="9" y2="21"></line>
        </svg>
      </div>
      <div class="stat-content">
        <span class="stat-label">Campanhas Ativas</span>
        <span class="stat-value">{{ activeCampaigns }}</span>
      </div>
    </div>
    
    <div class="stat-divider"></div>
    
    <div class="stat-item fade-in-up stagger-2">
      <div class="stat-icon stat-icon--success">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      </div>
      <div class="stat-content">
        <span class="stat-label">Taxa de Conversão</span>
        <span class="stat-value">{{ conversionRate }}%</span>
      </div>
    </div>
    
    <div class="stat-divider"></div>
    
    <div class="stat-item fade-in-up stagger-3">
      <div class="stat-icon stat-icon--warning">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      </div>
      <div class="stat-content">
        <span class="stat-label">ROI Médio</span>
        <span class="stat-value">{{ roi }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  activeCampaigns: {
    type: Number,
    required: true
  },
  totalResults: {
    type: Number,
    required: true
  },
  totalClicks: {
    type: Number,
    required: true
  },
  totalSpent: {
    type: Number,
    required: true
  }
});

const conversionRate = computed(() => {
  if (props.totalClicks === 0) return 0;
  return ((props.totalResults / props.totalClicks) * 100).toFixed(1);
});

const roi = computed(() => {
  const estimatedRevenue = props.totalResults * 50;
  if (props.totalSpent === 0) return 0;
  return (((estimatedRevenue - props.totalSpent) / props.totalSpent) * 100).toFixed(0);
});
</script>

<style scoped>
.quick-stats {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg) var(--spacing-xl);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-xl);
  box-shadow: var(--shadow-md);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex: 1;
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all var(--transition-base);
}

.stat-icon--primary {
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
  color: white;
}

.stat-icon--success {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: white;
}

.stat-icon--warning {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
  color: white;
}

.stat-item:hover .stat-icon {
  transform: scale(1.1) rotate(-2deg);
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  font-family: var(--font-display);
  color: var(--color-text-primary);
  line-height: 1;
}

.stat-divider {
  width: 1px;
  height: 44px;
  background: var(--color-border);
}

@media (max-width: 1024px) {
  .quick-stats {
    flex-wrap: wrap;
  }
  
  .stat-divider {
    display: none;
  }
  
  .stat-item {
    min-width: calc(50% - var(--spacing-lg) / 2);
  }
}

@media (max-width: 768px) {
  .quick-stats {
    flex-direction: column;
    padding: var(--spacing-md);
  }
  
  .stat-item {
    width: 100%;
    padding: var(--spacing-md);
    background: var(--color-surface-elevated);
    border-radius: var(--radius-md);
  }
}
</style>
