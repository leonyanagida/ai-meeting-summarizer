export default function LoadingState() {
  return (
    <div className="rounded-lg bg-indigo-50 p-6 flex flex-col items-center space-y-4">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        <h3 className="mt-4 text-lg font-medium text-indigo-900">Summarizing your meeting...</h3>
      </div>

      <div className="w-full max-w-md space-y-3">
        <div className="text-sm text-indigo-700 text-center">
          This might take up to a minute as we:
        </div>
        <div className="space-y-2">
          {[
            'Analyze the meeting content',
            'Extract key discussion points',
            'Identify participants and dates',
            'Generate concise summary'
          ].map((step, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 text-sm text-indigo-600"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse"
                style={{ animationDelay: `${index * 300}ms` }}
              />
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-indigo-600 mt-4 text-center">
        Please don&apos;t refresh the page. We&apos;re using a free API which might take a moment to respond.
      </p>
    </div>
  );
} 