import chromadb
from chromadb.utils import embedding_functions
from typing import List, Dict
import hashlib

class MemoryAgent:
    """Stores past reviews and retrieves similar issues"""
    
    def __init__(self, persist_dir="./chroma_db"):
        self.client = chromadb.PersistentClient(path=persist_dir)
        self.embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )
        self.collection = self.client.get_or_create_collection(
            name="code_reviews",
            embedding_function=self.embedding_fn
        )
    
    def store_finding(self, code_snippet: str, finding: Dict):
        """Store finding for future reference"""
        doc_id = hashlib.md5(code_snippet.encode()).hexdigest()
        self.collection.upsert(
            documents=[code_snippet],
            metadatas=[finding],
            ids=[doc_id]
        )
    
    def find_similar(self, code_snippet: str, n_results: int = 3) -> List[Dict]:
        """Find similar past issues"""
        results = self.collection.query(
            query_texts=[code_snippet],
            n_results=n_results
        )
        return results['metadatas'][0] if results['metadatas'] else []