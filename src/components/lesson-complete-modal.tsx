'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressRing } from '@/components/progress-ring';
import {
  Trophy,
  Star,
  Target,
  Clock,
  ArrowRight,
  RotateCcw,
  Share,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LessonStats {
  wordsStudied: number;
  correctAnswers: number;
  timeSpent: number; // in minutes
  perfectWords: string[];
  newWordsLearned: number;
  streakIncreased: boolean;
  xpEarned: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

interface LessonCompleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stats: LessonStats;
  achievements?: Achievement[];
  onContinue: () => void;
  onReview: () => void;
  onShare?: () => void;
  language?: string;
}

export function LessonCompleteModal({
  open,
  onOpenChange,
  stats,
  achievements = [],
  onContinue,
  onReview,
  onShare,
  language = 'Language',
}: LessonCompleteModalProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  const accuracy = stats.wordsStudied > 0 ? Math.round((stats.correctAnswers / stats.wordsStudied) * 100) : 0;
  const isPerfectScore = accuracy === 100;
  const isGreatScore = accuracy >= 80;

  useEffect(() => {
    if (open) {
      setShowCelebration(true);

      // Staggered animations
      const timeouts = [
        setTimeout(() => setAnimationStep(1), 300),
        setTimeout(() => setAnimationStep(2), 600),
        setTimeout(() => setAnimationStep(3), 900),
      ];

      return () => timeouts.forEach(clearTimeout);
    } else {
      setShowCelebration(false);
      setAnimationStep(0);
    }
  }, [open]);

  const getScoreMessage = () => {
    if (isPerfectScore) return "Perfect! Outstanding work!";
    if (isGreatScore) return "Great job! Well done!";
    if (accuracy >= 60) return "Good effort! Keep practicing!";
    return "Keep going! Practice makes perfect!";
  };

  const getScoreColor = () => {
    if (isPerfectScore) return "text-yellow-600";
    if (isGreatScore) return "text-green-600";
    if (accuracy >= 60) return "text-blue-600";
    return "text-gray-600";
  };

  const newAchievements = achievements.filter(a => a.unlocked);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md mx-auto bg-gradient-to-br from-blue-50 via-white to-green-50 border-2 border-blue-200">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto">
            {showCelebration && (
              <div className="relative">
                <Trophy
                  className={cn(
                    "w-16 h-16 mx-auto transition-all duration-1000",
                    isPerfectScore ? "text-yellow-500" : "text-blue-500",
                    animationStep >= 1 && "scale-110 animate-bounce"
                  )}
                />
                {isPerfectScore && animationStep >= 1 && (
                  <div className="absolute inset-0 animate-ping">
                    <Star className="w-16 h-16 mx-auto text-yellow-400" />
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogTitle className="text-2xl font-bold text-gray-800">
            Lesson Complete!
          </DialogTitle>

          <p className={cn("text-lg font-medium", getScoreColor())}>
            {getScoreMessage()}
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Ring */}
          <div className="flex justify-center">
            <ProgressRing
              progress={animationStep >= 2 ? accuracy : 0}
              size={120}
              variant={isPerfectScore ? 'success' : isGreatScore ? 'primary' : 'warning'}
              animate={true}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {animationStep >= 2 ? accuracy : 0}%
                </div>
                <div className="text-xs text-gray-600">accuracy</div>
              </div>
            </ProgressRing>
          </div>

          {/* Stats Grid */}
          <div className={cn(
            "grid grid-cols-2 gap-4 transition-all duration-700",
            animationStep >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <div className="bg-white rounded-lg p-3 shadow-sm border">
              <div className="flex items-center space-x-2 mb-1">
                <Target className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600">Correct</span>
              </div>
              <div className="text-xl font-bold text-green-600">
                {stats.correctAnswers}/{stats.wordsStudied}
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm border">
              <div className="flex items-center space-x-2 mb-1">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-600">Time</span>
              </div>
              <div className="text-xl font-bold text-blue-600">
                {stats.timeSpent}m
              </div>
            </div>

            {stats.newWordsLearned > 0 && (
              <div className="bg-white rounded-lg p-3 shadow-sm border">
                <div className="flex items-center space-x-2 mb-1">
                  <Star className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-gray-600">New Words</span>
                </div>
                <div className="text-xl font-bold text-yellow-600">
                  +{stats.newWordsLearned}
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg p-3 shadow-sm border">
              <div className="flex items-center space-x-2 mb-1">
                <Trophy className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-600">XP Earned</span>
              </div>
              <div className="text-xl font-bold text-purple-600">
                +{stats.xpEarned}
              </div>
            </div>
          </div>

          {/* Achievements */}
          {newAchievements.length > 0 && (
            <div className={cn(
              "transition-all duration-700 delay-300",
              animationStep >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
                🎉 New Achievements!
              </h3>
              <div className="space-y-2">
                {newAchievements.map((achievement, index) => (
                  <div
                    key={achievement.id}
                    className={cn(
                      "flex items-center space-x-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3 transition-all duration-500",
                      `delay-${(index + 1) * 100}`
                    )}
                    style={{
                      animationDelay: `${(index + 1) * 100}ms`,
                    }}
                  >
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">
                        {achievement.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {achievement.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Special badges */}
          <div className="flex justify-center space-x-2">
            {isPerfectScore && (
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                Perfect Score! 💯
              </Badge>
            )}
            {stats.perfectWords.length > 0 && (
              <Badge className="bg-green-100 text-green-800 border-green-300">
                {stats.perfectWords.length} Perfect Words ⭐
              </Badge>
            )}
            {stats.streakIncreased && (
              <Badge className="bg-orange-100 text-orange-800 border-orange-300">
                Streak Extended! 🔥
              </Badge>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col space-y-3">
            <Button
              onClick={onContinue}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              size="lg"
            >
              Continue Learning
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onReview}
                className="flex-1"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Review Words
              </Button>

              {onShare && (
                <Button
                  variant="outline"
                  onClick={onShare}
                  className="flex-1"
                >
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}