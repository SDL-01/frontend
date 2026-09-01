import React, { useState, useEffect } from 'react';
import { useMining } from '../../context/MiningContext';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import StatusBadge from '../common/StatusBadge';
import {
  MapPin,
  Layers,
  Building2,
  Sparkles,
  Filter,
  CheckCircle2
} from 'lucide-react';

const createMineIcon = (name) => {
  return L.divIcon({
    className: 'custom-mine-pin',
    html: `
      <div style="
        background: #2563eb;
        color: #ffffff;
        padding: 3px 6px;
        border-radius: 6px;
        font-weight: 600;
        font-size: 11px;
        border: 2px solid #ffffff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 4px;
        white-space: nowrap;
      ">
        <span>🏭</span>
        <span>${name.split(' ')[0]}</span>
      </div>
    `,
    iconSize: [75, 24],
    iconAnchor: [37, 12]
  });
};

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.0 });
    }
  }, [center, zoom, map]);
  return null;
}

export const ReserveDetectionMap = () => {
  const {
    mines,
    zones,
    handleSelectMine
  } = useMining();

  const [filterDistrict, setFilterDistrict] = useState('all');
  const [filterProb, setFilterProb] = useState('all');
  const [showMines, setShowMines] = useState(true);
  const [inspectedItem, setInspectedItem] = useState(zones[0] || null);
  const [mapCenter, setMapCenter] = useState([21.58, 79.72]);
  const [mapZoom, setMapZoom] = useState(9);

  const filteredZones = zones.filter((zone) => {
    if (filterDistrict !== 'all' && zone.district.toLowerCase() !== filterDistrict.toLowerCase()) {
      return false;
    }
    if (filterProb === 'high' && zone.mn_probability_pct < 80) return false;
    if (filterProb === 'medium' && (zone.mn_probability_pct < 60 || zone.mn_probability_pct >= 80)) return false;
    if (filterProb === 'low' && zone.mn_probability_pct >= 60) return false;
    return true;
  });

  const getMarkerColor = (zone) => {
    return zone.mn_probability_pct >= 85 ? '#059669' : zone.mn_probability_pct >= 70 ? '#d97706' : '#64748b';
  };

  const handleZoneClick = (zone) => {
    setInspectedItem(zone);
    setMapCenter([zone.lat, zone.lon]);
    setMapZoom(11);
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Reserve Detection Map
          </h2>
          <p className="text-xs text-slate-500">
            High, medium, and low manganese probability zones & active mine locations
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="bg-transparent text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Districts</option>
              <option value="Nagpur">Nagpur</option>
              <option value="Bhandara">Bhandara</option>
              <option value="Balaghat">Balaghat</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs">
            <span className="text-slate-400">Prob:</span>
            <select
              value={filterProb}
              onChange={(e) => setFilterProb(e.target.value)}
              className="bg-transparent text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All</option>
              <option value="high">High (&ge; 80%)</option>
              <option value="medium">Medium (60-79%)</option>
              <option value="low">Low (&lt; 60%)</option>
            </select>
          </div>

          <button
            onClick={() => setShowMines(!showMines)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition ${
              showMines
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-slate-200 text-slate-500'
            }`}
          >
            {showMines ? 'Mines Visible' : 'Mines Hidden'}
          </button>
        </div>
      </div>

      {/* Map and Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Map */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-2 shadow-xs h-[520px] relative">
          {/* Legend Overlay */}
          <div className="absolute top-4 right-4 z-20 bg-white/95 border border-slate-200 rounded-lg p-2.5 text-xs shadow-md">
            <div className="font-semibold text-slate-800 mb-1.5">Legend</div>
            <div className="space-y-1 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <span className="text-slate-600">High Prob (&ge; 85%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="text-slate-600">Medium Prob (70-84%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                <span className="text-slate-600">Low Prob (&lt; 70%)</span>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                <span>🏭</span>
                <span className="text-blue-700 font-medium">MOIL Mine</span>
              </div>
            </div>
          </div>

          <div className="w-full h-full rounded-lg overflow-hidden">
            <MapContainer center={mapCenter} zoom={mapZoom} scrollWheelZoom={true} className="w-full h-full">
              <MapController center={mapCenter} zoom={mapZoom} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {filteredZones.map((zone) => {
                const color = getMarkerColor(zone);
                const isSelected = inspectedItem?.grid_id === zone.grid_id;

                return (
                  <CircleMarker
                    key={zone.grid_id}
                    center={[zone.lat, zone.lon]}
                    radius={isSelected ? 10 : 7}
                    pathOptions={{
                      color: isSelected ? '#0f172a' : color,
                      fillColor: color,
                      fillOpacity: 0.85,
                      weight: isSelected ? 2.5 : 1
                    }}
                    eventHandlers={{ click: () => handleZoneClick(zone) }}
                  >
                    <Popup>
                      <div className="p-2 text-slate-900 min-w-[180px]">
                        <div className="font-bold text-xs">{zone.zone_name}</div>
                        <div className="text-[11px] text-slate-500">{zone.district} &bull; {zone.mn_probability_pct}% Prob</div>
                        <div className="mt-1 text-[11px] font-semibold text-emerald-700">Grade: {zone.predicted_grade_mn_pct}% Mn</div>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}

              {showMines &&
                mines.map((mine) => (
                  <Marker
                    key={mine.mine_id}
                    position={[mine.lat, mine.lon]}
                    icon={createMineIcon(mine.mine_name)}
                    eventHandlers={{ click: () => handleSelectMine(mine.mine_id, true) }}
                  >
                    <Popup>
                      <div className="p-2 text-slate-900 min-w-[180px]">
                        <div className="font-bold text-xs">{mine.mine_name}</div>
                        <div className="text-[11px] text-slate-500">{mine.district} &bull; {mine.type}</div>
                        <div className="mt-1 text-[11px] font-semibold text-blue-700">Capacity: {(mine.annual_capacity_mt / 1000).toLocaleString()}k MT</div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
            </MapContainer>
          </div>
        </div>

        {/* Right 4 Cols: Selected Zone Inspector */}
        <div className="lg:col-span-4 space-y-4">
          {inspectedItem && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
              <div className="flex items-start justify-between pb-2 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-semibold text-blue-600">Rank #{inspectedItem.rank} Priority</span>
                  <h3 className="text-sm font-bold text-slate-900">{inspectedItem.zone_name}</h3>
                  <p className="text-xs text-slate-500">{inspectedItem.district}, {inspectedItem.state}</p>
                </div>
                <StatusBadge status={inspectedItem.priority} variant={inspectedItem.priority_code} size="xs" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[10px]">Probability</span>
                  <div className="text-base font-bold text-emerald-700 mt-0.5">{inspectedItem.mn_probability_pct}%</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[10px]">Grade</span>
                  <div className="text-base font-bold text-amber-700 mt-0.5">{inspectedItem.predicted_grade_mn_pct}% Mn</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[10px]">Potential</span>
                  <div className="text-base font-bold text-blue-700 mt-0.5">{inspectedItem.predicted_reserve_mt} MT</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 text-[10px]">Stage</span>
                  <div className="text-sm font-bold text-purple-700 mt-0.5">{inspectedItem.unfc_stage}</div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Iron Oxide Index:</span>
                  <span className="font-semibold text-slate-900">{inspectedItem.iron_oxide_index}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Surface Temp (LST):</span>
                  <span className="font-semibold text-slate-900">{inspectedItem.lst_celsius}°C</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Pench ESZ Clearance:</span>
                  <span className="font-semibold text-emerald-700">{inspectedItem.environmental_status.split(' ')[0]}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-100 text-xs">
                <span className="font-semibold text-blue-800">Recommendation:</span>
                <p className="text-slate-700 mt-0.5">{inspectedItem.ai_recommendation}</p>
              </div>
            </div>
          )}

          {/* Quick List */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs space-y-1.5 max-h-56 overflow-y-auto">
            <h4 className="text-xs font-bold text-slate-900 mb-1 px-1">Exploration Zones</h4>
            {zones.map((zone) => (
              <button
                key={zone.grid_id}
                onClick={() => handleZoneClick(zone)}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition ${
                  inspectedItem?.grid_id === zone.grid_id
                    ? 'bg-blue-50 text-blue-800 font-semibold border border-blue-200'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span>#{zone.rank} {zone.zone_name}</span>
                <span className="font-bold text-emerald-700">{zone.mn_probability_pct}%</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReserveDetectionMap;
