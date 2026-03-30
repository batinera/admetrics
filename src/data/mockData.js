import { subDays, format } from "date-fns";

const generateDailyData = (days = 30) => {
  const data = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    const baseResults = 150 + Math.random() * 100;
    const baseReach = 5000 + Math.random() * 3000;
    const baseImpressions = baseReach * (2 + Math.random());
    const baseClicks = baseResults * (1.2 + Math.random() * 0.5);
    const baseSpend = 200 + Math.random() * 150;

    data.push({
      date: format(date, "yyyy-MM-dd"),
      results: Math.round(baseResults),
      reach: Math.round(baseReach),
      impressions: Math.round(baseImpressions),
      clicks: Math.round(baseClicks),
      spend: parseFloat(baseSpend.toFixed(2)),
      cpm: parseFloat(((baseSpend / baseImpressions) * 1000).toFixed(2)),
      costPerResult: parseFloat((baseSpend / baseResults).toFixed(2)),
      frequency: parseFloat((baseImpressions / baseReach).toFixed(2)),
    });
  }

  return data;
};

const campaigns = [
  {
    id: "camp_001",
    name: "Campanha Verão 2026",
    status: "active",
    objective: "Conversões",
    startDate: "2026-03-01",
    endDate: "2026-04-30",
    budget: 15000,
    dailyData: generateDailyData(30),
  },
  {
    id: "camp_002",
    name: "Lançamento Produto X",
    status: "active",
    objective: "Tráfego",
    startDate: "2026-03-15",
    endDate: "2026-04-15",
    budget: 8000,
    dailyData: generateDailyData(15),
  },
  {
    id: "camp_003",
    name: "Remarketing Q1",
    status: "active",
    objective: "Conversões",
    startDate: "2026-03-10",
    endDate: "2026-05-10",
    budget: 12000,
    dailyData: generateDailyData(20),
  },
  {
    id: "camp_004",
    name: "Brand Awareness",
    status: "paused",
    objective: "Alcance",
    startDate: "2026-02-01",
    endDate: "2026-03-31",
    budget: 5000,
    dailyData: generateDailyData(30),
  },
  {
    id: "camp_005",
    name: "Promoção Relâmpago",
    status: "completed",
    objective: "Conversões",
    startDate: "2026-02-20",
    endDate: "2026-03-05",
    budget: 3000,
    dailyData: generateDailyData(14),
  },
];

const calculateCampaignTotals = (campaign) => {
  const totals = campaign.dailyData.reduce(
    (acc, day) => ({
      results: acc.results + day.results,
      reach: acc.reach + day.reach,
      impressions: acc.impressions + day.impressions,
      clicks: acc.clicks + day.clicks,
      spend: acc.spend + day.spend,
    }),
    { results: 0, reach: 0, impressions: 0, clicks: 0, spend: 0 },
  );

  const avgFrequency = totals.impressions / totals.reach;
  const avgCpm = (totals.spend / totals.impressions) * 1000;
  const avgCostPerResult = totals.spend / totals.results;

  return {
    ...campaign,
    totals: {
      ...totals,
      spend: parseFloat(totals.spend.toFixed(2)),
      frequency: parseFloat(avgFrequency.toFixed(2)),
      cpm: parseFloat(avgCpm.toFixed(2)),
      costPerResult: parseFloat(avgCostPerResult.toFixed(2)),
      budgetRemaining: parseFloat((campaign.budget - totals.spend).toFixed(2)),
      budgetUsedPercent: parseFloat(
        ((totals.spend / campaign.budget) * 100).toFixed(1),
      ),
    },
  };
};

export const mockCampaigns = campaigns.map(calculateCampaignTotals);

export const getOverallMetrics = () => {
  const activeCampaigns = mockCampaigns.filter((c) => c.status === "active");

  const overall = activeCampaigns.reduce(
    (acc, campaign) => ({
      results: acc.results + campaign.totals.results,
      reach: acc.reach + campaign.totals.reach,
      impressions: acc.impressions + campaign.totals.impressions,
      clicks: acc.clicks + campaign.totals.clicks,
      spend: acc.spend + campaign.totals.spend,
      budget: acc.budget + campaign.budget,
    }),
    { results: 0, reach: 0, impressions: 0, clicks: 0, spend: 0, budget: 0 },
  );

  const previousPeriodMultiplier = 0.85;

  return {
    results: {
      value: overall.results,
      change: parseFloat(
        (
          ((overall.results - overall.results * previousPeriodMultiplier) /
            (overall.results * previousPeriodMultiplier)) *
          100
        ).toFixed(1),
      ),
      trend: "up",
    },
    reach: {
      value: overall.reach,
      change: parseFloat(
        (
          ((overall.reach - overall.reach * previousPeriodMultiplier) /
            (overall.reach * previousPeriodMultiplier)) *
          100
        ).toFixed(1),
      ),
      trend: "up",
    },
    frequency: {
      value: parseFloat((overall.impressions / overall.reach).toFixed(2)),
      change: 5.2,
      trend: "up",
    },
    costPerResult: {
      value: parseFloat((overall.spend / overall.results).toFixed(2)),
      change: -8.3,
      trend: "down",
    },
    budget: {
      value: overall.budget,
      change: 0,
      trend: "neutral",
    },
    spend: {
      value: parseFloat(overall.spend.toFixed(2)),
      change: 12.4,
      trend: "up",
    },
    impressions: {
      value: overall.impressions,
      change: 18.7,
      trend: "up",
    },
    cpm: {
      value: parseFloat(
        ((overall.spend / overall.impressions) * 1000).toFixed(2),
      ),
      change: -3.2,
      trend: "down",
    },
    clicks: {
      value: overall.clicks,
      change: 22.1,
      trend: "up",
    },
    activeCampaigns: activeCampaigns.length,
  };
};

export const getTimeSeriesData = (metric = "results", days = 30) => {
  const allDailyData = {};

  mockCampaigns
    .filter((c) => c.status === "active")
    .forEach((campaign) => {
      campaign.dailyData.forEach((day) => {
        if (!allDailyData[day.date]) {
          allDailyData[day.date] = {
            date: day.date,
            results: 0,
            reach: 0,
            impressions: 0,
            clicks: 0,
            spend: 0,
            cpm: 0,
            costPerResult: 0,
          };
        }
        allDailyData[day.date].results += day.results;
        allDailyData[day.date].reach += day.reach;
        allDailyData[day.date].impressions += day.impressions;
        allDailyData[day.date].clicks += day.clicks;
        allDailyData[day.date].spend += day.spend;
      });
    });

  const sortedData = Object.values(allDailyData)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-days);

  sortedData.forEach((day) => {
    day.cpm = parseFloat(((day.spend / day.impressions) * 1000).toFixed(2));
    day.costPerResult = parseFloat((day.spend / day.results).toFixed(2));
  });

  return sortedData;
};

export const getMetricsForCampaigns = (campaignIds = [], dateRange = null) => {
  let filteredCampaigns = mockCampaigns;
  
  if (campaignIds.length > 0) {
    filteredCampaigns = mockCampaigns.filter(c => campaignIds.includes(c.id));
  }
  
  const allDailyData = {};
  
  filteredCampaigns.forEach((campaign) => {
    campaign.dailyData.forEach((day) => {
      if (dateRange) {
        const dayDate = new Date(day.date);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        
        if (dayDate < startDate || dayDate > endDate) {
          return;
        }
      }
      
      if (!allDailyData[day.date]) {
        allDailyData[day.date] = {
          date: day.date,
          results: 0,
          reach: 0,
          impressions: 0,
          clicks: 0,
          spend: 0,
        };
      }
      allDailyData[day.date].results += day.results;
      allDailyData[day.date].reach += day.reach;
      allDailyData[day.date].impressions += day.impressions;
      allDailyData[day.date].clicks += day.clicks;
      allDailyData[day.date].spend += day.spend;
    });
  });
  
  const sortedData = Object.values(allDailyData)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  
  const totals = sortedData.reduce(
    (acc, day) => ({
      results: acc.results + day.results,
      reach: acc.reach + day.reach,
      impressions: acc.impressions + day.impressions,
      clicks: acc.clicks + day.clicks,
      spend: acc.spend + day.spend,
      budget: acc.budget,
    }),
    { results: 0, reach: 0, impressions: 0, clicks: 0, spend: 0, budget: filteredCampaigns.reduce((sum, c) => sum + c.budget, 0) }
  );
  
  const previousPeriodMultiplier = 0.85;
  
  return {
    results: {
      value: totals.results,
      change: parseFloat(
        (((totals.results - totals.results * previousPeriodMultiplier) / (totals.results * previousPeriodMultiplier)) * 100).toFixed(1)
      ),
      trend: "up",
    },
    reach: {
      value: totals.reach,
      change: parseFloat(
        (((totals.reach - totals.reach * previousPeriodMultiplier) / (totals.reach * previousPeriodMultiplier)) * 100).toFixed(1)
      ),
      trend: "up",
    },
    frequency: {
      value: parseFloat((totals.impressions / totals.reach).toFixed(2)),
      change: 5.2,
      trend: "up",
    },
    costPerResult: {
      value: parseFloat((totals.spend / totals.results).toFixed(2)),
      change: -8.3,
      trend: "down",
    },
    budget: {
      value: totals.budget,
      change: 0,
      trend: "neutral",
    },
    spend: {
      value: parseFloat(totals.spend.toFixed(2)),
      change: 12.4,
      trend: "up",
    },
    impressions: {
      value: totals.impressions,
      change: 18.7,
      trend: "up",
    },
    cpm: {
      value: parseFloat(((totals.spend / totals.impressions) * 1000).toFixed(2)),
      change: -3.2,
      trend: "down",
    },
    clicks: {
      value: totals.clicks,
      change: 22.1,
      trend: "up",
    },
    activeCampaigns: filteredCampaigns.filter(c => c.status === 'active').length,
    timeSeriesData: sortedData,
    campaigns: filteredCampaigns,
  };
};

export default {
  mockCampaigns,
  getOverallMetrics,
  getTimeSeriesData,
};
