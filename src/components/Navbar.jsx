import React from 'react';
import { BookOpen, Sparkles, Upload, FileCode, CheckCircle2, ExternalLink } from 'lucide-react';

export function Navbar({ activeTab, onSelectTab, inTestMode = false, onExitTest }) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#d1d7dc] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => inTestMode ? onExitTest() : onSelectTab('home')}>
            {/* Udemy-style brand icon */}
            <div className="w-10 h-10 rounded-md bg-[#a435f0] flex items-center justify-center text-white shadow-sm transition-transform hover:scale-105">
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-label="Udemy Mock Platform">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl text-[#2d2f31] tracking-tight">
                  Mock<span className="text-[#a435f0]">Master</span>
                </span>
                <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider bg-[#f5eefc] text-[#a435f0] px-2 py-0.5 rounded">
                  Udemy Style
                </span>
              </div>
              <p className="text-[11px] text-[#6a6f73] hidden md:block">
                LLM-Powered Practice Test Simulator
              </p>
            </div>
          </div>

          {/* Navigation Links (when not in full exam mode) */}
          {!inTestMode ? (
            <nav className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={() => onSelectTab('home')}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  activeTab === 'home'
                    ? 'text-[#a435f0] bg-[#f5eefc] font-semibold'
                    : 'text-[#2d2f31] hover:text-[#a435f0] hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center space-x-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">Exams</span>
                </span>
              </button>

              <button
                onClick={() => onSelectTab('prompt')}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  activeTab === 'prompt'
                    ? 'text-[#a435f0] bg-[#f5eefc] font-semibold'
                    : 'text-[#2d2f31] hover:text-[#a435f0] hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-[#a435f0]" />
                  <span>LLM Prompt & Schema</span>
                </span>
              </button>

              <button
                onClick={() => onSelectTab('upload')}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  activeTab === 'upload'
                    ? 'text-[#a435f0] bg-[#f5eefc] font-semibold'
                    : 'text-[#2d2f31] hover:text-[#a435f0] hover:bg-gray-50'
                }`}
              >
                <span className="flex items-center space-x-1.5">
                  <Upload className="w-4 h-4" />
                  <span className="hidden sm:inline">Upload JSON</span>
                </span>
              </button>

              <a
                href="https://github.com/ssJvirtually/udemy-test-mock"
                target="_blank"
                rel="noreferrer"
                className="hidden lg:flex items-center space-x-1 text-sm text-[#6a6f73] hover:text-[#2d2f31] px-2 py-1 rounded transition-colors"
                title="View on GitHub"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GitHub</span>
              </a>
            </nav>

          ) : (
            <div className="flex items-center space-x-3">
              <span className="text-xs sm:text-sm text-[#6a6f73] hidden sm:inline">
                Test in progress
              </span>
              <button
                onClick={onExitTest}
                className="text-xs sm:text-sm font-medium text-gray-600 hover:text-red-600 px-3 py-1.5 rounded border border-gray-300 hover:border-red-300 transition-colors"
              >
                Exit to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
