'use client';

import { useState, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AudioButtonProps {
  text: string;
  language?: string;
  audioUrl?: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  onPlay?: () => void;
  onError?: (error: string) => void;
  disabled?: boolean;
  showText?: boolean;
}

export function AudioButton({
  text,
  language = 'en',
  audioUrl,
  variant = 'outline',
  size = 'default',
  className,
  onPlay,
  onError,
  disabled = false,
  showText = false,
}: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playWithWebAudio = useCallback(async () => {
    if (!('speechSynthesis' in window)) {
      throw new Error('Speech synthesis not supported');
    }

    setIsLoading(true);

    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getLanguageCode(language);
      utterance.rate = 0.8;
      utterance.pitch = 1;

      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v =>
        v.lang.startsWith(getLanguageCode(language).split('-')[0])
      );

      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsLoading(false);
        onPlay?.();
      };

      utterance.onend = () => {
        setIsPlaying(false);
      };

      utterance.onerror = (event) => {
        setIsPlaying(false);
        setIsLoading(false);
        setHasError(true);
        onError?.('Speech synthesis failed: ' + event.error);
      };

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      setIsLoading(false);
      setHasError(true);
      onError?.(error instanceof Error ? error.message : 'Unknown error');
    }
  }, [text, language, onPlay, onError]);

  const playWithAudioUrl = useCallback(async () => {
    if (!audioUrl) return;

    setIsLoading(true);

    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onloadstart = () => setIsLoading(true);
      audio.oncanplaythrough = () => setIsLoading(false);

      audio.onplay = () => {
        setIsPlaying(true);
        setIsLoading(false);
        onPlay?.();
      };

      audio.onended = () => {
        setIsPlaying(false);
      };

      audio.onerror = () => {
        setIsPlaying(false);
        setIsLoading(false);
        setHasError(true);
        onError?.('Audio playback failed');
      };

      await audio.play();
    } catch (error) {
      setIsLoading(false);
      setHasError(true);
      onError?.(error instanceof Error ? error.message : 'Audio playback failed');
    }
  }, [audioUrl, onPlay, onError]);

  const handleClick = useCallback(async () => {
    if (disabled || isPlaying || isLoading) return;

    setHasError(false);

    if (audioUrl) {
      await playWithAudioUrl();
    } else {
      await playWithWebAudio();
    }
  }, [disabled, isPlaying, isLoading, audioUrl, playWithAudioUrl, playWithWebAudio]);

  const getLanguageCode = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'spanish':
      case 'es':
        return 'es-ES';
      case 'french':
      case 'fr':
        return 'fr-FR';
      case 'german':
      case 'de':
        return 'de-DE';
      case 'italian':
      case 'it':
        return 'it-IT';
      case 'portuguese':
      case 'pt':
        return 'pt-PT';
      default:
        return 'en-US';
    }
  };

  const getIcon = () => {
    if (isLoading) {
      return <Loader2 className={cn('animate-spin', getIconSize())} />;
    }
    if (hasError) {
      return <VolumeX className={cn('text-red-500', getIconSize())} />;
    }
    return (
      <Volume2
        className={cn(
          getIconSize(),
          isPlaying && 'text-blue-600 animate-pulse'
        )}
      />
    );
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'w-3 h-3';
      case 'lg':
        return 'w-5 h-5';
      default:
        return 'w-4 h-4';
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={cn(
        'transition-all duration-200',
        isPlaying && 'ring-2 ring-blue-300',
        hasError && 'border-red-300 text-red-600',
        className
      )}
      aria-label={`Play pronunciation of ${text}`}
    >
      {getIcon()}
      {showText && (
        <span className="ml-2">
          {isLoading ? 'Loading...' : hasError ? 'Error' : 'Play'}
        </span>
      )}
    </Button>
  );
}