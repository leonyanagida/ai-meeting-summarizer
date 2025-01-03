import { HfInference } from '@huggingface/inference';
import { rateLimit } from '../config/rate-limiter';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
const MIN_RESPONSE_TIME = 5000;

export async function POST(request: Request) {
  try {
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

    // Check for potential spam patterns
    const spamPatterns = [
      // Common spam keywords
      /\b(viagra|casino|lottery|prize|crypto|bitcoin|forex|porn|xxx|sex|dating)\b/i,

      // URLs and links
      /\b(http|https|www\.)\S+/i,

      // Repeated characters (e.g., "aaaaa")
      /(.)\1{4,}/,

      // Excessive capitalization
      /[A-Z]{5,}/,

      // Common spam phrases
      /\b(make money|get rich|earn fast|free offer|winner|you won|congratulation|\\$\\$\\$)\b/i,

      // Email addresses
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,

      // Phone numbers
      /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/,

      // Excessive punctuation
      /[!?]{3,}|[.]{4,}/,

      // Cryptocurrency wallet addresses
      /\b(0x[a-fA-F0-9]{40}|bc1[a-zA-Z0-9]{25,39})\b/,

      // Non-meeting related promotional content
      /\b(discount|sale|offer|limited time|buy now|click here|subscribe|sign up today)\b/i
    ];

    if (spamPatterns.some(pattern => pattern.test(notes))) {
      return new Response(
        JSON.stringify({
          error: 'Invalid content detected. Please ensure your input contains only meeting notes.'
        }),
        { status: 400 }
      );
    }

    // Record start time
    const startTime = Date.now();

    // Generate the summary
    const result = await hf.summarization({
      model: 'philschmid/bart-large-cnn-samsum',
      inputs: notes,
      parameters: {
        max_length: 250,
        min_length: 100,
        temperature: 0.7,
      },
    });

    // Calculate how long the operation took
    const operationTime = Date.now() - startTime;

    // If operation was faster than MIN_RESPONSE_TIME, wait for the remaining time
    if (operationTime < MIN_RESPONSE_TIME) {
      await new Promise(resolve => setTimeout(resolve, MIN_RESPONSE_TIME - operationTime));
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
  } catch (error) {
    console.error('Summarization error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to summarize text' }),
      { status: 500 }
    );
  }
}
