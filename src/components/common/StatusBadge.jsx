import React from 'react';
import {
  RESERVATION_STATUS_CONFIG,
  PAYMENT_STATUS_CONFIG,
  ROOM_AVAILABILITY_CONFIG,
} from '../../utils/constants';

const StatusBadge = ({ status, type = 'reservation', size = 'md' }) => {
  let config;
  if (type === 'payment') {
    config = PAYMENT_STATUS_CONFIG[status?.toLowerCase()] || {
      label: status,
      bg: 'bg-gray-500/10',
      text: 'text-gray-400',
      border: 'border-gray-500/30',
    };
  } else if (type === 'room') {
    config = ROOM_AVAILABILITY_CONFIG[status?.toLowerCase()] || {
      label: status,
      bg: 'bg-gray-500/10',
      text: 'text-gray-400',
      border: 'border-gray-500/30',
    };
  } else {
    config = RESERVATION_STATUS_CONFIG[status?.toLowerCase()] || {
      label: status || 'Unknown',
      bg: 'bg-gray-500/10',
      text: 'text-gray-400',
      border: 'border-gray-500/30',
      dot: 'bg-gray-400',
    };
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}`}
    >
      {config.dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      )}
      {config.label}
    </span>
  );
};

export default StatusBadge;
