import React, { useState } from 'react';
import { useMining } from '../../context/MiningContext';
import StatusBadge from '../common/StatusBadge';
import {
  AlertTriangle,
  Wrench,
  CloudRain,
  Zap,
  Truck,
  Layers,
  CheckCircle2
} from 'lucide-react';

export const RiskMonitoring = () => {
  const { risks } = useMining();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [resolvedRisks, setResolvedRisks] = useState(new Set());

  const categories = [
    { id: 'all', label: 'All Risks' },
    { id: 'Equipment', label: 'Equipment Downtime' },
    { id: 'Weather', label: 'Weather / Rain' },
    { id: 'Blasting', label: 'Blasting Delays' },
    { id: 'Transportation', label: 'Transportation' },
    { id: 'Grade', label: 'Low Ore Grade' }
  ];

  const filteredRisks = risks.filter((r) => {
    if (selectedCategory === 'all') return true;
    return r.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  const handleResolveRisk = (riskId) => {
    setResolvedRisks(prev => new Set([...prev, riskId]));
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Risk & Constraint Monitoring
          </h2>
          <p className="text-xs text-slate-500">
            Real-time tracking of equipment downtime, weather, blasting delays, transport, and low ore grade
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                selectedCategory === cat.id
                  ? 'bg-blue-50 border-blue-200 text-blue-700 font-semibold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clean Risk Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRisks.map((risk) => {
          const isResolved = resolvedRisks.has(risk.id);

          return (
            <div
              key={risk.id}
              className={`p-4 rounded-xl border bg-white shadow-xs transition flex flex-col justify-between ${
                isResolved ? 'opacity-70 bg-slate-50 border-slate-200' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase">{risk.category}</span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">{risk.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{risk.mine} &bull; <strong className="text-rose-600">{risk.impact}</strong></p>
                  </div>
                  <StatusBadge
                    status={isResolved ? 'Resolved' : risk.severity}
                    variant={isResolved ? 'success' : risk.severity === 'Critical' ? 'critical' : 'warning'}
                    size="xs"
                  />
                </div>

                <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                  <strong className="text-slate-700">AI Mitigation:</strong> {risk.ai_mitigation}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">{risk.updated_at}</span>
                <button
                  onClick={() => handleResolveRisk(risk.id)}
                  disabled={isResolved}
                  className={`px-3 py-1 rounded-md font-medium text-xs transition ${
                    isResolved
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  {isResolved ? 'Mitigated' : 'Mark Fixed'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RiskMonitoring;
