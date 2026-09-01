import React, { useState } from 'react';
import { MiningProvider, useMining } from './context/MiningContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import OverviewDashboard from './components/sections/OverviewDashboard';
import ReserveDetectionMap from './components/sections/ReserveDetectionMap';
import ProductionShortfall from './components/sections/ProductionShortfall';
import RiskMonitoring from './components/sections/RiskMonitoring';
import AIRecommendations from './components/sections/AIRecommendations';
import ExplorationPriority from './components/sections/ExplorationPriority';
import AnalyticsView from './components/sections/AnalyticsView';
import MineDetailsView from './components/sections/MineDetailsView';
import Toast from './components/common/Toast';
import { Menu, X, Loader2 } from 'lucide-react';

function DashboardContent() {
  const { activeSection, loading, toastMessage } = useMining();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderSection = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-xs font-medium text-slate-500">
            Loading Manganese Exploration & Operational Data...
          </p>
        </div>
      );
    }

    switch (activeSection) {
      case 'overview':
        return <OverviewDashboard />;
      case 'reserve-detection':
        return <ReserveDetectionMap />;
      case 'production-prediction':
        return <ProductionShortfall />;
      case 'risk-monitoring':
        return <RiskMonitoring />;
      case 'ai-recommendations':
        return <AIRecommendations />;
      case 'exploration-priority':
        return <ExplorationPriority />;
      case 'analytics':
        return <AnalyticsView />;
      case 'mine-details':
        return <MineDetailsView />;
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar />

      {/* Mobile Menu Toggle Button */}
      <div className="lg:hidden fixed bottom-5 left-5 z-50">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-3 rounded-full bg-blue-600 text-white font-bold shadow-lg flex items-center justify-center"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden flex">
            <div className="w-64 max-w-[80vw] h-full bg-white border-r border-slate-200 shadow-xl flex flex-col">
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">Menu Navigation</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div
                className="flex-1 overflow-y-auto"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Sidebar />
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 max-w-7xl mx-auto w-full">
          {renderSection()}
        </main>
      </div>

      {/* Global Toast */}
      <Toast toast={toastMessage} />
    </div>
  );
}

export default function App() {
  return (
    <MiningProvider>
      <DashboardContent />
    </MiningProvider>
  );
}
