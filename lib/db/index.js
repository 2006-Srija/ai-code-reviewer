import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;

export async function saveReview(userId, repo, prNumber, review) {
  try {
    return await prisma.review.create({
      data: {
        userId,
        repo,
        prNumber,
        score: review.score || 0,
        issues: review || {}
      }
    });
  } catch (error) {
    console.error('Error saving review:', error);
    return null;
  }
}

export async function getUserReviews(userId) {
  try {
    return await prisma.review.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

export async function getUserStats(userId) {
  try {
    const reviews = await prisma.review.findMany({ where: { userId } });
    return {
      totalPRs: reviews.length,
      totalBugs: reviews.reduce((sum, r) => sum + (r.issues?.bugs?.length || 0), 0),
      avgScore: reviews.length > 0 ? Math.round(reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length) : 0
    };
  } catch (error) {
    return { totalPRs: 0, totalBugs: 0, avgScore: 0 };
  }
}