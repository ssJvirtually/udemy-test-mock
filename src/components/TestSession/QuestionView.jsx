import React, { useState } from 'react';
import { 
  Bookmark, 
  ChevronLeft, 
  ChevronRight, 
  Grid, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  HelpCircle,
  ExternalLink,
  Info
} from 'lucide-react';
import { FormattedText } from '../../utils/markdown';

export function QuestionView({
  question,
  currentIndex,
  totalQuestions,
  currentAnswer,
  isMarked,
  onToggleMark,
  onSelectAnswer,
  onPrev,
  onNext,
  onOpenDrawer,
  answeredCount,
  practiceMode = false
}) {
  const [showExplanation, setShowExplanation] = useState(false);

  // Reset explanation visibility when question changes
  React.useEffect(() => {
    setShowExplanation(false);
  }, [currentIndex]);

  const isMultiple = question.type === 'multiple';
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  const handleOptionClick = (index) => {
    if (isMultiple) {
      const currentArr = Array.isArray(currentAnswer) ? currentAnswer : [];
      if (currentArr.includes(index)) {
        onSelectAnswer(currentArr.filter(i => i !== index));
      } else {
        onSelectAnswer([...currentArr, index].sort((a, b) => a - b));
      }
    } else {
      onSelectAnswer(index);
    }
  };

  const isOptionSelected = (index) => {
    if (isMultiple) {
      return Array.isArray(currentAnswer) && currentAnswer.includes(index);
    }
    return currentAnswer === index;
  };

  const isOptionCorrect = (index) => {
    if (isMultiple) {
      return Array.isArray(question.correctAnswer) && question.correctAnswer.includes(index);
    }
    return question.correctAnswer === index;
  };

  // Check if user answered correctly
  const isAnswerCorrect = () => {
    if (isMultiple) {
      if (!Array.isArray(currentAnswer) || !Array.isArray(question.correctAnswer)) return false;
      if (currentAnswer.length !== question.correctAnswer.length) return false;
      return currentAnswer.every(val => question.correctAnswer.includes(val));
    }
    return currentAnswer === question.correctAnswer;
  };

  const hasAnswered = currentAnswer !== undefined && currentAnswer !== null && (
    isMultiple ? currentAnswer.length > 0 : true
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col min-h-[calc(100vh-140px)] justify-between">
      <div className="space-y-6">
        {/* Question Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#d1d7dc]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-extrabold text-[#2d2f31] text-base sm:text-lg">
              Question {currentIndex + 1} of {totalQuestions}
            </span>

            {question.domain && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-[#2d2f31] border border-gray-200">
                {question.domain}
              </span>
            )}

            {question.difficulty && (
              <span className="text-xs font-medium px-2 py-0.5 rounded text-purple-700 bg-purple-50 border border-purple-200">
                {question.difficulty}
              </span>
            )}
          </div>

          {/* Mark for review toggle */}
          <button
            type="button"
            onClick={onToggleMark}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isMarked
                ? 'bg-amber-50 text-amber-900 border-amber-300 font-bold shadow-2xs'
                : 'bg-white text-[#6a6f73] border-[#d1d7dc] hover:text-[#2d2f31] hover:border-gray-400'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isMarked ? 'fill-current text-amber-500' : ''}`} />
            <span>{isMarked ? 'Marked for Review' : 'Mark for Review'}</span>
          </button>
        </div>

        {/* Question Stem */}
        <div className="space-y-4">
          <FormattedText content={question.question} className="text-base sm:text-lg text-[#2d2f31] font-medium" />

          {/* Optional Code Snippet */}
          {question.codeSnippet && (
            <div className="rounded-lg overflow-hidden border border-[#d1d7dc] bg-[#1e1e1e] my-3">
              <div className="bg-[#2d2d2d] px-4 py-1.5 text-xs font-mono text-gray-300 border-b border-gray-700 flex justify-between items-center">
                <span>CODE / CONFIGURATION</span>
              </div>
              <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-emerald-300 leading-normal">
                <code>{question.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* Instructions Badge */}
          <div className="text-xs font-bold text-[#6a6f73] uppercase tracking-wide">
            {isMultiple
              ? `Select all that apply (${Array.isArray(question.correctAnswer) ? question.correctAnswer.length : 2} answers required):`
              : 'Choose 1 answer:'}
          </div>
        </div>

        {/* Option Choices */}
        <div className="space-y-3">
          {question.options.map((optionText, optIdx) => {
            const isSelected = isOptionSelected(optIdx);
            const isCorrect = isOptionCorrect(optIdx);

            // Styling states
            let borderClass = 'border-[#d1d7dc] hover:border-[#a435f0] hover:bg-[#fcfafc]';
            let bgClass = 'bg-white';
            let letterBgClass = 'bg-[#f7f9fa] text-[#2d2f31] border-[#d1d7dc]';

            if (isSelected) {
              borderClass = 'border-[#a435f0] ring-1 ring-[#a435f0]';
              bgClass = 'bg-[#fcfaff]';
              letterBgClass = 'bg-[#a435f0] text-white border-[#a435f0]';
            }

            // In practice mode when explanation is revealed:
            if (practiceMode && showExplanation) {
              if (isCorrect) {
                borderClass = 'border-emerald-500 bg-emerald-50/70 ring-1 ring-emerald-500';
                letterBgClass = 'bg-emerald-600 text-white border-emerald-600';
              } else if (isSelected && !isCorrect) {
                borderClass = 'border-red-500 bg-red-50/70 ring-1 ring-red-500';
                letterBgClass = 'bg-red-600 text-white border-red-600';
              }
            }

            return (
              <div
                key={optIdx}
                onClick={() => handleOptionClick(optIdx)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start space-x-3.5 ${borderClass} ${bgClass}`}
              >
                {/* Letter or Selection Icon */}
                <div className={`w-7 h-7 rounded-md font-bold text-xs flex items-center justify-center shrink-0 border mt-0.5 transition-colors ${letterBgClass}`}>
                  {letters[optIdx] || optIdx + 1}
                </div>

                {/* Option Content */}
                <div className="flex-1 text-sm sm:text-[15px] text-[#2d2f31] leading-relaxed pt-0.5">
                  <FormattedText content={optionText} />
                </div>

                {/* Status indicator in practice mode */}
                {practiceMode && showExplanation && (
                  <div className="shrink-0 pt-0.5">
                    {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                    {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Practice Mode: Instant Check Answer Button */}
        {practiceMode && (
          <div className="pt-2">
            {!showExplanation ? (
              <button
                type="button"
                disabled={!hasAnswered}
                onClick={() => setShowExplanation(true)}
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold shadow-xs transition-all ${
                  hasAnswered
                    ? 'bg-[#2d2f31] hover:bg-black text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Check Answer & Explanation</span>
              </button>
            ) : (
              <div className="bg-[#fcfaff] border border-purple-200 rounded-xl p-5 space-y-4 animate-fade-in shadow-xs">
                <div className="flex items-center space-x-2">
                  {isAnswerCorrect() ? (
                    <div className="flex items-center space-x-1.5 text-emerald-700 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Correct Answer! Well done.</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1.5 text-red-700 font-bold text-sm">
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span>Incorrect answer. Review the explanation below.</span>
                    </div>
                  )}
                </div>

                {/* Explanation text */}
                <div className="text-xs sm:text-sm text-[#2d2f31] leading-relaxed pt-1 border-t border-purple-100">
                  <span className="font-bold text-[#2d2f31] block mb-1">Overall Explanation:</span>
                  <FormattedText content={question.explanation} />
                </div>

                {/* Option-by-option rationales if available */}
                {question.optionRationales && Object.keys(question.optionRationales).length > 0 && (
                  <div className="mt-3 pt-3 border-t border-purple-100 space-y-2">
                    <span className="font-bold text-xs uppercase tracking-wider text-gray-600 block">
                      Option Rationale Breakdown:
                    </span>
                    {Object.entries(question.optionRationales).map(([optKey, rationale]) => (
                      <div key={optKey} className="text-xs text-gray-700 bg-white p-2.5 rounded-lg border border-gray-200">
                        <strong className="text-[#2d2f31] mr-1.5">Choice {optKey}:</strong>
                        <span>{rationale}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reference URL */}
                {question.referenceUrl && (
                  <div className="pt-2 text-xs">
                    <a
                      href={question.referenceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#a435f0] hover:underline font-semibold inline-flex items-center space-x-1"
                    >
                      <span>Official Documentation / Reference</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="pt-8 mt-8 border-t border-[#d1d7dc] flex items-center justify-between gap-3">
        {/* Previous Button */}
        <button
          type="button"
          onClick={onPrev}
          disabled={currentIndex === 0}
          className={`inline-flex items-center space-x-1 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold border transition-colors ${
            currentIndex === 0
              ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
              : 'border-[#d1d7dc] text-[#2d2f31] hover:bg-gray-100 bg-white'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {/* Center: Open Questions Drawer Button */}
        <button
          type="button"
          onClick={onOpenDrawer}
          className="inline-flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-[#2d2f31] bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <Grid className="w-4 h-4 text-gray-600" />
          <span>Questions ({answeredCount}/{totalQuestions})</span>
        </button>

        {/* Next / Finish Button */}
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center space-x-1 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold bg-[#2d2f31] hover:bg-black text-white shadow-xs transition-colors"
        >
          <span>{currentIndex === totalQuestions - 1 ? 'Review & Finish' : 'Next Question'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
