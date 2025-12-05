'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy } from 'lucide-react';
import clsx from 'clsx';

interface QuizQuestion {
  id: number;
  text: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string;
}

interface QuizProps {
  quiz: {
    id: number;
    title: string;
    passingScore: number;
    questions: QuizQuestion[];
  };
  onComplete: (score: number, passed: boolean) => void;
  completed?: boolean;
  score?: number | null;
}

export default function Quiz({ quiz, onComplete, completed = false, score: savedScore = null }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizComplete, setQuizComplete] = useState(completed);
  const [finalScore, setFinalScore] = useState<number | null>(savedScore);

  const question = quiz.questions[currentQuestion];
  const isLastQuestion = currentQuestion === quiz.questions.length - 1;
  const hasAnswered = selectedAnswers[question.id] !== undefined;

  const handleSelectAnswer = (optionId: string) => {
    if (showExplanation) return; // Can't change after viewing explanation
    setSelectedAnswers(prev => ({ ...prev, [question.id]: optionId }));
  };

  const handleCheckAnswer = () => {
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (isLastQuestion) {
      // Calculate score
      let correct = 0;
      quiz.questions.forEach(q => {
        const selectedOption = q.options.find(o => o.id === selectedAnswers[q.id]);
        if (selectedOption?.isCorrect) correct++;
      });
      const score = Math.round((correct / quiz.questions.length) * 100);
      const passed = score >= quiz.passingScore;

      setFinalScore(score);
      setQuizComplete(true);
      setShowResult(true);
      onComplete(score, passed);
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResult(false);
    setShowExplanation(false);
    setQuizComplete(false);
    setFinalScore(null);
  };

  const selectedOption = question.options.find(o => o.id === selectedAnswers[question.id]);
  const isCorrect = selectedOption?.isCorrect;

  // Show results screen
  if (showResult || quizComplete) {
    const passed = (finalScore || 0) >= quiz.passingScore;

    return (
      <div className="text-center py-8">
        <div className={clsx(
          'w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6',
          passed ? 'bg-green-100' : 'bg-red-100'
        )}>
          {passed ? (
            <Trophy className="w-10 h-10 text-green-600" />
          ) : (
            <XCircle className="w-10 h-10 text-red-600" />
          )}
        </div>

        <h3 className="text-2xl font-bold text-acto-black mb-2">
          {passed ? 'Congratulations!' : 'Keep Learning'}
        </h3>

        <p className="text-gray-600 mb-6">
          {passed
            ? 'You passed the quiz!'
            : `You need ${quiz.passingScore}% to pass. Try again!`}
        </p>

        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-100 mb-6">
          <span className="text-gray-500">Your Score:</span>
          <span className={clsx(
            'text-2xl font-bold',
            passed ? 'text-green-600' : 'text-red-600'
          )}>
            {finalScore}%
          </span>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-gray-500">
          Question {currentQuestion + 1} of {quiz.questions.length}
        </span>
        <div className="flex gap-1">
          {quiz.questions.map((_, i) => (
            <div
              key={i}
              className={clsx(
                'w-8 h-1 rounded-full',
                i < currentQuestion
                  ? 'bg-acto-teal'
                  : i === currentQuestion
                  ? 'bg-acto-teal/50'
                  : 'bg-gray-200'
              )}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <h3 className="text-lg font-semibold text-acto-black mb-6">
        {question.text}
      </h3>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option) => {
          const isSelected = selectedAnswers[question.id] === option.id;
          const showCorrectness = showExplanation;

          return (
            <button
              key={option.id}
              onClick={() => handleSelectAnswer(option.id)}
              disabled={showExplanation}
              className={clsx(
                'w-full p-4 rounded-xl border-2 text-left transition-all',
                !showCorrectness && isSelected && 'border-acto-teal bg-acto-soft-blue/30',
                !showCorrectness && !isSelected && 'border-gray-200 hover:border-gray-300 bg-white',
                showCorrectness && option.isCorrect && 'border-green-500 bg-green-50',
                showCorrectness && isSelected && !option.isCorrect && 'border-red-500 bg-red-50',
                showCorrectness && !isSelected && !option.isCorrect && 'border-gray-200 bg-gray-50 opacity-50'
              )}
            >
              <div className="flex items-center gap-3">
                <span className={clsx(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                  !showCorrectness && isSelected && 'bg-acto-teal text-white',
                  !showCorrectness && !isSelected && 'bg-gray-100 text-gray-600',
                  showCorrectness && option.isCorrect && 'bg-green-500 text-white',
                  showCorrectness && isSelected && !option.isCorrect && 'bg-red-500 text-white',
                  showCorrectness && !isSelected && !option.isCorrect && 'bg-gray-200 text-gray-400'
                )}>
                  {showCorrectness ? (
                    option.isCorrect ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : isSelected ? (
                      <XCircle className="w-4 h-4" />
                    ) : (
                      option.id.toUpperCase()
                    )
                  ) : (
                    option.id.toUpperCase()
                  )}
                </span>
                <span className={clsx(
                  'flex-1',
                  showCorrectness && !option.isCorrect && !isSelected && 'text-gray-400'
                )}>
                  {option.text}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className={clsx(
          'p-4 rounded-xl mb-6',
          isCorrect ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'
        )}>
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className={clsx(
                'font-medium mb-1',
                isCorrect ? 'text-green-700' : 'text-amber-700'
              )}>
                {isCorrect ? 'Correct!' : 'Not quite right'}
              </p>
              <p className="text-sm text-gray-600">{question.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        {!showExplanation ? (
          <button
            onClick={handleCheckAnswer}
            disabled={!hasAnswered}
            className={clsx(
              'flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors',
              hasAnswered
                ? 'bg-acto-teal text-white hover:bg-acto-teal-dark'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            )}
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-acto-teal text-white rounded-xl font-medium hover:bg-acto-teal-dark transition-colors"
          >
            {isLastQuestion ? 'See Results' : 'Next Question'}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
