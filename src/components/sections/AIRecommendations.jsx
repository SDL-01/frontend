import React, { useState } from 'react';
import { useMining } from '../../context/MiningContext';
import {
  Sparkles,
  CheckCircle2,
  Play
} from 'lucide-react';

export const AIRecommendations = () => {
  const {
    recommendations,
    appliedRecommendations,
    applyRecommendationAction,
    showToast
  } = useMining();

  const [activeFilter, setActiveFilter] = useState('all');

  const filterCategories = [
    { id: 'all', label: 'All Recommendations' },
    { id: 'Schedule', label: 'Mine Schedule' },
    { id: 'Fleet', label: 'Re-deploy Equipment' },
    { id: 'Blasting', label: 'Optimize Blasting' },
    { id: 'Exploration', label: 'Exploration Zones' },
    { id: 'Grade', label: 'Grade & Production' }
  ];

  const filteredRecs = recommendations.filter((r) => {
    if (activeFilter === 'all') return true;
    return r.category.toLowerCase().includes(activeFilter.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            AI Recommendations Engine
          </h2>
          <p className="text-xs text-slate-500">
            Automated recommendations for mine schedule, equipment re-deployment, blasting, exploration, and production balancing
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {filterCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                activeFilter === cat.id
                  ? 'bg-blue-50 border-blue-200 text-blue-700 font-semibold'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clean Recommendation Cards List */}
      <div className="space-y-4">
        {filteredRecs.map((rec) => {
          const isApplied = appliedRecommendations.has(rec.id);

          return (
            <div
              key={rec.id}
              className={`p-4 rounded-xl border bg-white shadow-xs transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isApplied ? 'bg-emerald-50/40 border-emerald-200' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-1 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{rec.title}</span>
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {rec.confidence_score}% Confidence
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">{rec.category}</span>
                </div>
                <p className="text-xs text-slate-600">{rec.summary}</p>
                <div className="text-xs font-semibold text-emerald-700 pt-0.5">
                  Expected Impact: {rec.impact}
                </div>
              </div>

              <div className="shrink-0">
                <button
                  onClick={() => applyRecommendationAction(rec.id)}
                  disabled={isApplied}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                    isApplied
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                  }`}
                >
                  {isApplied ? 'Applied' : 'Apply Action'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AIRecommendations;
