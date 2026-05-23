"""
Gemini Router — Decides which agents to call based on code analysis
"""

import google.generativeai as genai
import json
import os
from typing import List, Dict

class GeminiRouter:
    """Uses Gemini to understand code and decide which agents to invoke"""
    
    def __init__(self, api_key: str = None):
        api_key = api_key or os.getenv("GEMINI_API_KEY")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash-exp')
    
    async def analyze_code_context(self, code: str, language: str) -> Dict:
        """Understand code context and decide which agents to call"""
        
        prompt = f"""
        Analyze this {language} code and tell me:
        1. Does it have database queries? (yes/no)
        2. Does it have loops (>10 iterations)? (yes/no)
        3. Does it have security concerns (eval, SQL injection, XSS)? (yes/no)
        4. Does it have concurrency/parallelism? (yes/no)
        5. Does it have complex algorithms? (yes/no)
        6. What's the primary purpose? (describe in one line)
        
        Return ONLY JSON with these keys: has_db, has_loops, has_security, has_concurrency, has_complex, purpose
        
        Code:
        {code[:3000]}
        """
        
        response = self.model.generate_content(prompt)
        try:
            return json.loads(response.text.strip('```json\n').strip('\n```'))
        except:
            return {"has_db": False, "has_loops": False, "has_security": True, 
                    "has_concurrency": False, "has_complex": False, "purpose": "unknown"}
    
    async def get_agents_to_run(self, code: str, language: str) -> List[str]:
        """Decide which agents to run based on code analysis"""
        context = await self.analyze_code_context(code, language)
        
        agents = []
        if context.get('has_security', False):
            agents.append('security')
        if context.get('has_loops', False) or context.get('has_concurrency', False):
            agents.append('performance')
        if context.get('has_complex', False) or language in ['rust', 'cpp', 'go']:
            agents.append('quality')
        
        # Always run at least quality agent
        if not agents:
            agents.append('quality')
        
        return agents