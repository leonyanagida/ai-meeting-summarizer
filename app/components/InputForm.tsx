'use client';

import { useState } from 'react';
import Footer from './Footer';
import ExamplePrompts from './ExamplePrompts';
import Navigation from './Navigation';
import LoadingState from './LoadingState';

interface SummaryResult {
  summary: string;
  meetingDate: string;
  keyParticipants: string[];
}

export default function InputForm() {
  const MAX_CHARS = 2000; // Maximum characters allowed
  const MIN_CHARS = 50; // Minimum characters required

  const [notes, setNotes] = useState('');
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = async () => {
    if (!notes.trim()) {
      setError('Please enter some meeting notes to summarize');
      return;
    }

    if (notes.length < MIN_CHARS) {
      setError(`Please enter at least ${MIN_CHARS} characters for a meaningful summary`);
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setSummary(null);

      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 429) {
          throw new Error('You have reached the hourly limit. Please try again later.');
        }
        throw new Error(data.error);
      }
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to summarize text');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setNotes(text);
      setError('');
    }
  };

  const charCount = notes.length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <div className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-6 space-y-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Meeting Notes</h1>
              <p className="mt-2 text-gray-600">
                Paste your notes below for a summary
              </p>
            </div>

            <ExamplePrompts />

            {!isLoading ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Meeting Notes
                  </label>
                  <textarea
                    id="notes"
                    rows={8}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                      focus:border-indigo-500 focus:ring-indigo-500 
                      bg-gray-50 text-gray-900 
                      placeholder:text-gray-500
                      sm:text-sm p-4"
                    placeholder="Enter your meeting notes here..."
                    value={notes}
                    onChange={handleTextChange}
                    disabled={isLoading}
                  />
                  <div className="mt-2 flex justify-between text-sm text-gray-500">
                    <div />
                    <div>{charCount} / {MAX_CHARS}</div>
                  </div>
                </div>

                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="text-sm text-red-700">{error}</div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleSummarize}
                  disabled={isLoading}
                  className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                    ${isLoading
                      ? 'bg-indigo-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    }`}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Summarizing...</span>
                    </div>
                  ) : (
                    'Summarize Meeting'
                  )}
                </button>
              </div>
            ) : (
              <LoadingState />
            )}

            {summary && (
              <div className="mt-6">
                <div className="rounded-md bg-green-50 p-6 space-y-4">
                  <div>
                    <h2 className="text-lg font-medium text-green-900 mb-1">Meeting Date</h2>
                    <p className="text-sm text-green-700">{summary.meetingDate}</p>
                  </div>

                  <div>
                    <h2 className="text-lg font-medium text-green-900 mb-1">Key Participants</h2>
                    <ul className="list-disc list-inside text-sm text-green-700">
                      {summary.keyParticipants.map((participant, index) => (
                        <li key={index}>{participant}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h2 className="text-lg font-medium text-green-900 mb-1">Summary</h2>
                    <div className="text-sm text-green-700 whitespace-pre-wrap">{summary.summary}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
