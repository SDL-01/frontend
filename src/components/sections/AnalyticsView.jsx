import React from 'react';
import { useMining } from '../../context/MiningContext';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export const AnalyticsView = () => {
  const { analytics, forecast } = useMining();
  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Analytics & Forecasting
        </h2>
        <p className="text-xs text-slate-500">
          Production history, reserve trends, grade distribution, demand vs supply, and equipment performance
        </p>
      </div>

      {/* Grid of 4 Core Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Production History & Forecast */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900">1. Production History & Forecast (MT)</h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecast} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.5rem', color: '#0f172a' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Line type="monotone" dataKey="actual" name="Actual Production" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="expected" name="Expected / Forecast" stroke="#10b981" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 2 }} />
                <Line type="monotone" dataKey="demand" name="Demand" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Reserve Trends */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900">2. Reserve Trends (Million Tonnes)</h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.reserve_trends} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.5rem', color: '#0f172a' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Line type="monotone" dataKey="proved_reserves_mt" name="Proved Reserves (MT)" stroke="#059669" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="probable_reserves_mt" name="Probable Reserves (MT)" stroke="#d97706" strokeWidth={2} strokeDasharray="3 3" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Grade Distribution */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900">3. Manganese Grade Distribution</h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.grade_distribution} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="range" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.5rem', color: '#0f172a' }} />
                <Bar dataKey="tonnes_k" name="Tonnage (k MT)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Demand vs Supply Gap */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900">4. Demand vs Supply Gap</h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.demand_vs_supply} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.5rem', color: '#0f172a' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Bar dataKey="demand_mt" name="Demand (MT)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="supply_mt" name="Supply (MT)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Equipment Performance OEE Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900">5. Equipment Fleet Performance (OEE)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {analytics.equipment_oee.map((item) => (
            <div key={item.name} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-600 font-medium block truncate">{item.name}</span>
              <div className="text-lg font-bold text-blue-700 mt-1">{item.oee}% <span className="text-xs font-normal text-slate-400">OEE</span></div>
              <div className="text-[11px] text-slate-500 mt-1">Avail: {item.availability}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
