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
    // #region agent log
    fetch("http://127.0.0.1:7337/ingest/25b36a14-8e5f-4b32-9168-eb48b1e02f7b", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "29027b",
      },
      body: JSON.stringify({
        sessionId: "29027b",
        location: "useMetrics.js:loadData-start",
        message: "loadData started",
        data: {
          period: period,
          selectedCampaignsLength: selectedCampaigns.value.length,
          dateRange: dateRange.value,
        },
        timestamp: Date.now(),
        runId: "initial",
        hypothesisId: "B",
      }),
    }).catch(() => {});
    // #endregion
    isLoading.value = true;
    error.value = null;

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (selectedCampaigns.value.length > 0 || dateRange.value) {
        const filteredData = getMetricsForCampaigns(
          selectedCampaigns.value,
          dateRange.value,
        );
        metrics.value = filteredData;
        timeSeriesData.value = filteredData.timeSeriesData || [];
        campaigns.value = filteredData.campaigns || [];
      } else {
        metrics.value = getOverallMetrics();
        timeSeriesData.value = getTimeSeriesData("results", parseInt(period));
        campaigns.value = mockCampaigns;
      }

      // #region agent log
      fetch(
        "http://127.0.0.1:7337/ingest/25b36a14-8e5f-4b32-9168-eb48b1e02f7b",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "29027b",
          },
          body: JSON.stringify({
            sessionId: "29027b",
            location: "useMetrics.js:loadData-success",
            message: "Data loaded successfully",
            data: {
              hasMetrics: !!metrics.value,
              activeCampaigns: metrics.value?.activeCampaigns,
              resultsValue: metrics.value?.results?.value,
              clicksValue: metrics.value?.clicks?.value,
              spendValue: metrics.value?.spend?.value,
              metricsStructure: metrics.value
                ? Object.keys(metrics.value)
                : null,
            },
            timestamp: Date.now(),
            runId: "initial",
            hypothesisId: "B",
          }),
        },
      ).catch(() => {});
      // #endregion

      console.log("Data loaded successfully:", {
        metrics: metrics.value,
        timeSeriesDataLength: timeSeriesData.value.length,
        campaignsCount: campaigns.value.length,
      });
    } catch (e) {
      error.value = e.message;
      console.error("Error loading metrics:", e);
      // #region agent log
      fetch(
        "http://127.0.0.1:7337/ingest/25b36a14-8e5f-4b32-9168-eb48b1e02f7b",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Debug-Session-Id": "29027b",
          },
          body: JSON.stringify({
            sessionId: "29027b",
            location: "useMetrics.js:loadData-error",
            message: "Error loading data",
            data: { errorMessage: e.message, errorStack: e.stack },
            timestamp: Date.now(),
            runId: "initial",
            hypothesisId: "B",
          }),
        },
      ).catch(() => {});
      // #endregion
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
