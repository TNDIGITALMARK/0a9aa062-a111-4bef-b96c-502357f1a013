'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, RotateCcw, ArrowLeft, ArrowRight } from 'lucide-react';
import { VocabularyWord } from '@/lib/mock-data';
import { useSwipeGesture } from '@/hooks/use-swipe-gesture';
import { cn } from '@/lib/utils';

interface VocabularyCardProps {
  word: VocabularyWord;
  onCorrect: () => void;
  onIncorrect: () => void;
  onPlayAudio?: () => void;
  showAnswer?: boolean;
  mode: 'learn' | 'review' | 'test';
  className?: string;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  enableSwipeGestures?: boolean;
}

export function VocabularyCard({
  word,
  onCorrect,
  onIncorrect,
  onPlayAudio,
  showAnswer = false,
  mode,
  className,
  onSwipeLeft,
  onSwipeRight,
  enableSwipeGestures = true,
}: VocabularyCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);

  // Swipe gesture support
  const { ref: swipeRef, isSwiping } = useSwipeGesture({
    onSwipeLeft: enableSwipeGestures ? onSwipeLeft : undefined,
    onSwipeRight: enableSwipeGestures ? onSwipeRight : undefined,
    minSwipeDistance: 100,
  });

  useEffect(() => {
    if (showAnswer && !hasRevealed) {
      setIsFlipped(true);
      setHasRevealed(true);
    }
  }, [showAnswer, hasRevealed]);

  const handleFlip = () => {
    if (!hasRevealed) {
      setIsFlipped(!isFlipped);
      if (!isFlipped) {
        setHasRevealed(true);
      }
    } else {
      setIsFlipped(!isFlipped);
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      onCorrect();
    } else {
      onIncorrect();
    }
    // Reset for next word
    setIsFlipped(false);
    setHasRevealed(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-600 bg-green-50';
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-50';
      case 'advanced':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div
      ref={swipeRef as React.RefObject<HTMLDivElement>}
      className={cn(
        'relative w-full max-w-md mx-auto perspective-1000',
        isSwiping && 'select-none',
        className
      )}
    >
      <div
        className={cn(
          'relative w-full h-96 transition-transform duration-700 transform-style-preserve-3d cursor-pointer',
          isFlipped && 'rotate-y-180',
          isSwiping && 'pointer-events-none'
        )}
        onClick={mode === 'learn' ? handleFlip : undefined}
      >
        {/* Front of card */}
        <Card className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 hover:border-blue-300 transition-colors">
          <CardContent className="flex flex-col justify-center items-center h-full p-6 text-center">
            <div className="mb-4">
              <span
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-medium',
                  getDifficultyColor(word.difficulty)
                )}
              >
                {word.difficulty}
              </span>
            </div>

            <div className="mb-6">
              <h2 className="text-4xl font-bold text-gray-800 mb-2">{word.word}</h2>
              <p className="text-lg text-gray-600 italic">{word.pronunciation}</p>
            </div>

            {onPlayAudio && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayAudio();
                }}
                className="mb-4 bg-white hover:bg-blue-50"
              >
                <Volume2 className="w-4 h-4 mr-2" />
                Play Audio
              </Button>
            )}

            {mode === 'learn' && (
              <div className="text-sm text-gray-500 flex items-center">
                <RotateCcw className="w-4 h-4 mr-1" />
                Tap to reveal translation
              </div>
            )}
          </CardContent>
        </Card>

        {/* Back of card */}
        <Card className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <CardContent className="flex flex-col justify-center items-center h-full p-6 text-center">
            <div className="mb-6">
              <h3 className="text-3xl font-bold text-gray-800 mb-2">{word.translation}</h3>
              <div className="text-sm text-gray-600 mb-4">
                <span className="font-medium">Category:</span> {word.category}
              </div>
            </div>

            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm max-w-sm">
              <p className="text-gray-800 mb-2 italic">"{word.exampleSentence}"</p>
              <p className="text-gray-600 text-sm">"{word.exampleTranslation}"</p>
            </div>

            {mode === 'test' && hasRevealed && (
              <div className="flex gap-3 mt-4">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAnswer(false);
                  }}
                  variant="outline"
                  className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                >
                  Incorrect
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAnswer(true);
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Correct
                </Button>
              </div>
            )}

            {mode === 'learn' && (
              <div className="text-sm text-gray-500 flex items-center">
                <RotateCcw className="w-4 h-4 mr-1" />
                Tap to flip back
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Progress indicators */}
      {(word.correctCount > 0 || word.incorrectCount > 0) && (
        <div className="mt-4 flex justify-center space-x-4 text-sm">
          <div className="flex items-center text-green-600">
            <span className="w-2 h-2 bg-green-600 rounded-full mr-1"></span>
            Correct: {word.correctCount}
          </div>
          <div className="flex items-center text-red-600">
            <span className="w-2 h-2 bg-red-600 rounded-full mr-1"></span>
            Incorrect: {word.incorrectCount}
          </div>
        </div>
      )}
    </div>
  );
}