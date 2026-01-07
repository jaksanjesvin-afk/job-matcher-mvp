import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Job Matcher MVP',
  description: 'Job discovery, compatibility scoring, and CV/cover letter tailoring system',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
