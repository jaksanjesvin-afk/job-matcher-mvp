export interface CandidateProfile {
  personal: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    work_authorization: string;
  };
  education: Education[];
  languages: Language[];
  skills: {
    technical: string[];
    tools: string[];
    domains: string[];
  };
  experience: Experience[];
  projects: Project[];
  certifications: string[];
  target_roles: string[];
  preferences: {
    job_types: string[];
    locations: string[];
    hybrid_onsite: string[];
    min_salary?: string;
  };
}

export interface Education {
  degree: string;
  field: string;
  institution: string;
  location: string;
  start_date: string;
  end_date: string;
  gpa?: string;
}

export interface Language {
  language: string;
  level: string;
}

export interface Experience {
  title: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string;
  responsibilities: string[];
}

export interface Project {
  title: string;
  context: string;
  start_date: string;
  end_date: string;
  description: string;
  keywords: string[];
}

export interface JobParsed {
  requirements: {
    education: string[];
    experience_years: string;
    languages: Language[];
    must_have_skills: string[];
    nice_to_have_skills: string[];
  };
  responsibilities: string[];
  keywords: string[];
}

export interface SubScore {
  score: number;
  weight: number;
  details: string;
}

export interface CompatibilityScoreData {
  overall_score: number;
  sub_scores: {
    must_have_match: SubScore;
    keyword_match: SubScore;
    seniority_fit: SubScore;
    location_fit: SubScore;
    domain_fit: SubScore;
  };
  gap_list: string[];
  risk_list: string[];
  recommendation: string;
}
