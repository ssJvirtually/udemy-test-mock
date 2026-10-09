// JSON Schema and Specification for Udemy-style Mock Exams

export const EXAM_JSON_SCHEMA_STRING = `{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "UdemyMockExam",
  "type": "object",
  "required": ["title", "questions"],
  "properties": {
    "title": {
      "type": "string",
      "description": "Title of the practice exam"
    },
    "description": {
      "type": "string",
      "description": "Brief description of the exam scope and syllabus"
    },
    "durationMinutes": {
      "type": "integer",
      "description": "Total duration in minutes (e.g. 60, 90, 130)",
      "default": 65
    },
    "passingScore": {
      "type": "integer",
      "description": "Passing grade percentage (e.g. 70, 72, 80)",
      "default": 72
    },
    "category": {
      "type": "string",
      "description": "Category or topic (e.g. Cloud Certification, Software Engineering)"
    },
    "domains": {
      "type": "array",
      "description": "List of knowledge domains or topics covered",
      "items": { "type": "string" }
    },
    "questions": {
      "type": "array",
      "description": "List of exam questions",
      "items": {
        "type": "object",
        "required": ["id", "question", "options", "correctAnswer", "explanation"],
        "properties": {
          "id": {
            "type": ["integer", "string"],
            "description": "Unique identifier for question"
          },
          "domain": {
            "type": "string",
            "description": "Knowledge domain or topic category for this question"
          },
          "difficulty": {
            "type": "string",
            "enum": ["Beginner", "Intermediate", "Advanced", "Hard"],
            "default": "Intermediate"
          },
          "question": {
            "type": "string",
            "description": "Question text or scenario. Supports markdown, code blocks, bold text."
          },
          "codeSnippet": {
            "type": "string",
            "description": "Optional snippet of code, configuration, or terminal command"
          },
          "type": {
            "type": "string",
            "enum": ["single", "multiple"],
            "description": "'single' for 1 correct answer (radio), 'multiple' for multi-select (checkboxes)"
          },
          "options": {
            "type": "array",
            "description": "Array of 4-6 choices",
            "items": { "type": "string" }
          },
          "correctAnswer": {
            "type": ["integer", "array"],
            "description": "0-based index of correct option for 'single' (e.g. 0 for A), or array of 0-based indices for 'multiple' (e.g. [0, 2] for A and C)"
          },
          "explanation": {
            "type": "string",
            "description": "Comprehensive explanation of why the correct answer is right and why others are wrong."
          },
          "optionRationales": {
            "type": "object",
            "description": "Optional breakdown for each option (e.g. { 'A': 'Correct because...', 'B': 'Incorrect because...' })"
          },
          "referenceUrl": {
            "type": "string",
            "description": "Optional documentation or reference link"
          }
        }
      }
    }
  }
}`;

export const SAMPLE_EXAM_JSON = {
  title: "AWS Solutions Architect Practice Exam",
  description: "High-yield scenario questions modeled after the SAA-C03 certification.",
  durationMinutes: 45,
  passingScore: 72,
  category: "Cloud Computing",
  domains: [
    "Domain 1: Design Secure Architectures",
    "Domain 2: Design Resilient Architectures",
    "Domain 3: Design High-Performing Architectures",
    "Domain 4: Design Cost-Optimized Architectures"
  ],
  questions: [
    {
      id: 1,
      domain: "Domain 2: Design Resilient Architectures",
      difficulty: "Intermediate",
      type: "single",
      question: "A company runs a stateless web application on Amazon EC2 instances behind an Application Load Balancer (ALB). Traffic spikes unpredictably during marketing campaigns. Which architecture provides the most cost-effective auto-scaling capability with zero downtime?",
      options: [
        "Attach an Auto Scaling group to the ALB with a Target Tracking scaling policy based on average CPU utilization.",
        "Manually increase EC2 instance sizes to high-memory instances before every marketing campaign.",
        "Configure an ALB with a single large EC2 instance and enable Multi-AZ failover.",
        "Deploy the application onto Amazon S3 static website hosting with CloudFront."
      ],
      correctAnswer: 0,
      explanation: "Using an Auto Scaling group attached to an Application Load Balancer with a Target Tracking policy allows EC2 capacity to dynamically expand and shrink based on metrics like CPU utilization or request count per target. This ensures high availability during traffic surges while minimizing costs during low periods.",
      optionRationales: {
        "A": "Correct: Target tracking automatically scales in and out based on demand with zero downtime.",
        "B": "Incorrect: Manual scaling is prone to human error, cannot respond to unpredictable spikes, and wastes cost.",
        "C": "Incorrect: A single EC2 instance is a single point of failure and does not provide elastic scalability.",
        "D": "Incorrect: A stateless web application on EC2 implies server-side execution, which Amazon S3 static hosting cannot execute."
      },
      referenceUrl: "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-target-tracking.html"
    },
    {
      id: 2,
      domain: "Domain 1: Design Secure Architectures",
      difficulty: "Advanced",
      type: "multiple",
      question: "A financial organization needs to securely store sensitive customer records in Amazon S3. Regulatory compliance mandates that data must be encrypted at rest with keys managed in a hardware security module (HSM) where key access is strictly audited, and no unencrypted HTTP traffic can reach the bucket. Which TWO actions should the architect implement? (Select TWO)",
      options: [
        "Use Server-Side Encryption with AWS KMS keys stored in AWS CloudHSM or AWS KMS (SSE-KMS / AWS KMS custom key store).",
        "Add an S3 Bucket Policy with a Deny statement on Condition {'Bool': {'aws:SecureTransport': 'false'}}.",
        "Enable Server-Side Encryption with Amazon S3-Managed Keys (SSE-S3).",
        "Configure Amazon Macie to automatically encrypt incoming objects using default AES-256.",
        "Enable S3 Transfer Acceleration on the bucket with default encryption."
      ],
      correctAnswer: [0, 1],
      explanation: "Requirement 1 asks for encryption with keys in an audited HSM (satisfied by SSE-KMS with CloudHSM or KMS with customer managed keys). Requirement 2 mandates no unencrypted HTTP traffic, which is enforced via an S3 bucket policy denying requests where aws:SecureTransport is false (enforcing HTTPS only).",
      optionRationales: {
        "A": "Correct: SSE-KMS / Custom Key Store backed by CloudHSM meets HSM regulatory compliance with full CloudTrail audit logging.",
        "B": "Correct: Enforcing aws:SecureTransport: false blocks plain HTTP requests and forces SSL/TLS.",
        "C": "Incorrect: SSE-S3 uses keys managed entirely by AWS, not customer-audited HSM keys.",
        "D": "Incorrect: Macie is a data security and privacy service, not an automatic encryption engine.",
        "E": "Incorrect: S3 Transfer Acceleration speeds up transfers over CloudFront edge locations but does not enforce HTTPS or HSM encryption."
      },
      referenceUrl: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html"
    }
  ]
};
