import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export async function GET() {
    const { text } = await generateText({
        model: google("gemini-2.5-flash"),
        prompt: 'Explique física quântica para uma criança.',
    });
    return NextResponse.json({ message: text });
}
