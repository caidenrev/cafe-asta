import React from 'react';

export type OrderStatus = 'Pending' | 'Processing' | 'Completed';

interface StatusBadgeProps {
  status: OrderStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    Pending: {
      bg: 'bg-amber-50 text-amber-800 border-amber-200/80',
      dot: 'bg-amber-500 animate-status-pulse',
      label: 'Menunggu'
    },
    Processing: {
      bg: 'bg-blue-50 text-blue-800 border-blue-200/80',
      dot: 'bg-blue-500 animate-pulse',
      label: 'Disiapkan'
    },
    Completed: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      dot: 'bg-emerald-500',
      label: 'Selesai'
    }
  };

  const current = config[status] || config.Pending;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${current.bg} shadow-sm select-none transition-all duration-300`}>
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`}></span>
      {current.label}
    </span>
  );
}
