import React from 'react';
import { AlertTriangle, CheckCircle, Bookmark, ArrowRight, X } from 'lucide-react';

export function FinishModal({ 
  isOpen, 
  onClose, 
  onConfirmFinish, 
  totalQuestions, 
  answeredCount, 
  markedCount 
}) {
  if (!isOpen) return null;

  const unansweredCount = totalQuestions - answeredCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 border border-[#d1d7dc] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-[#2d2f31]">
            Finish Test & View Score?
          </h3>
        </div>

        {/* Warning Details */}
        {unansweredCount > 0 ? (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 text-xs sm:text-sm text-amber-900 space-y-1">
            <p className="font-bold">
              You have {unansweredCount} unanswered {unansweredCount === 1 ? 'question' : 'questions'}!
            </p>
            <p className="text-amber-700">
              Unanswered questions will be scored as incorrect. You can return to answer them or submit now.
            </p>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4 text-xs sm:text-sm text-emerald-900 space-y-1">
            <p className="font-bold flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>All {totalQuestions} questions have been answered!</span>
            </p>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6 text-center text-xs">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-gray-500 font-medium">Answered</div>
            <div className="text-lg font-bold text-[#2d2f31] mt-0.5">{answeredCount} / {totalQuestions}</div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-gray-500 font-medium">Unanswered</div>
            <div className="text-lg font-bold text-amber-600 mt-0.5">{unansweredCount}</div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-gray-500 font-medium">Marked for Review</div>
            <div className="text-lg font-bold text-[#a435f0] mt-0.5">{markedCount}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2 border-t border-[#d1d7dc]">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg font-semibold text-xs sm:text-sm border border-[#d1d7dc] text-[#2d2f31] hover:bg-gray-100 transition-colors"
          >
            Review Questions
          </button>

          <button
            type="button"
            onClick={onConfirmFinish}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg font-bold text-xs sm:text-sm bg-[#a435f0] hover:bg-[#8710d8] text-white shadow-sm flex items-center justify-center space-x-2 transition-all hover:scale-[1.02]"
          >
            <span>Confirm & Finish</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
