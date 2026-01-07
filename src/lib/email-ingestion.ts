import Imap from 'imap';
import { simpleParser, ParsedMail } from 'mailparser';
import { prisma } from './prisma';

interface EmailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
}

export class EmailIngestion {
  private imap: Imap;
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
    this.imap = new Imap({
      user: config.user,
      password: config.password,
      host: config.host,
      port: config.port,
      tls: true,
      tlsOptions: { rejectUnauthorized: false }
    });
  }

  async fetchJobAlerts(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.imap.once('ready', () => {
        this.imap.openBox('INBOX', false, (err) => {
          if (err) return reject(err);

          const searchCriteria: any[] = [['UNSEEN']];

          this.imap.search(searchCriteria, (searchErr, results) => {
            if (searchErr) return reject(searchErr);

            if (!results || results.length === 0) {
              console.log('No new emails found');
              this.imap.end();
              return resolve();
            }

            const fetcher = this.imap.fetch(results, { bodies: '' });

            fetcher.on('message', (msg) => {
              // IMPORTANT: "stream" typing may appear as ReadableStream in Next/Vercel builds.
              // mailparser expects a Node stream (Source). Casting avoids TS build failure.
              msg.on('body', (stream: any) => {
                simpleParser(stream as any, async (parseErr, parsed) => {
                  if (parseErr) {
                    console.error('Error parsing email:', parseErr);
                    return;
                  }
                  await this.processJobEmail(parsed);
                });
              });
            });

            fetcher.once('error', (e) => {
              try {
                this.imap.end();
              } catch {}
              reject(e);
            });

            fetcher.once('end', () => {
              this.imap.end();
              resolve();
            });
          });
        });
      });

      this.imap.once('error', reject);
      this.imap.connect();
    });
  }

  private async processJobEmail(email: ParsedMail): Promise<void> {
    try {
      const text = email.text || '';
      const html = typeof email.html === 'string' ? email.html : '';

      const urlRegex = /(https?:\/\/[^\s"']+)/gi;
      const urls = [...text.matchAll(urlRegex), ...html.matchAll(urlRegex)]
        .map((m) => m[1])
        .filter((u, i, arr) => arr.indexOf(u) === i)
        .slice(0, 10);

      for (const url of urls) {
        const existing = await prisma.job.findFirst({ where: { sourceUrl: url } });
        if (existing) continue;

        await prisma.job.create({
          data: {
            source: this.getSourceFromUrl(url),
            sourceUrl: url,
            datePosted: new Date(),
            title: email.subject || 'Job Alert',
            company: 'Unknown',
            location: 'Unknown',
            jobType: 'full-time',
            remotePolicy: 'unknown',
            descriptionRaw: text,
            parsed: JSON.stringify({
              requirements: {
                education: [],
                experience_years: '0-2',
                languages: [],
                must_have_skills: [],
                nice_to_have_skills: []
              },
              responsibilities: [],
              keywords: []
            })
          }
        });

        console.log(`✅ Ingested job link: ${url}`);
      }
    } catch (error) {
      console.error('Error processing job email:', error);
    }
  }

  private getSourceFromUrl(url: string): string {
    if (url.includes('linkedin.com')) return 'LinkedIn';
    if (url.includes('indeed.')) return 'Indeed';
    if (url.includes('stepstone.')) return 'StepStone';
    if (url.includes('glassdoor.')) return 'Glassdoor';
    return 'Email';
  }
}
