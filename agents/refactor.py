"""
Athena — Auto-Fix Refactor Agent
Applies fixes to code automatically
"""

import re
import ast
import subprocess
from typing import Dict, List, Tuple
import logging

logger = logging.getLogger(__name__)


class RefactorAgent:
    """Applies automatic fixes to code issues"""
    
    def __init__(self):
        self.fix_applied = 0
    
    async def apply_fixes(self, code: str, findings: List[Dict]) -> Tuple[str, List[Dict]]:
        """Apply fixes to code and return fixed code with applied fixes"""
        fixed_code = code
        applied_fixes = []
        
        # Fix 1: var -> const/let
        if any(f.get('title') == 'Use const/let instead of var' for f in findings):
            fixed_code, fixes = self._fix_var_to_const(fixed_code)
            applied_fixes.extend(fixes)
        
        # Fix 2: == -> ===
        if any(f.get('title') == 'Use strict equality (===') for f in findings):
            fixed_code, fixes = self._fix_loose_equality(fixed_code)
            applied_fixes.extend(fixes)
        
        # Fix 3: Add missing semicolons
        if any('semicolon' in f.get('title', '').lower() for f in findings):
            fixed_code, fixes = self._fix_missing_semicolons(fixed_code)
            applied_fixes.extend(fixes)
        
        # Fix 4: Remove console.log
        if any('Console log' in f.get('title', '') for f in findings):
            fixed_code, fixes = self._remove_console_logs(fixed_code)
            applied_fixes.extend(fixes)
        
        # Fix 5: Add missing error handling
        if any('try/catch' in f.get('suggestion', '').lower() for f in findings):
            fixed_code, fixes = self._add_error_handling(fixed_code)
            applied_fixes.extend(fixes)
        
        self.fix_applied = len(applied_fixes)
        return fixed_code, applied_fixes
    
    def _fix_var_to_const(self, code: str) -> Tuple[str, List[Dict]]:
        fixes = []
        lines = code.split('\n')
        fixed_lines = []
        
        for i, line in enumerate(lines, 1):
            if re.search(r'\bvar\s+', line):
                # Check if variable is reassigned later
                var_name = re.search(r'var\s+(\w+)', line)
                if var_name:
                    name = var_name.group(1)
                    if re.search(rf'{name}\s*=', '\n'.join(lines[i:]), re.MULTILINE):
                        new_line = line.replace('var ', 'let ')
                        fixes.append({
                            "line": i,
                            "original": line.strip(),
                            "fixed": new_line.strip(),
                            "type": "var_to_let"
                        })
                    else:
                        new_line = line.replace('var ', 'const ')
                        fixes.append({
                            "line": i,
                            "original": line.strip(),
                            "fixed": new_line.strip(),
                            "type": "var_to_const"
                        })
                    fixed_lines.append(new_line)
                else:
                    fixed_lines.append(line)
            else:
                fixed_lines.append(line)
        
        return '\n'.join(fixed_lines), fixes
    
    def _fix_loose_equality(self, code: str) -> Tuple[str, List[Dict]]:
        fixes = []
        lines = code.split('\n')
        fixed_lines = []
        
        for i, line in enumerate(lines, 1):
            if '==' in line and '===' not in line:
                new_line = line.replace('==', '===')
                fixes.append({
                    "line": i,
                    "original": line.strip(),
                    "fixed": new_line.strip(),
                    "type": "loose_equality"
                })
                fixed_lines.append(new_line)
            else:
                fixed_lines.append(line)
        
        return '\n'.join(fixed_lines), fixes
    
    def _fix_missing_semicolons(self, code: str) -> Tuple[str, List[Dict]]:
        fixes = []
        lines = code.split('\n')
        fixed_lines = []
        
        for i, line in enumerate(lines, 1):
            stripped = line.strip()
            if stripped and not stripped.endswith(';') and not stripped.endswith('{') and not stripped.endswith('}'):
                if not re.match(r'^(if|else|for|while|function|class|import|export|//|#|const|let|var)', stripped):
                    new_line = line + ';'
                    fixes.append({
                        "line": i,
                        "original": line.strip(),
                        "fixed": new_line.strip(),
                        "type": "missing_semicolon"
                    })
                    fixed_lines.append(new_line)
                else:
                    fixed_lines.append(line)
            else:
                fixed_lines.append(line)
        
        return '\n'.join(fixed_lines), fixes
    
    def _remove_console_logs(self, code: str) -> Tuple[str, List[Dict]]:
        fixes = []
        lines = code.split('\n')
        fixed_lines = []
        
        for i, line in enumerate(lines, 1):
            if 'console.log' in line or 'console.debug' in line or 'console.info' in line:
                fixes.append({
                    "line": i,
                    "original": line.strip(),
                    "fixed": "// " + line.strip(),
                    "type": "remove_console"
                })
                fixed_lines.append('// ' + line)
            else:
                fixed_lines.append(line)
        
        return '\n'.join(fixed_lines), fixes
    
    def _add_error_handling(self, code: str) -> Tuple[str, List[Dict]]:
        fixes = []
        lines = code.split('\n')
        fixed_lines = []
        
        in_function = False
        function_start = 0
        
        for i, line in enumerate(lines, 1):
            if 'async function' in line or 'function' in line and '{' in line:
                in_function = True
                function_start = i
                fixed_lines.append(line)
            elif in_function and '}' in line and 'try' not in '\n'.join(lines[function_start-1:i]):
                # Add try-catch wrapper
                fixes.append({
                    "line": function_start,
                    "original": f"Line {function_start} function",
                    "fixed": "Added try-catch wrapper",
                    "type": "error_handling"
                })
                fixed_lines.insert(function_start, '    try {')
                fixed_lines.insert(i+1, '    } catch (error) {')
                fixed_lines.insert(i+2, '        console.error("Error:", error);')
                fixed_lines.insert(i+3, '    }')
                in_function = False
            else:
                fixed_lines.append(line)
        
        return '\n'.join(fixed_lines), fixes