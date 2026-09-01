import React from 'react';

export const StatusBadge = ({ status, variant = 'default', size = 'sm' }) => {
  const getColors = () => {
    switch (variant) {
      case 'critical':
      case 'danger':
      case 'high-risk':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'warning':
      case 'high':
      case 'medium-risk':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'success':
      case 'clear':
      case 'low-risk':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'info':
      case 'active':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'purple':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const sizeClasses = size === 'xs' ? 'px-2 py-0.5 text-[11px]' : size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border font-sans ${getColors()} ${sizeClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
};

export default StatusBadge;
