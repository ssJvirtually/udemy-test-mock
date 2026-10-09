import React from 'react';
import { 
  Clock, 
  HelpCircle, 
  Award, 
  Play, 
  Download, 
  Trash2, 
  Layers, 
  Sparkles,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { getBestScoreForExam, exportExamAsJson } from '../utils/storage';

export function ExamCard({ exam, onStartExam, onDeleteExam, isBuiltIn = false }) {
  const bestScore = getBestScoreForExam(exam.id);
  const isPassed = bestScore !== null && bestScore >= (exam.passingScore || 70);

  return (
    <div className="bg-white rounded-xl border border-[#d1d7dc] hover:border-[#a435f0] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
      {/* Top Banner Accent */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Row */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#a435f0] bg-[#f5eefc] px-2.5 py-0.5 rounded">
              {exam.category || 'Practice Test'}
            </span>

            {bestScore !== null && (
              <span className={`inline-flex items-center space-x-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}>
                {isPassed ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                <span>Best: {bestScore}%</span>
              </span>
            )}
          </div>

          {/* Exam Title */}
          <h3 className="font-bold text-base sm:text-lg text-[#2d2f31] group-hover:text-[#a435f0] transition-colors leading-snug line-clamp-2">
            {exam.title}
          </h3>

          {/* Description */}
          {exam.description && (
            <p className="text-xs sm:text-sm text-[#6a6f73] mt-2 line-clamp-2 leading-relaxed">
              {exam.description}
            </p>
          )}

          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#6a6f73] mt-4 pt-3 border-t border-[#f0f2f5]">
            <span className="flex items-center space-x-1">
              <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
              <span>{exam.questions?.length || 0} Questions</span>
            </span>

            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>{exam.durationMinutes || 60} mins</span>
            </span>

            <span className="flex items-center space-x-1">
              <Award className="w-3.5 h-3.5 text-gray-400" />
              <span>Pass: {exam.passingScore || 72}%</span>
            </span>

            {exam.domains && exam.domains.length > 0 && (
              <span className="flex items-center space-x-1">
                <Layers className="w-3.5 h-3.5 text-gray-400" />
                <span>{exam.domains.length} Domains</span>
              </span>
            )}
          </div>
        </div>

        {/* Buttons / Actions */}
        <div className="mt-5 pt-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onStartExam(exam)}
            className="flex-1 inline-flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-bold text-xs sm:text-sm bg-[#a435f0] hover:bg-[#8710d8] text-white shadow-xs transition-colors"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Practice Test</span>
          </button>

          <button
            type="button"
            onClick={() => exportExamAsJson(exam)}
            title="Download Exam JSON"
            className="p-2 rounded-md border border-[#d1d7dc] text-gray-600 hover:text-[#a435f0] hover:border-[#a435f0] transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>

          {!isBuiltIn && onDeleteExam && (
            <button
              type="button"
              onClick={() => onDeleteExam(exam.id)}
              title="Delete Custom Exam"
              className="p-2 rounded-md border border-[#d1d7dc] text-gray-500 hover:text-red-600 hover:border-red-300 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
