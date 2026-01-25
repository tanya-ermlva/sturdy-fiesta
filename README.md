# Portfolio Website

A playful portfolio website built with Next.js, TypeScript, and Tailwind CSS, ready for deployment on Vercel with a custom domain.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git (already initialized)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
```

3. Edit `.env.local` and add your API keys (if needed for AI features):
```env
OPENAI_API_KEY=your_key_here
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see your portfolio.

### Build

Create a production build:

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## 📁 Project Structure

```
Portfolio/
├── app/                    # Next.js App Router directory
│   ├── api/               # API routes (server-side only)
│   │   └── example/       # Example API route
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/            # Reusable React components
├── public/                # Static assets (images, etc.)
├── .env.local.example     # Environment variables template
├── next.config.js         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## 🔐 Secure API Calls

This project is set up to make secure API calls using Next.js API routes. API keys are stored in `.env.local` and are **never exposed to the browser**.

### Example Usage

1. Create an API route in `app/api/your-feature/route.ts`:
```typescript
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const apiKey = process.env.YOUR_API_KEY; // Safe! Never exposed
  // Make your API call here
  return NextResponse.json({ success: true });
}
```

2. Call it from your React components:
```typescript
const response = await fetch('/api/your-feature', {
  method: 'POST',
  body: JSON.stringify({ data: 'your data' }),
});
```

See `app/api/example/route.ts` for a complete example.

## 🎨 Styling

This project uses Tailwind CSS with a playful color palette. Customize colors in `tailwind.config.ts`:

```typescript
playful: {
  primary: "#FF6B9D",
  secondary: "#4ECDC4",
  accent: "#FFE66D",
  // ... customize to your taste!
}
```

## 🚢 Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub (if not already):
```bash
git add .
git commit -m "Initial portfolio setup"
git push origin main
```

2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "New Project"
4. Import your repository
5. Vercel will auto-detect Next.js settings
6. Add environment variables in Vercel dashboard (Settings → Environment Variables)
7. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to link your project

### Custom Domain Setup

1. In your Vercel project dashboard, go to Settings → Domains
2. Add your custom domain
3. Follow Vercel's instructions to update your DNS records
4. Vercel will automatically provision SSL certificates

## 📝 Environment Variables

**Important:** Never commit `.env.local` to git! It's already in `.gitignore`.

For Vercel deployment:
1. Go to your project settings in Vercel
2. Navigate to Environment Variables
3. Add the same variables you have in `.env.local`
4. Vercel will use these in production

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🎯 Next Steps

- Customize the homepage in `app/page.tsx`
- Add your components in the `components/` directory
- Create new API routes in `app/api/` for your AI features
- Update colors and styling in `tailwind.config.ts`
- Add your portfolio content and projects!

Happy coding! 🎨
