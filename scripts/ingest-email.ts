import { EmailIngestion } from '../src/lib/email-ingestion';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  const config = {
    host: process.env.EMAIL_HOST || 'imap.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '993', 10),
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || ''
  };

  if (!config.user || !config.password) {
    console.log('⚠️  Email credentials not configured. Skipping email ingestion.');
    console.log('Set EMAIL_USER and EMAIL_PASSWORD in .env to enable.');
    return;
  }

  console.log('📧 Starting email job alert ingestion...');
  const ingestion = new EmailIngestion(config);

  try {
    await ingestion.fetchJobAlerts();
    console.log('✅ Email ingestion completed');
  } catch (error) {
    console.error('❌ Email ingestion failed:', error);
  }
}

main();
