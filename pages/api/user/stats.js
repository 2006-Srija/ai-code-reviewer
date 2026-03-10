import { getUserStatsFromDynamoDB } from '../../../lib/dynamodb.service.js';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const stats = await getUserStatsFromDynamoDB(session.user.id);
    console.log('📊 Stats from DynamoDB:', stats); // Add this for debugging
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
}