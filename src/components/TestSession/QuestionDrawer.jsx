import React, { useState } from 'react';
import { Bookmark, X, Check, Filter } from 'lucide-react';

export function QuestionDrawer({ 
  isOpen, 
  onClose, 
  questions, 
  userAnswers, 
  markedQuestions, 
  currentIndex, 
  onSelectQuestion 
}) {
  const [filter, setFilter] = useState('all'); // 'all' | 'answered' | 'unanswered' | 'marked'

  if (!isOpen) return null;

  const total = questions.length;
  
  const isAnswered = (idx) => {
    const ans = userAnswers[idx];
    if (ans === undefined || ans === null) return false;
    if (Array.isArray(ans)) return ans.length > 0;
    return true;
  };

  const isMarked = (idx) => !!markedQuestions[idx];

  const filteredIndices = questions.map((_, i) => i).filter(idx => {
    if (filter === 'answered') return isAnswered(idx);
    if (filter === 'unanswered') return !isAnswered(idx);
    if (filter === 'marked') return isMarked(idx);
    return true;
  });

  const answeredCount = questions.filter((_, i) => isAnswered(i)).length;
  const markedCount = questions.filter((_, i) => isMarked(i)).length;
  const unansweredCount = total - answeredCount;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-2xs animate-fade-in">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#d1d7dc] animate-slide-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#d1d7dc] flex items-center justify-between bg-[#f7f9fa]">
          <div>
            <h3 className="font-bold text-base text-[#2d2f31]">
              Question Navigator
            </h3>
            <p className="text-xs text-[#6a6f73]">
              {answeredCount} of {total} questions answered
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-500 hover:text-black hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="p-3 border-b border-[#d1d7dc] flex flex-wrap gap-1.5 bg-white text-xs">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
              filter === 'all'
                ? 'bg-[#2d2f31] text-white'
                : 'bg-gray-100 text-[#2d2f31] hover:bg-gray-200'
            }`}
          >
            All ({total})
          </button>

          <button
            type="button"
            onClick={() => setFilter('answered')}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
              filter === 'answered'
                ? 'bg-[#2d2f31] text-white'
                : 'bg-gray-100 text-[#2d2f31] hover:bg-gray-200'
            }`}
          >
            Answered ({answeredCount})
          </button>

          <button
            type="button"
            onClick={() => setFilter('unanswered')}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors ${
              filter === 'unanswered'
                ? 'bg-[#2d2f31] text-white'
                : 'bg-gray-100 text-[#2d2f31] hover:bg-gray-200'
            }`}
          >
            Unanswered ({unansweredCount})
          </button>

          <button
            type="button"
            onClick={() => setFilter('marked')}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors flex items-center space-x-1 ${
              filter === 'marked'
                ? 'bg-[#a435f0] text-white'
                : 'bg-gray-100 text-[#2d2f31] hover:bg-gray-200'
            }`}
          >
            <Bookmark className="w-3 h-3 fill-current" />
            <span>Marked ({markedCount})</span>
          </button>
        </div>

        {/* Legend */}
        <div className="px-4 py-2 bg-gray-50 border-b border-[#d1d7dc] flex items-center justify-between text-[11px] text-[#6a6f73]">
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[#2d2f31]"></span>
            <span>Answered</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded border border-[#d1d7dc] bg-white"></span>
            <span>Unanswered</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-current" />
            <span>Marked</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-3.5 rounded ring-2 ring-[#a435f0] bg-white"></span>
            <span>Current</span>
          </div>
        </div>

        {/* Question Palette Grid */}
        <div className="p-4 flex-1 overflow-y-auto">
          {filteredIndices.length === 0 ? (
            <div className="text-center py-10 text-xs text-gray-500">
              No questions found for the selected filter.
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-2.5">
              {filteredIndices.map((idx) => {
                const answered = isAnswered(idx);
                const marked = isMarked(idx);
                const isCurrent = idx === currentIndex;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onSelectQuestion(idx);
                      onClose();
                    }}
                    className={`relative h-11 rounded-lg font-bold text-xs flex items-center justify-center transition-all ${
                      answered
                        ? 'bg-[#2d2f31] text-white hover:bg-black'
                        : 'bg-white text-[#2d2f31] border border-[#d1d7dc] hover:border-gray-400'
                    } ${
                      isCurrent
                        ? 'ring-2 ring-offset-1 ring-[#a435f0] font-extrabold'
                        : ''
                    }`}
                  >
                    <span>{idx + 1}</span>

                    {/* Bookmark indicator */}
                    {marked && (
                      <span className="absolute top-1 right-1">
                        <Bookmark className="w-3 h-3 text-amber-400 fill-current" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#d1d7dc] bg-[#f7f9fa]">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-lg border border-[#d1d7dc] text-xs sm:text-sm font-semibold text-[#2d2f31] hover:bg-white transition-colors"
          >
            Close Navigator
          </button>
        </div>
      </div>
    </div>
  );
}
