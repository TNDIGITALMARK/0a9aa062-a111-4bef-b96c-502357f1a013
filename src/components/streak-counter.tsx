'use client';

import { Flame, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak?: number;
  className?: string;
  variant?: 'compact' | 'detailed';
  animated?: boolean;
}

export function StreakCounter({
  currentStreak,
  longestStreak,
  className,
  variant = 'detailed',
  animated = true,
}: StreakCounterProps) {
  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-purple-600 bg-purple-50 border-purple-200';
    if (streak >= 14) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (streak >= 7) return 'text-red-600 bg-red-50 border-red-200';
    if (streak >= 3) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getStreakMessage = (streak: number) => {
    if (streak >= 30) return 'Legendary!';
    if (streak >= 14) return 'On fire!';
    if (streak >= 7) return 'Great streak!';
    if (streak >= 3) return 'Keep going!';
    if (streak >= 1) return 'Getting started!';
    return 'Start your streak!';
  };

  const getFlameIcon = (streak: number) => {
    if (streak >= 7) return <Flame className="w-6 h-6" fill="currentColor" />;
    return <Zap className="w-6 h-6" />;
  };

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center space-x-2', className)}>
        <div className={cn('p-2 rounded-full', getStreakColor(currentStreak))}>
          {getFlameIcon(currentStreak)}
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-800">{currentStreak}</div>
          <div className="text-sm text-gray-600">day streak</div>
        </div>
      </div>
    );
  }

  return (
    <Card className={cn('bg-gradient-to-br from-orange-50 to-red-50 border-orange-200', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={cn(
              'p-3 rounded-full transition-all duration-300',
              getStreakColor(currentStreak),
              animated && currentStreak > 0 && 'animate-pulse'
            )}>
              {getFlameIcon(currentStreak)}
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-800">
                {currentStreak}
              </div>
              <div className="text-sm text-gray-600">
                day{currentStreak !== 1 ? 's' : ''} in a row
              </div>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <div className={cn(
            'text-sm font-medium px-3 py-1 rounded-full inline-block',
            getStreakColor(currentStreak)
          )}>
            {getStreakMessage(currentStreak)}
          </div>
        </div>

        {longestStreak !== undefined && longestStreak > currentStreak && (
          <div className="text-sm text-gray-600 flex items-center justify-between pt-3 border-t border-gray-200">
            <span>Longest streak:</span>
            <span className="font-semibold text-gray-800">{longestStreak} days</span>
          </div>
        )}

        {/* Progress bar towards next milestone */}
        {currentStreak < 30 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-600 mb-2">
              <span>Next milestone</span>
              <span>
                {currentStreak >= 14 ? '30 days' :
                 currentStreak >= 7 ? '14 days' :
                 currentStreak >= 3 ? '7 days' : '3 days'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={cn(
                  'h-2 rounded-full transition-all duration-1000',
                  currentStreak >= 14 ? 'bg-purple-500' :
                  currentStreak >= 7 ? 'bg-orange-500' :
                  currentStreak >= 3 ? 'bg-red-500' :
                  'bg-yellow-500'
                )}
                style={{
                  width: `${
                    currentStreak >= 14
                      ? ((currentStreak - 14) / (30 - 14)) * 100
                      : currentStreak >= 7
                      ? ((currentStreak - 7) / (14 - 7)) * 100
                      : currentStreak >= 3
                      ? ((currentStreak - 3) / (7 - 3)) * 100
                      : (currentStreak / 3) * 100
                  }%`,
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}