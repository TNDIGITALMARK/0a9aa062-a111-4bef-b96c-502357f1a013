'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { StreakCounter } from '@/components/streak-counter';
import { ProgressRing } from '@/components/progress-ring';
import {
  BookOpen,
  Play,
  Target,
  Calendar,
  Star,
  TrendingUp,
  Globe,
  Award,
  ChevronRight,
} from 'lucide-react';
import {
  mockUserProgress,
  mockLanguages,
  getWordsForReview,
  getDueWords,
} from '@/lib/mock-data';
import Link from 'next/link';

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedLanguage, setSelectedLanguage] = useState('es');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const userProgress = mockUserProgress;
  const currentLanguage = mockLanguages.find(lang => lang.code === selectedLanguage);
  const dueWords = currentLanguage ? getDueWords(currentLanguage.vocabulary) : [];
  const reviewWords = currentLanguage ? getWordsForReview(currentLanguage.vocabulary) : [];

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const dailyProgressPercentage = (userProgress.wordsLearnedToday / userProgress.dailyGoal) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-100">LinguaFlow</h1>
                  <p className="text-sm text-gray-300">Your language learning journey</p>
                </div>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-blue-400 font-medium">
                Dashboard
              </Link>
              <Link href="/learn" className="text-gray-300 hover:text-blue-400 transition-colors">
                Learn
              </Link>
              <Link href="/progress" className="text-gray-300 hover:text-blue-400 transition-colors">
                Progress
              </Link>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-green-600">
                Premium
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-100 mb-2">
            {getGreeting()}! Ready to learn?
          </h2>
          <p className="text-gray-300 text-lg">
            You're doing great! Keep up the momentum with your daily practice.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Current Streak */}
          <div className="lg:col-span-1">
            <StreakCounter
              currentStreak={userProgress.currentStreak}
              longestStreak={userProgress.longestStreak}
              animated={true}
            />
          </div>

          {/* Daily Goal Progress */}
          <Card className="lg:col-span-2 bg-gradient-to-r from-emerald-900/20 to-green-900/20 border-green-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-green-400" />
                  <span>Daily Goal</span>
                </CardTitle>
                <Badge variant="outline" className="bg-slate-800 border-slate-600">
                  {userProgress.wordsLearnedToday}/{userProgress.dailyGoal} words
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress
                  value={dailyProgressPercentage}
                  className="h-3"
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>
                    {userProgress.dailyGoal - userProgress.wordsLearnedToday} words remaining
                  </span>
                  <span>{Math.round(dailyProgressPercentage)}% complete</span>
                </div>
                {dailyProgressPercentage >= 100 && (
                  <div className="flex items-center space-x-2 text-green-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">Goal completed! 🎉</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Language Selection & Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-blue-400" />
                <span>Your Languages</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockLanguages.map((language) => (
                  <div
                    key={language.code}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedLanguage === language.code
                        ? 'border-blue-500 bg-blue-900/20'
                        : 'border-slate-600 hover:border-blue-500 hover:bg-slate-700/50'
                    }`}
                    onClick={() => setSelectedLanguage(language.code)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{language.flag}</span>
                        <div>
                          <h3 className="font-semibold text-gray-100">{language.name}</h3>
                          <p className="text-sm text-gray-400">
                            Level {userProgress.languageProgress[language.code]?.level || 1}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-400">
                          {userProgress.languageProgress[language.code]?.wordsLearned || 0}
                        </div>
                        <div className="text-xs text-gray-400">words learned</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Overall Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span>Overall Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-6">
                <ProgressRing
                  progress={(userProgress.xp % 1000) / 10}
                  size={120}
                  variant="primary"
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-100">
                      {userProgress.level}
                    </div>
                    <div className="text-xs text-gray-400">level</div>
                  </div>
                </ProgressRing>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {userProgress.totalWordsLearned}
                  </div>
                  <div className="text-gray-400">Total Words</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {userProgress.totalLessonsCompleted}
                  </div>
                  <div className="text-gray-400">Lessons</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Start Learning */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-600 rounded-full">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <ChevronRight className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-100 mb-2">
                Start Learning
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Continue with your {currentLanguage?.name} lessons
              </p>
              <Link href="/learn">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Continue Learning
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Review Words */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-orange-900/20 to-orange-800/20 border-orange-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-600 rounded-full">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-orange-600">{dueWords.length}</Badge>
              </div>
              <h3 className="text-xl font-semibold text-gray-100 mb-2">
                Review Words
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                {dueWords.length} words are due for review
              </p>
              <Link href="/learn?mode=review">
                <Button variant="outline" className="w-full border-orange-500 text-orange-400 hover:bg-orange-900/20">
                  Start Review
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* View Progress */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-600 rounded-full">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-green-600">{userProgress.achievements.length}</Badge>
              </div>
              <h3 className="text-xl font-semibold text-gray-100 mb-2">
                View Progress
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Check your achievements and stats
              </p>
              <Link href="/progress">
                <Button variant="outline" className="w-full border-green-500 text-green-400 hover:bg-green-900/20">
                  View Progress
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Achievements */}
        {userProgress.achievements.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-400" />
                <span>Recent Achievements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {userProgress.achievements.slice(0, 4).map((achievement) => (
                  <div
                    key={achievement.id}
                    className="p-4 rounded-lg bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-700 text-center"
                  >
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <h4 className="font-semibold text-gray-100 text-sm mb-1">
                      {achievement.title}
                    </h4>
                    <p className="text-xs text-gray-400">
                      {achievement.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}