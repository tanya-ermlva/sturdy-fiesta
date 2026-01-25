import { NextResponse } from 'next/server';

/**
 * Example API route demonstrating secure server-side API calls
 * 
 * This route runs on the server, so API keys are never exposed to the browser.
 * 
 * Usage:
 * - Call from your React components: fetch('/api/example')
 * - Add your API keys to .env.local (never commit this file!)
 * - Access keys server-side: process.env.YOUR_API_KEY
 */

export async function GET() {
  try {
    // Example: Making a secure API call
    // Replace this with your actual API endpoint
    // const apiKey = process.env.YOUR_API_KEY; // Safe! Never exposed to browser
    // const response = await fetch('https://api.example.com/data', {
    //   headers: {
    //     'Authorization': `Bearer ${apiKey}`,
    //   },
    // });
    // const data = await response.json();

    return NextResponse.json({
      message: 'API route is working!',
      note: 'This is a secure server-side endpoint. API keys used here are never exposed to the browser.',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// Example POST handler for AI features
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Example: Secure AI API call
    // const apiKey = process.env.OPENAI_API_KEY; // Hidden from browser!
    // const response = await fetch('https://api.openai.com/v1/chat/completions', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${apiKey}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(body),
    // });
    // const data = await response.json();

    return NextResponse.json({
      message: 'POST request received',
      received: body,
      note: 'This endpoint can securely call external APIs without exposing keys.',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
