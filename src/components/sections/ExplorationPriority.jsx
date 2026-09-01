import React, { useState } from 'react';
import { useMining } from '../../context/MiningContext';
import StatusBadge from '../common/StatusBadge';
import {
  Compass,
  Search,
  Download,
  MapPin
} from 'lucide-react';

export const ExplorationPriority = () => {
  const { zones, handleSelectZone } = useMining();

  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');

  const filteredZones = zones.filter((zone) => {
    const matchSearch =
      zone.zone_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      zone.district.toLowerCase().includes(searchTerm.toLowerCase());

    const matchDistrict = districtFilter === 'all' || zone.district.toLowerCase() === districtFilter.toLowerCase();
    return matchSearch && matchDistrict;
  });

  const exportCSV = () => {
    const headers = ['Rank', 'Location', 'District', 'Probability %', 'Grade', 'Priority'];
    const rows = filteredZones.map(z => [
      z.rank,
      `"${z.zone_name}"`,
      z.district,
      z.mn_probability_pct,
      `"${z.predicted_grade_mn_pct}% Mn"`,
      z.priority
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'exploration_priority_matrix.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Exploration Priority Matrix
          </h2>
          <p className="text-xs text-slate-500">
            Ranked exploration locations by manganese probability, grade, and drilling priority
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search location or district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
          <span className="text-slate-400">District:</span>
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="bg-transparent text-slate-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Districts</option>
            <option value="Bhandara">Bhandara</option>
            <option value="Nagpur">Nagpur</option>
            <option value="Balaghat">Balaghat</option>
          </select>
        </div>
      </div>

      {/* Clean Ranked Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-500 font-semibold text-[11px] border-b border-slate-200">
            <tr>
              <th className="py-3 px-4 w-16">Rank</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">District</th>
              <th className="py-3 px-4">Probability</th>
              <th className="py-3 px-4">Grade</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4 text-right">Map</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredZones.map((zone) => (
              <tr key={zone.grid_id} className="hover:bg-slate-50/80 transition">
                <td className="py-3 px-4 font-bold text-slate-900">
                  {zone.rank}
                </td>
                <td className="py-3 px-4 font-semibold text-slate-900">
                  {zone.zone_name}
                </td>
                <td className="py-3 px-4 text-slate-600">{zone.district}</td>
                <td className="py-3 px-4 font-bold text-emerald-700">
                  {zone.mn_probability_pct}%
                </td>
                <td className="py-3 px-4 font-medium text-slate-900">
                  {zone.predicted_grade_mn_pct}% Mn
                </td>
                <td className="py-3 px-4">
                  <StatusBadge
                    status={
                      zone.priority_code === 'critical'
                        ? '🔴 Critical'
                        : zone.priority_code === 'high'
                        ? '🟠 High'
                        : '🟡 Medium'
                    }
                    variant={zone.priority_code}
                    size="xs"
                  />
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => handleSelectZone(zone.grid_id, true)}
                    className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition inline-flex items-center"
                    title="View on Map"
                  >
                    <MapPin className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExplorationPriority;
