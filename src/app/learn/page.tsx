'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { VocabularyCard } from '@/components/vocabulary-card';
import { AudioButton } from '@/components/audio-button';
import { LessonCompleteModal } from '@/components/lesson-complete-modal';
import {
  ArrowLeft,
  ArrowRight,
  SkipForward,
  Pause,
  Play,
  Home,
  RotateCcw,
  Volume2,
  Heart,
  X,
  Check,
  Shuffle,
} from 'lucide-react';
import {
  mockLanguages,
  getWordsForReview,
  calculateNextReviewDate,
  VocabularyWord,
  mockUserProgress,
} from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface LessonSession {
  id: string;
  words: VocabularyWord[];
  currentIndex: number;
  correctCount: number;
  incorrectCount: number;
  startTime: Date;
  mode: 'learn' | 'review' | 'test';
  language: string;
  perfectWords: string[];
  reviewedWords: { [wordId: string]: { correct: boolean; attempts: number } };
}

export default function LearnPage() {
  const searchParams = useSearchParams();
  const mode = (searchParams.get('mode') || 'learn') as 'learn' | 'review' | 'test';
  const languageCode = searchParams.get('lang') || 'es';

  const [session, setSession] = useState<LessonSession | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [lives, setLives] = useState(5);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session
  useEffect(() => {
    const initializeSession = async () => {
      const language = mockLanguages.find(lang => lang.code === languageCode);
      if (!language) return;

      let wordsToStudy: VocabularyWord[];

      if (mode === 'review') {
        wordsToStudy = getWordsForReview(language.vocabulary, 10);
      } else if (mode === 'test') {
        // For test mode, mix due words with some random ones
        const dueWords = getWordsForReview(language.vocabulary, 5);
        const otherWords = language.vocabulary
          .filter(word => !dueWords.includes(word))
          .sort(() => Math.random() - 0.5)
          .slice(0, 5);
        wordsToStudy = [...dueWords, ...otherWords].sort(() => Math.random() - 0.5);
      } else {
        // Learn mode - focus on words that need practice
        wordsToStudy = language.vocabulary
          .filter(word => word.correctCount < 5)
          .sort((a, b) => (a.correctCount - a.incorrectCount) - (b.correctCount - b.incorrectCount))
          .slice(0, 10);
      }

      if (wordsToStudy.length === 0) {
        // If no words available, use first few words
        wordsToStudy = language.vocabulary.slice(0, 5);
      }

      const newSession: LessonSession = {
        id: Date.now().toString(),
        words: wordsToStudy,
        currentIndex: 0,
        correctCount: 0,
        incorrectCount: 0,
        startTime: new Date(),
        mode,
        language: language.name,
        perfectWords: [],
        reviewedWords: {},
      };

      setSession(newSession);
      setLives(mode === 'test' ? 5 : Infinity);
      setIsLoading(false);
    };

    initializeSession();
  }, [mode, languageCode]);

  const getCurrentWord = useCallback(() => {
    if (!session || session.currentIndex >= session.words.length) return null;
    return session.words[session.currentIndex];
  }, [session]);

  const handleCorrect = useCallback(() => {
    if (!session) return;

    const currentWord = getCurrentWord();
    if (!currentWord) return;

    const updatedSession = {
      ...session,
      correctCount: session.correctCount + 1,
      reviewedWords: {
        ...session.reviewedWords,
        [currentWord.id]: {
          correct: true,
          attempts: (session.reviewedWords[currentWord.id]?.attempts || 0) + 1,
        },
      },
    };

    // Check if this word was answered correctly on first try
    if (!session.reviewedWords[currentWord.id]) {
      updatedSession.perfectWords = [...session.perfectWords, currentWord.id];
    }

    setSession(updatedSession);

    // Move to next word after a brief delay
    setTimeout(() => {
      moveToNextWord();
    }, 1000);
  }, [session]);

  const handleIncorrect = useCallback(() => {
    if (!session) return;

    const currentWord = getCurrentWord();
    if (!currentWord) return;

    const updatedSession = {
      ...session,
      incorrectCount: session.incorrectCount + 1,
      reviewedWords: {
        ...session.reviewedWords,
        [currentWord.id]: {
          correct: false,
          attempts: (session.reviewedWords[currentWord.id]?.attempts || 0) + 1,
        },
      },
    };

    setSession(updatedSession);

    if (mode === 'test') {
      setLives(prev => Math.max(0, prev - 1));

      if (lives <= 1) {
        // Game over
        completeSession();
        return;
      }
    }

    // Show answer for incorrect responses
    setShowAnswer(true);

    setTimeout(() => {
      setShowAnswer(false);
      moveToNextWord();
    }, 3000);
  }, [session, lives, mode]);

  const moveToNextWord = useCallback(() => {
    if (!session) return;

    if (session.currentIndex >= session.words.length - 1) {
      completeSession();
    } else {
      setSession(prev => prev ? {
        ...prev,
        currentIndex: prev.currentIndex + 1,
      } : null);
      setShowAnswer(false);
    }
  }, [session]);

  const moveToPreviousWord = useCallback(() => {
    if (!session || session.currentIndex <= 0) return;

    setSession(prev => prev ? {
      ...prev,
      currentIndex: prev.currentIndex - 1,
    } : null);
    setShowAnswer(false);
  }, [session]);

  const skipWord = useCallback(() => {
    moveToNextWord();
  }, [moveToNextWord]);

  const completeSession = useCallback(() => {
    setShowCompleteModal(true);
  }, []);

  const handleSessionComplete = useCallback(() => {
    setShowCompleteModal(false);
    // Navigate back to dashboard or continue with next session
  }, []);

  const calculateAccuracy = useCallback(() => {
    if (!session || session.correctCount + session.incorrectCount === 0) return 0;
    return Math.round((session.correctCount / (session.correctCount + session.incorrectCount)) * 100);
  }, [session]);

  const getTimeSpent = useCallback(() => {
    if (!session) return 0;
    return Math.round((Date.now() - session.startTime.getTime()) / 1000 / 60);
  }, [session]);

  if (isLoading || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing your lesson...</p>
        </div>
      </div>
    );
  }

  const currentWord = getCurrentWord();
  const progress = ((session.currentIndex + 1) / session.words.length) * 100;
  const accuracy = calculateAccuracy();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>

              <div className="flex items-center space-x-3">
                <Badge className="bg-blue-100 text-blue-800">
                  {session.language}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {mode} Mode
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {mode === 'test' && lives !== Infinity && (
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {lives}
                  </span>
                </div>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? (
                  <Play className="w-4 h-4" />
                ) : (
                  <Pause className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                {session.currentIndex + 1} of {session.words.length}
              </span>
              <span className="text-sm text-gray-600">
                {accuracy}% accuracy
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </header>

      {isPaused ? (
        <div className="flex-1 flex items-center justify-center p-8">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <Pause className="w-16 h-16 mx-auto text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Lesson Paused</h2>
              <p className="text-gray-600 mb-6">
                Take your time. Resume when you're ready to continue.
              </p>
              <div className="flex flex-col space-y-3">
                <Button onClick={() => setIsPaused(false)} className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Resume Lesson
                </Button>
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    <Home className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl mx-auto">
            {currentWord ? (
              <div className="space-y-6">
                {/* Word Counter and Settings */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={moveToPreviousWord}
                      disabled={session.currentIndex === 0}
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>

                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">
                        {session.currentIndex + 1}
                      </div>
                      <div className="text-sm text-gray-600">
                        of {session.words.length}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={moveToNextWord}
                      disabled={session.currentIndex >= session.words.length - 1}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <AudioButton
                      text={currentWord.word}
                      language={languageCode}
                      size="sm"
                    />

                    {mode === 'learn' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={skipWord}
                      >
                        <SkipForward className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Vocabulary Card */}
                <VocabularyCard
                  word={currentWord}
                  onCorrect={handleCorrect}
                  onIncorrect={handleIncorrect}
                  showAnswer={showAnswer}
                  mode={mode}
                  className="mx-auto"
                  onPlayAudio={() => {
                    // Audio functionality handled by AudioButton
                  }}
                  onSwipeLeft={mode === 'test' ? handleIncorrect : skipWord}
                  onSwipeRight={mode === 'test' ? handleCorrect : moveToNextWord}
                  enableSwipeGestures={true}
                />

                {/* Mobile Swipe Instructions */}
                <div className="md:hidden text-center text-gray-500 text-sm mt-4">
                  <p className="flex items-center justify-center space-x-4">
                    <span className="flex items-center">
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      {mode === 'test' ? 'Swipe left: Don\'t know' : 'Swipe left: Skip'}
                    </span>
                    <span className="flex items-center">
                      <ArrowRight className="w-4 h-4 mr-1" />
                      {mode === 'test' ? 'Swipe right: Know it' : 'Swipe right: Next'}
                    </span>
                  </p>
                </div>

                {/* Action Buttons for Test Mode */}
                {mode === 'test' && !showAnswer && (
                  <div className="flex justify-center space-x-4 mt-8">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleIncorrect}
                      className="flex items-center space-x-2 border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <X className="w-5 h-5" />
                      <span>Don't Know</span>
                    </Button>
                    <Button
                      size="lg"
                      onClick={handleCorrect}
                      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                    >
                      <Check className="w-5 h-5" />
                      <span>I Know This</span>
                    </Button>
                  </div>
                )}

                {/* Review Mode Instructions */}
                {mode === 'review' && (
                  <div className="text-center text-gray-600 text-sm">
                    <p>Review these words to strengthen your memory</p>
                  </div>
                )}

                {/* Learn Mode Instructions */}
                {mode === 'learn' && (
                  <div className="text-center text-gray-600 text-sm">
                    <p>Take your time to learn each word</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <div className="text-gray-600 mb-4">No more words in this session</div>
                <Button onClick={completeSession}>Complete Lesson</Button>
              </div>
            )}
          </div>
        </main>
      )}

      {/* Session Statistics */}
      <div className="fixed bottom-4 right-4 hidden md:block">
        <Card className="bg-white/90 backdrop-blur-sm border-gray-200">
          <CardContent className="p-4">
            <div className="text-xs text-gray-600 space-y-1">
              <div>Correct: {session.correctCount}</div>
              <div>Incorrect: {session.incorrectCount}</div>
              <div>Time: {getTimeSpent()}m</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lesson Complete Modal */}
      <LessonCompleteModal
        open={showCompleteModal}
        onOpenChange={setShowCompleteModal}
        stats={{
          wordsStudied: session.words.length,
          correctAnswers: session.correctCount,
          timeSpent: getTimeSpent(),
          perfectWords: session.perfectWords,
          newWordsLearned: Math.min(5, session.correctCount), // Simplified calculation
          streakIncreased: true, // This would be calculated based on actual streak logic
          xpEarned: session.correctCount * 10 + session.perfectWords.length * 5,
        }}
        achievements={[
          // Mock achievements for demo
          ...(accuracy === 100 ? [{
            id: 'perfect',
            title: 'Perfect Score!',
            description: 'Completed lesson with 100% accuracy',
            icon: '🎯',
            unlocked: true,
          }] : []),
          ...(session.perfectWords.length >= 5 ? [{
            id: 'word-master',
            title: 'Word Master',
            description: 'Got 5 words perfect on first try',
            icon: '⭐',
            unlocked: true,
          }] : []),
        ]}
        onContinue={handleSessionComplete}
        onReview={() => {
          setShowCompleteModal(false);
          // Reset session for review
        }}
        language={session.language}
      />
    </div>
  );
}