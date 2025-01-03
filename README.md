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
```bash
cp .env.example .env.local
```
Then edit `.env.local` and add your Hugging Face API key

4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app

## ✨ Features

- **Instant Summaries**: Convert lengthy meeting transcripts into clear, actionable summaries
- **Key Information Extraction**: Automatically identifies meeting dates and participants
- **Modern UI/UX**: Clean, responsive interface with real-time feedback
- **Smart Rate Limiting**: Protects API from abuse while maintaining good user experience
- **Example Templates**: Built-in meeting note templates for easy testing
- **Security Features**: Spam detection and content validation

## 🛠️ Built With

- [Next.js 15](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Hugging Face](https://huggingface.co/) - AI model integration
- [Vercel](https://vercel.com) - Deployment

## 🎯 Project Purpose

This project was built in a few hours to demonstrate my ability to:
- Integrate AI tools into modern web applications
- Build clean, user-friendly interfaces
- Implement proper error handling and rate limiting
- Write maintainable, type-safe code
- Create responsive and accessible designs

## 🔒 Security Features

- Rate limiting (hourly and daily limits)
- Content validation
- Spam detection
- Input sanitization
- Maximum content length restrictions

## 🚦 Rate Limits

- 10 requests per hour
- 50 requests per day
- 50-2000 characters per request

## 🧑‍💻 Author

Leon Yanagida
- GitHub: [@leonyanagida](https://github.com/leonyanagida)

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
