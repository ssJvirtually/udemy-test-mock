import React from 'react';
import { PauseCircle, Play } from 'lucide-react';

export function PauseModal({ isOpen, onResume }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 text-center border border-[#d1d7dc]">
        <div className="w-16 h-16 rounded-full bg-[#f5eefc] text-[#a435f0] flex items-center justify-center mx-auto mb-4">
          <PauseCircle className="w-9 h-9" />
        </div>

        <h3 className="text-xl font-bold text-[#2d2f31]">
          Test Paused
        </h3>

        <p className="text-sm text-[#6a6f73] mt-2 leading-relaxed">
          Your timer has been stopped and your answers are saved. Take a breath and resume when you are ready!
        </p>

        <div className="mt-6">
          <button
            type="button"
            onClick={onResume}
            className="w-full py-3 px-6 rounded-lg font-bold text-sm bg-[#a435f0] hover:bg-[#8710d8] text-white shadow-md flex items-center justify-center space-x-2 transition-transform active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Resume Test</span>
          </button>
        </div>
      </div>
    </div>
  );
}
