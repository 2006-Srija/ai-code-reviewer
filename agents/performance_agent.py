import logging
import re
from typing import List
from agents.base_agent import Agent, Finding, Severity

logger = logging.getLogger(__name__)


class PerformanceAgent(Agent):
    """Specialized agent for performance issue detection"""
    
    def __init__(self):
        super().__init__(
            name="Performance Agent",
            role="Detects N+1 queries, memory leaks, inefficient loops"
        )
        self.logger = logger
    
    async def analyze(self, code: str, filename: str) -> List[Finding]:
        findings = []
        
        # N+1 Query Detection
        n1_pattern = r'for\s*\([^)]*\)\s*\{\s*[^}]*\.(find|select|query|fetch)'
        if re.search(n1_pattern, code, re.DOTALL):
            findings.append(Finding(
                agent_name=self.name,
                file_path=filename,
                line=self._find_line(code, 'for'),
                severity=Severity.HIGH,
                title="N+1 Query Pattern",
                description="Database query inside loop causes performance issues",
                suggestion="Use batch query, JOIN, or eager loading",
                fix_code="const ids = items.map(i => i.id);\nconst results = await db.query('SELECT * FROM table WHERE id IN (?)', [ids]);"
            ))
        
        # Memory leak detection
        if 'setInterval' in code and 'clearInterval' not in code:
            findings.append(Finding(
                agent_name=self.name,
                file_path=filename,
                line=self._find_line(code, 'setInterval'),
                severity=Severity.MEDIUM,
                title="Memory Leak Risk",
                description="setInterval without cleanup can cause memory leaks",
                suggestion="Store interval ID and clear on component unmount",
                fix_code="const interval = setInterval(fn, 1000);\n// Cleanup: clearInterval(interval);"
            ))
        
        # Inefficient loop
        inefficient_loop = r'for\s*\(\s*\w+\s*=\s*0\s*;\s*\w+\s*<\s*[^)]+\.length\s*;\s*\w+\+\+\)'
        if re.search(inefficient_loop, code):
            findings.append(Finding(
                agent_name=self.name,
                file_path=filename,
                line=self._find_line(code, 'for'),
                severity=Severity.LOW,
                title="Inefficient Loop",
                description="Array length calculated on each iteration",
                suggestion="Cache length before loop",
                fix_code="const len = arr.length;\nfor(let i = 0; i < len; i++)"
            ))
        
        self.logger.info(f"⚡ {self.name} found {len(findings)} issues")
        return findings
    
    def _find_line(self, code: str, pattern: str) -> int:
        lines = code.split('\n')
        for i, line in enumerate(lines, 1):
            if pattern in line:
                return i
        return 1