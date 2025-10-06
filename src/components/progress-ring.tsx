'use client';

import { cn } from '@/lib/utils';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'error';
  showPercentage?: boolean;
  animate?: boolean;
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  className,
  children,
  variant = 'primary',
  showPercentage = false,
  animate = true,
}: ProgressRingProps) {
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedProgress / 100) * circumference;

  const getVariantColors = (variant: string) => {
    switch (variant) {
      case 'success':
        return {
          track: 'stroke-green-100',
          progress: 'stroke-green-500',
          text: 'text-green-600',
        };
      case 'warning':
        return {
          track: 'stroke-yellow-100',
          progress: 'stroke-yellow-500',
          text: 'text-yellow-600',
        };
      case 'error':
        return {
          track: 'stroke-red-100',
          progress: 'stroke-red-500',
          text: 'text-red-600',
        };
      default:
        return {
          track: 'stroke-blue-100',
          progress: 'stroke-blue-500',
          text: 'text-blue-600',
        };
    }
  };

  const colors = getVariantColors(variant);

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        aria-hidden="true"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className={cn('fill-transparent', colors.track)}
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={cn(
            'fill-transparent transition-all duration-1000 ease-out',
            colors.progress,
            animate && 'animate-in'
          )}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: animate ? strokeDashoffset : 0,
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (
          showPercentage && (
            <div className="text-center">
              <div className={cn('text-2xl font-bold', colors.text)}>
                {Math.round(normalizedProgress)}%
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}