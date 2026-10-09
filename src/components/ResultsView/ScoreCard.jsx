import React, { useEffect } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RotateCcw, 
  ListFilter, 
  Sparkles,
  ArrowRight,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { firePassConfetti } from '../../utils/confetti';

export function ScoreCard({
  exam,
  scorePercentage,
  isPassed,
  correctCount,
  incorrectCount,
  skippedCount,
  timeTakenSeconds,
  onRetakeAll,
  onRetakeMissed,
  onScrollToReview,
  onBackToHome
}) {
  useEffect(() => {
    if (isPassed) {
      firePassConfetti();
    }
  }, [isPassed]);

  const formatDuration = (totalSecs) => {
    if (!totalSecs) return '0m 0s';
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}m ${secs}s`;
  };

  const passingScore = exam.passingScore || 72;

  return (
    <div className="bg-white rounded-2xl border border-[#d1d7dc] shadow-sm overflow-hidden">
      {/* Top Banner Accent */}
      <div className={`p-6 sm:p-8 text-white ${
        isPassed 
          ? 'bg-gradient-to-r from-emerald-700 via-emerald-800 to-[#1e7e34]' 
          : 'bg-gradient-to-r from-[#2d2f31] via-gray-800 to-[#b32d0f]'
      }`}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              <Award className="w-3.5 h-3.5" />
              <span>{isPassed ? 'Certification Ready' : 'Practice Required'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {isPassed ? 'Congratulations! You Passed!' : 'Keep Practicing!'}
            </h2>
            <p className="text-white/80 text-xs sm:text-sm max-w-lg">
              {isPassed
                ? `You achieved a passing grade of ${scorePercentage}%. You have demonstrated solid mastery over the tested objectives.`
                : `You scored ${scorePercentage}%. The passing threshold is ${passingScore}%. Review your missed questions below and try again to improve.`}
            </p>
          </div>

          {/* Big Score Dial */}
          <div className="bg-white/10 backdrop-blur-md border border-white/25 rounded-2xl p-5 text-center min-w-[160px] shadow-inner">
            <div className="text-4xl sm:text-5xl font-black tracking-tight text-white">
              {scorePercentage}%
            </div>
            <div className="text-xs text-white/90 font-semibold mt-1">
              Passing Grade: {passingScore}%
            </div>
            <div className="mt-2 inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white text-[#2d2f31]">
              {isPassed ? 'PASSED' : 'NOT PASSED'}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="p-6 sm:p-8 bg-[#f7f9fa] border-b border-[#d1d7dc]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {/* Correct */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Correct</div>
              <div className="text-xl font-bold text-[#2d2f31]">{correctCount}</div>
            </div>
          </div>

          {/* Incorrect */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Incorrect</div>
              <div className="text-xl font-bold text-[#2d2f31]">{incorrectCount}</div>
            </div>
          </div>

          {/* Skipped */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Skipped</div>
              <div className="text-xl font-bold text-[#2d2f31]">{skippedCount}</div>
            </div>
          </div>

          {/* Time Taken */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-[#a435f0] flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">Time Taken</div>
              <div className="text-xl font-bold text-[#2d2f31]">{formatDuration(timeTakenSeconds)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-6 sm:p-8 bg-white">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onScrollToReview}
              className="px-5 py-2.5 rounded-lg font-bold text-xs sm:text-sm bg-[#a435f0] hover:bg-[#8710d8] text-white shadow-xs flex items-center space-x-2 transition-colors"
            >
              <ListFilter className="w-4 h-4" />
              <span>Review Detailed Questions</span>
            </button>

            {incorrectCount + skippedCount > 0 && onRetakeMissed && (
              <button
                type="button"
                onClick={onRetakeMissed}
                className="px-4 py-2.5 rounded-lg font-bold text-xs sm:text-sm bg-purple-50 hover:bg-purple-100 text-[#a435f0] border border-purple-200 flex items-center space-x-1.5 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-[#a435f0]" />
                <span>Retake Missed Only ({incorrectCount + skippedCount})</span>
              </button>
            )}

            <button
              type="button"
              onClick={onRetakeAll}
              className="px-4 py-2.5 rounded-lg font-semibold text-xs sm:text-sm border border-[#d1d7dc] text-[#2d2f31] hover:bg-gray-100 flex items-center space-x-1.5 transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-gray-500" />
              <span>Retake Entire Test</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onBackToHome}
            className="text-xs sm:text-sm text-gray-600 hover:text-black font-semibold underline"
          >
            Back to Exam Library
          </button>
        </div>
      </div>
    </div>
  );
}
