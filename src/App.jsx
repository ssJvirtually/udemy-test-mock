import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Upload, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Award, 
  Play, 
  Plus, 
  FileCode, 
  HelpCircle,
  ShieldCheck,
  Search,
  Filter
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PromptGenerator } from './components/PromptGenerator';
import { ExamUploader } from './components/ExamUploader';
import { ExamCard } from './components/ExamCard';
import { TestHeader } from './components/TestSession/TestHeader';
import { QuestionView } from './components/TestSession/QuestionView';
import { QuestionDrawer } from './components/TestSession/QuestionDrawer';
import { PauseModal } from './components/TestSession/PauseModal';
import { FinishModal } from './components/TestSession/FinishModal';
import { ScoreCard } from './components/ResultsView/ScoreCard';
import { DomainReport } from './components/ResultsView/DomainReport';
import { QuestionReview } from './components/ResultsView/QuestionReview';

import { 
  getAllExams, 
  saveCustomExam, 
  deleteCustomExam, 
  saveExamAttempt, 
  getBestScoreForExam 
} from './utils/storage';
import { SAMPLE_EXAMS } from './data/sampleExams';

export function App() {
  // Navigation & View
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'prompt' | 'upload'
  const [viewState, setViewState] = useState('dashboard'); // 'dashboard' | 'testing' | 'results'

  // Exam library data
  const [exams, setExams] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Active Test Session State
  const [activeExam, setActiveExam] = useState(null);
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [markedQuestions, setMarkedQuestions] = useState({});
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);

  // Modals & Drawers
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);

  // Results State
  const [testResult, setTestResult] = useState(null);

  const reviewSectionRef = useRef(null);

  // Load exams on initial mount
  useEffect(() => {
    refreshExams();
  }, []);

  const refreshExams = () => {
    const list = getAllExams();
    setExams(list);
  };

  // Timer interval for test session
  useEffect(() => {
    let timer = null;
    if (viewState === 'testing' && !isPaused && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleFinishExam(); // Auto finish when time expires
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [viewState, isPaused, secondsRemaining]);

  // Start Exam
  const handleStartExam = (exam, customQuestionsList = null) => {
    const questionsToUse = customQuestionsList || exam.questions;
    setActiveExam(exam);
    setActiveQuestions(questionsToUse);
    setCurrentIndex(0);
    setUserAnswers({});
    setMarkedQuestions({});
    setSecondsRemaining((exam.durationMinutes || 45) * 60);
    setIsPaused(false);
    setIsDrawerOpen(false);
    setIsPauseModalOpen(false);
    setIsFinishModalOpen(false);
    setViewState('testing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle Pause
  const handleTogglePause = () => {
    setIsPaused((prev) => {
      const next = !prev;
      setIsPauseModalOpen(next);
      return next;
    });
  };

  const handleResumeTest = () => {
    setIsPaused(false);
    setIsPauseModalOpen(false);
  };

  // Select Answer
  const handleSelectAnswer = (ans) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: ans
    }));
  };

  // Toggle Marked for review
  const handleToggleMark = () => {
    setMarkedQuestions((prev) => ({
      ...prev,
      [currentIndex]: !prev[currentIndex]
    }));
  };

  // Finish Exam & Calculate Score
  const handleFinishExam = () => {
    setIsFinishModalOpen(false);
    setIsPauseModalOpen(false);

    let correctCount = 0;
    let incorrectCount = 0;
    let skippedCount = 0;

    activeQuestions.forEach((q, idx) => {
      const ans = userAnswers[idx];
      if (ans === undefined || ans === null || (Array.isArray(ans) && ans.length === 0)) {
        skippedCount++;
        return;
      }

      if (q.type === 'multiple') {
        if (Array.isArray(ans) && Array.isArray(q.correctAnswer)) {
          if (ans.length === q.correctAnswer.length && ans.every(v => q.correctAnswer.includes(v))) {
            correctCount++;
          } else {
            incorrectCount++;
          }
        } else {
          incorrectCount++;
        }
      } else {
        if (ans === q.correctAnswer) {
          correctCount++;
        } else {
          incorrectCount++;
        }
      }
    });

    const total = activeQuestions.length;
    const scorePercentage = Math.round((correctCount / total) * 100);
    const passingScore = activeExam.passingScore || 72;
    const isPassed = scorePercentage >= passingScore;
    const timeTakenSeconds = ((activeExam.durationMinutes || 45) * 60) - secondsRemaining;

    const resultPayload = {
      examId: activeExam.id,
      examTitle: activeExam.title,
      totalQuestions: total,
      correctCount,
      incorrectCount,
      skippedCount,
      scorePercentage,
      isPassed,
      timeTakenSeconds,
      date: new Date().toISOString()
    };

    saveExamAttempt(resultPayload);
    setTestResult(resultPayload);
    setViewState('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Retake Missed Only
  const handleRetakeMissed = () => {
    const missedQuestions = activeQuestions.filter((q, idx) => {
      const ans = userAnswers[idx];
      if (ans === undefined || ans === null) return true;
      if (q.type === 'multiple') {
        if (!Array.isArray(ans) || ans.length !== q.correctAnswer.length) return true;
        return !ans.every(v => q.correctAnswer.includes(v));
      }
      return ans !== q.correctAnswer;
    });

    if (missedQuestions.length > 0) {
      handleStartExam(
        {
          ...activeExam,
          title: `${activeExam.title} (Missed Questions Review)`,
          durationMinutes: Math.max(10, Math.round(missedQuestions.length * 1.5))
        },
        missedQuestions
      );
    }
  };

  // Delete Exam
  const handleDeleteExam = (id) => {
    if (window.confirm('Are you sure you want to delete this custom practice exam?')) {
      deleteCustomExam(id);
      refreshExams();
    }
  };

  // When new custom exam is added
  const handleExamSaved = (savedExam) => {
    saveCustomExam(savedExam);
    refreshExams();
    setActiveTab('home');
  };

  // Calculate filtered exams
  const categories = ['All', ...new Set(exams.map(e => e.category || 'General'))];
  const filteredExams = exams.filter(e => {
    const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
    const matchesQuery = !searchQuery || e.title.toLowerCase().includes(searchQuery.toLowerCase()) || (e.description && e.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const answeredCount = Object.keys(userAnswers).filter(k => {
    const val = userAnswers[k];
    if (val === undefined || val === null) return false;
    if (Array.isArray(val)) return val.length > 0;
    return true;
  }).length;

  const markedCount = Object.values(markedQuestions).filter(Boolean).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9fa]">
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setViewState('dashboard');
        }}
        inTestMode={viewState === 'testing'}
        onExitTest={() => {
          if (window.confirm('Do you want to exit the current test? Your current progress in this session will not be scored.')) {
            setViewState('dashboard');
          }
        }}
      />

      {/* VIEW STATE: DASHBOARD (HOME, PROMPT, UPLOAD) */}
      {viewState === 'dashboard' && (
        <main className="flex-1 pb-16">
          {/* HOME TAB */}
          {activeTab === 'home' && (
            <div className="space-y-12">
              {/* Udemy-style Hero Header */}
              <section className="bg-gradient-to-r from-[#1c1d1f] via-[#2d2f31] to-[#3a2e5c] text-white py-12 sm:py-16 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-8 space-y-4">
                      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 text-xs font-bold border border-purple-400/30">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                        <span>The Ultimate AI Mock Exam Platform</span>
                      </div>

                      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                        Ace Any Certification with <span className="text-[#c084fc]">AI-Generated</span> Practice Tests
                      </h1>

                      <p className="text-gray-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                        Use ChatGPT, Claude, Gemini, or DeepSeek to generate realistic scenario questions in JSON format.
                        Practice in an authentic Udemy-style test simulator with timers, question palettes, and comprehensive explanations.
                      </p>

                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            if (SAMPLE_EXAMS[0]) handleStartExam(SAMPLE_EXAMS[0]);
                          }}
                          className="px-6 py-3 rounded-lg font-bold text-sm bg-[#a435f0] hover:bg-[#8710d8] text-white shadow-md flex items-center space-x-2 transition-all hover:scale-105 active:scale-95"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          <span>Practice AWS SAA-C03 Sample</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveTab('prompt')}
                          className="px-5 py-3 rounded-lg font-semibold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center space-x-2 transition-colors"
                        >
                          <Sparkles className="w-4 h-4 text-purple-300" />
                          <span>View LLM Prompts & Schema</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveTab('upload')}
                          className="px-5 py-3 rounded-lg font-semibold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center space-x-2 transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Upload Your JSON</span>
                        </button>
                      </div>
                    </div>

                    {/* Right column quick stats card */}
                    <div className="lg:col-span-4 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-4">
                      <div className="text-xs uppercase font-bold tracking-wider text-purple-200">
                        Platform Capabilities
                      </div>

                      <div className="space-y-3 text-xs sm:text-sm text-gray-200">
                        <div className="flex items-center space-x-3">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>100% Free & Hosted on GitHub Pages</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Single & Multi-Select Scenario Questions</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Question Drawer & Mark for Review</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Domain-by-Domain Score Breakdown</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>Option-by-Option Explanations</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* CORE REQUIREMENT: Prompt Generator & JSON Schema Section directly on Home Page */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-4">
                  <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#a435f0]">
                    <Sparkles className="w-4 h-4" />
                    <span>How to Generate Questions with AI</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#2d2f31] mt-0.5">
                    LLM Prompt Generator & Official JSON Schema
                  </h2>
                  <p className="text-xs sm:text-sm text-[#6a6f73]">
                    Use the interactive builder below to craft custom prompts for ChatGPT, Claude, Gemini, or DeepSeek, or copy our battle-tested JSON schema.
                  </p>
                </div>

                <PromptGenerator onQuickStartExam={handleStartExam} />
              </section>

              {/* Practice Exams Library Section */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#d1d7dc]">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#2d2f31] flex items-center space-x-2">
                      <BookOpen className="w-6 h-6 text-[#a435f0]" />
                      <span>Available Practice Tests ({filteredExams.length})</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-[#6a6f73] mt-0.5">
                      Select a practice test below to begin your timed exam simulation.
                    </p>
                  </div>

                  {/* Search and Category Filter */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search exams..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-3 py-1.5 rounded-lg border border-[#d1d7dc] text-xs sm:text-sm bg-white focus:outline-none focus:border-[#a435f0]"
                      />
                    </div>

                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-[#d1d7dc] text-xs sm:text-sm bg-white focus:outline-none focus:border-[#a435f0]"
                    >
                      {categories.map((c, i) => (
                        <option key={i} value={c}>{c}</option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => setActiveTab('upload')}
                      className="px-3.5 py-1.5 rounded-lg font-bold text-xs sm:text-sm bg-[#2d2f31] hover:bg-black text-white flex items-center space-x-1.5 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Exam</span>
                    </button>
                  </div>
                </div>

                {/* Exam Cards Grid */}
                {filteredExams.length === 0 ? (
                  <div className="bg-white rounded-xl border border-[#d1d7dc] p-12 text-center text-[#6a6f73]">
                    <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="font-bold text-lg text-[#2d2f31]">No Practice Tests Found</h3>
                    <p className="text-xs sm:text-sm mt-1">Try adjusting your search terms or upload a new JSON exam file.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredExams.map((exam) => (
                      <ExamCard
                        key={exam.id}
                        exam={exam}
                        onStartExam={handleStartExam}
                        onDeleteExam={handleDeleteExam}
                        isBuiltIn={String(exam.id).startsWith('builtin-')}
                      />
                    ))}
                  </div>
                )}
              </section>

              {/* Quick Upload Banner */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ExamUploader 
                  onExamReady={handleStartExam} 
                  onSavedExam={handleExamSaved} 
                />
              </section>
            </div>
          )}

          {/* DEDICATED PROMPT & SCHEMA TAB */}
          {activeTab === 'prompt' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
              <div className="mb-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2d2f31]">
                  LLM Prompt Generator & JSON Schema
                </h1>
                <p className="text-sm text-[#6a6f73] mt-1">
                  Everything you need to prompt ChatGPT, Claude, Gemini, or DeepSeek to write perfect mock exams.
                </p>
              </div>

              <PromptGenerator onQuickStartExam={handleStartExam} />
            </div>
          )}

          {/* DEDICATED UPLOAD TAB */}
          {activeTab === 'upload' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
              <div className="mb-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2d2f31]">
                  Upload & Validate Practice Exam
                </h1>
                <p className="text-sm text-[#6a6f73] mt-1">
                  Paste the JSON from your LLM response or drop your .json file here.
                </p>
              </div>

              <ExamUploader 
                onExamReady={handleStartExam} 
                onSavedExam={handleExamSaved} 
              />
            </div>
          )}
        </main>
      )}

      {/* VIEW STATE: ACTIVE TEST SESSION */}
      {viewState === 'testing' && activeExam && (
        <main className="flex-1 flex flex-col bg-white">
          {/* Test Header */}
          <TestHeader
            examTitle={activeExam.title}
            currentIndex={currentIndex}
            totalQuestions={activeQuestions.length}
            secondsRemaining={secondsRemaining}
            isPaused={isPaused}
            onTogglePause={handleTogglePause}
            onFinishTestClick={() => setIsFinishModalOpen(true)}
            practiceMode={practiceMode}
            onTogglePracticeMode={() => setPracticeMode(prev => !prev)}
          />

          {/* Question View */}
          {activeQuestions[currentIndex] && (
            <QuestionView
              question={activeQuestions[currentIndex]}
              currentIndex={currentIndex}
              totalQuestions={activeQuestions.length}
              currentAnswer={userAnswers[currentIndex]}
              isMarked={!!markedQuestions[currentIndex]}
              onToggleMark={handleToggleMark}
              onSelectAnswer={handleSelectAnswer}
              onPrev={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              onNext={() => {
                if (currentIndex === activeQuestions.length - 1) {
                  setIsFinishModalOpen(true);
                } else {
                  setCurrentIndex(prev => Math.min(activeQuestions.length - 1, prev + 1));
                }
              }}
              onOpenDrawer={() => setIsDrawerOpen(true)}
              answeredCount={answeredCount}
              practiceMode={practiceMode}
            />
          )}

          {/* Question Drawer Palette */}
          <QuestionDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            questions={activeQuestions}
            userAnswers={userAnswers}
            markedQuestions={markedQuestions}
            currentIndex={currentIndex}
            onSelectQuestion={(idx) => setCurrentIndex(idx)}
          />

          {/* Pause Modal */}
          <PauseModal
            isOpen={isPauseModalOpen}
            onResume={handleResumeTest}
          />

          {/* Finish Modal */}
          <FinishModal
            isOpen={isFinishModalOpen}
            onClose={() => setIsFinishModalOpen(false)}
            onConfirmFinish={handleFinishExam}
            totalQuestions={activeQuestions.length}
            answeredCount={answeredCount}
            markedCount={markedCount}
          />
        </main>
      )}

      {/* VIEW STATE: RESULTS & REVIEW */}
      {viewState === 'results' && testResult && activeExam && (
        <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
          {/* Score Hero Card */}
          <ScoreCard
            exam={activeExam}
            scorePercentage={testResult.scorePercentage}
            isPassed={testResult.isPassed}
            correctCount={testResult.correctCount}
            incorrectCount={testResult.incorrectCount}
            skippedCount={testResult.skippedCount}
            timeTakenSeconds={testResult.timeTakenSeconds}
            onRetakeAll={() => handleStartExam(activeExam)}
            onRetakeMissed={handleRetakeMissed}
            onScrollToReview={() => {
              reviewSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
            }}
            onBackToHome={() => {
              setViewState('dashboard');
              setActiveTab('home');
            }}
          />

          {/* Knowledge Area Breakdown */}
          <DomainReport
            exam={activeExam}
            questions={activeQuestions}
            userAnswers={userAnswers}
          />

          {/* Question-by-Question Review with Explanations */}
          <div ref={reviewSectionRef}>
            <QuestionReview
              questions={activeQuestions}
              userAnswers={userAnswers}
              markedQuestions={markedQuestions}
            />
          </div>
        </main>
      )}

      {/* Footer */}
      {viewState !== 'testing' && (
        <Footer onSelectTab={(tab) => {
          setActiveTab(tab);
          setViewState('dashboard');
        }} />
      )}
    </div>
  );
}

export default App;

