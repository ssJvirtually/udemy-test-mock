// Default Prompts and Prompt Generator for LLMs (ChatGPT, Claude, Gemini, DeepSeek, etc.)

export const PROMPT_PRESETS = [
  {
    id: "aws-saa",
    title: "AWS Certified Solutions Architect (SAA-C03)",
    topic: "AWS Certified Solutions Architect Associate (SAA-C03)",
    count: 10,
    difficulty: "Advanced scenario-based",
    domains: [
      "Design Secure Architectures",
      "Design Resilient Architectures",
      "Design High-Performing Architectures",
      "Design Cost-Optimized Architectures"
    ],
    durationMinutes: 30,
    passingScore: 72,
    hasCode: false,
    hasMultiSelect: true
  },
  {
    id: "gcp-pca",
    title: "Google Cloud Professional Cloud Architect (GCP PCA)",
    topic: "Google Cloud Certified Professional Cloud Architect (GCP PCA)",
    count: 10,
    difficulty: "Advanced scenario-based",
    domains: [
      "Section 1: Designing and planning a cloud solution architecture",
      "Section 2: Managing and provisioning a solution infrastructure",
      "Section 3: Designing for security and compliance",
      "Section 4: Analyzing and optimizing technical and business processes",
      "Section 5: Managing implementations of cloud architecture",
      "Section 6: Ensuring solution and operations reliability"
    ],
    durationMinutes: 30,
    passingScore: 75,
    hasCode: false,
    hasMultiSelect: true
  },
  {
    id: "react-frontend",
    title: "Modern React & Frontend Engineering",
    topic: "React 19, TypeScript, State Management, Performance, and Web Architecture",
    count: 10,
    difficulty: "Intermediate to Advanced",
    domains: [
      "React Core & Hooks",
      "State Management & Data Fetching",
      "Performance Optimization & Rendering",
      "TypeScript & Component Patterns"
    ],
    durationMinutes: 25,
    passingScore: 75,
    hasCode: true,
    hasMultiSelect: true
  },
  {
    id: "python-backend",
    title: "Python 3 & Backend System Design",
    topic: "Python 3 Advanced Concepts, AsyncIO, OOP, Data Structures & REST APIs",
    count: 10,
    difficulty: "Intermediate",
    domains: [
      "Language Internals & Generators",
      "Concurrency & AsyncIO",
      "Object-Oriented Design & Clean Code",
      "API & Database Performance"
    ],
    durationMinutes: 25,
    passingScore: 70,
    hasCode: true,
    hasMultiSelect: false
  },
  {
    id: "pmp-exam",
    title: "PMP (Project Management Professional)",
    topic: "Project Management Professional (PMP) Exam Practice Questions",
    count: 10,
    difficulty: "Advanced scenario-based",
    domains: [
      "People (Team & Leadership)",
      "Process (Predictive & Agile Methodologies)",
      "Business Environment"
    ],
    durationMinutes: 30,
    passingScore: 75,
    hasCode: false,
    hasMultiSelect: true
  }
];

export function generatePrompt({
  topic = "AWS Certified Solutions Architect",
  count = 10,
  difficulty = "Intermediate to Advanced",
  domains = [],
  durationMinutes = 30,
  passingScore = 72,
  includeCode = true,
  includeMultiSelect = true,
  includeOptionRationales = true,
  outputMode = "file" // 'file' (downloadable .json) | 'chat' (raw json text) | 'python' (local script)
}) {
  const domainText = domains && domains.length > 0
    ? `Knowledge domains to cover:\n${domains.map(d => `- ${d}`).join('\n')}`
    : `Cover all core real-world syllabus domains for ${topic}.`;

  const codeInstruction = includeCode
    ? "- Include relevant code snippets or CLI configurations in the 'codeSnippet' field where appropriate."
    : "- Focus primarily on realistic scenarios, architectural problems, and practical questions.";

  const multiInstruction = includeMultiSelect
    ? "- Include a mix of single-choice questions ('type': 'single') and multiple-choice questions ('type': 'multiple', where correctAnswer is an array of indices e.g. [0, 2] and prompt says '(Select TWO)' or '(Select THREE)')."
    : "- Use single-choice questions ('type': 'single', with a single numeric 0-based index for correctAnswer).";

  const rationaleInstruction = includeOptionRationales
    ? `- Provide in 'optionRationales' a key for each option explaining why that specific choice is correct or incorrect (e.g. { "A": "Why A is right/wrong...", "B": "Why B is right/wrong..." }).`
    : "";

  const safeFileName = `${topic.toLowerCase().replace(/[^a-z0-9]/g, '_')}_exam`;

  // MODE 1: FILE GENERATION PROMPT (Prevents browser hangup on 50-65 questions)
  if (outputMode === "file") {
    return `You are an expert exam author who designs authentic, high-yield practice exams in the style of Udemy mock tests for "${topic}".

Please generate an authentic, full-length practice exam containing EXACTLY ${count} questions with detailed explanations.

🚨 CRITICAL: BROWSER FREEZE & TOKEN LIMIT PREVENTION (FILE GENERATION REQUIRED) 🚨
Because generating a comprehensive exam with ${count} questions, multiple choices, and in-depth rationales produces tens of thousands of tokens that WILL HANG OR CRASH THE USER'S BROWSER TAB if streamed directly into the chat:

👉 DO NOT stream this massive JSON text directly in the chat window!
👉 INSTEAD, use your Python code interpreter / environment (or Claude Artifact / file attachment tool) to generate and save the file directly:

1. Create a script or internal object containing all ${count} questions according to the schema below.
2. Save it directly to a downloadable file named:
   \`${safeFileName}.json\`
   Example Python pattern:
   \`\`\`python
   import json

   exam_data = {
       "title": "${topic} Mock Practice Exam",
       "description": "Comprehensive practice exam covering high-frequency exam topics, tricky scenarios, and conceptual challenges.",
       "durationMinutes": ${durationMinutes},
       "passingScore": ${passingScore},
       "category": "${topic}",
       "domains": [
${domains.length > 0 ? domains.map(d => `           "${d}"`).join(',\n') : '           "Core Concepts",\n           "Advanced Scenarios"'}
       ],
       "questions": [
           # Populate all ${count} questions here
       ]
   }

   with open('${safeFileName}.json', 'w', encoding='utf-8') as f:
       json.dump(exam_data, f, indent=2, ensure_ascii=False)
   \`\`\`
3. Output a direct 1-click download link / file attachment for \`${safeFileName}.json\` so I can download it immediately and upload it to the practice simulator.
4. If you are Claude, output the JSON in a downloadable Artifact named \`${safeFileName}.json\`.

Schema Requirements for Every Question in the Array:
- "id": integer 1 to ${count}
- "domain": string matching one of the syllabus domains
- "difficulty": "${difficulty}"
- "type": "single" or "multiple"
- "question": "Clear, realistic scenario stem."
- "codeSnippet": "Optional snippet if applicable"
- "options": Array of 4 strings for single choice, or 5 strings for multiple-choice
- "correctAnswer": 0-based integer (0 = A, 1 = B) for "single", or array of 0-based integers (e.g. [0, 2] for A and C) for "multiple"
- "explanation": "Detailed conceptual explanation."
- "optionRationales": { "A": "Why A is correct/incorrect...", "B": "Why B is correct/incorrect...", "C": "...", "D": "..." }
- "referenceUrl": "https://..."

Exam Quality Requirements:
1. Difficulty Level: ${difficulty}. High-yield, scenario-driven questions.
2. ${domainText}
3. ${codeInstruction}
4. ${multiInstruction}
5. ${rationaleInstruction}
6. Provide the download link to \`${safeFileName}.json\` as your primary output.`;
  }

  // MODE 2: PYTHON GENERATOR SCRIPT
  if (outputMode === "python") {
    return `Write a self-contained Python script named \`generate_exam.py\` that creates a complete Udemy-style mock exam with EXACTLY ${count} questions for "${topic}" and saves it to \`${safeFileName}.json\`.

The script must define all ${count} questions with full scenario stems, options, and explanations, and execute:
\`\`\`python
import json

exam = {
  "title": "${topic} Mock Practice Exam",
  "description": "Comprehensive practice exam covering high-frequency exam topics.",
  "durationMinutes": ${durationMinutes},
  "passingScore": ${passingScore},
  "category": "${topic}",
  "domains": [
${domains.length > 0 ? domains.map(d => `    "${d}"`).join(',\n') : '    "Core Concepts"'}
  ],
  "questions": [
    # All ${count} questions here
  ]
}

with open('${safeFileName}.json', 'w', encoding='utf-8') as f:
    json.dump(exam, f, indent=2, ensure_ascii=False)

print("Saved exam to ${safeFileName}.json successfully!")
\`\`\`

Requirements for Quality:
1. Difficulty: ${difficulty}.
2. ${domainText}
3. ${codeInstruction}
4. ${multiInstruction}
5. ${rationaleInstruction}
6. Make sure all ${count} questions are fully written out (no placeholders like '... add more here').`;
  }

  // MODE 3: DIRECT RAW JSON IN CHAT (Best for <= 15 questions)
  return `You are an expert exam author who designs authentic, high-yield practice exams in the style of Udemy mock tests for "${topic}".

Please generate a high-quality practice exam containing EXACTLY ${count} questions with detailed explanations.

Strictly adhere to the following JSON schema and return ONLY valid, raw JSON (no markdown formatting, no backticks, no explanations outside the JSON block):

\`\`\`json
{
  "title": "${topic} Mock Practice Exam",
  "description": "Comprehensive practice exam covering high-frequency exam topics, tricky scenarios, and conceptual challenges.",
  "durationMinutes": ${durationMinutes},
  "passingScore": ${passingScore},
  "category": "${topic}",
  "domains": [
${domains.length > 0 ? domains.map(d => `    "${d}"`).join(',\n') : '    "Core Concepts",\n    "Advanced Scenarios"'}
  ],
  "questions": [
    {
      "id": 1,
      "domain": "Domain Name Here",
      "difficulty": "${difficulty}",
      "type": "single",
      "question": "Scenario or question text. Clear, unambiguous, professional phrasing.",
      "codeSnippet": "",
      "options": [
        "First option choice text",
        "Second option choice text",
        "Third option choice text",
        "Fourth option choice text"
      ],
      "correctAnswer": 0,
      "explanation": "Detailed explanation explaining the concept, why the chosen option is correct, and why other options are suboptimal.",
      "optionRationales": {
        "A": "Why option A is correct...",
        "B": "Why option B is incorrect...",
        "C": "Why option C is incorrect...",
        "D": "Why option D is incorrect..."
      },
      "referenceUrl": "https://..."
    }
  ]
}
\`\`\`

Requirements for Quality:
1. Difficulty Level: ${difficulty}. Questions should be realistic, scenario-driven, and test deep understanding rather than pure trivia.
2. ${domainText}
3. ${codeInstruction}
4. ${multiInstruction}
5. ${rationaleInstruction}
6. IMPORTANT: For 'correctAnswer':
   - For 'type': 'single', 'correctAnswer' MUST be a 0-based integer (0 = A, 1 = B, 2 = C, 3 = D).
   - For 'type': 'multiple', 'correctAnswer' MUST be an array of 0-based integers (e.g. [0, 2] for options A and C).
7. Ensure exactly 4 options for single choice, and 5 options for multiple-choice questions.
8. Output ONLY pure valid JSON.`;
}
