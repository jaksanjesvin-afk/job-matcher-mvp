'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  remotePolicy: string;
  descriptionRaw: string;
  sourceUrl: string;
  scores: Array<{
    id: string;
    overallScore: number;
    subScores: string;
    gapList: string;
    riskList: string;
    recommendation: string;
  }>;
}

export default function JobDetailPage() {
  const params = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [scoring, setScoring] = useState(false);
  const [generatingCV, setGeneratingCV] = useState(false);
  const [generatingCL, setGeneratingCL] = useState(false);
  const [cvContent, setCvContent] = useState('');
  const [coverLetterEN, setCoverLetterEN] = useState('');
  const [coverLetterDE, setCoverLetterDE] = useState('');

  useEffect(() => {
    fetchJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  const fetchJob = async () => {
    try {
      const response = await fetch(`/api/jobs/${params.id}`);
      const data = await response.json();
      setJob(data);
    } finally {
      setLoading(false);
    }
  };

  const calculateScore = async () => {
    setScoring(true);
    try {
      await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: params.id })
      });
      await fetchJob();
    } finally {
      setScoring(false);
    }
  };

  const generateCV = async () => {
    setGeneratingCV(true);
    try {
      const response = await fetch('/api/generate/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: params.id, language: 'EN' })
      });
      const data = await response.json();
      setCvContent(data.cvContent || '');
    } finally {
      setGeneratingCV(false);
    }
  };

  const generateCoverLetter = async (lang: 'EN' | 'DE') => {
    setGeneratingCL(true);
    try {
      const response = await fetch('/api/generate/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: params.id, language: lang })
      });
      const data = await response.json();
      if (lang === 'EN') setCoverLetterEN(data.coverLetterContent || '');
      else setCoverLetterDE(data.coverLetterContent || '');
    } finally {
      setGeneratingCL(false);
    }
  };

  const downloadText = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-red-600">Job not found</p>
          <Link href="/jobs" className="text-blue-600 hover:underline">← Back to jobs</Link>
        </div>
      </div>
    );
  }

  const score = job.scores?.[0];
  const subScores = score ? JSON.parse(score.subScores) : null;
  const gapList = score ? JSON.parse(score.gapList) : [];
  const riskList = score ? JSON.parse(score.riskList) : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Link href="/jobs" className="text-blue-600 hover:underline mb-4 inline-block">← Back to jobs</Link>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <p className="text-xl text-gray-600 mb-4">{job.company}</p>
              <div className="flex gap-4 text-gray-600">
                <span>📍 {job.location}</span>
                <span>💼 {job.jobType}</span>
                <span>🏠 {job.remotePolicy}</span>
              </div>
            </div>

            {score && (
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">{score.overallScore}</div>
                <p className="text-sm text-gray-500">Compatibility Score</p>
                <p className="text-sm font-medium text-gray-700 mt-2">{score.recommendation}</p>
              </div>
            )}
          </div>

          {!score && (
            <button
              onClick={calculateScore}
              disabled={scoring}
              className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {scoring ? 'Calculating...' : 'Calculate Compatibility Score'}
            </button>
          )}

          {score && subScores && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(subScores).map(([key, value]: [string, any]) => (
                <div key={key} className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{value.score}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {key.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">{value.details}</p>
                </div>
              ))}
            </div>
          )}

          {gapList.length > 0 && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">📝 Gap Analysis</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                {gapList.map((gap: string, i: number) => (
                  <li key={i}>• {gap}</li>
                ))}
              </ul>
            </div>
          )}

          {riskList.length > 0 && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">⚠️ Risk Assessment</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                {riskList.map((risk: string, i: number) => (
                  <li key={i}>{risk}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 pt-6 border-t">
            <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              View Original Job Posting →
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Generate Application Documents</h2>

          <div className="space-y-4">
            <div>
              <button
                onClick={generateCV}
                disabled={generatingCV}
                className="w-full py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {generatingCV ? 'Generating CV...' : 'Generate Tailored CV (English)'}
              </button>

              {cvContent && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-900">Generated CV</h3>
                    <button
                      onClick={() => downloadText(cvContent, `CV_${job.company.replace(/\s/g, '_')}.txt`)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Download as TXT
                    </button>
                  </div>
                  <pre className="bg-gray-50 p-4 rounded-lg text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                    {cvContent}
                  </pre>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => generateCoverLetter('EN')}
                disabled={generatingCL}
                className="py-3 px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
              >
                {generatingCL ? 'Generating...' : 'Generate Cover Letter (EN)'}
              </button>
              <button
                onClick={() => generateCoverLetter('DE')}
                disabled={generatingCL}
                className="py-3 px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
              >
                {generatingCL ? 'Generating...' : 'Generate Cover Letter (DE)'}
              </button>
            </div>

            {coverLetterEN && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-900">Cover Letter (English)</h3>
                  <button
                    onClick={() => downloadText(coverLetterEN, `CoverLetter_EN_${job.company.replace(/\s/g, '_')}.txt`)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Download as TXT
                  </button>
                </div>
                <pre className="bg-gray-50 p-4 rounded-lg text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                  {coverLetterEN}
                </pre>
              </div>
            )}

            {coverLetterDE && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-gray-900">Cover Letter (German)</h3>
                  <button
                    onClick={() => downloadText(coverLetterDE, `CoverLetter_DE_${job.company.replace(/\s/g, '_')}.txt`)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Download as TXT
                  </button>
                </div>
                <pre className="bg-gray-50 p-4 rounded-lg text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                  {coverLetterDE}
                </pre>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
          <pre className="whitespace-pre-wrap text-sm text-gray-700">{job.descriptionRaw}</pre>
        </div>
      </div>
    </div>
  );
}
