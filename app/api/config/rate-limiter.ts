import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { Redis } from '@upstash/redis';

interface RateLimit {
  count: number;
  lastReset: number;
  totalRequests: number;
  dailyReset: number;
}

// Initialize Redis outside the function to maintain connection
const redis = new Redis({
  url: process.env.STORAGE_KV_REST_API_URL!,
  token: process.env.STORAGE_KV_REST_API_TOKEN!,
  automaticDeserialization: true  // Handle JSON automatically
});

const HOUR_IN_MS = 60 * 60 * 1000;
const DAY_IN_MS = 24 * HOUR_IN_MS;
const MAX_REQUESTS_PER_HOUR = 5;
const MAX_REQUESTS_PER_DAY = 50;
const MIN_CONTENT_LENGTH = 50;
const MAX_CONTENT_LENGTH = 2000;

export async function rateLimit(content?: string) {
  try {
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';
    const now = Date.now();

    // Get rate limit data from Redis
    let rateData: RateLimit;
    try {
      const userData = await redis.get<RateLimit | null>(`ratelimit:${ip}`);
      rateData = userData ?? {
        count: 0,
        lastReset: now,
        totalRequests: 0,
        dailyReset: now,
      };
    } catch (error) {
      console.error('Redis get error:', error);
      // Fallback to allow request if Redis fails
      rateData = {
        count: 0,
        lastReset: now,
        totalRequests: 0,
        dailyReset: now,
      };
    }

    // Reset counters if needed
    if (now - rateData.lastReset > HOUR_IN_MS) {
      rateData.count = 0;
      rateData.lastReset = now;
    }

    if (now - rateData.dailyReset > DAY_IN_MS) {
      rateData.totalRequests = 0;
      rateData.dailyReset = now;
    }

    // Content validation
    if (content) {
      if (content.length < MIN_CONTENT_LENGTH) {
        return NextResponse.json(
          { error: 'Content too short. Please provide more detailed notes.' },
          { status: 400 }
        );
      }
      if (content.length > MAX_CONTENT_LENGTH) {
        return NextResponse.json(
          { error: 'Content too long. Please shorten your notes.' },
          { status: 400 }
        );
      }
    }

    // Increment counters
    rateData.count++;
    rateData.totalRequests++;

    // Check limits
    if (rateData.count > MAX_REQUESTS_PER_HOUR) {
      return NextResponse.json(
        { error: 'Hourly request limit reached. Please try again later.' },
        { status: 429 }
      );
    }

    if (rateData.totalRequests > MAX_REQUESTS_PER_DAY) {
      return NextResponse.json(
        { error: 'Daily request limit reached. Please try again tomorrow.' },
        { status: 429 }
      );
    }

    // Save updated data back to Redis
    try {
      await redis.set(`ratelimit:${ip}`, rateData, {
        ex: DAY_IN_MS / 1000
      });
    } catch (error) {
      console.error('Redis set error:', error);
      // Continue even if Redis save fails
    }

    return null;
  } catch (error) {
    console.error('Rate limit error:', error);
    // Allow the request to proceed if rate limiting fails
    return null;
  }
} 