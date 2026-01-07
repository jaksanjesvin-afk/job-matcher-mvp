'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  remotePolicy: string;
  dateDiscovered: string;
  scores: Array<{ overallScore: number; recommendation: string }>;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [minScore, setMinScore] = useState(0);
  const [jobType, setJobType] = useState('');

  useEffect(() => {
    fetchJobs();
  }, [minScore, jobType]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('minScore', minScore.toString());
      if (jobType) params.append('jobType', jobType);

      const response = await fetch(`/api/jobs?${params}`);
      const data = await response.json();
      setJobs(data);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Job Opportunities</h1>
          <p className="text-gray-600 mt-2">Sorted by compatibility score</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex gap-4 flex-wrap">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Score</label>
              <input
                type="range"
                min="0"
                max="100"
                value={minScore}
                onChange={(e) => setMinScore(parseInt(e.target.value, 10))}
                className="w-48"
              />
              <span className="ml-2 text-sm text-gray-600">{minScore}+</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
              <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="border rounded px-3 py-2">
                <option value="">All Types</option>
                <option value="working student">Working Student</option>
                <option value="internship">Internship</option>
                <option value="full-time">Full-Time</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600">No jobs found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`} className="block bg-white rounded-lg shadow hover:shadow-md transition p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h2>
                    <p className="text-gray-600 mb-2">{job.company}</p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>📍 {job.location}</span>
                      <span>💼 {job.jobType}</span>
                      <span>🏠 {job.remotePolicy}</span>
                    </div>
                  </div>

                  {job.scores?.length > 0 && (
                    <div className="ml-4">
                      <div className={`text-2xl font-bold px-4 py-2 rounded-lg ${getScoreColor(job.scores[0].overallScore)}`}>
                        {job.scores[0].overallScore}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 text-center">Score</p>
                    </div>
                  )}
                </div>

                {job.scores?.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <span className="text-sm font-medium text-gray-700">{job.scores[0].recommendation}</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
