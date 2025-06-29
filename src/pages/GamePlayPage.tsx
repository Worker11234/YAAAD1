import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Clock, Heart, X, Check, HelpCircle, 
  SkipForward, Award, Star, Zap, AlertCircle
} from 'lucide-react';
import { TouchOptimized } from '../components/ui/TouchOptimized';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

export function GamePlayPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { isMobile } = useDeviceDetection();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per game
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [lives, setLives] = useState(3);
  const [showResults, setShowResults] = useState(false);
  
  // Mock game data - in a real app, this would be fetched based on gameId
  const game = {
    id: gameId,
    title: 'Who is This?',
    type: 'photo-recognition',
    questions: [
      {
        id: 1,
        type: 'photo',
        question: 'Who is this person?',
        image: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
        options: ['Grandma Mary', 'Aunt Sarah', 'Mom', 'Cousin Emma'],
        correctAnswer: 2, // Index of the correct answer (Mom)
        hint: 'This person is your mother'
      },
      {
        id: 2,
        type: 'photo',
        question: 'Who is this person?',
        image: 'https://images.pexels.com/photos/2269872/pexels-photo-2269872.jpeg?auto=compress&cs=tinysrgb&w=400',
        options: ['Uncle John', 'Dad', 'Grandpa Joe', 'Brother Tom'],
        correctAnswer: 0, // Index of the correct answer (Uncle John)
        hint: 'This is your mother\'s brother'
      },
      {
        id: 3,
        type: 'photo',
        question: 'Who is this person?',
        image: 'https://images.pexels.com/photos/1729931/pexels-photo-1729931.jpeg?auto=compress&cs=tinysrgb&w=400',
        options: ['Cousin Jake', 'Brother Tom', 'Uncle Mike', 'Dad'],
        correctAnswer: 3, // Index of the correct answer (Dad)
        hint: 'This is your father'
      },
      {
        id: 4,
        type: 'photo',
        question: 'Who is this person?',
        image: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400',
        options: ['Aunt Lisa', 'Grandma Mary', 'Cousin Emma', 'Mom'],
        correctAnswer: 1, // Index of the correct answer (Grandma Mary)
        hint: 'This is your mother\'s mother'
      },
      {
        id: 5,
        type: 'photo',
        question: 'Who is this person?',
        image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
        options: ['Sister Kate', 'Cousin Emma', 'Aunt Sarah', 'Friend Julie'],
        correctAnswer: 0, // Index of the correct answer (Sister Kate)
        hint: 'This is your sibling'
      }
    ]
  };

  useEffect(() => {
    // Start the timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const currentQ = game.questions[currentQuestion];

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null || gameOver) return;
    
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === currentQ.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prev => prev + 1);
    } else {
      setLives(prev => prev - 1);
    }
    
    // Move to next question after a delay
    setTimeout(() => {
      if (!correct && lives <= 1) {
        setGameOver(true);
      } else if (currentQuestion < game.questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setShowHint(false);
      } else {
        setGameOver(true);
      }
    }, 1500);
  };

  const handleSkip = () => {
    if (selectedAnswer !== null || gameOver) return;
    
    if (currentQuestion < game.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowHint(false);
    } else {
      setGameOver(true);
    }
  };

  const handleShowHint = () => {
    if (showHint || selectedAnswer !== null || gameOver) return;
    
    setShowHint(true);
    setHintsUsed(prev => prev + 1);
  };

  const handlePlayAgain = () => {
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(60);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setGameOver(false);
    setShowHint(false);
    setHintsUsed(0);
    setLives(3);
    setShowResults(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreMessage = () => {
    const percentage = (score / game.questions.length) * 100;
    if (percentage >= 80) return 'Excellent!';
    if (percentage >= 60) return 'Good job!';
    if (percentage >= 40) return 'Nice try!';
    return 'Keep practicing!';
  };

  const getScoreColor = () => {
    const percentage = (score / game.questions.length) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    if (percentage >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  if (gameOver && !showResults) {
    // Game Over Screen
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-purple-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Award className="w-10 h-10 text-purple-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Game Complete!</h1>
          <p className="text-xl text-gray-600 mb-6">{getScoreMessage()}</p>
          
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="text-5xl font-bold mb-2 text-center">
              <span className={getScoreColor()}>{score}</span>
              <span className="text-gray-400">/{game.questions.length}</span>
            </div>
            <p className="text-gray-600">Correct Answers</p>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-purple-600 mb-1">{formatTime(60 - timeLeft)}</div>
                <div className="text-xs text-gray-600">Time Taken</div>
              </div>
              
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-purple-600 mb-1">{hintsUsed}</div>
                <div className="text-xs text-gray-600">Hints Used</div>
              </div>
            </div>
          </div>
          
          {/* Earned achievements */}
          {score >= 4 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Achievement Earned!</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center space-x-3">
                <div className="bg-yellow-500 p-3 rounded-full">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Recognition Expert</h3>
                  <p className="text-sm text-gray-600">Score 80% or higher on the Who is This? game</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <TouchOptimized>
              <button
                onClick={() => setShowResults(true)}
                className="w-full sm:w-auto bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
              >
                View Results
              </button>
            </TouchOptimized>
            
            <TouchOptimized>
              <button
                onClick={handlePlayAgain}
                className="w-full sm:w-auto border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-colors"
              >
                Play Again
              </button>
            </TouchOptimized>
            
            <TouchOptimized>
              <Link
                to="/games"
                className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Back to Games
              </Link>
            </TouchOptimized>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    // Detailed Results Screen
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Game Results</h1>
            <TouchOptimized>
              <button
                onClick={() => navigate('/games')}
                className="text-gray-600 hover:text-gray-800"
              >
                <X size={24} />
              </button>
            </TouchOptimized>
          </div>
          
          <div className="space-y-6">
            {game.questions.map((q, index) => {
              const isCorrectAnswer = index < currentQuestion && 
                (index === currentQuestion - 1 ? isCorrect : true);
              
              return (
                <div 
                  key={q.id} 
                  className={`
                    rounded-lg border p-4
                    ${index < currentQuestion
                      ? isCorrectAnswer
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                      : 'border-gray-200 bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">Question {index + 1}</h3>
                    {index < currentQuestion && (
                      <div className={`
                        flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
                        ${isCorrectAnswer
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                        }
                      `}>
                        {isCorrectAnswer ? (
                          <>
                            <Check size={12} />
                            <span>Correct</span>
                          </>
                        ) : (
                          <>
                            <X size={12} />
                            <span>Incorrect</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 mb-3">
                    <div className="sm:w-1/3">
                      <img 
                        src={q.image} 
                        alt="Question" 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="sm:w-2/3">
                      <p className="text-gray-700 mb-2">{q.question}</p>
                      <div className="space-y-2">
                        {q.options.map((option, optIndex) => (
                          <div 
                            key={optIndex}
                            className={`
                              p-2 rounded-lg text-sm
                              ${index < currentQuestion && optIndex === q.correctAnswer
                                ? 'bg-green-100 text-green-700 font-medium'
                                : index < currentQuestion && !isCorrectAnswer && optIndex === selectedAnswer
                                ? 'bg-red-100 text-red-700 font-medium'
                                : 'bg-white text-gray-700'
                              }
                            `}
                          >
                            {option}
                            {index < currentQuestion && optIndex === q.correctAnswer && (
                              <Check size={16} className="inline ml-2 text-green-600" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-8 flex justify-center">
            <TouchOptimized>
              <button
                onClick={handlePlayAgain}
                className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
              >
                Play Again
              </button>
            </TouchOptimized>
          </div>
        </div>
      </div>
    );
  }

  // Active Game Screen
  return (
    <div className="max-w-3xl mx-auto">
      {/* Game Header */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex items-center justify-between">
        <Link 
          to="/games" 
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={18} />
          <span>Exit Game</span>
        </Link>
        
        <h1 className="text-xl font-bold text-gray-900">{game.title}</h1>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-purple-600">
            <Clock size={18} />
            <span className="font-medium">{formatTime(timeLeft)}</span>
          </div>
          
          <div className="flex">
            {[...Array(3)].map((_, i) => (
              <Heart 
                key={i} 
                size={18} 
                className={i < lives ? "text-red-500 fill-current" : "text-gray-300"} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-purple-100 px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-purple-700">
              Question {currentQuestion + 1} of {game.questions.length}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <TouchOptimized>
              <button
                onClick={handleShowHint}
                disabled={showHint || selectedAnswer !== null}
                className="p-2 text-yellow-600 hover:text-yellow-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                aria-label="Show hint"
              >
                <HelpCircle size={20} />
              </button>
            </TouchOptimized>
            
            <TouchOptimized>
              <button
                onClick={handleSkip}
                disabled={selectedAnswer !== null}
                className="p-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                aria-label="Skip question"
              >
                <SkipForward size={20} />
              </button>
            </TouchOptimized>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {currentQ.question}
        </h2>
        
        {/* Question Image */}
        <div className="mb-6">
          <img 
            src={currentQ.image} 
            alt="Who is this person?" 
            className="w-full max-h-80 object-contain rounded-lg mx-auto"
          />
        </div>
        
        {/* Hint */}
        {showHint && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <HelpCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800 mb-1">Hint</p>
                <p className="text-yellow-700">{currentQ.hint}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Answer Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentQ.options.map((option, index) => (
            <TouchOptimized key={index}>
              <button
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
                className={`
                  w-full p-4 rounded-xl border-2 text-left transition-all
                  ${selectedAnswer === index
                    ? isCorrect
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : selectedAnswer !== null && index === currentQ.correctAnswer
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-purple-300'
                  }
                  ${selectedAnswer !== null ? 'cursor-default' : 'cursor-pointer'}
                `}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{option}</span>
                  {selectedAnswer === index && (
                    isCorrect ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )
                  )}
                  {selectedAnswer !== null && selectedAnswer !== index && index === currentQ.correctAnswer && (
                    <Check className="w-5 h-5 text-green-600" />
                  )}
                </div>
              </button>
            </TouchOptimized>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Game Progress</span>
          <span className="text-sm text-gray-600">
            {currentQuestion + 1} of {game.questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / game.questions.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}