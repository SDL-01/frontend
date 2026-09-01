import React from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';

export const Toast = ({ toast }) => {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 shrink-0" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in">
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-lg text-slate-800 text-sm font-medium">
        {icons[toast.type] || icons.info}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};

export default Toast;
