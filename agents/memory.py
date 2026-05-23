"""
Athena — RAG Memory System
Stores past reviews and learns from them
"""

import chromadb
from chromadb.utils import embedding_functions
import hashlib
import json
from typing import List, Dict, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class AthenaMemory:
    """Memory system for storing and retrieving past reviews"""
    
    def __init__(self, persist_dir: str = "./athena_memory"):
        self.client = chromadb.PersistentClient(path=persist_dir)
        self.embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )
        
        # Collections for different types of memory
        self.reviews_collection = self.client.get_or_create_collection(
            name="code_reviews",
            embedding_function=self.embedding_fn
        )
        
        self.issues_collection = self.client.get_or_create_collection(
            name="detected_issues",
            embedding_function=self.embedding_fn
        )
        
        self.suggestions_collection = self.client.get_or_create_collection(
            name="accepted_suggestions",
            embedding_function=self.embedding_fn
        )
        
        logger.info("✅ AthenaMemory initialized")
    
    def store_review(self, code: str, review_result: Dict, accepted: bool = False):
        """Store a review result for future reference"""
        doc_id = hashlib.md5(code.encode()).hexdigest()
        
        # Store review
        self.reviews_collection.upsert(
            documents=[code[:2000]],  # Store first 2000 chars
            metadatas=[{
                "score": review_result.get('score', 0),
                "total_issues": review_result.get('total_issues', 0),
                "accepted": accepted,
                "timestamp": datetime.now().isoformat()
            }],
            ids=[doc_id]
        )
        
        # Store individual issues
        for finding in review_result.get('findings', []):
            issue_id = hashlib.md5(f"{finding.get('title')}{finding.get('description')}".encode()).hexdigest()
            self.issues_collection.upsert(
                documents=[finding.get('description', '')],
                metadatas=[{
                    "title": finding.get('title'),
                    "severity": finding.get('severity'),
                    "agent": finding.get('agent'),
                    "fix": finding.get('fix', ''),
                    "occurrences": 1
                }],
                ids=[issue_id]
            )
        
        logger.info(f"📝 Stored review {doc_id[:8]} with {review_result.get('total_issues', 0)} issues")
    
    def find_similar_issues(self, code: str, n_results: int = 5) -> List[Dict]:
        """Find similar issues from past reviews"""
        try:
            results = self.issues_collection.query(
                query_texts=[code[:1000]],
                n_results=n_results
            )
            
            similar_issues = []
            if results['metadatas']:
                for meta in results['metadatas'][0]:
                    similar_issues.append(meta)
            
            logger.info(f"🔍 Found {len(similar_issues)} similar issues")
            return similar_issues
        except Exception as e:
            logger.error(f"Error finding similar issues: {e}")
            return []
    
    def get_common_issues(self, limit: int = 10) -> List[Dict]:
        """Get most common issues detected"""
        # Get all issues
        results = self.issues_collection.get(limit=1000)
        
        if not results['metadatas']:
            return []
        
        # Count occurrences
        issue_counts = {}
        for meta in results['metadatas']:
            title = meta.get('title', 'Unknown')
            if title in issue_counts:
                issue_counts[title]['count'] += 1
            else:
                issue_counts[title] = {
                    'title': title,
                    'severity': meta.get('severity', 'low'),
                    'agent': meta.get('agent', 'Unknown'),
                    'fix': meta.get('fix', ''),
                    'count': 1
                }
        
        # Sort by count and return top N
        common = sorted(issue_counts.values(), key=lambda x: x['count'], reverse=True)[:limit]
        logger.info(f"📊 Retrieved {len(common)} common issues")
        return common
    
    def mark_suggestion_accepted(self, suggestion: str):
        """Mark a suggestion as accepted by user"""
        doc_id = hashlib.md5(suggestion.encode()).hexdigest()
        self.suggestions_collection.upsert(
            documents=[suggestion],
            metadatas=[{
                "accepted": True,
                "timestamp": datetime.now().isoformat(),
                "times_accepted": 1
            }],
            ids=[doc_id]
        )
    
    def get_stats(self) -> Dict:
        """Get memory statistics"""
        return {
            "total_reviews": self.reviews_collection.count(),
            "total_issues": self.issues_collection.count(),
            "total_suggestions": self.suggestions_collection.count(),
            "collections": ["code_reviews", "detected_issues", "accepted_suggestions"]
        }