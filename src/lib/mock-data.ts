export interface VocabularyWord {
  id: string;
  word: string;
  translation: string;
  pronunciation: string;
  audioUrl?: string;
  exampleSentence: string;
  exampleTranslation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  lastReviewed?: Date;
  correctCount: number;
  incorrectCount: number;
  nextReviewDate: Date;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
  vocabulary: VocabularyWord[];
}

export interface UserProgress {
  currentStreak: number;
  longestStreak: number;
  totalLessonsCompleted: number;
  totalWordsLearned: number;
  dailyGoal: number;
  wordsLearnedToday: number;
  level: number;
  xp: number;
  achievements: Achievement[];
  languageProgress: {
    [languageCode: string]: {
      level: number;
      xp: number;
      wordsLearned: number;
      lessonsCompleted: number;
    };
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: 'streak' | 'vocabulary' | 'lessons' | 'perfect';
}

export interface LessonSession {
  id: string;
  languageCode: string;
  words: VocabularyWord[];
  completedWords: string[];
  currentWordIndex: number;
  startTime: Date;
  endTime?: Date;
  score: number;
  perfectWords: string[];
}

const today = new Date();
const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

export const mockSpanishVocabulary: VocabularyWord[] = [
  {
    id: 'es-1',
    word: 'Hola',
    translation: 'Hello',
    pronunciation: 'OH-lah',
    exampleSentence: 'Hola, ¿cómo estás?',
    exampleTranslation: 'Hello, how are you?',
    difficulty: 'beginner',
    category: 'greetings',
    correctCount: 5,
    incorrectCount: 1,
    nextReviewDate: today,
  },
  {
    id: 'es-2',
    word: 'Gracias',
    translation: 'Thank you',
    pronunciation: 'GRAH-see-ahs',
    exampleSentence: 'Gracias por tu ayuda.',
    exampleTranslation: 'Thank you for your help.',
    difficulty: 'beginner',
    category: 'politeness',
    correctCount: 8,
    incorrectCount: 0,
    nextReviewDate: nextWeek,
  },
  {
    id: 'es-3',
    word: 'Casa',
    translation: 'House',
    pronunciation: 'KAH-sah',
    exampleSentence: 'Mi casa es muy grande.',
    exampleTranslation: 'My house is very big.',
    difficulty: 'beginner',
    category: 'home',
    correctCount: 3,
    incorrectCount: 2,
    nextReviewDate: today,
  },
  {
    id: 'es-4',
    word: 'Comida',
    translation: 'Food',
    pronunciation: 'koh-MEE-dah',
    exampleSentence: 'La comida está deliciosa.',
    exampleTranslation: 'The food is delicious.',
    difficulty: 'beginner',
    category: 'food',
    correctCount: 2,
    incorrectCount: 3,
    nextReviewDate: today,
  },
  {
    id: 'es-5',
    word: 'Trabajar',
    translation: 'To work',
    pronunciation: 'trah-bah-HAHR',
    exampleSentence: 'Necesito trabajar mañana.',
    exampleTranslation: 'I need to work tomorrow.',
    difficulty: 'intermediate',
    category: 'verbs',
    correctCount: 1,
    incorrectCount: 1,
    nextReviewDate: today,
  },
  {
    id: 'es-6',
    word: 'Hermoso',
    translation: 'Beautiful',
    pronunciation: 'er-MOH-soh',
    exampleSentence: 'Qué día tan hermoso.',
    exampleTranslation: 'What a beautiful day.',
    difficulty: 'intermediate',
    category: 'adjectives',
    correctCount: 4,
    incorrectCount: 1,
    nextReviewDate: yesterday,
  },
];

export const mockFrenchVocabulary: VocabularyWord[] = [
  {
    id: 'fr-1',
    word: 'Bonjour',
    translation: 'Hello',
    pronunciation: 'bone-ZHOOR',
    exampleSentence: 'Bonjour, comment allez-vous?',
    exampleTranslation: 'Hello, how are you?',
    difficulty: 'beginner',
    category: 'greetings',
    correctCount: 6,
    incorrectCount: 0,
    nextReviewDate: nextWeek,
  },
  {
    id: 'fr-2',
    word: 'Merci',
    translation: 'Thank you',
    pronunciation: 'mer-SEE',
    exampleSentence: 'Merci beaucoup pour votre aide.',
    exampleTranslation: 'Thank you very much for your help.',
    difficulty: 'beginner',
    category: 'politeness',
    correctCount: 7,
    incorrectCount: 1,
    nextReviewDate: nextWeek,
  },
  {
    id: 'fr-3',
    word: 'Maison',
    translation: 'House',
    pronunciation: 'may-ZOHN',
    exampleSentence: 'J\'aime ma maison.',
    exampleTranslation: 'I love my house.',
    difficulty: 'beginner',
    category: 'home',
    correctCount: 2,
    incorrectCount: 2,
    nextReviewDate: today,
  },
  {
    id: 'fr-4',
    word: 'Nourriture',
    translation: 'Food',
    pronunciation: 'noo-ree-TOOR',
    exampleSentence: 'Cette nourriture est excellente.',
    exampleTranslation: 'This food is excellent.',
    difficulty: 'intermediate',
    category: 'food',
    correctCount: 1,
    incorrectCount: 3,
    nextReviewDate: today,
  },
  {
    id: 'fr-5',
    word: 'Travailler',
    translation: 'To work',
    pronunciation: 'trah-vah-YAY',
    exampleSentence: 'Je dois travailler demain.',
    exampleTranslation: 'I have to work tomorrow.',
    difficulty: 'intermediate',
    category: 'verbs',
    correctCount: 3,
    incorrectCount: 2,
    nextReviewDate: today,
  },
  {
    id: 'fr-6',
    word: 'Magnifique',
    translation: 'Beautiful',
    pronunciation: 'man-nee-FEEK',
    exampleSentence: 'Le coucher de soleil est magnifique.',
    exampleTranslation: 'The sunset is beautiful.',
    difficulty: 'intermediate',
    category: 'adjectives',
    correctCount: 2,
    incorrectCount: 1,
    nextReviewDate: today,
  },
];

export const mockLanguages: Language[] = [
  {
    code: 'es',
    name: 'Spanish',
    flag: '🇪🇸',
    vocabulary: mockSpanishVocabulary,
  },
  {
    code: 'fr',
    name: 'French',
    flag: '🇫🇷',
    vocabulary: mockFrenchVocabulary,
  },
];

export const mockAchievements: Achievement[] = [
  {
    id: 'first-word',
    title: 'First Steps',
    description: 'Learned your first word!',
    icon: '🌟',
    unlockedAt: new Date('2024-01-01'),
    category: 'vocabulary',
  },
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Maintained a 7-day streak',
    icon: '🔥',
    unlockedAt: new Date('2024-01-07'),
    category: 'streak',
  },
  {
    id: 'perfect-lesson',
    title: 'Perfect Score',
    description: 'Completed a lesson with 100% accuracy',
    icon: '💯',
    unlockedAt: new Date('2024-01-15'),
    category: 'perfect',
  },
  {
    id: 'vocabulary-50',
    title: 'Word Master',
    description: 'Learned 50 words',
    icon: '📚',
    unlockedAt: new Date('2024-02-01'),
    category: 'vocabulary',
  },
];

export const mockUserProgress: UserProgress = {
  currentStreak: 12,
  longestStreak: 23,
  totalLessonsCompleted: 45,
  totalWordsLearned: 89,
  dailyGoal: 10,
  wordsLearnedToday: 7,
  level: 8,
  xp: 2340,
  achievements: mockAchievements,
  languageProgress: {
    es: {
      level: 5,
      xp: 1200,
      wordsLearned: 45,
      lessonsCompleted: 23,
    },
    fr: {
      level: 3,
      xp: 800,
      wordsLearned: 32,
      lessonsCompleted: 18,
    },
  },
};

export const mockCurrentSession: LessonSession = {
  id: 'session-1',
  languageCode: 'es',
  words: mockSpanishVocabulary.slice(0, 5),
  completedWords: ['es-1', 'es-2'],
  currentWordIndex: 2,
  startTime: new Date(),
  score: 80,
  perfectWords: ['es-1'],
};

// Helper functions for spaced repetition algorithm
export const calculateNextReviewDate = (
  correctCount: number,
  incorrectCount: number,
  lastReviewed: Date = new Date()
): Date => {
  const successRate = correctCount / (correctCount + incorrectCount || 1);
  const baseInterval = Math.max(1, Math.floor(successRate * 7)); // 1-7 days
  const jitter = Math.random() * 0.2 - 0.1; // ±10% jitter
  const finalInterval = Math.max(1, Math.floor(baseInterval * (1 + jitter)));

  const nextDate = new Date(lastReviewed);
  nextDate.setDate(nextDate.getDate() + finalInterval);
  return nextDate;
};

export const getDueWords = (vocabulary: VocabularyWord[]): VocabularyWord[] => {
  const now = new Date();
  return vocabulary.filter(word => new Date(word.nextReviewDate) <= now);
};

export const getWordsForReview = (
  vocabulary: VocabularyWord[],
  maxWords: number = 10
): VocabularyWord[] => {
  const dueWords = getDueWords(vocabulary);
  const sortedByUrgency = dueWords.sort((a, b) => {
    const aUrgency = (a.incorrectCount + 1) / (a.correctCount + 1);
    const bUrgency = (b.incorrectCount + 1) / (b.correctCount + 1);
    return bUrgency - aUrgency;
  });

  return sortedByUrgency.slice(0, maxWords);
};