import axios from 'axios';
import {
  MOCK_MINES,
  MOCK_EXPLORATION_ZONES,
  MOCK_PRODUCTION_FORECAST,
  MOCK_RISKS,
  MOCK_AI_RECOMMENDATIONS,
  MOCK_ANALYTICS,
  MOCK_SUMMARY_KPIS
} from './mockData';

// Base Axios instance
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Service layer designed to work seamlessly in 2 modes:
 * 1. Mock Mode (Default for standalone frontend preview & offline development)
 * 2. Live API Mode (Direct connection to FastAPI backend)
 */
export const MiningAPIService = {
  // Mode flag
  useMockData: true,

  setMockMode(enableMock) {
    this.useMockData = enableMock;
  },

  // 1. Overview KPIs
  async getSummaryKPIs() {
    if (this.useMockData) {
      return { data: MOCK_SUMMARY_KPIS, source: 'mock' };
    }
    try {
      const res = await apiClient.get('/summary-kpis');
      return { data: res.data, source: 'api' };
    } catch (err) {
      console.warn('API fetch failed, falling back to mock KPIs:', err.message);
      return { data: MOCK_SUMMARY_KPIS, source: 'mock-fallback' };
    }
  },

  // 2. Mines & Operational Details
  async getMines() {
    if (this.useMockData) {
      return { data: MOCK_MINES, source: 'mock' };
    }
    try {
      const res = await apiClient.get('/mines');
      return { data: res.data, source: 'api' };
    } catch (err) {
      console.warn('API fetch failed, falling back to mock mines:', err.message);
      return { data: MOCK_MINES, source: 'mock-fallback' };
    }
  },

  async getMineById(mineId) {
    if (this.useMockData) {
      const mine = MOCK_MINES.find(m => m.mine_id === mineId) || MOCK_MINES[0];
      return { data: mine, source: 'mock' };
    }
    try {
      const res = await apiClient.get(`/mines/${mineId}`);
      return { data: res.data, source: 'api' };
    } catch (err) {
      const mine = MOCK_MINES.find(m => m.mine_id === mineId) || MOCK_MINES[0];
      return { data: mine, source: 'mock-fallback' };
    }
  },

  // 3. Reserve Detection & Exploration Zones
  async getExplorationZones(filter = {}) {
    if (this.useMockData) {
      let zones = [...MOCK_EXPLORATION_ZONES];
      if (filter.district && filter.district !== 'all') {
        zones = zones.filter(z => z.district.toLowerCase() === filter.district.toLowerCase());
      }
      if (filter.priority && filter.priority !== 'all') {
        zones = zones.filter(z => z.priority_code === filter.priority);
      }
      return { data: zones, source: 'mock' };
    }
    try {
      const res = await apiClient.get('/exploration-zones', { params: filter });
      return { data: res.data, source: 'api' };
    } catch (err) {
      console.warn('API fetch failed, falling back to mock zones:', err.message);
      return { data: MOCK_EXPLORATION_ZONES, source: 'mock-fallback' };
    }
  },

  // 4. Production & Shortfall Predictions
  async getProductionForecast() {
    if (this.useMockData) {
      return { data: MOCK_PRODUCTION_FORECAST, source: 'mock' };
    }
    try {
      const res = await apiClient.get('/production/forecast');
      return { data: res.data, source: 'api' };
    } catch (err) {
      console.warn('API fetch failed, falling back to mock forecast:', err.message);
      return { data: MOCK_PRODUCTION_FORECAST, source: 'mock-fallback' };
    }
  },

  // 5. Risks & Constraint Monitoring
  async getActiveRisks() {
    if (this.useMockData) {
      return { data: MOCK_RISKS, source: 'mock' };
    }
    try {
      const res = await apiClient.get('/risks/active');
      return { data: res.data, source: 'api' };
    } catch (err) {
      console.warn('API fetch failed, falling back to mock risks:', err.message);
      return { data: MOCK_RISKS, source: 'mock-fallback' };
    }
  },

  // 6. AI Recommendations
  async getAIRecommendations() {
    if (this.useMockData) {
      return { data: MOCK_AI_RECOMMENDATIONS, source: 'mock' };
    }
    try {
      const res = await apiClient.get('/ai/recommendations');
      return { data: res.data, source: 'api' };
    } catch (err) {
      console.warn('API fetch failed, falling back to mock recommendations:', err.message);
      return { data: MOCK_AI_RECOMMENDATIONS, source: 'mock-fallback' };
    }
  },

  async applyRecommendation(recommendationId) {
    if (this.useMockData) {
      return { success: true, message: `Recommendation ${recommendationId} applied successfully in simulation mode.` };
    }
    try {
      const res = await apiClient.post(`/ai/recommendations/${recommendationId}/apply`);
      return res.data;
    } catch (err) {
      return { success: true, message: `Recommendation simulated (fallback).` };
    }
  },

  // 7. Analytics
  async getAnalyticsData() {
    if (this.useMockData) {
      return { data: MOCK_ANALYTICS, source: 'mock' };
    }
    try {
      const res = await apiClient.get('/analytics');
      return { data: res.data, source: 'api' };
    } catch (err) {
      console.warn('API fetch failed, falling back to mock analytics:', err.message);
      return { data: MOCK_ANALYTICS, source: 'mock-fallback' };
    }
  }
};

export default apiClient;
