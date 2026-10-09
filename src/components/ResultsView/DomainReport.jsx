import React from 'react';
import { Layers, CheckCircle2, AlertCircle } from 'lucide-react';

export function DomainReport({ exam, questions, userAnswers }) {
  // Aggregate stats per domain
  const domainStats = {};

  questions.forEach((q, idx) => {
    const domain = q.domain || exam.category || 'General';
    if (!domainStats[domain]) {
      domainStats[domain] = { total: 0, correct: 0 };
    }
    domainStats[domain].total += 1;

    // Check correctness
    const ans = userAnswers[idx];
    if (ans !== undefined && ans !== null) {
      if (q.type === 'multiple') {
        if (Array.isArray(ans) && Array.isArray(q.correctAnswer)) {
          if (ans.length === q.correctAnswer.length && ans.every(v => q.correctAnswer.includes(v))) {
            domainStats[domain].correct += 1;
          }
        }
      } else {
        if (ans === q.correctAnswer) {
          domainStats[domain].correct += 1;
        }
      }
    }
  });

  const domainList = Object.entries(domainStats).map(([name, stats]) => {
    const percentage = Math.round((stats.correct / stats.total) * 100);
    const passed = percentage >= (exam.passingScore || 70);
    return { name, ...stats, percentage, passed };
  });

  if (domainList.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-[#d1d7dc] p-6 shadow-2xs">
      <div className="flex items-center space-x-2 pb-4 mb-4 border-b border-[#d1d7dc]">
        <Layers className="w-5 h-5 text-[#a435f0]" />
        <h3 className="font-bold text-base sm:text-lg text-[#2d2f31]">
          Knowledge Area / Domain Performance
        </h3>
      </div>

      <div className="space-y-4">
        {domainList.map((dom, dIdx) => (
          <div key={dIdx} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-semibold text-[#2d2f31] flex items-center space-x-1.5">
                {dom.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                )}
                <span className="truncate max-w-xs sm:max-w-md">{dom.name}</span>
              </span>

              <div className="flex items-center space-x-2 shrink-0">
                <span className="text-gray-500 text-xs">
                  {dom.correct} / {dom.total} correct
                </span>
                <span className={`font-bold px-2 py-0.5 rounded text-xs ${
                  dom.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {dom.percentage}%
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  dom.passed ? 'bg-emerald-600' : 'bg-amber-500'
                }`}
                style={{ width: `${dom.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
