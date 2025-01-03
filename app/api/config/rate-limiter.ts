import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

interface RateLimitStore {
  [key: string]: {
    count: number;
    lastReset: number;
    totalRequests: number; // Track daily total
    dailyReset: number; // Daily reset timestamp
  };
}

const store: RateLimitStore = {};

const HOUR_IN_MS = 60 * 60 * 1000;
const DAY_IN_MS = 24 * HOUR_IN_MS;
const MAX_REQUESTS_PER_HOUR = 10;
const MAX_REQUESTS_PER_DAY = 50;
const MIN_CONTENT_LENGTH = 50; // Minimum characters required
const MAX_CONTENT_LENGTH = 2000; // Maximum characters allowed

export async function rateLimit(content?: string) {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || 'unknown';
  const now = Date.now();

  // Initialize or reset if needed
  if (!store[ip] || now - store[ip].lastReset > HOUR_IN_MS) {
    store[ip] = {
      count: 0,
      lastReset: now,
      totalRequests: store[ip]?.totalRequests || 0,
      dailyReset: store[ip]?.dailyReset || now,
    };
  }

  // Reset daily counts if needed
  if (now - store[ip].dailyReset > DAY_IN_MS) {
    store[ip].totalRequests = 0;
    store[ip].dailyReset = now;
  }

  // Content validation if provided
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
  store[ip].count++;
  store[ip].totalRequests++;

  // Check limits
  if (store[ip].count > MAX_REQUESTS_PER_HOUR) {
    return NextResponse.json(
      { error: 'Hourly request limit reached. Please try again later.' },
      { status: 429 }
    );
  }

  if (store[ip].totalRequests > MAX_REQUESTS_PER_DAY) {
    return NextResponse.json(
      { error: 'Daily request limit reached. Please try again tomorrow.' },
      { status: 429 }
    );
  }

  return null;
} 