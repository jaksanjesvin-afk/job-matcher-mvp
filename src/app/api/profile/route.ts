import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const profiles = await prisma.candidateProfile.findMany({ orderBy: { updatedAt: 'desc' }, take: 1 });
    if (profiles.length === 0) return NextResponse.json({ error: 'No profile found' }, { status: 404 });
    return NextResponse.json(JSON.parse(profiles[0].data));
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const existing = await prisma.candidateProfile.findMany({ orderBy: { updatedAt: 'desc' }, take: 1 });

    const profile = existing.length
      ? await prisma.candidateProfile.update({ where: { id: existing[0].id }, data: { data: JSON.stringify(body) } })
      : await prisma.candidateProfile.create({ data: { data: JSON.stringify(body) } });

    return NextResponse.json(JSON.parse(profile.data));
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
