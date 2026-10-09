import React from 'react';
import { Sparkles, Shield, Cpu, ExternalLink } from 'lucide-react';

export function Footer({ onSelectTab }) {
  return (
    <footer className="mt-auto bg-[#1c1d1f] text-gray-300 border-t border-gray-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded bg-[#a435f0] flex items-center justify-center text-white font-bold">
                M
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Mock<span className="text-[#a435f0]">Master</span>
              </span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm max-w-md leading-relaxed">
              An authentic Udemy-style mock exam practice platform designed for GitHub Pages.
              Generate realistic exam questions with ChatGPT, Claude, Gemini, or DeepSeek, upload the JSON, and practice in an authentic test simulator.
            </p>
            <div className="flex items-center space-x-4 pt-2 text-xs text-gray-400">
              <span className="flex items-center space-x-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Client-Side Privacy</span>
              </span>
              <span className="flex items-center space-x-1">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>Zero Server Overhead</span>
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-xs mb-3">
              Exam Tools
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onSelectTab('prompt')}
                  className="text-gray-400 hover:text-white transition-colors flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#a435f0]" />
                  <span>LLM Prompt Generator</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('prompt')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  JSON Schema Specification
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('upload')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Upload & Validate JSON
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('home')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Practice Sample Exams
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider text-xs mb-3">
              Deployment & Tech
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
              <li>Static SPA (Single Page App)</li>
              <li>Hosted on GitHub Pages</li>
              <li>Local storage persistence</li>
              <li>Markdown & Code Snippet engine</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400">
          <p>© {new Date().getFullYear()} MockMaster Simulator. Built with React & Tailwind for seamless GitHub Pages hosting.</p>
          <p className="mt-2 sm:mt-0">Inspired by the Udemy Practice Test experience.</p>
        </div>
      </div>
    </footer>
  );
}
