import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCoverLetterPrompt } from '@/lib/prompts';
import { redactPII } from '@/lib/pii-redaction';
import { CandidateProfile, JobParsed } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { jobId, language = 'EN' } = await request.json();
    if (!jobId) return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });

    const profiles = await prisma.candidateProfile.findMany({ orderBy: { updatedAt: 'desc' }, take: 1 });
    if (profiles.length === 0) return NextResponse.json({ error: 'No candidate profile found' }, { status: 404 });

    const candidate: CandidateProfile = JSON.parse(profiles[0].data);
    const jobParsed: JobParsed = JSON.parse(job.parsed);

    const redactedCandidate = redactPII(candidate);
    const prompt = getCoverLetterPrompt(redactedCandidate, jobParsed, job.title, job.company, language);

    const llmResponse = await fetch(`${request.nextUrl.origin}/api/llm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, candidateProfile: candidate })
    });

    const payload = await llmResponse.json();
    const coverLetterContent = payload.response || '';

    const finalCoverLetter = coverLetterContent.replace(/\[CANDIDATE_NAME\]/g, candidate.personal.name);
    return NextResponse.json({ coverLetterContent: finalCoverLetter });
  } catch (error) {
    console.error('Error generating cover letter:', error);
    return NextResponse.json({ error: 'Failed to generate cover letter' }, { status: 500 });
  }
}
