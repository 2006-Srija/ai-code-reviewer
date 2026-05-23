"""
Athena — Dependency Agent
Checks for vulnerable and outdated dependencies
"""

import subprocess
import json
import os
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)


class DependencyAgent:
    """Checks dependencies for vulnerabilities"""
    
    def __init__(self):
        self.name = "Dependency Agent"
    
    async def analyze(self, repo_path: str) -> List[Dict]:
        findings = []
        
        # Check package.json for npm projects
        package_json_path = os.path.join(repo_path, 'package.json')
        if os.path.exists(package_json_path):
            findings.extend(await self._check_npm(package_json_path))
        
        # Check requirements.txt for Python
        requirements_path = os.path.join(repo_path, 'requirements.txt')
        if os.path.exists(requirements_path):
            findings.extend(await self._check_python(requirements_path))
        
        # Check Cargo.toml for Rust
        cargo_path = os.path.join(repo_path, 'Cargo.toml')
        if os.path.exists(cargo_path):
            findings.extend(await self._check_rust(cargo_path))
        
        return findings
    
    async def _check_npm(self, package_json_path: str) -> List[Dict]:
        findings = []
        
        try:
            result = subprocess.run(
                ['npm', 'audit', '--json'],
                cwd=os.path.dirname(package_json_path),
                capture_output=True,
                text=True
            )
            
            if result.stdout:
                audit = json.loads(result.stdout)
                vulnerabilities = audit.get('vulnerabilities', {})
                
                for pkg, info in vulnerabilities.items():
                    if info.get('severity') in ['high', 'critical']:
                        findings.append({
                            "agent": self.name,
                            "package": pkg,
                            "severity": info.get('severity', 'high'),
                            "title": f"Vulnerable package: {pkg}",
                            "description": info.get('via', ['Unknown vulnerability'])[0],
                            "suggestion": f"Run: npm update {pkg}",
                            "fix": f"npm install {pkg}@latest"
                        })
        except Exception as e:
            logger.error(f"npm audit failed: {e}")
        
        return findings
    
    async def _check_python(self, requirements_path: str) -> List[Dict]:
        findings = []
        
        try:
            result = subprocess.run(
                ['pip', 'list', '--outdated', '--format=json'],
                capture_output=True,
                text=True
            )
            
            if result.stdout:
                outdated = json.loads(result.stdout)
                for pkg in outdated:
                    findings.append({
                        "agent": self.name,
                        "package": pkg.get('name'),
                        "severity": "medium",
                        "title": f"Outdated package: {pkg.get('name')}",
                        "description": f"Current: {pkg.get('version')}, Latest: {pkg.get('latest_version')}",
                        "suggestion": f"pip install --upgrade {pkg.get('name')}",
                        "fix": f"{pkg.get('name')}=={pkg.get('latest_version')}"
                    })
        except Exception as e:
            logger.error(f"pip check failed: {e}")
        
        return findings
    
    async def _check_rust(self, cargo_path: str) -> List[Dict]:
        findings = []
        
        try:
            result = subprocess.run(
                ['cargo', 'audit', '--json'],
                cwd=os.path.dirname(cargo_path),
                capture_output=True,
                text=True
            )
            
            if result.stdout:
                for line in result.stdout.split('\n'):
                    if '"vulnerabilities"' in line:
                        # Parse vulnerability info
                        pass
        except Exception as e:
            logger.error(f"cargo audit failed: {e}")
        
        return findings