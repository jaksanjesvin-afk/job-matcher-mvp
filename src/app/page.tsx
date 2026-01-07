import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Job Matcher MVP</h1>
        <p className="text-lg text-gray-600 mb-8">
          Discover jobs, get compatibility scores, and generate tailored CVs and cover letters.
        </p>

        <div className="space-y-4">
          <Link href="/jobs" className="block w-full py-3 px-6 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Browse Jobs
          </Link>

          <Link href="/profile" className="block w-full py-3 px-6 text-center bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
            Edit Profile
          </Link>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h2 className="font-semibold text-gray-900 mb-2">Features:</h2>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>✅ Job compatibility scoring (0-100)</li>
            <li>✅ Gap & risk analysis</li>
            <li>✅ ATS-safe CV generation</li>
            <li>✅ Cover letter in EN & DE</li>
            <li>✅ GDPR-style redaction (PII removed from LLM prompts)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
