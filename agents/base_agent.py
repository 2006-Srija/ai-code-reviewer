from abc import ABC, abstractmethod
from typing import List, Dict, Any
from dataclasses import dataclass
from enum import Enum

class Severity(Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

@dataclass
class Finding:
    agent_name: str
    file_path: str
    line: int
    severity: Severity
    title: str
    description: str
    suggestion: str
    fix_code: str = None
    cwe_id: str = None
    language: str = "unknown"

class Agent(ABC):
    def __init__(self, name: str, role: str):
        self.name = name
        self.role = role
    
    @abstractmethod
    async def analyze(self, code: str, filename: str, language: str) -> List[Finding]:
        pass