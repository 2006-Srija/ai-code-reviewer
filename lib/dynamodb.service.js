import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import dotenv from "dotenv";
dotenv.config();

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Document client for easier JavaScript objects
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "PRReviews";

/**
 * Save a PR review to DynamoDB
 */
export async function saveReviewToDynamoDB(userId, repo, prNumber, reviewData) {
  try {
    const timestamp = new Date().toISOString();
    
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        userId: userId,
        createdAt: timestamp,
        repo: repo,
        prNumber: prNumber,
        score: reviewData.score || 0,
        bugs: reviewData.bugs || [],
        security: reviewData.security || [],
        performance: reviewData.performance || [],
        suggestions: reviewData.suggestions || [],
        rawReview: reviewData,
      },
    });

    await docClient.send(command);
    console.log(`✅ Review saved to DynamoDB for user ${userId}`);
    return { success: true };
  } catch (error) {
    console.error("❌ Error saving to DynamoDB:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get all reviews for a user
 */
export async function getUserReviewsFromDynamoDB(userId) {
  try {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
      ScanIndexForward: false, // descending order (newest first)
    });

    const response = await docClient.send(command);
    
    return response.Items || [];
  } catch (error) {
    console.error("❌ Error fetching user reviews:", error);
    return [];
  }
}

/**
 * Get user stats
 */
export async function getUserStatsFromDynamoDB(userId) {
  try {
    const reviews = await getUserReviewsFromDynamoDB(userId);
    
    const totalPRs = reviews.length;
    const totalBugs = reviews.reduce((sum, r) => sum + (r.bugs?.length || 0), 0);
    const totalSecurity = reviews.reduce((sum, r) => sum + (r.security?.length || 0), 0);
    
    const avgScore = totalPRs > 0
      ? Math.round(reviews.reduce((sum, r) => sum + (r.score || 0), 0) / totalPRs)
      : 0;

    return { totalPRs, totalBugs, totalSecurity, avgScore };
  } catch (error) {
    console.error("❌ Error getting stats:", error);
    return { totalPRs: 0, totalBugs: 0, totalSecurity: 0, avgScore: 0 };
  }
}

/**
 * Get a specific review
 */
export async function getReviewFromDynamoDB(userId, createdAt) {
  try {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        userId: userId,
        createdAt: createdAt,
      },
    });

    const response = await docClient.send(command);
    return response.Item || null;
  } catch (error) {
    console.error("❌ Error fetching review:", error);
    return null;
  }
}

/**
 * Delete a review
 */
export async function deleteReviewFromDynamoDB(userId, createdAt) {
  try {
    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        userId: userId,
        createdAt: createdAt,
      },
    });

    await docClient.send(command);
    console.log(`✅ Review deleted from DynamoDB`);
    return { success: true };
  } catch (error) {
    console.error("❌ Error deleting review:", error);
    return { success: false, error: error.message };
  }
}