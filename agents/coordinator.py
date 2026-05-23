import asyncio
from typing import Dict, Any
from tenacity import retry, stop_after_attempt, wait_exponential

class CoordinatorAgent:
    """LLM-powered coordinator that decides which agents to call"""
    
    def __init__(self):
        self.agents = {
            "security": SecurityAgent(),
            "performance": PerformanceAgent(),
            "quality": QualityAgent(),
            "architecture": ArchitectureAgent(),
            "refactor": RefactorAgent()
        }
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
    async def call_agent_with_retry(self, agent_name: str, code: str):
        """Self-healing: retries if agent fails"""
        agent = self.agents.get(agent_name)
        if not agent:
            return []
        try:
            return await agent.analyze(code)
        except Exception as e:
            print(f"⚠️ {agent_name} failed: {e}. Retrying...")
            raise  # tenacity will retry
    
    async def analyze_with_context(self, code: str, language: str):
        """Coordinator decides which agents to run"""
        
        # First, understand the code context
        context = await self.get_code_context(code, language)
        
        # Decide which agents to run based on context
        agents_to_run = []
        
        if context['has_database']:
            agents_to_run.append('security')
        if context['has_loops']:
            agents_to_run.append('performance')
        if context['has_complex_logic']:
            agents_to_run.append('quality')
        if context['has_architecture_concerns']:
            agents_to_run.append('architecture')
        
        # Run agents in parallel with retry
        tasks = [self.call_agent_with_retry(agent, code) for agent in agents_to_run]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        return self.aggregate_results(results)
    
    async def get_code_context(self, code: str, language: str) -> Dict:
        """Use LLM to understand code context"""
        # Call a small LLM to analyze the code structure
        prompt = f"Analyze this {language} code and tell me if it has: database queries, loops, complex logic, architecture concerns. Return JSON."
        # Implementation using local LLM or Gemini API
        ...