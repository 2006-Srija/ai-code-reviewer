import logging
import re
from typing import List
from agents.base_agent import Agent, Finding, Severity

logger = logging.getLogger(__name__)


class QualityAgent(Agent):
    """Specialized agent for code quality detection"""
    
    def __init__(self):
        super().__init__(
            name="Quality Agent",
            role="Detects code style, naming, quality issues"
        )
        self.logger = logger
    
    async def analyze(self, code: str, filename: str) -> List[Finding]:
        findings = []
        
        # var usage detection
        if re.search(r'\bvar\s+', code):
            findings.append(Finding(
                agent_name=self.name,
                file_path=filename,
                line=self._find_line(code, 'var '),
                severity=Severity.LOW,
                title="Use const/let instead of var",
                description="var has function scope and can cause bugs",
                suggestion="Use const (if not reassigned) or let (if reassigned)",
                fix_code=code.replace('var ', 'const ').replace('var ', 'let ')
            ))
        
        # == vs === detection
        if re.search(r'[^=]==[^=]', code) and '===' not in code:
            findings.append(Finding(
                agent_name=self.name,
                file_path=filename,
                line=self._find_line(code, '=='),
                severity=Severity.MEDIUM,
                title="Use strict equality (===)",
                description="Loose equality (==) can cause type coercion bugs",
                suggestion="Use === for type-safe comparison",
                fix_code=code.replace('==', '===')
            ))
        
        # Console logs
        if re.search(r'console\.(log|debug|info|warn|error)', code):
            findings.append(Finding(
                agent_name=self.name,
                file_path=filename,
                line=self._find_line(code, 'console.'),
                severity=Severity.LOW,
                title="Console log in production",
                description="console.log should be removed in production",
                suggestion="Remove console.log or use proper logging library",
                fix_code="// Remove or replace with: logger.debug()"
            ))
        
        self.logger.info(f"📊 {self.name} found {len(findings)} issues")
        return findings
    
    def _find_line(self, code: str, pattern: str) -> int:
        lines = code.split('\n')
        for i, line in enumerate(lines, 1):
            if pattern in line:
                return i
        return 1