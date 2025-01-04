import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { Redis } from '@upstash/redis';

interface RateLimit {
  count: number;
  lastReset: number;
  totalRequests: number;
  dailyReset: number;
}

const redis = new Redis({
  url: process.env.STORAGE_KV_REST_API_URL!,
  token: process.env.STORAGE_KV_REST_API_TOKEN!
});

const HOUR_IN_MS = 60 * 60 * 1000;
const DAY_IN_MS = 24 * HOUR_IN_MS;
const MAX_REQUESTS_PER_HOUR = 5;
const MAX_REQUESTS_PER_DAY = 50;
const MIN_CONTENT_LENGTH = 50;
const MAX_CONTENT_LENGTH = 2000;

export async function rateLimit(content?: string) {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || 'unknown';
  const now = Date.now();

  const userData = await redis.get<RateLimit>(`ratelimit:${ip}`);
  const rateData: RateLimit = userData || {
    count: 0,
    lastReset: now,
    totalRequests: 0,
    dailyReset: now,
  };

  if (now - rateData.dailyReset > DAY_IN_MS) {
    rateData.totalRequests = 0;
    rateData.dailyReset = now;
  }

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

  rateData.count++;
  rateData.totalRequests++;

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

  await redis.set(`ratelimit:${ip}`, rateData, {
    ex: DAY_IN_MS / 1000
  });

  return null;
} 