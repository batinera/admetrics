// Exemplo de integração com Facebook Marketing API
// Renomeie para facebookApi.js e configure suas credenciais

const API_VERSION = "v19.0";
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;

class FacebookAdsAPI {
  constructor(accessToken) {
    this.accessToken = accessToken;
  }

  async fetchCampaigns(accountId) {
    const fields = [
      "id",
      "name",
      "status",
      "objective",
      "start_time",
      "stop_time",
      "daily_budget",
      "lifetime_budget",
    ].join(",");

    const url = `${BASE_URL}/act_${accountId}/campaigns?fields=${fields}&access_token=${this.accessToken}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      return data.data;
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      throw error;
    }
  }

  async fetchInsights(campaignId, dateRange) {
    const fields = [
      "results",
      "reach",
      "impressions",
      "frequency",
      "spend",
      "cpm",
      "cpc",
      "clicks",
      "cost_per_result",
    ].join(",");

    const params = new URLSearchParams({
      fields,
      time_range: JSON.stringify(dateRange),
      access_token: this.accessToken,
    });

    const url = `${BASE_URL}/${campaignId}/insights?${params}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      return data.data[0] || null;
    } catch (error) {
      console.error("Error fetching insights:", error);
      throw error;
    }
  }

  async fetchTimeSeriesInsights(campaignId, dateRange) {
    const fields = [
      "results",
      "reach",
      "impressions",
      "frequency",
      "spend",
      "cpm",
      "clicks",
      "cost_per_result",
    ].join(",");

    const params = new URLSearchParams({
      fields,
      time_range: JSON.stringify(dateRange),
      time_increment: "1",
      access_token: this.accessToken,
    });

    const url = `${BASE_URL}/${campaignId}/insights?${params}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      return data.data || [];
    } catch (error) {
      console.error("Error fetching time series insights:", error);
      throw error;
    }
  }

  async fetchAllCampaignsWithInsights(accountId, dateRange) {
    try {
      const campaigns = await this.fetchCampaigns(accountId);

      const campaignsWithInsights = await Promise.all(
        campaigns.map(async (campaign) => {
          const insights = await this.fetchInsights(campaign.id, dateRange);
          const timeSeries = await this.fetchTimeSeriesInsights(
            campaign.id,
            dateRange,
          );

          return {
            ...campaign,
            insights,
            timeSeries,
          };
        }),
      );

      return campaignsWithInsights;
    } catch (error) {
      console.error("Error fetching campaigns with insights:", error);
      throw error;
    }
  }
}

// Uso:
// const api = new FacebookAdsAPI(import.meta.env.VITE_FB_ACCESS_TOKEN);
// const accountId = 'YOUR_AD_ACCOUNT_ID';
// const dateRange = { since: '2026-03-01', until: '2026-03-30' };
// const data = await api.fetchAllCampaignsWithInsights(accountId, dateRange);

export default FacebookAdsAPI;

// Transformação de dados da API para o formato da dashboard
export function transformFacebookData(apiData) {
  return apiData.map((campaign) => ({
    id: campaign.id,
    name: campaign.name,
    status: campaign.status.toLowerCase(),
    objective: campaign.objective,
    startDate: campaign.start_time,
    endDate: campaign.stop_time,
    budget: parseFloat(campaign.lifetime_budget || campaign.daily_budget || 0),
    totals: {
      results: parseInt(campaign.insights?.results || 0),
      reach: parseInt(campaign.insights?.reach || 0),
      impressions: parseInt(campaign.insights?.impressions || 0),
      clicks: parseInt(campaign.insights?.clicks || 0),
      spend: parseFloat(campaign.insights?.spend || 0),
      frequency: parseFloat(campaign.insights?.frequency || 0),
      cpm: parseFloat(campaign.insights?.cpm || 0),
      costPerResult: parseFloat(campaign.insights?.cost_per_result || 0),
    },
    dailyData:
      campaign.timeSeries?.map((day) => ({
        date: day.date_start,
        results: parseInt(day.results || 0),
        reach: parseInt(day.reach || 0),
        impressions: parseInt(day.impressions || 0),
        clicks: parseInt(day.clicks || 0),
        spend: parseFloat(day.spend || 0),
        cpm: parseFloat(day.cpm || 0),
        costPerResult: parseFloat(day.cost_per_result || 0),
        frequency: parseFloat(day.frequency || 0),
      })) || [],
  }));
}
