import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const minScore = parseInt(searchParams.get('minScore') || '0', 10);
    const maxScore = parseInt(searchParams.get('maxScore') || '100', 10);
    const jobType = searchParams.get('jobType');

    const jobs = await prisma.job.findMany({
      include: {
        scores: { orderBy: { createdAt: 'desc' }, take: 1 }
      },
      orderBy: { dateDiscovered: 'desc' }
    });

    const filtered = jobs.filter(job => {
      if (jobType && job.jobType !== jobType) return false;
      const score = job.scores[0];
      if (score) return score.overallScore >= minScore && score.overallScore <= maxScore;
      return minScore === 0;
    });

    filtered.sort((a, b) => (b.scores[0]?.overallScore || 0) - (a.scores[0]?.overallScore || 0));

    return NextResponse.json(filtered);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const job = await prisma.job.create({
      data: {
        source: body.source || 'Manual',
        sourceUrl: body.sourceUrl,
        datePosted: new Date(body.datePosted || Date.now()),
        title: body.title,
        company: body.company,
        location: body.location,
        jobType: body.jobType || 'full-time',
        remotePolicy: body.remotePolicy || 'onsite',
        descriptionRaw: body.descriptionRaw,
        parsed: body.parsed || JSON.stringify({})
      }
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}
