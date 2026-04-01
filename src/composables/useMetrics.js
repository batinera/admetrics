import { ref, computed } from "vue";
import { apiUrl } from "../utils/apiBase";
import {
  mockCampaigns,
  getOverallMetrics,
  getTimeSeriesData,
  getMetricsForCampaigns,
} from "../data/mockData";

const useMock = import.meta.env.VITE_USE_MOCK === "true";

function getStoredIntegrationId() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admetrics_integration_id");
}

export function setActiveIntegrationId(id) {
  if (id) {
    localStorage.setItem("admetrics_integration_id", id);
  } else {
    localStorage.removeItem("admetrics_integration_id");
  }
}

export function useMetrics() {
  const metrics = ref(null);
  const timeSeriesData = ref([]);
  const campaigns = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const selectedPeriod = ref("30");
  const selectedCampaigns = ref([]);
  const dateRange = ref(null);

  const integrationId = ref(getStoredIntegrationId());

  const allCampaigns = computed(() => {
    if (useMock) {
      return mockCampaigns;
    }
    return campaigns.value;
  });

  async function fetchDashboardFromApi(period) {
    const id = integrationId.value || getStoredIntegrationId();
    if (!id) {
      throw new Error("Nenhuma integração selecionada.");
    }
    const params = new URLSearchParams({
      integrationId: id,
      period: String(period),
    });
    if (selectedCampaigns.value.length > 0) {
      params.set("campaignIds", selectedCampaigns.value.join(","));
    }
    if (dateRange.value?.start && dateRange.value?.end) {
      params.set("dateRangeStart", dateRange.value.start);
      params.set("dateRangeEnd", dateRange.value.end);
    }
    const r = await fetch(apiUrl(`/api/dashboard?${params}`), {
      credentials: "include",
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      throw new Error(data.error || `Erro ${r.status}`);
    }
    return data;
  }

  const loadData = async (period = selectedPeriod.value) => {
    isLoading.value = true;
    error.value = null;

    try {
      if (useMock) {
        await new Promise((resolve) => setTimeout(resolve, 300));
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
          timeSeriesData.value = getTimeSeriesData(
            "results",
            parseInt(period, 10),
          );
          campaigns.value = mockCampaigns;
        }
        return;
      }

      const data = await fetchDashboardFromApi(period);
      metrics.value = data.metrics;
      timeSeriesData.value = data.timeSeriesData || [];
      campaigns.value = data.campaigns || [];
    } catch (e) {
      error.value = e.message || "Erro ao carregar dados";
      console.error("Error loading metrics:", e);
    } finally {
      isLoading.value = false;
    }
  };

  const refreshData = () => loadData(selectedPeriod.value);

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

  const syncIntegrationId = () => {
    integrationId.value = getStoredIntegrationId();
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

  return {
    metrics,
    timeSeriesData,
    campaigns,
    isLoading,
    error,
    selectedPeriod,
    selectedCampaigns,
    dateRange,
    integrationId,
    allCampaigns,
    loadData,
    refreshData,
    setPeriod,
    setSelectedCampaigns,
    setDateRange,
    syncIntegrationId,
    activeCampaignsCount,
    totalBudget,
    totalSpent,
  };
}
