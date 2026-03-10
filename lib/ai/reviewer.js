import axios from 'axios';

export async function reviewCode(code, filename = '') {
  console.log('🔍 Analyzing code with enhanced AI...');
  
  // Try AI first
  try {
    const aiReview = await getAIReview(code);
    if (aiReview && (aiReview.bugs?.length || aiReview.security?.length)) {
      console.log('✅ AI analysis successful');
      return validateReview(aiReview);
    }
  } catch (e) {
    console.log('⚠️ AI failed, using fallback');
  }
  
  // Fallback with comprehensive checks
  return enhancedAnalysis(code);
}

async function getAIReview(code) {
  const prompt = `You are a senior security expert and code reviewer. Analyze this code and find ALL issues including:

1. SECURITY VULNERABILITIES (CRITICAL):
   - SQL injection (string concatenation in queries)
   - Cross-site scripting (XSS) - innerHTML with user input
   - eval() usage
   - Prototype pollution
   - Insecure random number generation

2. BUGS:
   - Race conditions
   - Memory leaks (setInterval without cleanup)
   - Null pointer exceptions
   - Type coercion issues

3. PERFORMANCE:
   - Callback hell (nested callbacks)
   - Unoptimized loops
   - Memory leaks

4. BAD PRACTICES:
   - var usage (use const/let)
   - Global variables
   - Missing semicolons
   - console.log in production

Code to analyze:
${code}

Return ONLY a valid JSON object with this exact structure:
{
  "bugs": [{"line": 1, "message": "description", "fix": "how to fix"}],
  "security": [{"line": 2, "message": "description", "fix": "how to fix"}],
  "performance": [{"line": 3, "message": "description", "fix": "how to fix"}],
  "score": 50
}

Be CRITICAL. Find EVERY issue. Score should reflect code quality (0-100).`;

  const response = await axios.post('http://localhost:11434/api/generate', {
    model: 'codellama:7b',
    prompt: prompt,
    stream: false,
    options: {
      temperature: 0.1,
      num_predict: 2000
    }
  }, { timeout: 30000 });
  
  const text = response.data.response;
  console.log('AI response preview:', text.substring(0, 200));
  
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error('JSON parse failed:', e);
    }
  }
  return null;
}

function enhancedAnalysis(code) {
  const lines = code.split('\n');
  const review = {
    bugs: [],
    security: [],
    performance: [],
    score: 100
  };
  
  let issueCount = 0;

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    
    // SECURITY CHECKS
    if (line.includes('eval(')) {
      review.security.push({
        line: lineNum,
        message: 'CRITICAL: eval() executes arbitrary code - major security risk!',
        fix: 'Remove eval() completely. Use safe alternatives like JSON.parse() or Function constructor.'
      });
      issueCount += 5;
    }
    
    if (line.includes('innerHTML') && (line.includes('+') || line.includes('${'))) {
      review.security.push({
        line: lineNum,
        message: 'XSS vulnerability: innerHTML with dynamic content',
        fix: 'Use textContent instead of innerHTML, or sanitize input with DOMPurify'
      });
      issueCount += 4;
    }
    
    if ((line.includes('SELECT') || line.includes('INSERT')) && 
        line.includes('+') && line.includes('"')) {
      review.security.push({
        line: lineNum,
        message: 'SQL INJECTION vulnerability - direct string concatenation',
        fix: 'Use parameterized queries or an ORM. Never concatenate user input.'
      });
      issueCount += 5;
    }
    
    if (line.includes('prototype') && line.includes('=')) {
      review.security.push({
        line: lineNum,
        message: 'Prototype pollution - modifying built-in prototypes',
        fix: 'Avoid modifying Object.prototype. Use WeakMap or Symbol for extensions.'
      });
      issueCount += 3;
    }
    
    // BUG CHECKS
    if (line.match(/var\s+/)) {
      review.bugs.push({
        line: lineNum,
        message: 'Use const/let instead of var (var has function scope, can cause bugs)',
        fix: line.replace('var ', 'const ').replace('var ', 'let ')
      });
      issueCount += 1;
    }
    
    if (line.includes('==') && !line.includes('===') && !line.includes('==') === line.includes('==')) {
      review.bugs.push({
        line: lineNum,
        message: 'Loose equality (==) can cause type coercion bugs',
        fix: line.replace('==', '===')
      });
      issueCount += 2;
    }
    
    if (line.includes('null') || line.includes('undefined')) {
      if (!line.includes('if') && !line.includes('?')) {
        review.bugs.push({
          line: lineNum,
          message: 'Potential null/undefined reference without check',
          fix: 'Add null check: if (value) { ... } or optional chaining value?.property'
        });
        issueCount += 2;
      }
    }
    
    // PERFORMANCE CHECKS
    if (line.includes('setInterval(') && !code.includes('clearInterval')) {
      review.performance.push({
        line: lineNum,
        message: 'Memory leak risk: setInterval without cleanup',
        fix: 'Store interval ID and clear on unmount: const id = setInterval(...); clearInterval(id)'
      });
      issueCount += 3;
    }
    
    const timeoutCount = (line.match(/setTimeout/g) || []).length;
    if (timeoutCount > 2) {
      review.performance.push({
        line: lineNum,
        message: 'Callback hell - nested timeouts make code hard to follow',
        fix: 'Use async/await or Promise chains instead of nested callbacks'
      });
      issueCount += 2;
    }
    
    // Check for inefficient loops
    if (line.includes('for(') && line.includes('var i=0')) {
      review.performance.push({
        line: lineNum,
        message: 'Inefficient loop pattern',
        fix: 'Use forEach, map, or for...of for better performance'
      });
      issueCount += 1;
    }
  });

  // Calculate score (0-100)
  review.score = Math.max(0, Math.min(100, 100 - (issueCount * 2.5)));
  
  return review;
}

function validateReview(review) {
  return {
    bugs: Array.isArray(review.bugs) ? review.bugs : [],
    security: Array.isArray(review.security) ? review.security : [],
    performance: Array.isArray(review.performance) ? review.performance : [],
    score: typeof review.score === 'number' ? Math.min(100, Math.max(0, review.score)) : 70
  };
}

export async function reviewPR(code, filename) {
  return reviewCode(code, filename);
}