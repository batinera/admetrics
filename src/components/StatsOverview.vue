<template>
  <div class="stats-overview">
    <div class="stats-card">
      <div class="stats-icon stats-icon--campaigns">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="9" y1="3" x2="9" y2="21"></line>
        </svg>
      </div>
      <div class="stats-content">
        <span class="stats-label">Campanhas Ativas</span>
        <span class="stats-value">{{ activeCampaigns }}</span>
      </div>
    </div>
    
    <div class="stats-card">
      <div class="stats-icon stats-icon--performance">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      </div>
      <div class="stats-content">
        <span class="stats-label">Performance Média</span>
        <span class="stats-value">{{ avgPerformance }}%</span>
      </div>
    </div>
    
    <div class="stats-card">
      <div class="stats-icon stats-icon--roi">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      </div>
      <div class="stats-content">
        <span class="stats-label">ROI Estimado</span>
        <span class="stats-value">{{ roi }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  activeCampaigns: {
    type: Number,
    required: true
  },
  avgPerformance: {
    type: Number,
    required: true
  },
  roi: {
    type: Number,
    required: true
  }
});
</script>

<style scoped>
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.stats-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
}

.stats-card:hover {
  border-color: var(--color-border-light);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.stats-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stats-icon--campaigns {
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
  color: white;
}

.stats-icon--performance {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: white;
}

.stats-icon--roi {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
  color: white;
}

.stats-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stats-label {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.stats-value {
  font-size: 1.5rem;
  font-weight: 700;
  font-family: var(--font-display);
  color: var(--color-text-primary);
  line-height: 1;
}
</style>
