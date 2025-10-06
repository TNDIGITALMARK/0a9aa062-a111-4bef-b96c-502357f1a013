'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ProgressRing } from '@/components/progress-ring';
import { StreakCounter } from '@/components/streak-counter';
import {
  ArrowLeft,
  Trophy,
  Target,
  Calendar,
  Star,
  TrendingUp,
  Globe,
  Award,
  BookOpen,
  Clock,
  Flame,
  Zap,
  Crown,
  Medal,
  Gift,
  ChevronRight,
  Share,
  Download,
} from 'lucide-react';
import {
  mockUserProgress,
  mockLanguages,
  Achievement,
} from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Chart component (simplified for this implementation)
const SimpleBarChart = ({ data, className }: { data: number[], className?: string }) => {
  const maxValue = Math.max(...data);

  return (
    <div className={cn('flex items-end space-x-1 h-20', className)}>
      {data.map((value, index) => (
        <div
          key={index}
          className="bg-blue-600 rounded-t flex-1 transition-all duration-300 hover:bg-blue-500"
          style={{
            height: `${(value / maxValue) * 100}%`,
            minHeight: '4px',
          }}
          title={`Day ${index + 1}: ${value} words`}
        />
      ))}
    </div>
  );
};

const SimpleLineChart = ({ data, className }: { data: number[], className?: string }) => {
  return (
    <div className={cn('relative h-20', className)}>
      <svg width="100%" height="100%" className="overflow-visible">
        <polyline
          fill="none"
          stroke="#60a5fa"
          strokeWidth="2"
          points={data
            .map((value, index) =>
              `${(index / (data.length - 1)) * 100},${100 - (value / Math.max(...data)) * 80}`
            )
            .join(' ')}
        />
        {data.map((value, index) => (
          <circle
            key={index}
            cx={`${(index / (data.length - 1)) * 100}%`}
            cy={`${100 - (value / Math.max(...data)) * 80}%`}
            r="3"
            fill="#60a5fa"
            className="hover:r-4 transition-all cursor-pointer"
          >
            <title>{`Day ${index + 1}: Level ${value}`}</title>
          </circle>
        ))}
      </svg>
    </div>
  );
};

export default function ProgressPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('week');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

  const userProgress = mockUserProgress;

  // Mock data for charts
  const weeklyData = [5, 8, 3, 12, 7, 9, 15];
  const levelProgressData = [1, 1, 2, 2, 3, 3, 4];
  const streakData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const allAchievements: Achievement[] = [
    ...userProgress.achievements,
    {
      id: 'streak-30',
      title: 'Month Master',
      description: 'Maintain a 30-day streak',
      icon: '🔥',
      unlockedAt: new Date(),
      category: 'streak',
    },
    {
      id: 'vocab-100',
      title: 'Century Scholar',
      description: 'Learn 100 words',
      icon: '📖',
      unlockedAt: new Date(),
      category: 'vocabulary',
    },
    {
      id: 'perfect-10',
      title: 'Perfectionist',
      description: 'Get 10 perfect lessons',
      icon: '💎',
      unlockedAt: new Date(),
      category: 'perfect',
    },
  ];

  const unlockedAchievements = allAchievements.filter(a =>
    userProgress.achievements.some(ua => ua.id === a.id)
  );

  const lockedAchievements = allAchievements.filter(a =>
    !userProgress.achievements.some(ua => ua.id === a.id)
  );

  const getAchievementIcon = (category: string) => {
    switch (category) {
      case 'streak': return <Flame className="w-4 h-4" />;
      case 'vocabulary': return <BookOpen className="w-4 h-4" />;
      case 'lessons': return <Target className="w-4 h-4" />;
      case 'perfect': return <Star className="w-4 h-4" />;
      default: return <Trophy className="w-4 h-4" />;
    }
  };

  const calculateNextLevelProgress = () => {
    const currentLevelXP = userProgress.xp % 1000;
    return (currentLevelXP / 1000) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-100">Your Progress</h1>
                <p className="text-sm text-gray-300">Track your learning journey</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="languages">Languages</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-blue-900/20 to-blue-800/20 border-blue-700">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-100">{userProgress.level}</div>
                  <div className="text-sm text-gray-400">Current Level</div>
                  <Progress value={calculateNextLevelProgress()} className="mt-2 h-1" />
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-900/20 to-green-800/20 border-green-700">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-100">{userProgress.totalWordsLearned}</div>
                  <div className="text-sm text-gray-400">Words Learned</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-900/20 to-orange-800/20 border-orange-700">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Flame className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-100">{userProgress.currentStreak}</div>
                  <div className="text-sm text-gray-400">Day Streak</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-100">{userProgress.xp}</div>
                  <div className="text-sm text-gray-400">Total XP</div>
                </CardContent>
              </Card>
            </div>

            {/* Main Progress Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Streak Counter */}
              <StreakCounter
                currentStreak={userProgress.currentStreak}
                longestStreak={userProgress.longestStreak}
                animated={true}
              />

              {/* Level Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Crown className="w-5 h-5 text-yellow-400" />
                    <span>Level Progress</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center mb-6">
                    <ProgressRing
                      progress={calculateNextLevelProgress()}
                      size={120}
                      variant="primary"
                    >
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">
                          {userProgress.level}
                        </div>
                        <div className="text-xs text-gray-600">level</div>
                      </div>
                    </ProgressRing>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Current XP</span>
                      <span className="font-medium">{userProgress.xp % 1000}/1000</span>
                    </div>
                    <Progress value={calculateNextLevelProgress()} className="h-2" />
                    <p className="text-xs text-gray-500 text-center">
                      {1000 - (userProgress.xp % 1000)} XP until level {userProgress.level + 1}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-yellow-400" />
                    <span>Recent Achievements</span>
                  </CardTitle>
                  <Link href="#achievements">
                    <Button variant="ghost" size="sm">
                      View All <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {unlockedAchievements.slice(0, 4).map((achievement) => (
                    <div
                      key={achievement.id}
                      className="p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 text-center hover:shadow-md transition-shadow"
                    >
                      <div className="text-3xl mb-2">{achievement.icon}</div>
                      <h4 className="font-semibold text-gray-800 text-sm mb-1">
                        {achievement.title}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">
                        {achievement.description}
                      </p>
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                        Unlocked
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-6">
            {/* Time Period Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Time Period:</span>
              <div className="flex space-x-2">
                {(['week', 'month', 'year'] as const).map((period) => (
                  <Button
                    key={period}
                    variant={selectedTimeframe === period ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTimeframe(period)}
                    className="capitalize"
                  >
                    {period}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span>Daily Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SimpleBarChart data={weeklyData} className="mb-4" />
                  <div className="text-sm text-gray-600">
                    <p>Average: {Math.round(weeklyData.reduce((a, b) => a + b, 0) / weeklyData.length)} words/day</p>
                    <p>Best day: {Math.max(...weeklyData)} words</p>
                  </div>
                </CardContent>
              </Card>

              {/* Level Progress Over Time */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span>Level Progress</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SimpleLineChart data={levelProgressData} className="mb-4" />
                  <div className="text-sm text-gray-600">
                    <p>Started at Level {levelProgressData[0]}</p>
                    <p>Currently Level {levelProgressData[levelProgressData.length - 1]}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Streak History */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Flame className="w-5 h-5 text-orange-600" />
                    <span>Streak History</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SimpleBarChart data={streakData} className="mb-4" />
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{userProgress.currentStreak}</div>
                      <div className="text-gray-600">Current</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{userProgress.longestStreak}</div>
                      <div className="text-gray-600">Longest</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">85%</div>
                      <div className="text-gray-600">Success Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            {/* Achievement Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {['streak', 'vocabulary', 'lessons', 'perfect'].map((category) => (
                <Card key={category} className="text-center hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      {getAchievementIcon(category)}
                    </div>
                    <div className="text-lg font-bold text-gray-800">
                      {allAchievements.filter(a => a.category === category &&
                        userProgress.achievements.some(ua => ua.id === a.id)).length}
                    </div>
                    <div className="text-xs text-gray-600 capitalize">{category}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Unlocked Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <span>Unlocked Achievements ({unlockedAchievements.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {unlockedAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-1">
                            {achievement.title}
                          </h4>
                          <p className="text-xs text-gray-600 mb-2">
                            {achievement.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                              Unlocked
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(achievement.unlockedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Locked Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Medal className="w-5 h-5 text-gray-500" />
                  <span>Coming Soon ({lockedAchievements.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lockedAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="p-4 rounded-lg bg-gray-50 border border-gray-200 opacity-75"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl grayscale">{achievement.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-600 mb-1">
                            {achievement.title}
                          </h4>
                          <p className="text-xs text-gray-500 mb-2">
                            {achievement.description}
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            Locked
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="languages" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockLanguages.map((language) => {
                const languageProgress = userProgress.languageProgress[language.code];
                if (!languageProgress) return null;

                return (
                  <Card key={language.code}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <span className="text-2xl">{language.flag}</span>
                        <div>
                          <div className="text-lg font-semibold">{language.name}</div>
                          <div className="text-sm text-gray-600">
                            Level {languageProgress.level}
                          </div>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Progress Ring */}
                        <div className="flex justify-center">
                          <ProgressRing
                            progress={(languageProgress.xp % 200) / 2}
                            size={100}
                            variant="success"
                          >
                            <div className="text-center">
                              <div className="text-xl font-bold text-gray-800">
                                {languageProgress.level}
                              </div>
                              <div className="text-xs text-gray-600">level</div>
                            </div>
                          </ProgressRing>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-blue-600">
                              {languageProgress.wordsLearned}
                            </div>
                            <div className="text-sm text-gray-600">Words</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-green-600">
                              {languageProgress.lessonsCompleted}
                            </div>
                            <div className="text-sm text-gray-600">Lessons</div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div>
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Progress to Level {languageProgress.level + 1}</span>
                            <span>{languageProgress.xp % 200}/200 XP</span>
                          </div>
                          <Progress value={(languageProgress.xp % 200) / 2} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}