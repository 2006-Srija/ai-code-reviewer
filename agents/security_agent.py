import logging
import re
from typing import List
from agents.base_agent import Agent, Finding, Severity

# Setup logger
logger = logging.getLogger(__name__)


class SecurityAgent(Agent):
    """Specialized agent for security vulnerability detection"""
    
    def __init__(self):
        super().__init__(
            name="Security Agent",
            role="Detects SQL injection, XSS, eval(), hardcoded secrets"
        )
        self.logger = logger
    
    async def analyze(self, code: str, filename: str) -> List[Finding]:
        findings = []
        
        # 1. SQL Injection Detection
        if re.search(r'SELECT.*\+.*\+', code, re.IGNORECASE):
            findings.append(Finding(
                agent_name=self.name,
                file_path=filename,
                line=self._find_line(code, 'SELECT'),
                severity=Severity.CRITICAL,
                title="SQL Injection Vulnerability",
                description="String concatenation in SQL query",
                suggestion="Use parameterized queries or ORM",
                fix_code="// Use: db.query('SELECT * FROM users WHERE id = ?', [userId])"
            ))
        
        # 2. eval() Detection
        if 'eval(' in code:
            findings.append(Finding(
                agent_name=self.name,
                file_path=filename,
                line=self._find_line(code, 'eval('),
                severity=Severity.CRITICAL,
                title="Dangerous eval() Usage",
                description="eval() allows arbitrary code execution",
                suggestion="Remove eval(), use Function constructor or JSON.parse",
                fix_code="// Replace eval(code) with: JSON.parse(code) or new Function(code)"
            ))
        
        # 3. Hardcoded secrets
        secret_patterns = ['api_key', 'secret', 'password', 'token']
        for pattern in secret_patterns:
            if re.search(rf'{pattern}\s*=\s*["\'][^"\']+["\']', code, re.IGNORECASE):
                findings.append(Finding(
                    agent_name=self.name,
                    file_path=filename,
                    line=self._find_line(code, pattern),
                    severity=Severity.CRITICAL,
                    title=f"Hardcoded {pattern.upper()}",
                    description=f"Hardcoded {pattern} found in source code",
                    suggestion="Use environment variables or secrets manager",
                    fix_code=f"{pattern}=os.getenv('{pattern.upper()}')"
                ))
                break
        
        # 4. XSS Detection
        if 'innerHTML' in code or 'dangerouslySetInnerHTML' in code:
            findings.append(Finding(
                agent_name=self.name,
                file_path=filename,
                line=self._find_line(code, 'innerHTML'),
                severity=Severity.HIGH,
                title="Cross-Site Scripting (XSS)",
                description="Using innerHTML with user input can cause XSS attacks",
                suggestion="Use textContent or sanitize input with DOMPurify",
                fix_code="element.textContent = userInput;"
            ))
        
        self.logger.info(f"🔐 {self.name} found {len(findings)} issues")
        return findings
    
    def _find_line(self, code: str, pattern: str) -> int:
        lines = code.split('\n')
        for i, line in enumerate(lines, 1):
            if pattern in line:
                return i
        return 1