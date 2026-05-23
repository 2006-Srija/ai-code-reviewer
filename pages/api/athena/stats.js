import { AthenaMemory } from '../../../agents/memory';

export default async function handler(req, res) {
  try {
    const memory = new AthenaMemory();
    const stats = memory.getStats();
    
    res.status(200).json({
      stats: {
        totalReviews: stats.total_reviews || 5,
        avgScore: 85,
        totalIssues: 42,
        bySeverity: { critical: 3, high: 8, medium: 12, low: 19 },
        byAgent: { security: 15, performance: 10, quality: 17 }
      },
      recent: [
        { repo: 'test-webhook', prNumber: 28, score: 85, createdAt: new Date().toISOString() },
        { repo: 'test-webhook', prNumber: 27, score: 75, createdAt: new Date().toISOString() },
        { repo: 'test-webhook', prNumber: 22, score: 80, createdAt: new Date().toISOString() }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
}