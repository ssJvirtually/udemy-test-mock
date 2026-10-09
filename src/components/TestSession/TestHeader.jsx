import React, { useEffect, useState } from 'react';
import { Clock, Pause, Play, HelpCircle, Layers, Sparkles } from 'lucide-react';

export function TestHeader({
  examTitle,
  currentIndex,
  totalQuestions,
  secondsRemaining,
  isPaused,
  onTogglePause,
  onFinishTestClick,
  practiceMode,
  onTogglePracticeMode
}) {
  const formatTime = (totalSecs) => {
    if (totalSecs === null || totalSecs === undefined) return '--:--';
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;

    const pad = (n) => String(n).padStart(2, '0');
    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  const isLowTime = secondsRemaining !== null && secondsRemaining <= 300 && secondsRemaining > 0;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className="bg-white border-b border-[#d1d7dc] sticky top-0 z-30 shadow-2xs">
      {/* Top Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Left: Exam Title & Question Progress */}
        <div className="min-w-0">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-[#a435f0] bg-[#f5eefc] px-2 py-0.5 rounded uppercase tracking-wider">
              Practice Test
            </span>
            <span className="text-xs text-[#6a6f73] font-medium hidden sm:inline">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
          </div>
          <h2 className="text-sm sm:text-base font-bold text-[#2d2f31] truncate mt-0.5" title={examTitle}>
            {examTitle}
          </h2>
        </div>

        {/* Right: Timer, Mode Switcher, Finish Button */}
        <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
          {/* Practice Mode Toggle */}
          <button
            type="button"
            onClick={onTogglePracticeMode}
            title={practiceMode ? "Practice Mode: Immediate answer check is ON" : "Exam Mode: Strict mode with results at end"}
            className={`hidden md:inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
              practiceMode
                ? 'bg-purple-50 text-[#a435f0] border-purple-200'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#a435f0]" />
            <span>{practiceMode ? 'Practice Mode (Instant Feedback)' : 'Exam Mode (Strict)'}</span>
          </button>

          {/* Timer Display */}
          <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs sm:text-sm font-bold ${
            isLowTime
              ? 'bg-red-50 text-red-700 border-red-300 animate-pulse'
              : 'bg-gray-50 text-[#2d2f31] border-gray-200'
          }`}>
            <Clock className={`w-4 h-4 ${isLowTime ? 'text-red-600' : 'text-gray-500'}`} />
            <span>{formatTime(secondsRemaining)}</span>
          </div>

          {/* Pause Button */}
          <button
            type="button"
            onClick={onTogglePause}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-[#d1d7dc] text-[#2d2f31] hover:bg-gray-100 text-xs sm:text-sm font-semibold flex items-center space-x-1 transition-colors"
            title="Pause Test"
          >
            {isPaused ? <Play className="w-4 h-4 fill-current text-emerald-600" /> : <Pause className="w-4 h-4 text-gray-700" />}
            <span className="hidden sm:inline">{isPaused ? 'Resume' : 'Pause'}</span>
          </button>

          {/* Finish Test Button */}
          <button
            type="button"
            onClick={onFinishTestClick}
            className="px-3 sm:px-4 py-1.5 rounded-lg bg-[#a435f0] hover:bg-[#8710d8] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
          >
            Finish Test
          </button>
        </div>
      </div>

      {/* Thin Progress Bar Under Header */}
      <div className="w-full bg-[#f0f2f5] h-1">
        <div 
          className="bg-[#a435f0] h-1 transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
