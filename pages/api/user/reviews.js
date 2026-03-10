import { getUserReviewsFromDynamoDB } from '../../../lib/dynamodb.service.js';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const reviews = await getUserReviewsFromDynamoDB(session.user.id);
    console.log('📚 Reviews from DynamoDB:', reviews.length); // Add this for debugging
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
}