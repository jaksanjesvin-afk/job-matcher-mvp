# Job Matcher MVP

A job discovery, compatibility scoring, and CV/cover letter tailoring system built with Next.js, TypeScript, Prisma, and SQLite.

## Quick start

1) Install Node.js 18+

2) Create `.env`
```bash
cp .env.example .env
```
Add your real Anthropic key in `.env`.

3) Install & run
```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```
Open http://localhost:3000

## Notes
- `/jobs` shows seeded jobs (3 examples).
- Open a job → Calculate Score → Generate CV/Cover Letter.
- Email ingestion is optional:
```bash
npm run ingest:email
```

## Deploy (Vercel)
- Push this repo to GitHub
- Import to Vercel
- Add env vars in Vercel (same as `.env`)
- Build command: `npm run build`
- Output: Next.js default
