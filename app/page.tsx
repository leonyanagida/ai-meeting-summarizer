import Link from 'next/link';
import Footer from './components/Footer';
import Navigation from './components/Navigation';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col">
      <Navigation />
      <div className="flex-grow">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Transform Your Meeting Notes</span>
              <span className="block text-indigo-600">Into Clear Summaries</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Instantly convert lengthy meeting transcripts into concise, actionable summaries using AI technology.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <Link
                href="/app"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent 
                  text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 
                  md:py-4 md:text-lg md:px-10 transition-colors duration-200"
              >
                Try It Now
              </Link>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-24 grid gap-8 grid-cols-1 md:grid-cols-3">
            {[
              {
                title: 'Quick Summaries',
                description: 'Get concise summaries of your meetings in seconds, saving valuable time.',
                icon: '⚡',
              },
              {
                title: 'Key Points Extraction',
                description: 'Automatically identify and highlight the most important discussion points.',
                icon: '🎯',
              },
              {
                title: 'Easy to Use',
                description: 'Simple interface that requires no training or complex setup.',
                icon: '✨',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="relative p-6 bg-white rounded-xl shadow-md hover:shadow-lg 
                  transition-shadow duration-200"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
