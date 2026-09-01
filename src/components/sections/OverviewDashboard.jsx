import React from 'react';
import { useMining } from '../../context/MiningContext';
import MetricCard from '../common/MetricCard';
import StatusBadge from '../common/StatusBadge';
import {
  Pickaxe,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  MapPin,
  ChevronRight,
  Gauge
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const OverviewDashboard = () => {
  const {
    kpis,
    mines,
    forecast,
    risks,
    recommendations,
    setActiveSection,
    handleSelectMine,
    appliedRecommendations,
    applyRecommendationAction
  } = useMining();

  const chartData = forecast.slice(0, 8).map(f => ({
    name: f.month,
    Actual: f.actual || f.expected,
    Demand: f.demand
  }));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h2>
          <p className="text-xs text-slate-500">Manganese production, shortfall risk, and active AI optimizations</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSection('reserve-detection')}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs transition"
          >
            Open Map
          </button>
          <button
            onClick={() => setActiveSection('ai-recommendations')}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs shadow-xs transition"
          >
            AI Actions ({recommendations.length})
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Estimated Reserves"
          value={kpis?.total_reserves_mt ? `${kpis.total_reserves_mt}M` : '85.4M'}
          unit="Tonnes"
          icon={Pickaxe}
          color="blue"
          trend={{ value: '+8.3M MT', isPositive: true }}
          onClick={() => setActiveSection('reserve-detection')}
        />

        <MetricCard
          title="Current Production"
          value={kpis?.current_month_production_mt ? (kpis.current_month_production_mt / 1000).toFixed(1) : '176.4'}
          unit="k MT / Mo"
          icon={TrendingUp}
          color="emerald"
          subtitle={`Target: ${((kpis?.monthly_demand_mt || 202000) / 1000).toFixed(1)}k MT`}
          onClick={() => setActiveSection('production-prediction')}
        />

        <MetricCard
          title="Predicted Shortfall"
          value={kpis?.predicted_shortfall_mt ? (kpis.predicted_shortfall_mt / 1000).toFixed(1) : '25.6'}
          unit="k MT"
          icon={Gauge}
          color="rose"
          trend={{ value: `${kpis?.shortfall_probability_pct || 74}% Probability`, isPositive: false }}
          onClick={() => setActiveSection('production-prediction')}
        />

        <MetricCard
          title="Average Ore Grade"
          value={kpis?.avg_manganese_grade_pct ? `${kpis.avg_manganese_grade_pct}%` : '43.8%'}
          unit="Mn Content"
          icon={Sparkles}
          color="purple"
          subtitle="High Ferro Grade"
          onClick={() => setActiveSection('analytics')}
        />
      </div>

      {/* 2-Column Split: Forecast & AI Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Production vs Demand Forecast */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Production vs Demand Forecast</h3>
              <p className="text-xs text-slate-500">Monthly extraction compared to steel demand (MT)</p>
            </div>
            <button
              onClick={() => setActiveSection('production-prediction')}
              className="text-xs text-blue-600 hover:underline font-medium flex items-center gap-1"
            >
              Details <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.5rem', color: '#0f172a' }}
                  formatter={(val) => [`${Number(val).toLocaleString()} MT`, '']}
                />
                <Area type="monotone" dataKey="Demand" stroke="#f59e0b" strokeWidth={2} fill="url(#colorDemand)" />
                <Area type="monotone" dataKey="Actual" stroke="#2563eb" strokeWidth={2.5} fill="url(#colorActual)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                Actual/Expected Output
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                Steel Demand
              </span>
            </div>
            <span className="text-rose-600 font-medium">Shortfall: Jun - Aug Deficit</span>
          </div>
        </div>

        {/* Right 5 Cols: Top AI Recommendations */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">AI Recommendations</h3>
              <p className="text-xs text-slate-500">Suggested optimizations</p>
            </div>
            <button
              onClick={() => setActiveSection('ai-recommendations')}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              View All &rarr;
            </button>
          </div>

          <div className="space-y-3">
            {recommendations.slice(0, 3).map((rec) => {
              const isApplied = appliedRecommendations.has(rec.id);
              return (
                <div
                  key={rec.id}
                  className={`p-3 rounded-lg border transition ${
                    isApplied ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">{rec.title}</span>
                    <span className="text-[10px] font-medium text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 shrink-0">
                      {rec.confidence_score}% Conf
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1">{rec.summary}</p>

                  <div className="mt-2.5 flex items-center justify-between text-xs pt-1.5 border-t border-slate-200/60">
                    <span className="text-emerald-700 font-semibold text-[11px]">{rec.impact}</span>
                    <button
                      onClick={() => applyRecommendationAction(rec.id)}
                      disabled={isApplied}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                        isApplied
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs'
                      }`}
                    >
                      {isApplied ? 'Dispatched' : 'Dispatch'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mine List Row */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Active Mines ({mines.length})</h3>
          <button
            onClick={() => setActiveSection('mine-details')}
            className="text-xs text-blue-600 hover:underline font-medium"
          >
            All Mine Details &rarr;
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
          {mines.slice(0, 4).map((mine) => (
            <div
              key={mine.mine_id}
              onClick={() => handleSelectMine(mine.mine_id, true)}
              className="p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 cursor-pointer transition"
            >
              <div className="flex items-start justify-between">
                <h4 className="text-xs font-bold text-slate-900 truncate">{mine.mine_name}</h4>
                <span className="text-[10px] text-slate-500 font-medium shrink-0 ml-1">{mine.typical_grade_mn}% Mn</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">{mine.district} &bull; {mine.type.split(' ')[0]}</p>
              <div className="mt-2 text-xs font-semibold text-slate-700">
                {(mine.current_production_mtd / 1000).toFixed(1)}k MT <span className="text-[10px] font-normal text-slate-400">MTD</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewDashboard;
