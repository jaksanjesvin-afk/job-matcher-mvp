import { EmailIngestion } from '../src/lib/email-ingestion';

async function main() {
  const config = {
    host: process.env.EMAIL_HOST || 'imap.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '993', 10),
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || ''
  };

  if (!config.user || !config.password) {
    console.log('⚠️ Email credentials not configured. Skipping email ingestion.');
    return;
  }

  console.log('📧 Starting email job alert ingestion...');
  const ingestion = new EmailIngestion(config);
  await ingestion.fetchJobAlerts();
  console.log('✅ Email ingestion completed');
}

main().catch((err) => {
  console.error('❌ Email ingestion failed:', err);
  process.exit(1);
});
