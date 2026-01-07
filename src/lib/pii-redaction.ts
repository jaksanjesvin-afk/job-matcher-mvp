import { CandidateProfile } from '@/types';

export function redactPII(profile: CandidateProfile): CandidateProfile {
  return {
    ...profile,
    personal: {
      ...profile.personal,
      name: '[REDACTED_NAME]',
      email: '[REDACTED_EMAIL]',
      phone: '[REDACTED_PHONE]',
      linkedin: profile.personal.linkedin ? '[REDACTED_LINKEDIN]' : undefined
    }
  };
}

export function redactPIIFromText(text: string, profile: CandidateProfile): string {
  let redacted = text;

  // Redact name (escape regex)
  const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (profile.personal?.name) redacted = redacted.replace(new RegExp(esc(profile.personal.name), 'gi'), '[REDACTED_NAME]');
  if (profile.personal?.email) redacted = redacted.replace(new RegExp(esc(profile.personal.email), 'gi'), '[REDACTED_EMAIL]');
  if (profile.personal?.phone) {
    const phoneNormalized = profile.personal.phone.replace(/\s+/g, '');
    redacted = redacted.replace(new RegExp(esc(phoneNormalized), 'g'), '[REDACTED_PHONE]');
    redacted = redacted.replace(new RegExp(esc(profile.personal.phone), 'g'), '[REDACTED_PHONE]');
  }

  return redacted;
}
