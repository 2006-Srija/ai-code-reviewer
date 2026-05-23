import axios from 'axios';

export async function reviewCode(code, filename = '') {
  console.log('🔍 ULTIMATE SENIOR DEV REVIEW STARTED...');
  const startTime = Date.now();
  
  const ext = filename.split('.').pop();
  const language = getLanguage(ext);

  // Smart truncation - keep most important parts
  const processedCode = smartTruncate(code, language);

  // ULTIMATE SENIOR DEV PROMPT
  const prompt = `You are a **Principal Architect** with 25 years experience at Google/Microsoft/Amazon. 
You have reviewed 50,000+ PRs and can spot issues in milliseconds.

Review this ${language} code with **extreme scrutiny**. Find **everything** a senior dev would find.

## MUST FIND (0-50 seconds):

### 🔒 SECURITY (CRITICAL)
- Hardcoded secrets (API keys, tokens, passwords)
- SQL/NoSQL injection (string concatenation in queries)
- XSS (innerHTML, dangerouslySetInnerHTML)
- Command injection (exec, spawn with user input)
- Path traversal (file operations with user input)
- Insecure deserialization (eval, Function constructor)
- Authentication flaws (JWT verification missing, weak algorithms)
- Authorization issues (missing role checks)
- CSRF missing
- Insecure cookies (no HttpOnly, Secure)
- Prototype pollution (Object.assign with user input)
- Regex DoS (catastrophic backtracking)
- Rate limiting missing
- Security headers missing

### 🐛 BUGS (IMMEDIATE)
- Null/undefined access (no optional chaining)
- Race conditions (shared state without sync)
- Memory leaks (intervals, listeners not cleared)
- Off-by-one errors
- Type coercion (== vs ===)
- Async/await issues (missing await, unhandled promises)
- Infinite loops
- Dead code
- Error handling (swallowed errors, wrong types)
- Floating point precision

### ⚡ PERFORMANCE (AT SCALE)
- N+1 queries (in loops)
- Blocking event loop (sync operations)
- Memory bloat (no cleanup)
- Inefficient algorithms (O(n²))
- No caching where beneficial
- Large payloads (no pagination)
- Connection pool exhaustion

### 🧠 CODE QUALITY
- SOLID violations (single responsibility, open-closed)
- Cyclomatic complexity > 10
- Long functions (> 50 lines)
- Deep nesting (> 3 levels)
- Magic numbers/strings
- Duplicate code (DRY violation)
- No input validation
- Hardcoded config
- Global state pollution

### 🚀 PRODUCTION READINESS
- Graceful shutdown missing
- Health checks missing
- Structured logging missing
- Timeouts missing on external calls
- Retries with backoff missing
- Circuit breakers missing
- Feature flags for gradual rollout
- Distributed tracing missing

### 🏗️ ARCHITECTURE
- Tight coupling (new keyword everywhere)
- Leaky abstractions
- God objects
- Over-engineering
- Missing dependency injection
- Package cycles

## OUTPUT FORMAT (STRICT JSON):

{
  "score": number (0-100, be CRITICAL),
  "security": [
    {
      "line": number,
      "message": "exact issue",
      "severity": "critical|high|medium|low",
      "cwe": "CWE-ID",
      "fix": "exact code to fix"
    }
  ],
  "bugs": [{ "line": number, "message": "", "fix": "" }],
  "performance": [{ "line": number, "message": "", "fix": "" }],
  "quality": [{ "line": number, "message": "", "fix": "" }],
  "production": [{ "line": number, "message": "", "fix": "" }],
  "architecture": [{ "line": number, "message": "", "fix": "" }],
  "suggestions": ["actionable improvement"]
}

**BE BRUTAL**. Score 100 only if truly flawless (rare).
**NO FALLBACK**. This is pure AI. Fail if can't parse.

Code:
${processedCode}
`;

  try {
    // Try multiple models in parallel (first one wins)
    const models = [
      { name: 'qwen2.5-coder:7b', timeout: 45000 },
      { name: 'deepseek-coder:6.7b', timeout: 50000 },
      { name: 'codellama:7b', timeout: 55000 }
    ];

    let response = null;
    let error = null;

    for (const model of models) {
      try {
        console.log(`🔄 Trying model: ${model.name}`);
        response = await axios.post('http://localhost:11434/api/generate', {
          model: model.name,
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.05,      // Very low for consistent results
            num_predict: 6000,       // Enough for full analysis
            top_p: 0.9,
            frequency_penalty: 0.2,
            presence_penalty: 0.2,
            stop: ['\n\n\n']         // Stop at natural breaks
          }
        }, { timeout: model.timeout });

        if (response?.data?.response) break;
      } catch (e) {
        error = e;
        console.log(`⚠️ Model ${model.name} failed, trying next...`);
        continue;
      }
    }

    if (!response) throw error || new Error('All models failed');

    const text = response.data.response;
    console.log(`✅ Analysis complete in ${(Date.now() - startTime) / 1000}s`);

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON in response');
    }

    try {
      const review = JSON.parse(jsonMatch[0]);
      
      // Validate required fields
      if (!review.score) review.score = 50;
      if (!review.security) review.security = [];
      if (!review.bugs) review.bugs = [];
      if (!review.performance) review.performance = [];
      if (!review.quality) review.quality = [];
      if (!review.production) review.production = [];
      if (!review.architecture) review.architecture = [];
      if (!review.suggestions) review.suggestions = [];

      // Cap score
      review.score = Math.min(100, Math.max(0, review.score));
      
      return review;

    } catch (e) {
      console.error('JSON parse error:', e);
      throw new Error('Invalid JSON response');
    }

  } catch (error) {
    console.error('AI Error:', error.message);
    
    // LAST RESORT: Ultra minimal review (only if absolutely necessary)
    return {
      score: 50,
      security: [{
        line: 1,
        message: 'Analysis timed out. Please try again or reduce code size.',
        severity: 'medium',
        cwe: 'N/A',
        fix: 'Split code into smaller files or sections'
      }],
      bugs: [],
      performance: [],
      quality: [],
      production: [],
      architecture: [],
      suggestions: ['Try analyzing smaller code snippets (under 2000 lines)']
    };
  }
}

function smartTruncate(code, language) {
  const MAX_LINES = 500;
  const lines = code.split('\n');
  
  if (lines.length <= MAX_LINES) return code;
  
  // Keep first 250 lines + last 250 lines
  const head = lines.slice(0, 250);
  const tail = lines.slice(-250);
  
  return [
    ...head,
    `\n// ... [${lines.length - 500} lines truncated for performance] ...\n`,
    ...tail
  ].join('\n');
}

function getLanguage(ext) {
  const map = {
    js: 'JavaScript', jsx: 'React', ts: 'TypeScript', tsx: 'React TypeScript',
    py: 'Python', java: 'Java', cpp: 'C++', go: 'Golang', rb: 'Ruby',
    php: 'PHP', html: 'HTML', css: 'CSS', json: 'JSON', yml: 'YAML',
    md: 'Markdown', sql: 'SQL', sh: 'Shell', dockerfile: 'Dockerfile',
    rs: 'Rust', swift: 'Swift', kt: 'Kotlin', scala: 'Scala'
  };
  return map[ext] || 'Unknown';
}