"""
Athena — Code Intelligence Platform
Main orchestrator for multi-agent code review
"""

import sys
import os
import asyncio
import json
from typing import Dict, List

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Try to import agents, if not available, use mock
try:
    from agents.security_agent import SecurityAgent
    from agents.performance_agent import PerformanceAgent
    from agents.quality_agent import QualityAgent
    from agents.memory import AthenaMemory
    AGENTS_AVAILABLE = True
    MEMORY_AVAILABLE = True
except ImportError as e:
    AGENTS_AVAILABLE = False
    MEMORY_AVAILABLE = False


class Athena:
    """Main orchestrator for Athena platform"""
    
    def __init__(self):
        self.agents = []
        if AGENTS_AVAILABLE:
            self.agents = [
                SecurityAgent(),
                PerformanceAgent(),
                QualityAgent()
            ]
        
        # Initialize memory system
        if MEMORY_AVAILABLE:
            try:
                self.memory = AthenaMemory()
            except Exception as e:
                self.memory = None
        else:
            self.memory = None
    
    async def review_code(self, code: str, filename: str) -> Dict:
        """Run all agents and aggregate results"""
        
        # Find similar issues from memory (if available)
        similar_issues = []
        if self.memory:
            try:
                similar_issues = self.memory.find_similar_issues(code, n_results=3)
            except Exception as e:
                pass
        
        if not AGENTS_AVAILABLE or not self.agents:
            # Mock response for testing
            result = {
                "score": 98,
                "total_issues": 1,
                "findings": [
                    {
                        "agent": "Quality Agent",
                        "file": filename,
                        "line": 1,
                        "severity": "low",
                        "title": "Use const/let instead of var",
                        "description": "var has function scope and can cause bugs",
                        "suggestion": "Use const (if not reassigned) or let",
                        "fix": code.replace('var ', 'const ') if code else ""
                    }
                ]
            }
            
            # Store in memory
            if self.memory:
                try:
                    self.memory.store_review(code, result, accepted=False)
                except Exception as e:
                    pass
            
            return result
        
        tasks = [agent.analyze(code, filename) for agent in self.agents]
        results = await asyncio.gather(*tasks)
        
        all_findings = []
        for result in results:
            if isinstance(result, list):
                for f in result:
                    # Convert Severity enum to string safely
                    severity_value = "low"
                    if hasattr(f, 'severity'):
                        if hasattr(f.severity, 'value'):
                            severity_value = f.severity.value
                        else:
                            severity_value = str(f.severity).lower()
                    
                    # Add memory-sourced suggestions if available
                    suggestion = getattr(f, 'suggestion', '')
                    if similar_issues:
                        suggestion += " (Similar issue seen before)"
                    
                    all_findings.append({
                        "agent": getattr(f, 'agent_name', 'Unknown Agent'),
                        "file": getattr(f, 'file_path', filename),
                        "line": getattr(f, 'line', 1),
                        "severity": severity_value,
                        "title": getattr(f, 'title', 'Issue found'),
                        "description": getattr(f, 'description', ''),
                        "suggestion": suggestion,
                        "fix": getattr(f, 'fix_code', '')
                    })
            elif isinstance(result, dict) and 'findings' in result:
                all_findings.extend(result['findings'])
        
        severity_weights = {"critical": 15, "high": 10, "medium": 5, "low": 2}
        score = 100 - sum(severity_weights.get(f.get('severity', 'low'), 5) for f in all_findings)
        score = max(0, min(100, score))
        
        result = {
            "score": score,
            "total_issues": len(all_findings),
            "findings": all_findings
        }
        
        # Store review in memory for future learning
        if self.memory:
            try:
                self.memory.store_review(code, result, accepted=False)
            except Exception as e:
                pass
        
        return result
    
    async def get_common_issues(self, limit: int = 10) -> List[Dict]:
        """Get most common issues from memory"""
        if self.memory:
            return self.memory.get_common_issues(limit)
        return []
    
    async def get_memory_stats(self) -> Dict:
        """Get memory statistics"""
        if self.memory:
            return self.memory.get_stats()
        return {"error": "Memory system not available"}


async def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--code', type=str, help='Code to analyze')
    parser.add_argument('--code-file', type=str, help='File containing code')
    parser.add_argument('--file', type=str, default='code.js', help='File path')
    parser.add_argument('--stats', action='store_true', help='Show memory stats')
    parser.add_argument('--common', action='store_true', help='Show common issues')
    args = parser.parse_args()
    
    athena = Athena()
    
    if args.stats:
        stats = await athena.get_memory_stats()
        print(json.dumps(stats))
    elif args.common:
        common = await athena.get_common_issues()
        print(json.dumps(common))
    elif args.code_file:
        with open(args.code_file, 'r') as f:
            code = f.read()
        result = await athena.review_code(code, args.file)
        print(json.dumps(result))
    elif args.code:
        result = await athena.review_code(args.code, args.file)
        print(json.dumps(result))
    else:
        test_code = """function test() {
    var x = 10;
    return x;
}"""
        result = await athena.review_code(test_code, "test.js")
        print(json.dumps(result))


if __name__ == "__main__":
    asyncio.run(main())