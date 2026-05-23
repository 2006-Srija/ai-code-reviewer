"""
AST Analyzer for multiple languages (Rust, C++, Go, Python, JavaScript)
"""

import ast
import subprocess
import tempfile
import os
from typing import List, Dict

class ASTAnalyzer:
    """Analyzes code structure using AST parsing"""
    
    def __init__(self, language: str):
        self.language = language
    
    def analyze(self, code: str) -> List[Dict]:
        """Analyze code and return structural issues"""
        
        if self.language == 'python':
            return self._analyze_python(code)
        elif self.language == 'javascript':
            return self._analyze_javascript(code)
        elif self.language == 'rust':
            return self._analyze_rust(code)
        elif self.language == 'cpp':
            return self._analyze_cpp(code)
        elif self.language == 'go':
            return self._analyze_go(code)
        return []
    
    def _analyze_python(self, code: str) -> List[Dict]:
        """Python AST analysis"""
        findings = []
        try:
            tree = ast.parse(code)
            for node in ast.walk(tree):
                if isinstance(node, ast.FunctionDef):
                    if len(node.body) > 50:
                        findings.append({
                            "type": "long_function",
                            "line": node.lineno,
                            "message": f"Function '{node.name}' is {len(node.body)} lines long",
                            "suggestion": "Split into smaller functions"
                        })
                elif isinstance(node, ast.While):
                    # Check for potential infinite loops
                    findings.append({
                        "type": "loop",
                        "line": node.lineno,
                        "message": "While loop without break condition check",
                        "suggestion": "Ensure there's a break condition"
                    })
        except SyntaxError as e:
            findings.append({
                "type": "syntax_error",
                "line": e.lineno or 1,
                "message": str(e),
                "suggestion": "Fix syntax error"
            })
        return findings
    
    def _analyze_rust(self, code: str) -> List[Dict]:
        """Rust code analysis using tree-sitter or regex"""
        findings = []
        
        # Check for unsafe blocks
        if 'unsafe' in code:
            findings.append({
                "type": "unsafe_code",
                "line": 1,
                "message": "Unsafe code block detected",
                "suggestion": "Minimize unsafe usage, wrap in safe abstractions"
            })
        
        # Check for unwrap() usage
        if '.unwrap()' in code:
            findings.append({
                "type": "panic_risk",
                "line": 1,
                "message": "unwrap() can panic at runtime",
                "suggestion": "Use match or ? operator for error handling"
            })
        
        # Check for clone() on large data
        if '.clone()' in code:
            findings.append({
                "type": "performance",
                "line": 1,
                "message": "clone() on potentially large data",
                "suggestion": "Use references (&T) or Arc/Rc if needed"
            })
        
        return findings
    
    def _analyze_cpp(self, code: str) -> List[Dict]:
        """C++ code analysis"""
        findings = []
        
        # Check for raw pointers
        if 'new ' in code and 'delete' not in code:
            findings.append({
                "type": "memory_leak",
                "line": 1,
                "message": "Raw pointer allocation without matching delete",
                "suggestion": "Use smart pointers (unique_ptr, shared_ptr)"
            })
        
        # Check for C-style casts
        if '(' in code and ')' in code and 'int' in code:
            findings.append({
                "type": "c_style_cast",
                "line": 1,
                "message": "C-style cast detected",
                "suggestion": "Use static_cast, dynamic_cast, or reinterpret_cast"
            })
        
        return findings
    
    def _analyze_go(self, code: str) -> List[Dict]:
        """Go code analysis"""
        findings = []
        
        # Check for goroutine leaks
        if 'go func' in code and 'WaitGroup' not in code:
            findings.append({
                "type": "goroutine_leak",
                "line": 1,
                "message": "Goroutine without WaitGroup or channel sync",
                "suggestion": "Use sync.WaitGroup or ensure channel communication"
            })
        
        # Check for defer misuse
        if 'defer' in code and 'Close' in code:
            findings.append({
                "type": "defer_close",
                "line": 1,
                "message": "Deferred Close() - check error handling",
                "suggestion": "Check error from Close() separately"
            })
        
        return findings
    
    def _analyze_javascript(self, code: str) -> List[Dict]:
        """JavaScript code analysis"""
        findings = []
        
        # Check for var usage
        if 'var ' in code:
            findings.append({
                "type": "var_usage",
                "line": 1,
                "message": "Use const/let instead of var",
                "suggestion": "Replace var with const (if not reassigned) or let"
            })
        
        # Check for == usage
        if '==' in code and '===' not in code:
            findings.append({
                "type": "loose_equality",
                "line": 1,
                "message": "Use === instead of ==",
                "suggestion": "Strict equality prevents type coercion"
            })
        
        return findings