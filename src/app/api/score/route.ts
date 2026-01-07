import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateCompatibilityScore } from '@/lib/scoring';
import { CandidateProfile, JobParsed } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { jobId } = await request.json();
    if (!jobId) return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 });

    const profiles = await prisma.candidateProfile.findMany({ orderBy: { updatedAt: 'desc' }, take: 1 });
    if (profiles.length === 0) return NextResponse.json({ error: 'No candidate profile found' }, { status: 404 });

    const candidate: CandidateProfile = JSON.parse(profiles[0].data);
    const jobParsed: JobParsed = JSON.parse(job.parsed);

    const scoreData = calculateCompatibilityScore(candidate, jobParsed, job.title, job.location, job.remotePolicy);

    const score = await prisma.compatibilityScore.create({
      data: {
        jobId: job.id,
        candidateId: profiles[0].id,
        overallScore: scoreData.overall_score,
        subScores: JSON.stringify(scoreData.sub_scores),
        gapList: JSON.stringify(scoreData.gap_list),
        riskList: JSON.stringify(scoreData.risk_list),
        recommendation: scoreData.recommendation
      }
    });

    return NextResponse.json({ scoreId: score.id, ...scoreData });
  } catch (error) {
    console.error('Error calculating score:', error);
    return NextResponse.json({ error: 'Failed to calculate score' }, { status: 500 });
  }
}
