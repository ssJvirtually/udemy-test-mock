import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Bookmark, 
  ExternalLink, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  Info
} from 'lucide-react';
import { FormattedText } from '../../utils/markdown';

export function QuestionReview({ questions, userAnswers, markedQuestions }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'incorrect' | 'correct' | 'marked'
  const [expandedAll, setExpandedAll] = useState(true);
  const [collapsedItems, setCollapsedItems] = useState({});

  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  const getQuestionStatus = (q, idx) => {
    const ans = userAnswers[idx];
    if (ans === undefined || ans === null) return 'skipped';
    if (Array.isArray(ans) && ans.length === 0) return 'skipped';

    if (q.type === 'multiple') {
      if (Array.isArray(ans) && Array.isArray(q.correctAnswer)) {
        if (ans.length === q.correctAnswer.length && ans.every(v => q.correctAnswer.includes(v))) {
          return 'correct';
        }
      }
      return 'incorrect';
    } else {
      return ans === q.correctAnswer ? 'correct' : 'incorrect';
    }
  };

  const isMarked = (idx) => !!markedQuestions[idx];

  const filteredQuestions = questions.map((q, idx) => ({
    q,
    idx,
    status: getQuestionStatus(q, idx),
    marked: isMarked(idx)
  })).filter(item => {
    if (filter === 'incorrect') return item.status === 'incorrect';
    if (filter === 'correct') return item.status === 'correct';
    if (filter === 'marked') return item.marked;
    return true;
  });

  const toggleCollapse = (idx) => {
    setCollapsedItems(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const incorrectCount = questions.filter((q, i) => getQuestionStatus(q, i) === 'incorrect').length;
  const correctCount = questions.filter((q, i) => getQuestionStatus(q, i) === 'correct').length;
  const markedCount = questions.filter((_, i) => isMarked(i)).length;

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-white rounded-xl border border-[#d1d7dc] p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-[#2d2f31]">
            Detailed Question Review & Explanations
          </h3>
          <p className="text-xs text-[#6a6f73] mt-0.5">
            Examine correct answers, in-depth rationale, and official documentation links.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-[#2d2f31] text-white'
                : 'bg-gray-100 text-[#2d2f31] hover:bg-gray-200'
            }`}
          >
            All ({questions.length})
          </button>

          <button
            type="button"
            onClick={() => setFilter('incorrect')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center space-x-1 ${
              filter === 'incorrect'
                ? 'bg-red-700 text-white'
                : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Incorrect ({incorrectCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilter('correct')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center space-x-1 ${
              filter === 'correct'
                ? 'bg-emerald-700 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Correct ({correctCount})</span>
          </button>

          {markedCount > 0 && (
            <button
              type="button"
              onClick={() => setFilter('marked')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center space-x-1 ${
                filter === 'marked'
                  ? 'bg-[#a435f0] text-white'
                  : 'bg-purple-50 text-[#a435f0] hover:bg-purple-100'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
              <span>Marked ({markedCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Questions Review List */}
      <div className="space-y-5">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#d1d7dc] p-10 text-center text-sm text-[#6a6f73]">
            No questions match the selected filter.
          </div>
        ) : (
          filteredQuestions.map(({ q, idx, status, marked }) => {
            const isCollapsed = !!collapsedItems[idx];
            const userAnswer = userAnswers[idx];

            return (
              <div 
                key={idx}
                className="bg-white rounded-xl border border-[#d1d7dc] shadow-2xs overflow-hidden transition-all"
              >
                {/* Question Header Card */}
                <div 
                  onClick={() => toggleCollapse(idx)}
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer bg-white hover:bg-gray-50/80 transition-colors border-b border-gray-100"
                >
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="font-extrabold text-sm sm:text-base text-[#2d2f31]">
                      Question {idx + 1}
                    </span>

                    {/* Status Badge */}
                    {status === 'correct' && (
                      <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Correct</span>
                      </span>
                    )}

                    {status === 'incorrect' && (
                      <span className="inline-flex items-center space-x-1 text-xs font-bold text-red-800 bg-red-100 px-2.5 py-0.5 rounded-full">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Incorrect</span>
                      </span>
                    )}

                    {status === 'skipped' && (
                      <span className="inline-flex items-center space-x-1 text-xs font-bold text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded-full">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Skipped</span>
                      </span>
                    )}

                    {marked && (
                      <span className="inline-flex items-center space-x-1 text-xs font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                        <Bookmark className="w-3 h-3 fill-current text-amber-500" />
                        <span>Marked</span>
                      </span>
                    )}

                    {q.domain && (
                      <span className="hidden md:inline-block text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {q.domain}
                      </span>
                    )}
                  </div>

                  <button className="text-gray-400 hover:text-gray-600 p-1">
                    {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                  </button>
                </div>

                {/* Collapsible Question Body */}
                {!isCollapsed && (
                  <div className="p-5 sm:p-6 space-y-5 bg-[#fafbfc]">
                    {/* Stem */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <FormattedText content={q.question} className="text-base text-[#2d2f31] font-medium" />

                      {q.codeSnippet && (
                        <div className="rounded-lg overflow-hidden border border-[#d1d7dc] bg-[#1e1e1e] my-3">
                          <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-emerald-300">
                            <code>{q.codeSnippet}</code>
                          </pre>
                        </div>
                      )}
                    </div>

                    {/* Choices Review */}
                    <div className="space-y-2.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#6a6f73] block">
                        Answer Choices:
                      </span>

                      {q.options.map((optText, optIdx) => {
                        const isCorrectOption = q.type === 'multiple'
                          ? Array.isArray(q.correctAnswer) && q.correctAnswer.includes(optIdx)
                          : q.correctAnswer === optIdx;

                        const isUserChoice = q.type === 'multiple'
                          ? Array.isArray(userAnswer) && userAnswer.includes(optIdx)
                          : userAnswer === optIdx;

                        let cardClass = 'bg-white border-[#d1d7dc] text-[#2d2f31]';
                        let badge = null;

                        if (isCorrectOption && isUserChoice) {
                          cardClass = 'bg-emerald-50/80 border-emerald-400 ring-1 ring-emerald-400';
                          badge = (
                            <span className="text-xs font-bold text-emerald-700 inline-flex items-center space-x-1 shrink-0">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Your Correct Choice</span>
                            </span>
                          );
                        } else if (isCorrectOption && !isUserChoice) {
                          cardClass = 'bg-emerald-50/40 border-emerald-300';
                          badge = (
                            <span className="text-xs font-bold text-emerald-700 inline-flex items-center space-x-1 shrink-0">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Correct Choice</span>
                            </span>
                          );
                        } else if (!isCorrectOption && isUserChoice) {
                          cardClass = 'bg-red-50/80 border-red-400 ring-1 ring-red-400';
                          badge = (
                            <span className="text-xs font-bold text-red-700 inline-flex items-center space-x-1 shrink-0">
                              <XCircle className="w-4 h-4 text-red-600" />
                              <span>Your Choice (Incorrect)</span>
                            </span>
                          );
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-3.5 rounded-xl border flex items-start justify-between space-x-3 text-xs sm:text-sm ${cardClass}`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center shrink-0 border mt-0.5 ${
                                isCorrectOption
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : isUserChoice
                                  ? 'bg-red-600 text-white border-red-600'
                                  : 'bg-gray-100 text-gray-700 border-gray-300'
                              }`}>
                                {letters[optIdx] || optIdx + 1}
                              </div>
                              <div className="pt-0.5 leading-relaxed">
                                <FormattedText content={optText} />
                              </div>
                            </div>

                            {badge}
                          </div>
                        );
                      })}
                    </div>

                    {/* In-depth Explanation Card */}
                    <div className="bg-white border border-[#d1d7dc] rounded-xl p-5 space-y-4">
                      <div className="flex items-center space-x-2 text-sm font-bold text-[#2d2f31]">
                        <Info className="w-4 h-4 text-[#a435f0]" />
                        <span>Comprehensive Explanation:</span>
                      </div>

                      <div className="text-xs sm:text-sm text-[#2d2f31] leading-relaxed">
                        <FormattedText content={q.explanation} />
                      </div>

                      {/* Option Rationales Breakdown */}
                      {q.optionRationales && Object.keys(q.optionRationales).length > 0 && (
                        <div className="pt-3 border-t border-gray-100 space-y-2">
                          <span className="font-bold text-xs uppercase tracking-wider text-gray-600 block">
                            Option-by-Option Breakdown:
                          </span>
                          <div className="grid grid-cols-1 gap-2">
                            {Object.entries(q.optionRationales).map(([optLetter, rationale]) => (
                              <div key={optLetter} className="text-xs p-2.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-800">
                                <strong className="text-[#2d2f31] mr-1.5 font-bold">Choice {optLetter}:</strong>
                                <span>{rationale}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Reference Link */}
                      {q.referenceUrl && (
                        <div className="pt-2 text-xs">
                          <a
                            href={q.referenceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#a435f0] hover:underline font-semibold inline-flex items-center space-x-1"
                          >
                            <span>Official Documentation / Learning Resource</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
