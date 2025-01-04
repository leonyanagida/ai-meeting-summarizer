import { HfInference } from '@huggingface/inference';
import { rateLimit } from '../config/rate-limiter';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export const maxDuration = 30; // Extend Vercel's function timeout to 30 seconds
export const dynamic = 'force-dynamic'; // Disable static optimization

const MIN_RESPONSE_TIME = 3000; // 3 seconds minimum delay

export async function POST(request: Request) {
  try {
    const startTime = Date.now();
    const { notes } = await request.json();

    // Apply rate limiting with content validation
    const rateLimitResult = await rateLimit(notes);
    if (rateLimitResult) return rateLimitResult;

    // Additional input validation
    if (!notes || typeof notes !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid input. Notes must be a string.' }),
        { status: 400 }
      );
    }

    // Generate the summary with a timeout
    const result = await Promise.race([
      hf.summarization({
        model: 'philschmid/bart-large-cnn-samsum',
        inputs: notes,
        parameters: {
          max_length: 250,
          min_length: 100,
          temperature: 0.7,
        },
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('API timeout')), 25000)
      ),
    ]) as { summary_text: string };

    // Calculate time spent and add delay if needed
    const timeSpent = Date.now() - startTime;
    if (timeSpent < MIN_RESPONSE_TIME) {
      await new Promise(resolve => setTimeout(resolve, MIN_RESPONSE_TIME - timeSpent));
    }

    // Process and return the result
    const summary = result.summary_text
      .replace(/\n+/g, '\n')
      .trim();

    const structuredSummary = {
      summary,
      meetingDate: notes.match(/Date: ([^\n]+)/)?.[1] || 'Not specified',
      keyParticipants: notes.match(/Attendees:([^]*?)(?=\n\n)/)?.[1]
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.trim()) || [],
    };

    return new Response(
      JSON.stringify(structuredSummary),
      { status: 200 }
    );
  } catch (error: Error | unknown) {
    console.error('Summarization error:', error);
    if (error instanceof Error && error.message === 'API timeout') {
      return new Response(
        JSON.stringify({
          error: 'The summarization is taking longer than expected. Please try again.'
        }),
        { status: 504 }
      );
    }
    return new Response(
      JSON.stringify({ error: 'Failed to summarize text' }),
      { status: 500 }
    );
  }
}
