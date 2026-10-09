// Storage utility to manage exams, custom uploads, and test attempts in localStorage
import { SAMPLE_EXAMS } from '../data/sampleExams';

const STORAGE_KEYS = {
  CUSTOM_EXAMS: 'udemy_mock_custom_exams',
  ATTEMPTS: 'udemy_mock_attempts',
  SETTINGS: 'udemy_mock_settings'
};

export function getCustomExams() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_EXAMS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load custom exams from localStorage', e);
    return [];
  }
}

export function getAllExams() {
  const custom = getCustomExams();
  // Return built-in sample exams first, then any custom user exams
  return [...SAMPLE_EXAMS, ...custom];
}

export function getExamById(id) {
  const all = getAllExams();
  return all.find(e => String(e.id) === String(id)) || null;
}

export function saveCustomExam(examData) {
  const current = getCustomExams();
  // Check if exists already by id
  const existingIdx = current.findIndex(e => String(e.id) === String(examData.id));
  let updated;
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = examData;
  } else {
    updated = [examData, ...current];
  }

  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_EXAMS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save custom exam', e);
  }
  return updated;
}

export function deleteCustomExam(id) {
  const current = getCustomExams();
  const updated = current.filter(e => String(e.id) !== String(id));
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_EXAMS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete custom exam', e);
  }
  return updated;
}

export function saveExamAttempt(attempt) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
    const attempts = raw ? JSON.parse(raw) : [];
    attempts.unshift({
      ...attempt,
      id: `attempt-${Date.now()}`,
      timestamp: new Date().toISOString()
    });
    // Keep max 50 attempts
    if (attempts.length > 50) attempts.length = 50;
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));
  } catch (e) {
    console.error('Failed to save exam attempt', e);
  }
}

export function getExamAttempts(examId) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
    if (!raw) return [];
    const all = JSON.parse(raw);
    if (!examId) return all;
    return all.filter(a => String(a.examId) === String(examId));
  } catch (e) {
    return [];
  }
}

export function getBestScoreForExam(examId) {
  const attempts = getExamAttempts(examId);
  if (!attempts || attempts.length === 0) return null;
  return Math.max(...attempts.map(a => a.scorePercentage));
}

export function exportExamAsJson(exam) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exam, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  const filename = `${(exam.title || 'mock-exam').toLowerCase().replace(/[^a-z0-9]/gi, '_')}.json`;
  downloadAnchor.setAttribute("download", filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
