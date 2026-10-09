import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Code, 
  FileJson, 
  Download, 
  Play, 
  Info, 
  Sliders, 
  BookOpen, 
  HelpCircle,
  Cpu,
  Layers
} from 'lucide-react';
import { PROMPT_PRESETS, generatePrompt } from '../data/defaultPrompts';
import { EXAM_JSON_SCHEMA_STRING, SAMPLE_EXAM_JSON } from '../data/jsonSchema';

export function PromptGenerator({ onQuickStartExam }) {
  const [activeTab, setActiveTab] = useState('generator'); // 'generator' | 'schema' | 'sample'
  const [selectedPresetId, setSelectedPresetId] = useState(PROMPT_PRESETS[0].id);
  
  // Customizer state
  const [topic, setTopic] = useState(PROMPT_PRESETS[0].topic);
  const [count, setCount] = useState(PROMPT_PRESETS[0].count);
  const [difficulty, setDifficulty] = useState(PROMPT_PRESETS[0].difficulty);
  const [domains, setDomains] = useState(PROMPT_PRESETS[0].domains);
  const [domainInput, setDomainInput] = useState(PROMPT_PRESETS[0].domains.join('\n'));
  const [durationMinutes, setDurationMinutes] = useState(PROMPT_PRESETS[0].durationMinutes);
  const [passingScore, setPassingScore] = useState(PROMPT_PRESETS[0].passingScore);
  const [includeCode, setIncludeCode] = useState(PROMPT_PRESETS[0].hasCode);
  const [includeMultiSelect, setIncludeMultiSelect] = useState(PROMPT_PRESETS[0].hasMultiSelect);
  const [includeOptionRationales, setIncludeOptionRationales] = useState(true);

  // Copy feedback states
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedSample, setCopiedSample] = useState(false);

  // When preset changes
  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setTopic(preset.topic);
    setCount(preset.count);
    setDifficulty(preset.difficulty);
    setDomains(preset.domains);
    setDomainInput(preset.domains.join('\n'));
    setDurationMinutes(preset.durationMinutes);
    setPassingScore(preset.passingScore);
    setIncludeCode(preset.hasCode);
    setIncludeMultiSelect(preset.hasMultiSelect);
  };

  // Synchronize domains from textarea
  const handleDomainChange = (e) => {
    const val = e.target.value;
    setDomainInput(val);
    const parsed = val.split('\n').map(s => s.trim()).filter(Boolean);
    setDomains(parsed);
  };

  // Generate dynamic prompt
  const generatedPromptText = useMemo(() => {
    return generatePrompt({
      topic,
      count,
      difficulty,
      domains,
      durationMinutes,
      passingScore,
      includeCode,
      includeMultiSelect,
      includeOptionRationales
    });
  }, [topic, count, difficulty, domains, durationMinutes, passingScore, includeCode, includeMultiSelect, includeOptionRationales]);

  const copyToClipboard = (text, setCopiedState) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedState(true);
      setTimeout(() => setCopiedState(false), 2200);
    });
  };

  const handleDownloadSample = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(SAMPLE_EXAM_JSON, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "sample_exam.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-[#d1d7dc] overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#2d2f31] via-[#3a2e5c] to-[#5624d0] text-white p-6 sm:p-8">
        <div className="max-w-4xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-semibold mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>AI Exam Creator Guide</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Generate Authentic Mock Exams with LLMs
          </h2>
          <p className="text-purple-100 text-sm sm:text-base leading-relaxed">
            Copy our optimized prompt with the strict JSON schema below into <strong className="text-white">ChatGPT, Claude, Gemini, or DeepSeek</strong>. Paste the returned JSON right into this platform to practice in a real Udemy test environment!
          </p>
        </div>

        {/* Navigation Tabs inside Generator Card */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-white/10">
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center space-x-2 transition-all ${
              activeTab === 'generator'
                ? 'bg-white text-[#2d2f31] shadow-sm'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#a435f0]" />
            <span>1. Prompt Builder & Presets</span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center space-x-2 transition-all ${
              activeTab === 'schema'
                ? 'bg-white text-[#2d2f31] shadow-sm'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <FileJson className="w-4 h-4 text-emerald-400" />
            <span>2. JSON Schema Specification</span>
          </button>

          <button
            onClick={() => setActiveTab('sample')}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center space-x-2 transition-all ${
              activeTab === 'sample'
                ? 'bg-white text-[#2d2f31] shadow-sm'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Code className="w-4 h-4 text-amber-300" />
            <span>3. Sample JSON Output</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="p-6 sm:p-8">
        {/* TAB 1: PROMPT BUILDER */}
        {activeTab === 'generator' && (
          <div className="space-y-6">
            {/* Quick Presets */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6a6f73] mb-2.5">
                Choose a Ready-Made Certification Preset or Customize:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2.5">
                {PROMPT_PRESETS.map((preset) => {
                  const isSelected = selectedPresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`text-left p-3 rounded-lg border text-xs sm:text-sm transition-all ${
                        isSelected
                          ? 'border-[#a435f0] bg-[#f5eefc] text-[#2d2f31] ring-2 ring-[#a435f0]/30 font-medium'
                          : 'border-[#d1d7dc] hover:border-gray-400 text-gray-700 bg-white'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>{preset.title}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#a435f0]" />}
                      </div>
                      <div className="text-[11px] text-[#6a6f73] mt-1">
                        {preset.count} questions • {preset.difficulty}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Customizer Controls Accordion / Form */}
            <div className="bg-[#f7f9fa] border border-[#d1d7dc] rounded-xl p-4 sm:p-5">
              <div className="flex items-center space-x-2 text-sm font-bold text-[#2d2f31] mb-4">
                <Sliders className="w-4 h-4 text-[#a435f0]" />
                <span>Customize Prompt Parameters</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-semibold text-[#2d2f31] mb-1">
                    Exam / Topic Title
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Docker & Kubernetes CKA"
                    className="w-full px-3 py-2 border border-[#d1d7dc] rounded-md focus:outline-none focus:border-[#a435f0] bg-white text-[#2d2f31]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#2d2f31] mb-1">
                    Number of Questions
                  </label>
                  <select
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#d1d7dc] rounded-md focus:outline-none focus:border-[#a435f0] bg-white text-[#2d2f31]"
                  >
                    <option value={5}>5 Questions (Quick Test)</option>
                    <option value={10}>10 Questions (Recommended for single prompt)</option>
                    <option value={20}>20 Questions</option>
                    <option value={30}>30 Questions</option>
                    <option value={50}>50 Questions (Long Mock)</option>
                    <option value={65}>65 Questions (Full Certification Spec)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#2d2f31] mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-3 py-2 border border-[#d1d7dc] rounded-md focus:outline-none focus:border-[#a435f0] bg-white text-[#2d2f31]"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Intermediate to Advanced">Intermediate to Advanced</option>
                    <option value="Advanced scenario-based">Advanced Scenario-Based</option>
                    <option value="Tricky Exam Trap Questions">Tricky / Trap Questions</option>
                  </select>
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block font-semibold text-[#2d2f31] mb-1">
                    Knowledge Domains / Syllabus Modules (1 per line)
                  </label>
                  <textarea
                    rows={2}
                    value={domainInput}
                    onChange={handleDomainChange}
                    placeholder="Domain 1: Networking\nDomain 2: Security\nDomain 3: Storage"
                    className="w-full px-3 py-2 border border-[#d1d7dc] rounded-md focus:outline-none focus:border-[#a435f0] bg-white text-[#2d2f31] font-mono text-xs"
                  />
                </div>

                <div className="flex flex-wrap gap-5 sm:col-span-2 lg:col-span-3 pt-1">
                  <label className="inline-flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeCode}
                      onChange={(e) => setIncludeCode(e.target.checked)}
                      className="w-4 h-4 text-[#a435f0] rounded focus:ring-[#a435f0]"
                    />
                    <span className="text-xs sm:text-sm font-medium text-[#2d2f31]">
                      Include code snippets / CLI commands
                    </span>
                  </label>

                  <label className="inline-flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeMultiSelect}
                      onChange={(e) => setIncludeMultiSelect(e.target.checked)}
                      className="w-4 h-4 text-[#a435f0] rounded focus:ring-[#a435f0]"
                    />
                    <span className="text-xs sm:text-sm font-medium text-[#2d2f31]">
                      Include Multi-Select Questions ("Select TWO")
                    </span>
                  </label>

                  <label className="inline-flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeOptionRationales}
                      onChange={(e) => setIncludeOptionRationales(e.target.checked)}
                      className="w-4 h-4 text-[#a435f0] rounded focus:ring-[#a435f0]"
                    />
                    <span className="text-xs sm:text-sm font-medium text-[#2d2f31]">
                      Include Option-by-Option Rationales (Why A is right, Why B is wrong)
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Generated Prompt Box with 1-Click Copy */}
            <div className="relative border border-[#d1d7dc] rounded-xl overflow-hidden shadow-xs">
              <div className="bg-[#2d2f31] text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs sm:text-sm font-semibold">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Ready-to-Use LLM Prompt for: <span className="text-purple-300">{topic}</span></span>
                </div>

                <button
                  type="button"
                  onClick={() => copyToClipboard(generatedPromptText, setCopiedPrompt)}
                  className={`inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-md text-xs sm:text-sm font-bold transition-all shadow-sm ${
                    copiedPrompt
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#a435f0] hover:bg-[#8710d8] text-white'
                  }`}
                >
                  {copiedPrompt ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Full Prompt</span>
                    </>
                  )}
                </button>
              </div>

              {/* Prompt Text Preview */}
              <div className="bg-[#1e1e1e] p-4 text-xs font-mono text-gray-200 overflow-x-auto max-h-96 leading-relaxed whitespace-pre-wrap select-all">
                {generatedPromptText}
              </div>

              <div className="bg-[#f7f9fa] border-t border-[#d1d7dc] px-4 py-3 text-xs text-[#6a6f73] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="flex items-center space-x-1.5">
                  <Info className="w-4 h-4 text-[#a435f0] shrink-0" />
                  <span>
                    <strong>How to use:</strong> Click <strong>Copy Full Prompt</strong>, paste into ChatGPT (GPT-4o), Claude 3.5 Sonnet, Gemini 2.0, or DeepSeek, then copy the generated JSON and paste it into the <strong>Upload JSON</strong> tab!
                  </span>
                </span>
                <span className="text-emerald-700 font-semibold shrink-0">
                  ✓ Validated for all modern LLMs
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: JSON SCHEMA SPECIFICATION */}
        {activeTab === 'schema' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-[#2d2f31]">
                  Official JSON Schema Specification
                </h3>
                <p className="text-xs sm:text-sm text-[#6a6f73]">
                  Format requirements for practice exam files compatible with this platform.
                </p>
              </div>

              <button
                type="button"
                onClick={() => copyToClipboard(EXAM_JSON_SCHEMA_STRING, setCopiedSchema)}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all ${
                  copiedSchema
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#2d2f31] hover:bg-black text-white'
                }`}
              >
                {copiedSchema ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSchema ? 'Copied Schema!' : 'Copy JSON Schema'}</span>
              </button>
            </div>

            {/* Field Dictionary Table */}
            <div className="border border-[#d1d7dc] rounded-lg overflow-x-auto text-xs sm:text-sm">
              <table className="min-w-full divide-y divide-[#d1d7dc]">
                <thead className="bg-[#f7f9fa] text-left font-bold text-[#2d2f31]">
                  <tr>
                    <th className="py-2.5 px-3.5">Property</th>
                    <th className="py-2.5 px-3.5">Type</th>
                    <th className="py-2.5 px-3.5">Required?</th>
                    <th className="py-2.5 px-3.5">Description & Examples</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d1d7dc] text-[#2d2f31]">
                  <tr>
                    <td className="py-2.5 px-3.5 font-mono text-[#a435f0] font-bold">title</td>
                    <td className="py-2.5 px-3.5 text-gray-500">string</td>
                    <td className="py-2.5 px-3.5 font-semibold text-emerald-700">Yes</td>
                    <td className="py-2.5 px-3.5">Exam title, e.g. "AWS SAA-C03 Practice Test 1"</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 font-mono text-[#a435f0] font-bold">durationMinutes</td>
                    <td className="py-2.5 px-3.5 text-gray-500">integer</td>
                    <td className="py-2.5 px-3.5 text-gray-400">Optional</td>
                    <td className="py-2.5 px-3.5">Timer duration in minutes (default calculated from question count)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 font-mono text-[#a435f0] font-bold">passingScore</td>
                    <td className="py-2.5 px-3.5 text-gray-500">integer</td>
                    <td className="py-2.5 px-3.5 text-gray-400">Optional</td>
                    <td className="py-2.5 px-3.5">Percentage required to pass (e.g. 72 for 72%)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 font-mono text-[#a435f0] font-bold">domains</td>
                    <td className="py-2.5 px-3.5 text-gray-500">string[]</td>
                    <td className="py-2.5 px-3.5 text-gray-400">Optional</td>
                    <td className="py-2.5 px-3.5">List of syllabus knowledge areas for progress breakdown</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 font-mono text-[#a435f0] font-bold">questions[].question</td>
                    <td className="py-2.5 px-3.5 text-gray-500">string</td>
                    <td className="py-2.5 px-3.5 font-semibold text-emerald-700">Yes</td>
                    <td className="py-2.5 px-3.5">The question or scenario. Supports markdown, bold, code blocks.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 font-mono text-[#a435f0] font-bold">questions[].codeSnippet</td>
                    <td className="py-2.5 px-3.5 text-gray-500">string</td>
                    <td className="py-2.5 px-3.5 text-gray-400">Optional</td>
                    <td className="py-2.5 px-3.5">Optional code snippet, JSON, YAML, or CLI commands</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 font-mono text-[#a435f0] font-bold">questions[].type</td>
                    <td className="py-2.5 px-3.5 text-gray-500">string</td>
                    <td className="py-2.5 px-3.5 text-gray-400">Optional</td>
                    <td className="py-2.5 px-3.5"><code className="font-mono text-xs bg-gray-100 px-1">"single"</code> (radio) or <code className="font-mono text-xs bg-gray-100 px-1">"multiple"</code> (checkboxes)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 font-mono text-[#a435f0] font-bold">questions[].options</td>
                    <td className="py-2.5 px-3.5 text-gray-500">string[]</td>
                    <td className="py-2.5 px-3.5 font-semibold text-emerald-700">Yes</td>
                    <td className="py-2.5 px-3.5">Array of choices (e.g. 4 strings for A, B, C, D)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 font-mono text-[#a435f0] font-bold">questions[].correctAnswer</td>
                    <td className="py-2.5 px-3.5 text-gray-500">int | int[]</td>
                    <td className="py-2.5 px-3.5 font-semibold text-emerald-700">Yes</td>
                    <td className="py-2.5 px-3.5">0-based index: 0 for A, 1 for B. For multiple, array like [0, 2] for A and C.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 font-mono text-[#a435f0] font-bold">questions[].explanation</td>
                    <td className="py-2.5 px-3.5 text-gray-500">string</td>
                    <td className="py-2.5 px-3.5 font-semibold text-emerald-700">Yes</td>
                    <td className="py-2.5 px-3.5">In-depth rationale showing why the answer is correct</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 font-mono text-[#a435f0] font-bold">questions[].optionRationales</td>
                    <td className="py-2.5 px-3.5 text-gray-500">object</td>
                    <td className="py-2.5 px-3.5 text-gray-400">Optional</td>
                    <td className="py-2.5 px-3.5">Per-option rationale: {`{ "A": "Why A is right...", "B": "Why B is wrong..." }`}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Schema Raw Code */}
            <div className="rounded-lg overflow-hidden border border-[#d1d7dc]">
              <div className="bg-[#2d2f31] text-xs font-mono text-gray-300 px-4 py-2 flex justify-between items-center">
                <span>JSON Schema (Draft-2020-12)</span>
              </div>
              <pre className="bg-[#1e1e1e] p-4 text-xs font-mono text-purple-300 overflow-x-auto max-h-80 leading-relaxed">
                {EXAM_JSON_SCHEMA_STRING}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 3: SAMPLE JSON */}
        {activeTab === 'sample' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-[#2d2f31]">
                  Complete Sample Exam JSON
                </h3>
                <p className="text-xs sm:text-sm text-[#6a6f73]">
                  Ready-to-use exam JSON file containing scenario questions, multiple select, and domain breakdowns.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleDownloadSample}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold border border-[#d1d7dc] text-[#2d2f31] hover:bg-gray-100 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .json</span>
                </button>

                <button
                  type="button"
                  onClick={() => copyToClipboard(JSON.stringify(SAMPLE_EXAM_JSON, null, 2), setCopiedSample)}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all ${
                    copiedSample
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#2d2f31] hover:bg-black text-white'
                  }`}
                >
                  {copiedSample ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSample ? 'Copied!' : 'Copy Sample JSON'}</span>
                </button>

                {onQuickStartExam && (
                  <button
                    type="button"
                    onClick={() => onQuickStartExam(SAMPLE_EXAM_JSON)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-bold bg-[#a435f0] hover:bg-[#8710d8] text-white shadow-sm transition-colors"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Practice This Sample</span>
                  </button>
                )}
              </div>
            </div>

            <div className="rounded-lg overflow-hidden border border-[#d1d7dc]">
              <div className="bg-[#2d2f31] text-xs font-mono text-gray-300 px-4 py-2 flex justify-between items-center">
                <span>sample_exam.json</span>
                <span className="text-emerald-400">Valid Schema</span>
              </div>
              <pre className="bg-[#1e1e1e] p-4 text-xs font-mono text-emerald-300 overflow-x-auto max-h-96 leading-relaxed">
                {JSON.stringify(SAMPLE_EXAM_JSON, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
