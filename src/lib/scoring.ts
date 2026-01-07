import { CandidateProfile, JobParsed, CompatibilityScoreData, SubScore } from '@/types';

function makeSub(score: number, weight: number, details: string): SubScore {
  return { score: Math.round(score), weight, details };
}

function normalizeLevel(level: string): number {
  const s = (level || '').toUpperCase();
  if (s.includes('C2')) return 6;
  if (s.includes('C1')) return 5;
  if (s.includes('B2')) return 4;
  if (s.includes('B1')) return 3;
  if (s.includes('A2')) return 2;
  if (s.includes('A1')) return 1;
  return 0;
}

export function calculateCompatibilityScore(
  candidate: CandidateProfile,
  jobParsed: JobParsed,
  _jobTitle: string,
  location: string,
  remotePolicy: string
): CompatibilityScoreData {
  const mustHave = calculateMustHaveMatch(candidate, jobParsed, location);
  const keyword = calculateKeywordMatch(candidate, jobParsed);
  const seniority = calculateSeniorityFit(candidate, jobParsed.requirements.experience_years || '');
  const loc = calculateLocationFit(candidate, location, remotePolicy);
  const domain = calculateDomainFit(candidate, jobParsed.keywords || []);

  let overall =
    mustHave.score * 0.35 +
    keyword.score * 0.25 +
    seniority.score * 0.15 +
    loc.score * 0.15 +
    domain.score * 0.10;

  const gaps = generateGapList(candidate, jobParsed);
  const risks = generateRiskList(candidate, jobParsed, mustHave.score, seniority.score);

  // Hard caps for strict language requirements (simple MVP heuristic)
  const reqLangs = jobParsed.requirements.languages || [];
  for (const req of reqLangs) {
    const reqN = normalizeLevel(req.level);
    if (reqN >= 5) {
      const cand = candidate.languages.find(l => l.language.toLowerCase() === req.language.toLowerCase());
      const candN = cand ? normalizeLevel(cand.level) : 0;
      if (candN < reqN) {
        overall = Math.min(overall, 45);
        break;
      }
    }
  }

  let recommendation = 'RISKY - Missing critical requirements';
  if (overall >= 80) recommendation = 'APPLY - Strong fit';
  else if (overall >= 60) recommendation = 'APPLY - Address gaps in cover letter';

  return {
    overall_score: Math.round(overall),
    sub_scores: {
      must_have_match: mustHave,
      keyword_match: keyword,
      seniority_fit: seniority,
      location_fit: loc,
      domain_fit: domain
    },
    gap_list: gaps,
    risk_list: risks,
    recommendation
  };
}

function calculateMustHaveMatch(candidate: CandidateProfile, jobParsed: JobParsed, _location: string): SubScore {
  const details: string[] = [];

  const hasRelevantDegree = candidate.education.some(e => /food|nutrition|engineering/i.test(e.field));
  const degree = hasRelevantDegree ? 100 : 70;
  details.push(`Education: ${degree}/100`);

  const auth = /eu/i.test(candidate.personal.work_authorization) ? 100 : 60;
  details.push(`Work auth: ${auth}/100`);

  const reqLangs = jobParsed.requirements.languages || [];
  let langScore = 100;
  for (const req of reqLangs) {
    const cand = candidate.languages.find(l => l.language.toLowerCase() === req.language.toLowerCase());
    if (!cand) {
      langScore = Math.min(langScore, 40);
      continue;
    }
    const reqN = normalizeLevel(req.level);
    const candN = normalizeLevel(cand.level);
    if (candN >= reqN) langScore = Math.min(langScore, 100);
    else if (candN === reqN - 1) langScore = Math.min(langScore, 75);
    else langScore = Math.min(langScore, 55);
  }
  details.push(`Language: ${langScore}/100`);

  const expReq = (jobParsed.requirements.experience_years || '').toLowerCase();
  const hasAnyExp = candidate.experience.length > 0;
  let exp = 100;
  if (expReq.includes('2+') && !hasAnyExp) exp = 60;
  details.push(`Experience: ${exp}/100`);

  const total = degree * 0.25 + auth * 0.25 + langScore * 0.25 + exp * 0.25;
  return makeSub(total, 0.35, details.join(', '));
}

function calculateKeywordMatch(candidate: CandidateProfile, jobParsed: JobParsed): SubScore {
  const cand = new Set([
    ...candidate.skills.technical.map(s => s.toLowerCase()),
    ...candidate.skills.tools.map(s => s.toLowerCase()),
    ...candidate.skills.domains.map(s => s.toLowerCase()),
    ...candidate.projects.flatMap(p => p.keywords.map(k => k.toLowerCase()))
  ]);

  const must = (jobParsed.requirements.must_have_skills || []).map(s => s.toLowerCase());
  const nice = (jobParsed.requirements.nice_to_have_skills || []).map(s => s.toLowerCase());

  const mustMatches = must.filter(s => cand.has(s));
  const niceMatches = nice.filter(s => cand.has(s));

  const mustPart = must.length ? (mustMatches.length / must.length) * 70 : 70;
  const nicePart = nice.length ? (niceMatches.length / nice.length) * 30 : 30;

  const total = mustPart + nicePart;
  return makeSub(total, 0.25, `${mustMatches.length}/${must.length} must-have, ${niceMatches.length}/${nice.length} nice-to-have`);
}

function calculateSeniorityFit(candidate: CandidateProfile, jobExpYears: string): SubScore {
  const expReq = (jobExpYears || '').toLowerCase();
  const hasAny = candidate.experience.length > 0;
  let score = 100;
  if (expReq.includes('2+') && !hasAny) score = 70;
  return makeSub(score, 0.15, `Job asks: ${jobExpYears || 'N/A'}`);
}

function calculateLocationFit(candidate: CandidateProfile, jobLocation: string, remotePolicy: string): SubScore {
  const rp = (remotePolicy || '').toLowerCase();
  const jobLoc = (jobLocation || '').toLowerCase();
  const candLoc = (candidate.personal.location || '').toLowerCase();

  if (rp === 'remote') return makeSub(100, 0.15, 'Remote role');
  const city = jobLoc.split(',')[0]?.trim();
  if (city && candLoc.includes(city)) return makeSub(100, 0.15, 'Same city');

  if (candidate.preferences.locations?.some(l => jobLoc.includes(l.toLowerCase()))) {
    return makeSub(80, 0.15, 'Preferred location');
  }
  return makeSub(50, 0.15, 'Relocation/commute needed');
}

function calculateDomainFit(candidate: CandidateProfile, jobKeywords: string[]): SubScore {
  const candDomains = new Set(candidate.skills.domains.map(d => d.toLowerCase()));
  const job = new Set((jobKeywords || []).map(k => k.toLowerCase()));
  const overlap = [...candDomains].filter(d => job.has(d)).length;
  const score = job.size ? (overlap / job.size) * 100 : 75;
  return makeSub(score, 0.10, `${overlap} overlapping domain terms`);
}

function generateGapList(candidate: CandidateProfile, jobParsed: JobParsed): string[] {
  const gaps: string[] = [];
  const cand = new Set([
    ...candidate.skills.technical.map(s => s.toLowerCase()),
    ...candidate.skills.tools.map(s => s.toLowerCase())
  ]);

  const missingMust = (jobParsed.requirements.must_have_skills || []).filter(s => !cand.has(s.toLowerCase()));
  if (missingMust.length) gaps.push(`Missing must-have keywords (only add if true): ${missingMust.join(', ')}`);

  const missingNice = (jobParsed.requirements.nice_to_have_skills || []).filter(s => !cand.has(s.toLowerCase()));
  if (missingNice.length) gaps.push(`Consider highlighting if true: ${missingNice.slice(0, 3).join(', ')}`);

  // Language gap hints
  const reqLangs = jobParsed.requirements.languages || [];
  for (const req of reqLangs) {
    const candLang = candidate.languages.find(l => l.language.toLowerCase() === req.language.toLowerCase());
    if (!candLang) continue;
    const reqN = normalizeLevel(req.level);
    const candN = normalizeLevel(candLang.level);
    if (candN < reqN) {
      gaps.push(`${req.language}: you have ${candLang.level} but job asks ${req.level} (mention active improvement)`);
    }
  }

  return gaps;
}

function generateRiskList(candidate: CandidateProfile, jobParsed: JobParsed, mustHave: number, seniority: number): string[] {
  const risks: string[] = [];
  if (mustHave < 70) risks.push('⚠️ Must-have match is low; may be screened out');

  const reqLangs = jobParsed.requirements.languages || [];
  for (const req of reqLangs) {
    const reqN = normalizeLevel(req.level);
    if (reqN >= 5) {
      const cand = candidate.languages.find(l => l.language.toLowerCase() === req.language.toLowerCase());
      const candN = cand ? normalizeLevel(cand.level) : 0;
      if (candN < reqN) risks.push(`⚠️ ${req.language} requirement (${req.level}) may be strict`);
    }
  }

  if (seniority < 70) risks.push('⚠️ Experience mismatch possible');
  if (!risks.length) risks.push('✅ No major risks identified');
  return risks;
}
