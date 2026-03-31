<script setup>
import { computed, onMounted } from 'vue';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import QuickStats from './components/QuickStats.vue';
import MetricCard from './components/MetricCard.vue';
import PerformanceChart from './components/Charts/PerformanceChart.vue';
import CostAnalysisChart from './components/Charts/CostAnalysisChart.vue';
import BudgetDonutChart from './components/Charts/BudgetDonutChart.vue';
import CampaignTable from './components/CampaignTable.vue';
import LoadingSkeleton from './components/LoadingSkeleton.vue';
import ErrorState from './components/ErrorState.vue';
import { useMetrics } from './composables/useMetrics';

const {
  metrics,
  timeSeriesData,
  campaigns,
  isLoading,
  error,
  loadData,
  refreshData,
  setPeriod,
  setSelectedCampaigns,
  setDateRange,
  allCampaigns,
  totalBudget,
  totalSpent
} = useMetrics();
const handleRefresh = () => {
  refreshData();
};

const handlePeriodChange = (period) => {
  setPeriod(period);
};

const handleCampaignsChange = (campaignIds) => {
  setSelectedCampaigns(campaignIds);
};

const handleDateRangeChange = (range) => {
  setDateRange(range);
};

const handleExport = (format) => {
  if (format === 'csv') {
    exportToCsv();
  } else if (format === 'json') {
    exportToJson();
  }
};

const exportToCsv = () => {
  const headers = ['Campanha', 'Status', 'Resultados', 'Alcance', 'Impressões', 'Cliques', 'CPM', 'Custo/Resultado', 'Gasto', 'Orçamento'];
  const rows = campaigns.value.map(c => [
    c.name,
    c.status,
    c.totals.results,
    c.totals.reach,
    c.totals.impressions,
    c.totals.clicks,
    c.totals.cpm,
    c.totals.costPerResult,
    c.totals.spend,
    c.budget
  ]);
  
  const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
  downloadFile(csv, 'admetrics-export.csv', 'text/csv');
};

const exportToJson = () => {
  const data = {
    exportDate: new Date().toISOString(),
    metrics: metrics.value,
    campaigns: campaigns.value
  };
  
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, 'admetrics-export.json', 'application/json');
};

const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
onMounted(() => {
  console.log('App mounted, loading data...');
  loadData();
});

const metricCards = computed(() => {
  if (!metrics.value) return [];
  
  return [
    {
      id: 'results',
      label: 'Resultados',
      value: metrics.value.results.value,
      change: metrics.value.results.change,
      trend: metrics.value.results.change > 0 ? 'up' : 'down',
      icon: 'target',
      format: 'number',
      sparklineData: timeSeriesData.value.slice(-14).map(d => d.results)
    },
    {
      id: 'reach',
      label: 'Alcance',
      value: metrics.value.reach.value,
      change: metrics.value.reach.change,
      trend: metrics.value.reach.change > 0 ? 'up' : 'down',
      icon: 'users',
      format: 'number',
      sparklineData: timeSeriesData.value.slice(-14).map(d => d.reach)
    },
    {
      id: 'frequency',
      label: 'Frequência',
      value: metrics.value.frequency.value,
      change: metrics.value.frequency.change,
      trend: metrics.value.frequency.change > 0 ? 'up' : 'down',
      icon: 'trending',
      format: 'decimal',
      subtitle: 'vezes por pessoa'
    },
    {
      id: 'costPerResult',
      label: 'Custo por Resultado',
      value: metrics.value.costPerResult.value,
      change: metrics.value.costPerResult.change,
      trend: metrics.value.costPerResult.change < 0 ? 'up' : 'down',
      icon: 'dollar',
      format: 'currency',
      sparklineData: timeSeriesData.value.slice(-14).map(d => d.costPerResult)
    },
    {
      id: 'budget',
      label: 'Orçamento Total',
      value: metrics.value.budget.value,
      change: 0,
      trend: 'neutral',
      icon: 'dollar',
      format: 'currency',
      subtitle: `${metrics.value.activeCampaigns} campanhas ativas`
    },
    {
      id: 'spend',
      label: 'Valor Gasto',
      value: metrics.value.spend.value,
      change: metrics.value.spend.change,
      trend: metrics.value.spend.change > 0 ? 'up' : 'down',
      icon: 'dollar',
      format: 'currency',
      sparklineData: timeSeriesData.value.slice(-14).map(d => d.spend)
    },
    {
      id: 'impressions',
      label: 'Impressões',
      value: metrics.value.impressions.value,
      change: metrics.value.impressions.change,
      trend: metrics.value.impressions.change > 0 ? 'up' : 'down',
      icon: 'eye',
      format: 'number',
      sparklineData: timeSeriesData.value.slice(-14).map(d => d.impressions)
    },
    {
      id: 'cpm',
      label: 'CPM',
      value: metrics.value.cpm.value,
      change: metrics.value.cpm.change,
      trend: metrics.value.cpm.change < 0 ? 'up' : 'down',
      icon: 'chart',
      format: 'currency',
      subtitle: 'custo por mil impressões',
      sparklineData: timeSeriesData.value.slice(-14).map(d => d.cpm)
    },
    {
      id: 'clicks',
      label: 'Cliques no Link',
      value: metrics.value.clicks.value,
      change: metrics.value.clicks.change,
      trend: metrics.value.clicks.change > 0 ? 'up' : 'down',
      icon: 'click',
      format: 'number',
      sparklineData: timeSeriesData.value.slice(-14).map(d => d.clicks)
    },
    {
      id: 'cpc',
      label: 'CPC',
      value: metrics.value.cpc.value,
      change: metrics.value.cpc.change,
      trend: metrics.value.cpc.change < 0 ? 'up' : 'down',
      icon: 'dollar',
      format: 'currency',
      subtitle: 'custo por clique',
      sparklineData: timeSeriesData.value.slice(-14).map(d => d.cpc)
    },
    {
      id: 'ctr',
      label: 'CTR',
      value: metrics.value.ctr.value,
      change: metrics.value.ctr.change,
      trend: metrics.value.ctr.change > 0 ? 'up' : 'down',
      icon: 'click',
      format: 'percent',
      subtitle: 'taxa de cliques'
    },
    {
      id: 'engagement',
      label: 'Engajamento',
      value: metrics.value.engagement.value,
      change: metrics.value.engagement.change,
      trend: metrics.value.engagement.change > 0 ? 'up' : 'down',
      icon: 'target',
      format: 'percent',
      subtitle: 'taxa de conversão'
    }
  ];
});
</script>

<template>
  <div class="app">
    <Header 
      @refresh="handleRefresh" 
      @period-change="handlePeriodChange" 
      @campaigns-change="handleCampaignsChange"
      @daterange-change="handleDateRangeChange"
      @export="handleExport"
      :all-campaigns="allCampaigns"
    />
    
    <main class="dashboard-main">
      <div class="container">
        <LoadingSkeleton v-if="isLoading" />
        
        <ErrorState v-else-if="error" :message="error" @retry="loadData" />
        
        <div v-else-if="metrics">
          <QuickStats 
            :active-campaigns="metrics.activeCampaigns"
            :total-results="metrics.results.value"
            :total-clicks="metrics.clicks.value"
            :total-spent="metrics.spend.value"
          />
          
          <div class="dashboard-grid">
            <MetricCard
              v-for="metric in metricCards"
              :key="metric.label"
              :label="metric.label"
              :value="metric.value"
              :change="metric.change"
              :trend="metric.trend"
              :icon="metric.icon"
              :format="metric.format"
              :subtitle="metric.subtitle"
              :sparkline-data="metric.sparklineData"
            />
          </div>
          
          <div class="charts-grid">
            <PerformanceChart 
              :time-series-data="timeSeriesData"
            />
            
            <div class="charts-row">
              <CostAnalysisChart 
                :time-series-data="timeSeriesData"
              />
              
              <BudgetDonutChart
                :total-budget="totalBudget"
                :total-spent="totalSpent"
              />
            </div>
          </div>
          
          <CampaignTable 
            :campaigns="campaigns"
          />
        </div>
      </div>
    </main>
    
    <Footer />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: var(--color-background);
}

.dashboard-main {
  padding-top: var(--spacing-xl);
  padding-bottom: var(--spacing-3xl);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.charts-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.charts-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-lg);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-slow);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (min-width: 1600px) {
  .dashboard-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 1200px) {
  .dashboard-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-md);
  }
}

@media (max-width: 900px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
  }
  
  .charts-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .dashboard-main {
    padding-top: var(--spacing-md);
    padding-bottom: var(--spacing-xl);
  }
  
  .charts-grid {
    gap: var(--spacing-md);
  }
  
  .charts-row {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
}
</style>

