# AI Meeting Summarizer

A modern web application that uses AI to transform lengthy meeting notes into concise, structured summaries. Built with Next.js, TypeScript, and Hugging Face's AI models.

## 🚀 Live Demo

Try it out: [AI Meeting Summarizer](https://ai-meeting-summarizer-liard.vercel.app)

## 💻 Getting Started

1. Clone the repository

```bash
git clone https://github.com/leonyanagida/ai-meeting-summarizer.git
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

### Option A: Local Development

```bash
cp .env.example .env.local
```

Then edit `.env.local` and add:

- Hugging Face API key from https://huggingface.co/settings/tokens
- Redis credentials (see Option 1 or 2 in .env.example)

### Option B: Deploy to Vercel

1. Fork this repository
2. Create a new project in Vercel
3. Add your Hugging Face API key in Environment Variables
4. Add Upstash Redis:

   - Go to your Vercel project
   - Click "Storage"
   - Select "Connect Store" -> "Upstash Redis"
   - Follow the prompts to create/connect your database
   - Vercel will automatically add STORAGE_KV_REST_API_URL and STORAGE_KV_REST_API_TOKEN

5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app

## ✨ Features

- **Instant Summaries**: Convert lengthy meeting transcripts into clear, actionable summaries
- **Key Information Extraction**: Automatically identifies meeting dates and participants
- **Modern UI/UX**: Clean, responsive interface with real-time feedback
- **Robust Rate Limiting**: Redis-powered rate limiting with fallback mechanisms
- **Timeout Handling**: Graceful handling of API timeouts with user feedback
- **Performance Optimization**: Minimum response time for better UX
- **Example Templates**: Built-in meeting note templates for easy testing
- **Security Features**: Spam detection and content validation

## 🛠️ Built With

- [Next.js 15](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Hugging Face](https://huggingface.co/) - AI model integration
- [Upstash Redis](https://upstash.com/) - Serverless Redis with automatic failover
- [Vercel](https://vercel.com) - Deployment

## 🎯 Project Purpose

This project was built in a few hours to demonstrate my ability to:

- Integrate AI tools into modern web applications
- Build clean, user-friendly interfaces
- Handle edge cases and API timeouts gracefully
- Implement resilient serverless architecture
- Write maintainable, type-safe code
- Create responsive and accessible designs

## 🔒 Security Features

- Rate limiting (hourly and daily limits)
- Redis-powered request tracking with failover
- Content validation
- Spam detection
- Input sanitization
- Maximum content length restrictions
- Timeout protection

## 🚦 Rate Limits

- 5 requests per hour
- 50 requests per day
- 50-2000 characters per request
- 30-second timeout protection
- 3-second minimum response time

## 🧑‍💻 Author

Leon Yanagida

- GitHub: [@leonyanagida](https://github.com/leonyanagida)

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
