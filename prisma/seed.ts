import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const candidateProfile = {
  personal: {
    name: "Alex Mueller",
    email: "alex.mueller@example.com",
    phone: "+49 151 1234 5678",
    location: "Munich, Germany",
    linkedin: "linkedin.com/in/alexmueller",
    work_authorization: "EU citizen"
  },
  education: [
    {
      degree: "Master of Science",
      field: "International Food Business & Consumer Studies",
      institution: "Technical University of Munich",
      location: "Munich, Germany",
      start_date: "2023-10",
      end_date: "2025-09 (expected)",
      gpa: "1.7"
    },
    {
      degree: "Bachelor of Engineering",
      field: "Food Engineering",
      institution: "University of Applied Sciences",
      location: "Berlin, Germany",
      start_date: "2019-10",
      end_date: "2023-07",
      gpa: "2.1"
    }
  ],
  languages: [
    { language: "English", level: "C1 (Fluent)" },
    { language: "German", level: "A2-B1 (Intermediate)" },
    { language: "Turkish", level: "Native" }
  ],
  skills: {
    technical: ["HACCP", "IFS", "ISO 22000", "GMP", "CAPA", "Risk Assessment", "Food Safety", "Quality Assurance"],
    tools: ["MS Office", "SAP (basic)", "Minitab", "Python (basic)"],
    domains: ["Food Safety", "Quality Assurance", "Supplier Quality", "Auditing", "Product Development"]
  },
  experience: [
    {
      title: "Quality Assurance Intern",
      company: "Müller Dairy GmbH",
      location: "Munich, Germany",
      start_date: "2022-06",
      end_date: "2022-12",
      responsibilities: [
        "Conducted daily HACCP checks across 3 production lines, ensuring compliance with food safety standards",
        "Assisted in 2 IFS audits; identified and documented corrective actions, contributing to successful certification",
        "Maintained quality documentation system for 50+ daily production batches"
      ]
    }
  ],
  projects: [
    {
      title: "SupplyOS - Supplier Quality Management System",
      context: "Master's Thesis Project",
      start_date: "2024-10",
      end_date: "2025-06 (expected)",
      description: "Developing a web-based decision-support tool for supplier audits, risk scoring, and CAPA tracking. Implements HACCP/IFS frameworks and generates traceability reports.",
      keywords: ["Supplier Quality", "Risk Assessment", "CAPA", "Audit Management", "Traceability", "Food Safety", "HACCP", "IFS"]
    }
  ],
  certifications: ["HACCP Certificate (German Food Safety Authority, 2022)"],
  target_roles: ["Quality Assurance", "Food Safety", "Supplier Quality", "Product Development", "Regulatory Affairs"],
  preferences: {
    job_types: ["working student", "internship", "junior full-time"],
    locations: ["Germany", "Remote within EU"],
    hybrid_onsite: ["remote", "hybrid", "onsite"],
    min_salary: "15"
  }
};

const jobs = [
  {
    source: "LinkedIn",
    sourceUrl: "https://linkedin.com/jobs/view/12345",
    datePosted: new Date("2025-01-03"),
    title: "Quality Assurance Working Student (m/w/d)",
    company: "Danone GmbH",
    location: "Munich, Germany",
    jobType: "working student",
    remotePolicy: "hybrid",
    descriptionRaw: `Quality Assurance Working Student (m/w/d) at Danone GmbH

Location: Munich, Germany (Hybrid)
Type: Working Student (20h/week)

Responsibilities:
- Support QA team in daily HACCP compliance checks
- Document deviations and corrective actions in our quality management system
- Assist in internal audits and preparation for IFS certification
- Maintain quality documentation and traceability records
- Support supplier quality audits and documentation

Requirements:
- Currently enrolled in Bachelor's or Master's program in Food Science, Food Technology, or related field
- Basic knowledge of HACCP and GMP principles
- German language skills B1 or higher (working language)
- English B1+ for documentation
- Proficient in MS Office (Excel, Word)
- Available 20 hours per week

Nice to Have:
- Previous internship in food industry QA/QC
- Familiarity with IFS or ISO 22000 standards
- Experience with SAP QM module
`,
    parsed: JSON.stringify({
      requirements: {
        education: ["Bachelor or Master in Food Science/Technology"],
        experience_years: "0-1",
        languages: [
          { language: "German", level: "B1+" },
          { language: "English", level: "B1+" }
        ],
        must_have_skills: ["HACCP", "GMP", "MS Office"],
        nice_to_have_skills: ["IFS", "ISO 22000", "SAP", "Auditing"]
      },
      responsibilities: [
        "Support QA team in daily HACCP compliance checks",
        "Document deviations and corrective actions in QMS",
        "Assist in internal audits and IFS certification preparation",
        "Maintain quality documentation and traceability records",
        "Support supplier quality audits"
      ],
      keywords: ["HACCP", "GMP", "IFS", "ISO 22000", "CAPA", "Food Safety", "Quality Assurance", "Supplier Audits", "Traceability", "Dairy"]
    })
  },
  {
    source: "StepStone",
    sourceUrl: "https://stepstone.de/job/67890",
    datePosted: new Date("2025-01-04"),
    title: "Junior Quality Manager Food Safety (m/w/d)",
    company: "REWE Group",
    location: "Cologne, Germany",
    jobType: "full-time",
    remotePolicy: "onsite",
    descriptionRaw: `Junior Quality Manager Food Safety

Tasks:
- Conduct supplier audits (HACCP, IFS, GLOBALG.A.P.)
- Manage corrective actions and supplier quality improvement programs
- Prepare quality reports and KPIs for management

Profile:
- Degree in Food Technology/Food Science
- 0-2 years of experience in food quality or food safety
- Fluent German (C1) and good English (B2)
- Willingness to travel (20-30%)
- Driver's license required
`,
    parsed: JSON.stringify({
      requirements: {
        education: ["Bachelor or Master in Food Technology/Food Science"],
        experience_years: "0-2",
        languages: [
          { language: "German", level: "C1" },
          { language: "English", level: "B2" }
        ],
        must_have_skills: ["HACCP", "IFS", "Food Safety", "Supplier Audits"],
        nice_to_have_skills: ["GLOBALG.A.P.", "Product Development", "Quality KPIs"]
      },
      responsibilities: [
        "Conduct supplier audits (HACCP, IFS, GLOBALG.A.P.)",
        "Manage corrective actions and supplier quality improvement",
        "Prepare quality reports and KPIs"
      ],
      keywords: ["HACCP", "IFS", "GLOBALG.A.P.", "Supplier Audits", "CAPA", "Food Safety", "Quality Manager", "Fresh Produce", "Product Development"]
    })
  },
  {
    source: "Indeed",
    sourceUrl: "https://indeed.com/job/54321",
    datePosted: new Date("2025-01-05"),
    title: "Supplier Quality Engineer - Food Industry",
    company: "Nestlé Deutschland",
    location: "Frankfurt, Germany",
    jobType: "full-time",
    remotePolicy: "hybrid",
    descriptionRaw: `Supplier Quality Engineer - Food Manufacturing

Key Responsibilities:
- Lead supplier audits and assessments (IFS, FSSC 22000, organic certifications)
- Manage non-conformances and CAPA processes
- Evaluate new suppliers and conduct risk assessments

Requirements:
- University degree in Food Science/Food Engineering
- Minimum 2 years experience in supplier quality or QA in food
- Excellent knowledge of IFS, FSSC 22000, HACCP
- Fluent in German and English (both C1 level)
`,
    parsed: JSON.stringify({
      requirements: {
        education: ["University degree in Food Science/Food Engineering"],
        experience_years: "2+",
        languages: [
          { language: "German", level: "C1" },
          { language: "English", level: "C1" }
        ],
        must_have_skills: ["IFS", "FSSC 22000", "HACCP", "Supplier Audits", "CAPA"],
        nice_to_have_skills: ["SAP", "Risk Assessment", "Project Management", "Digital Transformation"]
      },
      responsibilities: [
        "Lead supplier audits and assessments",
        "Manage non-conformances and CAPA processes",
        "Evaluate new suppliers and conduct risk assessments"
      ],
      keywords: ["IFS", "FSSC 22000", "HACCP", "Supplier Quality", "Auditing", "CAPA", "Risk Assessment", "Supply Chain", "Food Safety"]
    })
  }
];

async function main() {
  console.log('🌱 Seeding database...');

  await prisma.application.deleteMany();
  await prisma.compatibilityScore.deleteMany();
  await prisma.job.deleteMany();
  await prisma.candidateProfile.deleteMany();

  const profile = await prisma.candidateProfile.create({
    data: { data: JSON.stringify(candidateProfile) }
  });
  console.log('✅ Created candidate profile:', profile.id);

  for (const job of jobs) {
    const createdJob = await prisma.job.create({ data: job });
    console.log('✅ Created job:', createdJob.title);
  }

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
