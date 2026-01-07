'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProfilePage() {
  const [profile, setProfile] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      const data = await response.json();
      setProfile(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    setMessage('');
    try {
      const parsed = JSON.parse(profile);
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed)
      });
      setMessage('✅ Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage('❌ Error saving profile. Check JSON format.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Home
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Candidate Profile</h1>
          <p className="text-gray-600 mb-6">
            Edit your profile as JSON. This data is used for compatibility scoring and document generation.
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Data (JSON format)
            </label>
            <textarea
              value={profile}
              onChange={(e) => setProfile(e.target.value)}
              className="w-full h-96 p-4 border rounded-lg font-mono text-sm"
              placeholder="Enter your profile as JSON..."
            />
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded ${message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {message}
            </div>
          )}

          <button
            onClick={saveProfile}
            disabled={saving}
            className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">💡 Privacy Note</h3>
            <p className="text-sm text-gray-700">
              Your PII (name, email, phone) is redacted when making LLM API calls, and restored only in the final documents.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
