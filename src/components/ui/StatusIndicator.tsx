
import React from 'react';
import { cn } from '@/lib/utils';

type StatusType = 'online' | 'offline' | 'loading' | 'error' | 'success';

interface StatusIndicatorProps {
  status: StatusType;
  text?: string;
  className?: string;
  pulse?: boolean;
}

const StatusIndicator = ({
  status,
  text,
  className,
  pulse = true,
}: StatusIndicatorProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-gray-400';
      case 'loading':
        return 'bg-blue-500';
      case 'error':
        return 'bg-red-500';
      case 'success':
        return 'bg-green-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = () => {
    return text || status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative flex items-center">
        <div
          className={cn(
            'h-2.5 w-2.5 rounded-full',
            getStatusColor(),
            pulse && 'animate-pulse-subtle'
          )}
        />
        {pulse && (
          <div
            className={cn(
              'absolute inset-0 h-2.5 w-2.5 rounded-full',
              getStatusColor(),
              'opacity-60 animate-ping'
            )}
          />
        )}
      </div>
      <span className="text-sm font-medium text-muted-foreground">
        {getStatusText()}
      </span>
    </div>
  );
};

export default StatusIndicator;
