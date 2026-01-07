import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { redactPIIFromText } from '@/lib/pii-redaction';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
});

export async function POST(request: NextRequest) {
  try {
    const { prompt, candidateProfile } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    let cleanPrompt = prompt;
    if (candidateProfile) {
      cleanPrompt = redactPIIFromText(prompt, candidateProfile);
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'Missing ANTHROPIC_API_KEY in .env' }, { status: 400 });
    }

    const message = await anthropic.messages.create({
      model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      messages: [{ role: 'user', content: cleanPrompt }]
    });

    const textPart = message.content.find((c: any) => c.type === 'text');
    const responseText = textPart && 'text' in textPart ? (textPart as any).text : '';

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error('LLM API error:', error);
    return NextResponse.json({ error: 'Failed to call LLM API' }, { status: 500 });
  }
}
