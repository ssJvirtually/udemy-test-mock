// Intelligent JSON validator and sanitizer for LLM-generated exam files

/**
 * Strips code fences (e.g. ```json ... ```) or conversational markdown that LLMs might include
 */
export function cleanRawJsonString(input) {
  if (typeof input !== 'string') return input;
  let str = input.trim();

  // If it starts with markdown code fence
  if (str.startsWith('```')) {
    str = str.replace(/^```(?:json)?\s*/i, '');
    str = str.replace(/\s*```$/, '');
  }

  // Find the first '{' and the last '}' in case LLM added greetings or notes
  const firstBrace = str.indexOf('{');
  const lastBrace = str.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    str = str.substring(firstBrace, lastBrace + 1);
  }

  return str.trim();
}

/**
 * Validates and normalizes exam data from LLM
 */
export function validateAndNormalizeExam(rawInput) {
  let data;
  if (typeof rawInput === 'string') {
    const cleaned = cleanRawJsonString(rawInput);
    try {
      data = JSON.parse(cleaned);
    } catch (err) {
      return {
        valid: false,
        error: `JSON Syntax Error: ${err.message}. Please check for trailing commas or unescaped quotes.`,
        data: null
      };
    }
  } else if (typeof rawInput === 'object' && rawInput !== null) {
    data = rawInput;
  } else {
    return {
      valid: false,
      error: 'Invalid input format. Expected a JSON string or object.',
      data: null
    };
  }

  // Basic structure check
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Exam data must be a JSON object with title and questions.', data: null };
  }

  if (!data.title || typeof data.title !== 'string') {
    data.title = 'Practice Mock Exam';
  }

  if (!Array.isArray(data.questions) || data.questions.length === 0) {
    return {
      valid: false,
      error: "Exam must contain a 'questions' array with at least one question.",
      data: null
    };
  }

  const warnings = [];
  const normalizedQuestions = [];
  const detectedDomains = new Set(data.domains || []);

  for (let i = 0; i < data.questions.length; i++) {
    const q = data.questions[i];
    const qNum = i + 1;

    if (!q || typeof q !== 'object') {
      return {
        valid: false,
        error: `Question #${qNum} is not a valid object.`,
        data: null
      };
    }

    if (!q.question || typeof q.question !== 'string' || q.question.trim().length === 0) {
      return {
        valid: false,
        error: `Question #${qNum} is missing the 'question' text.`,
        data: null
      };
    }

    if (!Array.isArray(q.options) || q.options.length < 2) {
      return {
        valid: false,
        error: `Question #${qNum} must have an 'options' array with at least 2 choices.`,
        data: null
      };
    }

    // Clean options: if items are objects like { text: '...' } or strings
    const cleanOptions = q.options.map(opt => {
      if (typeof opt === 'string') return opt.trim();
      if (typeof opt === 'object' && opt !== null && opt.text) return String(opt.text).trim();
      return String(opt).trim();
    });

    // Detect type
    let qType = q.type;
    if (!qType) {
      qType = Array.isArray(q.correctAnswer) && q.correctAnswer.length > 1 ? 'multiple' : 'single';
    }

    // Smart tolerance for correctAnswer:
    // Support: 0-based integer (0), letter ('A' or 'a'), or 1-based index (if LLM did 1-4)
    let normalizedAnswer = q.correctAnswer;

    if (qType === 'single') {
      if (typeof normalizedAnswer === 'string') {
        const letter = normalizedAnswer.trim().toUpperCase();
        if (/^[A-Z]$/.test(letter)) {
          normalizedAnswer = letter.charCodeAt(0) - 65; // A -> 0, B -> 1
        } else {
          normalizedAnswer = parseInt(letter, 10);
        }
      }
      if (typeof normalizedAnswer !== 'number' || isNaN(normalizedAnswer)) {
        normalizedAnswer = 0;
        warnings.push(`Question #${qNum} had invalid correctAnswer; defaulted to first option.`);
      }
      if (normalizedAnswer < 0 || normalizedAnswer >= cleanOptions.length) {
        // Check if 1-based (e.g. 1 to 4 instead of 0 to 3)
        if (normalizedAnswer === cleanOptions.length) {
          normalizedAnswer = normalizedAnswer - 1;
        } else {
          normalizedAnswer = 0;
        }
      }
    } else {
      // Multiple selection
      if (!Array.isArray(normalizedAnswer)) {
        if (typeof normalizedAnswer === 'number') {
          normalizedAnswer = [normalizedAnswer];
        } else if (typeof normalizedAnswer === 'string') {
          // e.g. "A, C" or "0, 2"
          const parts = normalizedAnswer.split(/[,&]/).map(s => s.trim().toUpperCase());
          normalizedAnswer = parts.map(p => {
            if (/^[A-Z]$/.test(p)) return p.charCodeAt(0) - 65;
            return parseInt(p, 10);
          }).filter(n => !isNaN(n) && n >= 0 && n < cleanOptions.length);
        } else {
          normalizedAnswer = [0];
        }
      } else {
        // Array of values
        normalizedAnswer = normalizedAnswer.map(ans => {
          if (typeof ans === 'string') {
            const letter = ans.trim().toUpperCase();
            if (/^[A-Z]$/.test(letter)) return letter.charCodeAt(0) - 65;
            return parseInt(ans, 10);
          }
          return ans;
        }).filter(n => typeof n === 'number' && !isNaN(n) && n >= 0 && n < cleanOptions.length);
      }

      if (normalizedAnswer.length === 0) {
        normalizedAnswer = [0];
        warnings.push(`Question #${qNum} had empty multiple correctAnswer; defaulted to [0].`);
      }
    }

    const domain = q.domain || data.category || 'General';
    detectedDomains.add(domain);

    normalizedQuestions.push({
      id: q.id !== undefined ? q.id : qNum,
      domain: domain,
      difficulty: q.difficulty || 'Intermediate',
      type: qType,
      question: q.question.trim(),
      codeSnippet: q.codeSnippet || '',
      options: cleanOptions,
      correctAnswer: normalizedAnswer,
      explanation: q.explanation ? q.explanation.trim() : 'No explanation provided for this question.',
      optionRationales: q.optionRationales || null,
      referenceUrl: q.referenceUrl || ''
    });
  }

  const durationMinutes = Number(data.durationMinutes) || Math.max(10, Math.round(normalizedQuestions.length * 1.5));
  const passingScore = Number(data.passingScore) || 72;

  const normalizedExam = {
    id: data.id || `custom-exam-${Date.now()}`,
    title: data.title.trim(),
    description: data.description ? data.description.trim() : 'AI-generated mock exam for practice.',
    category: data.category || 'General Practice',
    durationMinutes: durationMinutes,
    passingScore: passingScore,
    domains: Array.from(detectedDomains),
    questions: normalizedQuestions,
    createdAt: data.createdAt || new Date().toISOString()
  };

  return {
    valid: true,
    warnings: warnings,
    data: normalizedExam
  };
}
