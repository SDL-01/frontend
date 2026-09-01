import React, { createContext, useContext, useState, useEffect } from 'react';
import { MiningAPIService } from '../services/api';

const MiningContext = createContext();

export const MiningProvider = ({ children }) => {
  // Navigation State
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedMineId, setSelectedMineId] = useState('MOIL_DB_01');
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  
  // App Mode (Mock vs Live API)
  const [isMockMode, setIsMockMode] = useState(true);
  const [apiStatus, setApiStatus] = useState({ online: false, lastChecked: new Date() });
  
  // Data States
  const [kpis, setKpis] = useState(null);
  const [mines, setMines] = useState([]);
  const [zones, setZones] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [risks, setRisks] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Interactive Simulation states
  const [appliedRecommendations, setAppliedRecommendations] = useState(new Set(['REC-AI-103']));
  const [alertDismissed, setAlertDismissed] = useState(new Set());
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Load all initial data
  const loadAllData = async () => {
    setLoading(true);
    try {
      MiningAPIService.setMockMode(isMockMode);
      
      const [kpiRes, minesRes, zonesRes, forecastRes, risksRes, recsRes, analyticsRes] = await Promise.all([
        MiningAPIService.getSummaryKPIs(),
        MiningAPIService.getMines(),
        MiningAPIService.getExplorationZones(),
        MiningAPIService.getProductionForecast(),
        MiningAPIService.getActiveRisks(),
        MiningAPIService.getAIRecommendations(),
        MiningAPIService.getAnalyticsData()
      ]);

      setKpis(kpiRes.data);
      setMines(minesRes.data);
      setZones(zonesRes.data);
      setForecast(forecastRes.data);
      setRisks(risksRes.data);
      setRecommendations(recsRes.data);
      setAnalytics(analyticsRes.data);
    } catch (err) {
      console.error('Error loading mining data:', err);
      showToast('Error loading dataset, loaded fallback.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [isMockMode]);

  const toggleMockMode = () => {
    const nextMode = !isMockMode;
    setIsMockMode(nextMode);
    MiningAPIService.setMockMode(nextMode);
    showToast(`Switched to ${nextMode ? 'Mock Data Mode' : 'Live FastAPI Mode'}`, 'success');
  };

  const handleSelectMine = (mineId, jumpToSection = true) => {
    setSelectedMineId(mineId);
    if (jumpToSection) {
      setActiveSection('mine-details');
    }
  };

  const handleSelectZone = (zoneId, jumpToMap = true) => {
    setSelectedZoneId(zoneId);
    if (jumpToMap) {
      setActiveSection('reserve-detection');
    }
  };

  const applyRecommendationAction = async (recId) => {
    const res = await MiningAPIService.applyRecommendation(recId);
    setAppliedRecommendations(prev => new Set([...prev, recId]));
    showToast(res.message || `AI Action ${recId} executed successfully!`, 'success');
  };

  const selectedMine = mines.find(m => m.mine_id === selectedMineId) || mines[0];
  const selectedZone = zones.find(z => z.grid_id === selectedZoneId) || null;

  return (
    <MiningContext.Provider
      value={{
        activeSection,
        setActiveSection,
        selectedMineId,
        setSelectedMineId,
        selectedMine,
        handleSelectMine,
        selectedZoneId,
        setSelectedZoneId,
        selectedZone,
        handleSelectZone,
        isMockMode,
        toggleMockMode,
        kpis,
        mines,
        zones,
        forecast,
        risks,
        recommendations,
        analytics,
        loading,
        refreshData: loadAllData,
        appliedRecommendations,
        applyRecommendationAction,
        toastMessage,
        showToast
      }}
    >
      {children}
    </MiningContext.Provider>
  );
};

export const useMining = () => {
  const context = useContext(MiningContext);
  if (!context) {
    throw new Error('useMining must be used within a MiningProvider');
  }
  return context;
};
