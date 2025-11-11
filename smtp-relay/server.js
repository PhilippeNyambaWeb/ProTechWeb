import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const {
  SMTP_HOST,
  SMTP_PORT = '587',
  SMTP_SECURE = 'false',
  SMTP_USER,
  SMTP_PASS,
  FROM_EMAIL,
  FROM_NAME = 'ProTechWeb',
  RELAY_KEY,
  PORT = 8080,
} = process.env;

if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !FROM_EMAIL || !RELAY_KEY) {
  console.error('Missing required environment variables. See .env.example');
  process.exit(1);
}

const app = express();
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: String(SMTP_SECURE).toLowerCase() === 'true',
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

app.post('/send', async (req, res) => {
  try {
    const apiKey = req.header('X-API-Key');
    if (apiKey !== RELAY_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { to, subject, text, replyTo, bcc, fromEmail, fromName } = req.body || {};
    if (!Array.isArray(to) || to.length === 0 || !subject || !text) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    const mailOptions = {
      from: {
        name: fromName || FROM_NAME,
        address: fromEmail || FROM_EMAIL,
      },
      to,
      subject,
      text,
      bcc,
      replyTo,
    };

    const info = await transporter.sendMail(mailOptions);
    return res.status(200).json({ ok: true, id: info.messageId });
  } catch (err) {
    console.error('SMTP relay error:', err);
    return res.status(500).json({ error: 'Relay send failed', details: String(err && err.message || err) });
  }
});

app.get('/health', (_req, res) => res.json({ ok: true }));

app.listen(Number(PORT), () => {
  console.log(`SMTP relay listening on :${PORT}`);
});

