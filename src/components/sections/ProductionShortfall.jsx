import React, { useState } from 'react';
import { useMining } from '../../context/MiningContext';
import MetricCard from '../common/MetricCard';
import StatusBadge from '../common/StatusBadge';
import {
  TrendingUp,
  AlertOctagon,
  Gauge,
  Calendar,
  Sliders,
  Sparkles
} from 'lucide-react';
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export const ProductionShortfall = () => {
  const { forecast, setActiveSection } = useMining();
  
  const [demandMultiplier, setDemandMultiplier] = useState(100);
  const [mineEfficiencyBoost, setMineEfficiencyBoost] = useState(0);

  const simulatedData = forecast.map((item) => {
    const adjustedDemand = Math.round(item.demand * (demandMultiplier / 100));
    const baseOutput = item.actual || item.expected;
    const adjustedOutput = Math.round(baseOutput * (1 + mineEfficiencyBoost / 100));
    const adjustedShortfall = Math.max(0, adjustedDemand - adjustedOutput);
    const adjustedProb = adjustedShortfall > 0 
      ? Math.min(98, Math.round((adjustedShortfall / adjustedDemand) * 160)) 
      : 5;

    return {
      ...item,
      displayOutput: adjustedOutput,
      displayDemand: adjustedDemand,
      displayShortfall: adjustedShortfall,
      displayProb: adjustedProb
    };
  });

  const currentMonthData = simulatedData.find(d => d.month.includes('Jun')) || simulatedData[5];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Production & Shortfall Prediction
          </h2>
          <p className="text-xs text-slate-500">
            Current output, target demand, predicted shortfall, and future production trends
          </p>
        </div>

        <button
          onClick={() => setActiveSection('ai-recommendations')}
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg shadow-xs transition flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Resolve with AI &rarr;
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Current Production"
          value={currentMonthData ? (currentMonthData.displayOutput / 1000).toFixed(1) : '176.4'}
          unit="k MT / Mo"
          icon={TrendingUp}
          color="emerald"
          subtitle="Jun Output"
        />

        <MetricCard
          title="Target Demand"
          value={currentMonthData ? (currentMonthData.displayDemand / 1000).toFixed(1) : '202.0'}
          unit="k MT Required"
          icon={Calendar}
          color="amber"
          subtitle="Customer Demand"
        />

        <MetricCard
          title="Predicted Shortfall"
          value={currentMonthData ? (currentMonthData.displayShortfall / 1000).toFixed(1) : '25.6'}
          unit="k MT Deficit"
          icon={AlertOctagon}
          color="rose"
          subtitle="Estimated Gap"
        />

        <MetricCard
          title="Shortfall Probability"
          value={`${currentMonthData?.displayProb || 74}%`}
          unit="Probability"
          icon={Gauge}
          color="purple"
          subtitle={currentMonthData?.displayProb > 50 ? 'High Risk' : 'Low Risk'}
        />
      </div>

      {/* Main Graph & Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">12-Month Production vs Demand Horizon</h3>
            <span className="text-xs text-slate-500 font-medium">95% Confidence</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={simulatedData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.5rem', color: '#0f172a' }}
                  formatter={(val, name) => [`${Number(val).toLocaleString()} MT`, name]}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="displayDemand" name="Target Demand" stroke="#f59e0b" fill="#fef3c7" strokeWidth={2} />
                <Line type="monotone" dataKey="displayOutput" name="Production Output" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 3 }} />
                <Bar dataKey="displayShortfall" name="Predicted Shortfall" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* What-If Simulator */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Scenario Simulator</h3>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Demand Stress:</span>
              <span className="font-bold text-amber-700">{demandMultiplier}%</span>
            </div>
            <input
              type="range"
              min="80"
              max="130"
              value={demandMultiplier}
              onChange={(e) => setDemandMultiplier(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">AI Efficiency Boost:</span>
              <span className="font-bold text-emerald-700">+{mineEfficiencyBoost}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              value={mineEfficiencyBoost}
              onChange={(e) => setMineEfficiencyBoost(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Shortfall Impact:</span>
              <span className="font-bold text-rose-700">{currentMonthData?.displayShortfall.toLocaleString()} MT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Shortfall Risk:</span>
              <span className="font-bold text-amber-700">{currentMonthData?.displayProb}%</span>
            </div>
          </div>

          <button
            onClick={() => {
              setDemandMultiplier(100);
              setMineEfficiencyBoost(15);
            }}
            className="w-full py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold rounded-lg transition"
          >
            Apply +15% AI Boost Preset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductionShortfall;
