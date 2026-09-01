import React, { useState } from 'react';
import { useMining } from '../../context/MiningContext';
import {
  Pickaxe,
  Server,
  Database,
  Bell,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

export const Navbar = () => {
  const {
    isMockMode,
    toggleMockMode,
    refreshData,
    loading,
    risks,
    setActiveSection
  } = useMining();

  const [showAlerts, setShowAlerts] = useState(false);
  const activeAlertsCount = risks.length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 lg:px-6 py-3 shadow-2xs">
      <div className="flex items-center justify-between">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600 text-white font-bold shadow-xs">
            <Pickaxe className="w-5 h-5" />
          </div>

          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">
              Maharashtra Manganese AI
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              MOIL Exploration & Production Platform
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5">
          {/* Mock / Live API Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => isMockMode || toggleMockMode()}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition ${
                isMockMode
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-blue-600" />
              <span>Mock Data</span>
            </button>

            <button
              onClick={() => !isMockMode || toggleMockMode()}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition ${
                !isMockMode
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Server className="w-3.5 h-3.5 text-emerald-600" />
              <span>FastAPI Live</span>
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={refreshData}
            disabled={loading}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition border border-transparent hover:border-slate-200"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          {/* Alert Bell */}
          <div className="relative">
            <button
              onClick={() => setShowAlerts(!showAlerts)}
              className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition border border-transparent hover:border-slate-200"
              title="Risk Alerts"
            >
              <Bell className="w-4 h-4" />
              {activeAlertsCount > 0 && (
                <span className="absolute 1 top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
              )}
            </button>

            {/* Alert Dropdown */}
            {showAlerts && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-3 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-xs font-bold text-slate-900">Active Risks ({risks.length})</h3>
                  <button
                    onClick={() => {
                      setShowAlerts(false);
                      setActiveSection('risk-monitoring');
                    }}
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    View All
                  </button>
                </div>

                <div className="mt-2 space-y-1.5 max-h-60 overflow-y-auto">
                  {risks.slice(0, 4).map((risk) => (
                    <div
                      key={risk.id}
                      onClick={() => {
                        setShowAlerts(false);
                        setActiveSection('risk-monitoring');
                      }}
                      className="p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition border border-slate-100"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-900">{risk.category}</span>
                        <span className="text-[10px] font-medium text-red-600">{risk.severity}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{risk.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
