import React from 'react';
import { useMining } from '../../context/MiningContext';
import MetricCard from '../common/MetricCard';
import StatusBadge from '../common/StatusBadge';
import {
  Building2,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Layers,
  Wrench
} from 'lucide-react';

export const MineDetailsView = () => {
  const {
    mines,
    selectedMineId,
    setSelectedMineId,
    selectedMine,
    setActiveSection,
    showToast
  } = useMining();

  const mine = selectedMine || mines[0];

  return (
    <div className="space-y-6">
      {/* Header & Mine Selector Strip */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Mine Details & Operations
            </h2>
            <p className="text-xs text-slate-500">
              Select a mine to view location, production, reserves, ore grade, equipment, and recommended actions
            </p>
          </div>

          <button
            onClick={() => setActiveSection('reserve-detection')}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs flex items-center gap-1.5 transition"
          >
            <MapPin className="w-3.5 h-3.5" />
            View on Map
          </button>
        </div>

        {/* Horizontal Mine Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
          {mines.map((m) => {
            const isSelected = m.mine_id === selectedMineId;
            return (
              <button
                key={m.mine_id}
                onClick={() => setSelectedMineId(m.mine_id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {m.mine_name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mine Title Strip */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{mine.mine_name}</h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                {mine.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {mine.district}, {mine.state} &bull; {mine.type} &bull; ({mine.lat.toFixed(3)}°N, {mine.lon.toFixed(3)}°E)
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400">Annual Capacity</span>
            <div className="text-lg font-bold text-slate-900">
              {(mine.annual_capacity_mt / 1000).toLocaleString()}k MT / yr
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Production & Chemical Assay Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Current Production (MTD)"
          value={(mine.current_production_mtd / 1000).toFixed(1)}
          unit="k MT"
          icon={TrendingUp}
          color="emerald"
          subtitle={`Target: ${(mine.monthly_target_mtd / 1000).toFixed(1)}k MT`}
        />

        <MetricCard
          title="Predicted Next Month"
          value={(mine.predicted_production_next_month / 1000).toFixed(1)}
          unit="k MT"
          icon={Sparkles}
          color="blue"
          trend={{ value: '+8.2%', isPositive: true }}
        />

        <MetricCard
          title="Reserve Estimate"
          value={`${mine.reserve_estimate_mt}M`}
          unit="Tonnes"
          icon={Layers}
          color="amber"
          subtitle="Estimated Life > 15 yrs"
        />

        <MetricCard
          title="Ore Grade (% Mn)"
          value={`${mine.typical_grade_mn}%`}
          unit="Mn"
          icon={Layers}
          color="purple"
          subtitle={mine.primary_ore.split('(')[0]}
        />
      </div>

      {/* 2-Column Split: Equipment & Chemistry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Chemical Assay & Active Risks */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Ore Grade & Chemical Assay</h3>
            <p className="text-xs text-slate-600">
              <strong className="text-slate-900">Ore Type:</strong> {mine.primary_ore}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 text-[10px]">Manganese (Mn)</span>
                <div className="text-base font-bold text-emerald-700">{mine.typical_grade_mn}%</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 text-[10px]">Iron (Fe)</span>
                <div className="text-base font-bold text-amber-700">{mine.fe_pct}%</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 text-[10px]">Silica (SiO2)</span>
                <div className="text-base font-bold text-blue-700">{mine.sio2_pct}%</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-400 text-[10px]">Phosphorus (P)</span>
                <div className="text-base font-bold text-rose-700">{mine.p_content_pct}%</div>
              </div>
            </div>
          </div>

          {/* Active Mine Risks */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2">
            <h3 className="text-sm font-bold text-slate-900">Current Risks & Constraints</h3>
            {mine.active_risks.map((risk) => (
              <div key={risk.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs flex items-start justify-between gap-2">
                <div>
                  <span className="font-semibold text-slate-900">{risk.type}: </span>
                  <span className="text-slate-600">{risk.desc}</span>
                </div>
                <StatusBadge status={risk.severity} variant={risk.severity === 'Critical' ? 'critical' : 'warning'} size="xs" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Equipment Status & Recommended Action */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Equipment Fleet Status</h3>
              <span className="text-xs font-semibold text-blue-700">{mine.equipment_fleet.oee_pct}% OEE</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Excavators / Shovels:</span>
                <div className="text-sm font-bold text-slate-900 mt-0.5">
                  {mine.equipment_fleet.excavators.active} / {mine.equipment_fleet.excavators.total} Active
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Dump Trucks:</span>
                <div className="text-sm font-bold text-slate-900 mt-0.5">
                  {mine.equipment_fleet.dumpers.active} / {mine.equipment_fleet.dumpers.total} Active
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Crushers:</span>
                <div className="text-sm font-bold text-slate-900 mt-0.5">
                  {mine.equipment_fleet.crushers.active} / {mine.equipment_fleet.crushers.total} Active
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-slate-500">Drills:</span>
                <div className="text-sm font-bold text-slate-900 mt-0.5">
                  {mine.equipment_fleet.drills.active} / {mine.equipment_fleet.drills.total} Active
                </div>
              </div>
            </div>
          </div>

          {/* AI Recommended Action */}
          <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 shadow-xs space-y-2">
            <div className="flex items-center gap-1.5 text-blue-800 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Recommended Action for {mine.mine_name}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {mine.recommended_action}
            </p>
            <button
              onClick={() => showToast(`Shift plan dispatched to ${mine.mine_name}`, 'success')}
              className="mt-2 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-xs transition"
            >
              Dispatch Shift Action Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MineDetailsView;
