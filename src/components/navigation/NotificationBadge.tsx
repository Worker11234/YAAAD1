import React from 'react';

interface NotificationBadgeProps {
  count: number;
  maxCount?: number;
  className?: string;
}

export function NotificationBadge({ count, maxCount = 99, className = '' }: NotificationBadgeProps) {
  if (count <= 0) return null;

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  return (
    <span className={`
      absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold 
      rounded-full min-w-[20px] h-5 flex items-center justify-center 
      px-1 shadow-sm border-2 border-white
      ${className}
    `}>
      {displayCount}
    </span>
  );
}