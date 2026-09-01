import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const MetricCard = ({
  title,
  value,
  unit = '',
  trend = null,
  icon: Icon,
  color = 'blue',
  subtitle = null,
  onClick = null
}) => {
  const iconColors = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    rose: 'bg-rose-50 text-rose-600',
    purple: 'bg-purple-50 text-purple-600',
    cyan: 'bg-cyan-50 text-cyan-600'
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs transition-all ${
        onClick ? 'cursor-pointer hover:border-slate-300 hover:shadow-sm' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{title}</p>
          <div className="flex items-baseline gap-1 mt-1.5">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">{value}</span>
            {unit && <span className="text-xs font-medium text-slate-500">{unit}</span>}
          </div>
        </div>

        {Icon && (
          <div className={`p-2.5 rounded-lg ${iconColors[color] || iconColors.blue}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(trend || subtitle) && (
        <div className="flex items-center justify-between text-xs mt-3 pt-2.5 border-t border-slate-100">
          {trend && (
            <span className={`inline-flex items-center font-medium ${trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
              {trend.isPositive ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
              {trend.value}
            </span>
          )}
          {subtitle && <span className="text-slate-400">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};

export default MetricCard;
