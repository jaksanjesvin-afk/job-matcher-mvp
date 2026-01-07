import { CandidateProfile, JobParsed } from '@/types';

export function getCVGenerationPrompt(
  profile: CandidateProfile,
  jobParsed: JobParsed,
  jobTitle: string,
  company: string,
  language: 'EN' | 'DE'
): string {
  return `You are an ATS resume expert. Generate a tailored CV for the candidate below, optimized for the target job.

<candidate_profile>
${JSON.stringify(profile, null, 2)}
</candidate_profile>

<job_posting>
Title: ${jobTitle}
Company: ${company}
${JSON.stringify(jobParsed, null, 2)}
</job_posting>

<instructions>
CRITICAL ATS REQUIREMENTS:
1. Use 1-column layout, no tables, no text boxes, no icons, no headers/footers.
2. Use standard section headings: EDUCATION, EXPERIENCE, PROJECTS, SKILLS, CERTIFICATIONS.
3. Use consistent date format: "Month YYYY – Month YYYY" (e.g., "June 2022 – December 2022").
4. Use bullet points (•) for responsibilities; start each with action verb.
5. Include exact keywords from job posting (preserve job's exact terms).
6. Only include numbers/metrics if they already exist in the candidate profile. Otherwise do NOT invent metrics.
7. Do NOT fabricate experience, dates, tools, certifications, or company knowledge.
8. Keep bullets concise: 1-2 lines each, max 5 bullets per role.
9. Prioritize most relevant experience/skills for this job.
10. Language: ${language}

CRITICAL: Do NOT include the candidate's actual name, email, phone, or LinkedIn. Use placeholders:
[NAME]
[Email] | [Phone] | [LinkedIn] | [Location]

OUTPUT FORMAT:
Plain text, ready to paste into Word or ATS form. No JSON, no markdown formatting.

STRUCTURE:
---
[NAME]
[Email] | [Phone] | [LinkedIn] | [Location]

EDUCATION
[Degree], [Field] – [Institution], [Location]
[Start Date] – [End Date]

EXPERIENCE
[Job Title] – [Company], [Location]
[Start Date] – [End Date]
• [Tailored bullet 1]
• [Tailored bullet 2]

PROJECTS
[Project Title] – [Context]
[Start Date] – [End Date]
• [Description highlighting relevant keywords and outcomes]

SKILLS
Technical: ...
Tools: ...
Languages: ...

CERTIFICATIONS
• ...

---
</instructions>

Now generate the tailored CV.`;
}

export function getCoverLetterPrompt(
  profile: CandidateProfile,
  jobParsed: JobParsed,
  jobTitle: string,
  company: string,
  language: 'EN' | 'DE'
): string {
  return `You are a professional cover letter writer. Write a tailored cover letter for the candidate applying to the job below.

<candidate_profile>
${JSON.stringify(profile, null, 2)}
</candidate_profile>

<job_posting>
Title: ${jobTitle}
Company: ${company}
${JSON.stringify(jobParsed, null, 2)}
</job_posting>

<language>
${language}
</language>

<instructions>
TONE: Professional, specific, non-generic, human (not AI-sounding).

STRUCTURE (220-320 words):
1. Opening (2-3 sentences): role + why this company/role (keep it specific, no made-up facts).
2. Body: connect 2-3 job requirements to real experience/projects (use job keywords).
3. Address gaps honestly if needed (language level, years of experience).
4. Closing: thanks + availability.

CRITICAL: Do NOT include the candidate's actual name. Use [CANDIDATE_NAME] as placeholder.

GUARDRAILS:
- Do NOT fabricate achievements or company knowledge.
- Do NOT add certifications/tools not in profile.
- For German version: Formal tone ("Sehr geehrte Damen und Herren") and simple A2-B1 sentences.

</instructions>

Now write the cover letter.`;
}
