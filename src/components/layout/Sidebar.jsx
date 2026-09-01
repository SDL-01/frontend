import React from 'react';
import { useMining } from '../../context/MiningContext';
import {
  LayoutDashboard,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Compass,
  BarChart3,
  Building2
} from 'lucide-react';

export const Sidebar = () => {
  const { activeSection, setActiveSection, risks, recommendations } = useMining();

  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard
    },
    {
      id: 'reserve-detection',
      label: 'Reserve Detection',
      icon: MapPin
    },
    {
      id: 'production-prediction',
      label: 'Production Prediction',
      icon: TrendingUp
    },
    {
      id: 'risk-monitoring',
      label: 'Risk & Constraints',
      icon: AlertTriangle,
      badge: risks.length > 0 ? risks.length : null
    },
    {
      id: 'ai-recommendations',
      label: 'AI Recommendations',
      icon: Sparkles,
      badge: recommendations.length > 0 ? recommendations.length : null
    },
    {
      id: 'exploration-priority',
      label: 'Exploration Priority',
      icon: Compass
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3
    },
    {
      id: 'mine-details',
      label: 'Mine Details',
      icon: Building2
    }
  ];

  return (
    <aside className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-57px)]">
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                  isActive ? 'bg-blue-200 text-blue-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
