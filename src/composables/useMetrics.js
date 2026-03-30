import { ref, computed, watch } from "vue";
import {
  mockCampaigns,
  getOverallMetrics,
  getTimeSeriesData,
  getMetricsForCampaigns,
} from "../data/mockData";

export function useMetrics() {
  const metrics = ref(null);
  const timeSeriesData = ref([]);
  const campaigns = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const selectedPeriod = ref("30");
  const selectedCampaigns = ref([]);
  const dateRange = ref(null);

  const loadData = async (period = selectedPeriod.value) => {
    console.log("loadData called, period:", period);
    isLoading.value = true;
    error.value = null;

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (selectedCampaigns.value.length > 0 || dateRange.value) {
        const filteredData = getMetricsForCampaigns(selectedCampaigns.value, dateRange.value);
        metrics.value = filteredData;
        timeSeriesData.value = filteredData.timeSeriesData || [];
        campaigns.value = filteredData.campaigns || [];
      } else {
        metrics.value = getOverallMetrics();
        timeSeriesData.value = getTimeSeriesData("results", parseInt(period));
        campaigns.value = mockCampaigns;
      }

      console.log("Data loaded successfully:", {
        metrics: metrics.value,
        timeSeriesDataLength: timeSeriesData.value.length,
        campaignsCount: campaigns.value.length,
      });
    } catch (e) {
      error.value = e.message;
      console.error("Error loading metrics:", e);
    } finally {
      isLoading.value = false;
      console.log("Loading finished, isLoading:", isLoading.value);
    }
  };

  const refreshData = () => {
    return loadData(selectedPeriod.value);
  };

  const setPeriod = (period) => {
    selectedPeriod.value = period;
    return loadData(period);
  };
  
  const setSelectedCampaigns = (campaignIds) => {
    selectedCampaigns.value = campaignIds;
    return loadData(selectedPeriod.value);
  };
  
  const setDateRange = (range) => {
    dateRange.value = range;
    return loadData(selectedPeriod.value);
  };

  const activeCampaignsCount = computed(() => {
    return campaigns.value.filter((c) => c.status === "active").length;
  });

  const totalBudget = computed(() => {
    return campaigns.value
      .filter((c) => c.status === "active")
      .reduce((sum, c) => sum + c.budget, 0);
  });

  const totalSpent = computed(() => {
    return campaigns.value
      .filter((c) => c.status === "active")
      .reduce((sum, c) => sum + c.totals.spend, 0);
  });
  
  const allCampaigns = computed(() => mockCampaigns);

  return {
    metrics,
    timeSeriesData,
    campaigns,
    isLoading,
    error,
    selectedPeriod,
    selectedCampaigns,
    dateRange,
    allCampaigns,
    loadData,
    refreshData,
    setPeriod,
    setSelectedCampaigns,
    setDateRange,
    activeCampaignsCount,
    totalBudget,
    totalSpent,
  };
}
