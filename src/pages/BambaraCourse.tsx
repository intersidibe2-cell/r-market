import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check, X, RotateCcw, ChevronRight, Volume2, Heart, Flame, Star, Trophy, Lock, Play, BookOpen, Target, Zap } from 'lucide-react'
import { bambaraLessons } from '../data/bambara'

// Audio function using Web Speech API
const speak = (text: string, lang: string = 'fr-FR') => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.7
    utterance.pitch = 1
    window.speechSynthesis.speak(utterance)
  }
}

// Question types
type QuestionType = 'translate' | 'listen' | 'match' | 'fill' | 'speak'

interface Question {
  type: QuestionType
  bambara: string
  french: string
  russian: string
  pronunciation: string
  audioText: string
  options: string[]
  correct: number
  hint?: string
}

// Generate questions from lesson words
const generateQuestions = (lessonIndex: number, lang: 'ru' | 'fr'): Question[] => {
  const lesson = bambaraLessons[lessonIndex]
  const questions: Question[] = []
  
  lesson.words.forEach((word, i) => {
    // Translate question (Bambara → FR/RU)
    const translateOptions = [lang === 'ru' ? word.russian : word.french]
    const otherWords = lesson.words.filter((_, j) => j !== i)
    for (let k = 0; k < 3 && k < otherWords.length; k++) {
      translateOptions.push(lang === 'ru' ? otherWords[k].russian : otherWords[k].french)
    }
    questions.push({
      type: 'translate',
      bambara: word.bambara,
      french: word.french,
      russian: word.russian,
      pronunciation: word.pronunciation,
      audioText: word.audioText,
      options: shuffleArray(translateOptions),
      correct: shuffleArray(translateOptions).indexOf(lang === 'ru' ? word.russian : word.french)
    })

    // Listen question
    questions.push({
      type: 'listen',
      bambara: word.bambara,
      french: word.french,
      russian: word.russian,
      pronunciation: word.pronunciation,
      audioText: word.audioText,
      options: shuffleArray([word.bambara, ...otherWords.slice(0, 3).map(w => w.bambara)]),
      correct: 0,
      hint: word.audioText
    })
  })

  return shuffleArray(questions).slice(0, 10)
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Level definitions
const levels = [
  { id: 0, name: 'Salutations', nameRu: 'Приветствия', emoji: '👋', xpRequired: 0, color: 'from-green-500 to-green-600' },
  { id: 1, name: 'Nombres', nameRu: 'Числа', emoji: '🔢', xpRequired: 50, color: 'from-blue-500 to-blue-600' },
  { id: 2, name: 'Marché', nameRu: 'Рынок', emoji: '🛒', xpRequired: 120, color: 'from-yellow-500 to-orange-500' },
  { id: 3, name: 'Nourriture', nameRu: 'Еда', emoji: '🍽️', xpRequired: 200, color: 'from-red-500 to-red-600' },
  { id: 4, name: 'Directions', nameRu: 'Направления', emoji: '📍', xpRequired: 300, color: 'from-purple-500 to-purple-600' },
  { id: 5, name: 'Expressions', nameRu: 'Выражения', emoji: '💬', xpRequired: 420, color: 'from-pink-500 to-pink-600' },
]

export default function BambaraCourse() {
  // Game state
  const [screen, setScreen] = useState<'home' | 'lesson' | 'results'>('home')
  const [currentLevel, setCurrentLevel] = useState(() => {
    const saved = localStorage.getItem('bambara_level')
    return saved ? parseInt(saved) : 0
  })
  const [xp, setXp] = useState(() => {
    const saved = localStorage.getItem('bambara_xp')
    return saved ? parseInt(saved) : 0
  })
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('bambara_streak')
    return saved ? parseInt(saved) : 0
  })
  const [hearts, setHearts] = useState(5)
  const [maxHearts] = useState(5)
  
  // Lesson state
  const [questions, setQuestions] = useState<Question[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [lessonXp, setLessonXp] = useState(0)
  const [showHint, setShowHint] = useState(false)

  // Listen mode state
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false)

  // Save progress
  useEffect(() => {
    localStorage.setItem('bambara_level', currentLevel.toString())
    localStorage.setItem('bambara_xp', xp.toString())
    localStorage.setItem('bambara_streak', streak.toString())
  }, [currentLevel, xp, streak])

  // Start a lesson
  const startLesson = (levelIndex: number) => {
    if (levelIndex > currentLevel) return
    setCurrentLevel(levelIndex)
    const qs = generateQuestions(levelIndex, 'ru')
    setQuestions(qs)
    setQuestionIndex(0)
    setSelectedAnswer(null)
    setIsCorrect(null)
    setScore(0)
    setLessonXp(0)
    setHearts(5)
    setShowHint(false)
    setHasPlayedAudio(false)
    setScreen('lesson')
  }

  // Play audio for current word
  const playAudio = useCallback(() => {
    if (questions[questionIndex]) {
      speak(questions[questionIndex].audioText, 'fr-FR')
      setHasPlayedAudio(true)
    }
  }, [questions, questionIndex])

  // Handle answer
  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return
    
    const currentQ = questions[questionIndex]
    const correct = index === currentQ.correct
    
    setSelectedAnswer(index)
    setIsCorrect(correct)
    
    if (correct) {
      setScore(score + 1)
      setLessonXp(lessonXp + 10)
      speak('Correct! Bien joué!', 'fr-FR')
    } else {
      setHearts(hearts - 1)
      speak(currentQ.audioText, 'fr-FR')
    }
  }

  // Next question
  const nextQuestion = () => {
    if (hearts <= 0) {
      finishLesson()
      return
    }
    
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(questionIndex + 1)
      setSelectedAnswer(null)
      setIsCorrect(null)
      setShowHint(false)
      setHasPlayedAudio(false)
    } else {
      finishLesson()
    }
  }

  // Finish lesson
  const finishLesson = () => {
    const earnedXp = lessonXp + (score === questions.length ? 20 : 0) // Bonus for perfect
    setXp(xp + earnedXp)
    
    // Unlock next level if score >= 70%
    if (score >= questions.length * 0.7 && currentLevel < levels.length - 1) {
      // Current level stays unlocked for replay
    }
    
    // Update streak
    const lastDate = localStorage.getItem('bambara_last_date')
    const today = new Date().toDateString()
    if (lastDate !== today) {
      setStreak(streak + 1)
      localStorage.setItem('bambara_last_date', today)
    }
    
    setScreen('results')
  }

  // Current question
  const currentQ = questions[questionIndex]

  // XP progress bar
  const currentLevelData = levels[currentLevel]
  const nextLevelData = levels[Math.min(currentLevel + 1, levels.length - 1)]
  const xpInLevel = xp - currentLevelData.xpRequired
  const xpNeeded = nextLevelData.xpRequired - currentLevelData.xpRequired
  const progressPercent = Math.min((xpInLevel / xpNeeded) * 100, 100)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* HOME SCREEN */}
      {screen === 'home' && (
        <>
          {/* Header */}
          <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
            <div className="max-w-4xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Link to="/russian" className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700">
                    <ArrowLeft className="w-5 h-5" />
                  </Link>
                  <div>
                    <h1 className="text-xl font-bold">📚 Bambara</h1>
                    <p className="text-sm text-gray-400">Изучайте язык Мали</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 bg-orange-500/20 text-orange-400 px-3 py-1.5 rounded-lg">
                    <Flame className="w-5 h-5" />
                    <span className="font-bold">{streak}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-3 py-1.5 rounded-lg">
                    <Star className="w-5 h-5" />
                    <span className="font-bold">{xp} XP</span>
                  </div>
                </div>
              </div>

              {/* Level Progress */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-400">Niveau {currentLevel + 1}: {currentLevelData.emoji} {currentLevelData.name}</span>
                  <span className="text-green-400 font-bold">{xp} / {nextLevelData.xpRequired} XP</span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </header>

          {/* Levels Map */}
          <div className="max-w-4xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">🗺️ Путь обучения</h2>
            
            <div className="relative">
              {/* Path line */}
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-700 rounded-full" />
              
              <div className="space-y-6">
                {levels.map((level, i) => {
                  const isUnlocked = i <= currentLevel
                  const isCompleted = i < currentLevel
                  const isCurrent = i === currentLevel
                  
                  return (
                    <div key={level.id} className="relative flex items-start gap-6">
                      {/* Node */}
                      <div className={`relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg transition-all ${
                        isCompleted 
                          ? `bg-gradient-to-br ${level.color}` 
                          : isCurrent
                            ? `bg-gradient-to-br ${level.color} ring-4 ring-white/30 animate-pulse`
                            : 'bg-gray-700'
                      }`}>
                        {!isUnlocked ? (
                          <Lock className="w-6 h-6 text-gray-500" />
                        ) : (
                          level.emoji
                        )}
                        {isCompleted && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <div className={`p-5 rounded-2xl border transition-all ${
                          isCurrent 
                            ? 'bg-gray-800 border-green-500/50 shadow-lg shadow-green-500/10' 
                            : isCompleted
                              ? 'bg-gray-800/50 border-gray-700'
                              : 'bg-gray-800/30 border-gray-700/50 opacity-60'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-bold">
                              {level.emoji} {level.name}
                              <span className="text-gray-500 text-sm ml-2">({level.nameRu})</span>
                            </h3>
                            {isCompleted && (
                              <span className="text-green-400 text-sm flex items-center gap-1">
                                <Trophy className="w-4 h-4" /> Завершено
                              </span>
                            )}
                          </div>
                          
                          <p className="text-gray-400 text-sm mb-4">
                            {bambaraLessons[i]?.words.length || 0} слов и фраз
                          </p>
                          
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => startLesson(i)}
                              disabled={!isUnlocked}
                              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                                isUnlocked
                                  ? isCurrent
                                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg'
                                    : 'bg-gray-700 text-white hover:bg-gray-600'
                                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                              }`}
                            >
                              {isCompleted ? (
                                <>
                                  <RotateCcw className="w-4 h-4" />
                                  Пересдать
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4" />
                                  {isCurrent ? 'Начать урок' : 'Заблокировано'}
                                </>
                              )}
                            </button>
                            
                            {isCurrent && (
                              <div className="flex items-center gap-1 text-yellow-400">
                                <Zap className="w-4 h-4" />
                                <span className="text-sm font-medium">+{level.xpRequired + 50} XP</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Tips */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                <Volume2 className="w-8 h-8 text-blue-400 mb-2" />
                <h3 className="font-bold">🔊 Слушайте</h3>
                <p className="text-sm text-gray-400 mt-1">Нажмите на иконку для прослушивания</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                <Target className="w-8 h-8 text-green-400 mb-2" />
                <h3 className="font-bold">🎯 Практикуйте</h3>
                <p className="text-sm text-gray-400 mt-1">10 минут в день дают отличный результат</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                <Flame className="w-8 h-8 text-orange-400 mb-2" />
                <h3 className="font-bold">🔥 Серия</h3>
                <p className="text-sm text-gray-400 mt-1">Не прерывайте дневную серию!</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* LESSON SCREEN */}
      {screen === 'lesson' && currentQ && (
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
            <div className="max-w-2xl mx-auto flex items-center justify-between">
              <button onClick={() => setScreen('home')} className="p-2 text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
              
              {/* Progress */}
              <div className="flex-1 mx-4">
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full transition-all duration-300"
                    style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>
              
              {/* Hearts */}
              <div className="flex items-center gap-1">
                {[...Array(maxHearts)].map((_, i) => (
                  <Heart 
                    key={i} 
                    className={`w-5 h-5 ${i < hearts ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} 
                  />
                ))}
              </div>
            </div>
          </header>

          {/* Question */}
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-lg">
              {/* Question type label */}
              <div className="mb-6">
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                  currentQ.type === 'translate' ? 'bg-blue-500/20 text-blue-400' :
                  currentQ.type === 'listen' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {currentQ.type === 'translate' ? '🔤 Переведите' :
                   currentQ.type === 'listen' ? '🎧 Прослушайте' :
                   '📝 Напишите'}
                </span>
              </div>

              {/* Question content */}
              {currentQ.type === 'translate' && (
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-center mb-2">{currentQ.bambara}</h2>
                  <div className="flex items-center justify-center gap-3">
                    <button 
                      onClick={() => speak(currentQ.audioText, 'fr-FR')}
                      className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
                    >
                      <Volume2 className="w-5 h-5 text-blue-400" />
                    </button>
                    <p className="text-gray-400">{currentQ.audioText}</p>
                  </div>
                  <p className="text-center text-gray-300 mt-4 text-lg">
                    Что это значит?
                  </p>
                </div>
              )}

              {currentQ.type === 'listen' && (
                <div className="mb-8 text-center">
                  <button 
                    onClick={playAudio}
                    className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 transition-all ${
                      hasPlayedAudio 
                        ? 'bg-purple-600 hover:bg-purple-700' 
                        : 'bg-purple-600 hover:bg-purple-700 animate-pulse'
                    }`}
                  >
                    <Volume2 className="w-10 h-10" />
                  </button>
                  <p className="text-gray-300 text-lg">Прослушайте и выберите правильный вариант</p>
                  {!hasPlayedAudio && (
                    <p className="text-purple-400 text-sm mt-2">Нажмите для воспроизведения</p>
                  )}
                </div>
              )}

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((option, i) => {
                  let buttonClass = 'bg-gray-700 border-2 border-gray-600 hover:border-gray-500'
                  
                  if (selectedAnswer !== null) {
                    if (i === currentQ.correct) {
                      buttonClass = 'bg-green-600 border-2 border-green-500'
                    } else if (i === selectedAnswer && !isCorrect) {
                      buttonClass = 'bg-red-600 border-2 border-red-500'
                    } else {
                      buttonClass = 'bg-gray-700 border-2 border-gray-600 opacity-50'
                    }
                  }
                  
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      disabled={selectedAnswer !== null}
                      className={`w-full p-4 rounded-xl text-left font-medium transition-all ${buttonClass}`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center text-sm">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="text-lg">{option}</span>
                        {selectedAnswer !== null && i === currentQ.correct && (
                          <Check className="w-5 h-5 ml-auto" />
                        )}
                        {selectedAnswer === i && !isCorrect && (
                          <X className="w-5 h-5 ml-auto" />
                        )}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Hint */}
              {showHint && currentQ.hint && (
                <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-xl">
                  <p className="text-yellow-400 text-sm">💡 Подсказка: {currentQ.hint}</p>
                </div>
              )}

              {/* Hint button */}
              {selectedAnswer === null && !showHint && currentQ.hint && (
                <button 
                  onClick={() => setShowHint(true)}
                  className="mt-4 text-gray-400 text-sm hover:text-white"
                >
                  💡 Показать подсказку
                </button>
              )}

              {/* Feedback */}
              {selectedAnswer !== null && (
                <div className={`mt-6 p-4 rounded-xl ${
                  isCorrect ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'
                }`}>
                  <p className={`font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                    {isCorrect ? '✅ Правильно!' : '❌ Неправильно'}
                  </p>
                  {!isCorrect && (
                    <div className="mt-2">
                      <p className="text-gray-300">
                        Правильный ответ: <span className="text-white font-bold">{currentQ.options[currentQ.correct]}</span>
                      </p>
                      <button 
                        onClick={() => speak(currentQ.audioText, 'fr-FR')}
                        className="mt-2 text-sm text-blue-400 flex items-center gap-1"
                      >
                        <Volume2 className="w-4 h-4" /> Прослушать произношение
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Next button */}
              {selectedAnswer !== null && (
                <button 
                  onClick={nextQuestion}
                  className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
                >
                  {questionIndex < questions.length - 1 ? 'Далее' : 'Завершить'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RESULTS SCREEN */}
      {screen === 'results' && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md text-center">
            {/* Result icon */}
            <div className="text-8xl mb-6">
              {score === questions.length ? '🏆' : score >= questions.length * 0.7 ? '🎉' : score >= questions.length * 0.5 ? '👏' : '💪'}
            </div>
            
            <h1 className="text-3xl font-bold mb-2">
              {score === questions.length ? 'Идеально!' : score >= questions.length * 0.7 ? 'Отлично!' : 'Хорошая попытка!'}
            </h1>
            
            {/* Score */}
            <div className="bg-gray-800 rounded-2xl p-6 my-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-3xl font-bold text-green-400">{score}</p>
                  <p className="text-sm text-gray-400">Правильно</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-yellow-400">+{lessonXp}</p>
                  <p className="text-sm text-gray-400">XP</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-orange-400">{streak}</p>
                  <p className="text-sm text-gray-400">Серия 🔥</p>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Уровень {currentLevel + 1}</span>
                <span className="text-green-400">{xp} XP</span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button 
                onClick={() => startLesson(currentLevel)}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Повторить урок
              </button>
              <button 
                onClick={() => setScreen('home')}
                className="w-full bg-gray-700 text-white py-4 rounded-xl font-bold hover:bg-gray-600 transition-all"
              >
                На карту уровней
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
