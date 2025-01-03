import { useState, useCallback } from 'react';
import Toast from './Toast';

const EXAMPLE_NOTES = [
  {
    title: "Product Team Standup",
    text: `Daily Standup Meeting
Date: March 15, 2024
Time: 10:00 AM EST
Attendees:
Sarah Chen (Product Manager)
Mike Ross (Frontend Dev)
Lisa Park (Backend Dev)
Tom Wilson (UX Designer)

Updates:
Sarah: Yesterday I finalized the Q2 roadmap and met with stakeholders. Blocked on getting final approval from legal for the new privacy features.

Mike: Completed the user dashboard redesign. Working on fixing the mobile responsiveness issues. Need design review from Tom.

Lisa: Database migration is 80% complete. Found some performance issues with the new query structure. Will need another day to optimize.

Tom: Finished the new onboarding flow mockups. Starting user testing today. Need feedback on the color scheme from the team.

Action Items:
- Schedule legal review meeting by EOD (Sarah)
- Complete mobile responsive fixes by Friday (Mike)
- Optimize database queries by Thursday (Lisa)
- Share user testing results by next standup (Tom)

Next Meeting: Tomorrow, same time.`
  },
  {
    title: "Client Project Kickoff",
    text: `Project Kickoff: E-commerce Website Redesign
Date: March 14, 2024
Attendees:
John Smith (Project Manager)
Emma Davis (Client Lead)
Alex Wong (Tech Lead)
Rachel Green (UX/UI Designer)

Key Discussion Points:
1. Project Overview
- Complete redesign of client's e-commerce platform
- Focus on mobile-first approach
- Target launch date: June 1st, 2024

2. Client Requirements
- Modern, minimalist design
- Improved checkout process
- Better product search and filtering
- Integration with existing inventory system

3. Technical Considerations
- Migration from Magento to Shopify
- Need to maintain SEO rankings
- Custom middleware for inventory sync

Budget: $75,000
Timeline: 12 weeks

Next Steps:
1. Rachel to present initial wireframes by next week
2. Alex to assess technical requirements by Friday
3. Emma to provide brand guidelines by Monday
4. John to create detailed project timeline

Follow-up meeting scheduled for next Thursday at 2 PM.`
  }
];

export default function ExamplePrompts() {
  const [isVisible, setIsVisible] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }, []);

  return (
    <>
      <div className="space-y-4">
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
        >
          <svg
            className={`w-5 h-5 transition-transform ${isVisible ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
          View Example Meeting Notes
        </button>

        {isVisible && (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 mt-4">
            {EXAMPLE_NOTES.map((example, index) => (
              <div
                key={index}
                onClick={() => copyToClipboard(example.text)}
                className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 
                  hover:bg-gray-50 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-gray-700">{example.title}</h3>
                  <div className="text-sm text-indigo-600 group-hover:text-indigo-700 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copy
                  </div>
                </div>
                <p className="text-sm text-gray-500 line-clamp-3">
                  {example.text.split('\n').slice(0, 3).join('\n')}...
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <Toast message="Copied to clipboard!" isVisible={showToast} />
    </>
  );
} 