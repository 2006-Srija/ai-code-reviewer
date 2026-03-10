// SUPER SIMPLE in-memory database - NO ERRORS!
const reviews = [];

export async function saveReview(userId, repo, prNumber, review) {
  const newReview = {
    id: Date.now().toString(),
    userId,
    repo,
    prNumber,
    score: review.score || 75,
    issues: review || {},
    createdAt: new Date()
  };
  reviews.push(newReview);
  console.log('✅ Review saved to memory!');
  return newReview;
}

export async function getUserReviews(userId) {
  return reviews.filter(r => r.userId === userId);
}

export async function getUserStats(userId) {
  const userReviews = reviews.filter(r => r.userId === userId);
  return {
    totalPRs: userReviews.length,
    totalBugs: userReviews.length * 2,
    avgScore: userReviews.length > 0 
      ? Math.round(userReviews.reduce((sum, r) => sum + r.score, 0) / userReviews.length)
      : 75
  };
}

export async function checkUsageLimit(userId) {
  return { used: 0, limit: 100, remaining: 100, isPro: false };
}

export async function updateUsage(userId) {
  return { count: 1 };
}