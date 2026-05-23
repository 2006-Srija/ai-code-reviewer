"""
Orchestrator - Coordinates all agents and aggregates results
"""

import asyncio
from typing import Dict, List
from agents.base_agent import Finding
from agents.security_agent import SecurityAgent
from agents.performance_agent import PerformanceAgent
from agents.quality_agent import QualityAgent


class Orchestrator:
    """Main orchestrator that runs all agents in parallel"""
    
    def __init__(self):
        self.agents = [
            SecurityAgent(),
            PerformanceAgent(),
            QualityAgent()
        ]
    
    async def review_code(self, code: str, filename: str) -> Dict:
        """Run all agents and aggregate results"""
        tasks = [agent.analyze(code, filename) for agent in self.agents]
        results = await asyncio.gather(*tasks)
        
        all_findings = [f for result in results for f in result]
        
        severity_weights = {"critical": 15, "high": 10, "medium": 5, "low": 2}
        score = 100 - sum(severity_weights.get(f.severity.value, 5) for f in all_findings)
        score = max(0, min(100, score))
        
        return {
            "score": score,
            "total_issues": len(all_findings),
            "findings": [
                {
                    "agent": f.agent_name,
                    "file": f.file_path,
                    "line": f.line,
                    "severity": f.severity.value,
                    "title": f.title,
                    "description": f.description,
                    "suggestion": f.suggestion,
                    "fix": f.fix_code
                }
                for f in all_findings
            ]
        }


async def test():
    """Test function"""
    orchestrator = Orchestrator()
    
    buggy_code = '''function processUser(input) {
    var query = "SELECT * FROM users WHERE name = '" + input + "'";
    eval('console.log(query)');
    
    for(var i=0; i<data.length; i++) {
        var result = db.query("SELECT * FROM orders WHERE user_id = " + data[i].id);
    }
    
    console.log("Processing complete");
    return query;
}'''
    
    result = await orchestrator.review_code(buggy_code, "test.js")
    print(f"Score: {result['score']}/100")
    for f in result['findings']:
        print(f"[{f['agent']}] {f['title']}: {f['description']}")


if __name__ == "__main__":
    asyncio.run(test())