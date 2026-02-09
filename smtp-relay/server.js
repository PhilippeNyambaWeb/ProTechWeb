import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const {
  SMTP_HOST,
  SMTP_PORT = '587',
  SMTP_SECURE = 'false',
  SMTP_USER,
  SMTP_PASS,
  FROM_EMAIL,
  FROM_NAME = 'ProTechWeb',
  RETURN_PATH,
  RELAY_KEY,
  PORT = 8080,
  DB_HOST = 'localhost',
  DB_PORT = '3306',
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_CONNECTION_LIMIT = '5',
  ALLOWED_ORIGINS,
} = process.env;

const missing = [];
if (!SMTP_HOST) missing.push('SMTP_HOST');
if (!DB_USER) missing.push('DB_USER');
if (!DB_PASSWORD) missing.push('DB_PASSWORD');
if (!DB_NAME) missing.push('DB_NAME');
if (!RELAY_KEY) missing.push('RELAY_KEY');
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

const app = express();
app.set('trust proxy', true);
app.use(express.json({ limit: '512kb' }));

const allowedOrigins = (ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowAllOrigins = allowedOrigins.length === 0 || allowedOrigins.includes('*');

function originHost(origin) {
  if (!origin) return '';
  try {
    return new URL(origin).hostname.toLowerCase();
  } catch {
    return '';
  }
}

function isOriginAllowed(origin) {
  if (!origin) return true;
  if (allowAllOrigins) return true;
  if (allowedOrigins.includes(origin)) return true;
  const host = originHost(origin);
  return allowedOrigins.includes(host) || allowedOrigins.includes(`https://${host}`) || allowedOrigins.includes(`http://${host}`);
}

function originMatchesTenant(origin, domain) {
  if (!origin || !domain) return true;
  const host = originHost(origin);
  if (!host) return false;
  return host === domain || host.endsWith(`.${domain}`);
}

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (isOriginAllowed(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key, X-Tenant, X-Tenant-Domain');
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  return next();
});

const pool = mysql.createPool({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  connectionLimit: Number(DB_CONNECTION_LIMIT),
  charset: 'utf8mb4_unicode_ci',
});

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: String(SMTP_SECURE).toLowerCase() === 'true',
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

const tenantTransporters = new Map();

function normalizeDomain(value) {
  if (!value || typeof value !== 'string') return '';
  const raw = value.trim().toLowerCase();
  if (!raw) return '';
  try {
    const url = new URL(raw.includes('://') ? raw : `https://${raw}`);
    return url.hostname.replace(/^www\./, '');
  } catch {
    return raw.replace(/^https?:\/\//, '').split('/')[0].split(':')[0].replace(/^www\./, '');
  }
}

function envKeyForDomain(domain) {
  return domain.toUpperCase().replace(/[^A-Z0-9]+/g, '_');
}

function getEnvValue(keys) {
  for (const key of keys) {
    if (process.env[key]) return process.env[key];
  }
  return '';
}

function resolveTenantDomain(req, body) {
  const fromBody = normalizeDomain(body?.tenant || body?.domain);
  if (fromBody) return fromBody;
  const headerDomain = normalizeDomain(req.get('X-Tenant-Domain') || req.get('X-Tenant'));
  if (headerDomain) return headerDomain;
  const origin = normalizeDomain(req.get('Origin'));
  if (origin) return origin;
  const referer = normalizeDomain(req.get('Referer'));
  if (referer) return referer;
  return '';
}

async function fetchTenant(domain) {
  const [rows] = await pool.execute(
    `SELECT id, domain, name, contact_email, noreply_email, status
     FROM tenants
     WHERE domain = ? AND status = 'active'
     LIMIT 1`,
    [domain]
  );
  return rows?.[0] || null;
}

function getTenantTransporter(domain, noreplyEmail) {
  const key = `${domain}|${noreplyEmail}`;
  if (tenantTransporters.has(key)) return tenantTransporters.get(key);
  const domainKey = envKeyForDomain(domain);
  const smtpPass = getEnvValue([`NOREPLY_PASS__${domainKey}`, `SMTP_PASS__${domainKey}`]);
  const smtpUser = getEnvValue([`NOREPLY_USER__${domainKey}`]) || noreplyEmail;
  if (!smtpPass) {
    throw new Error(`Missing SMTP password for ${domain}. Expected NOREPLY_PASS__${domainKey}`);
  }
  const tenantTransporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: String(SMTP_SECURE).toLowerCase() === 'true',
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
  tenantTransporters.set(key, tenantTransporter);
  return tenantTransporter;
}

function validateEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function determinePriority(subject, message) {
  const urgentKeywords = ['urgent', 'asap', 'immediat', 'critique', 'probleme grave'];
  const highKeywords = ['important', 'rapidement', 'prioritaire', 'bug', 'erreur'];
  const combined = `${subject || ''} ${message || ''}`.toLowerCase();
  if (urgentKeywords.some((k) => combined.includes(k))) return 'urgent';
  if (highKeywords.some((k) => combined.includes(k))) return 'high';
  return 'medium';
}

function asciiSafe(input) {
  if (!input) return '';
  return String(input)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u00A0/g, ' ');
}

app.post('/send', async (req, res) => {
  try {
    const apiKey = req.header('X-API-Key');
    if (apiKey !== RELAY_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!SMTP_USER || !SMTP_PASS || !FROM_EMAIL) {
      return res.status(500).json({ error: 'SMTP_USER/SMTP_PASS/FROM_EMAIL not configured for /send' });
    }

    const { to, subject, text, html, replyTo, bcc, headers: customHeaders, fromEmail, fromName, priority } = req.body || {};
    const toList = Array.isArray(to) ? to : (typeof to === 'string' && to.length ? [to] : []);
    if (toList.length === 0 || !subject || (!text && !html)) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    const headers = {
      'Content-Language': 'fr-CA',
      'X-Mailer': 'ProTechWeb SMTP Relay',
      ...customHeaders,
    };

    const mailOptions = {
      from: { name: fromName || FROM_NAME, address: fromEmail || FROM_EMAIL },
      to: toList,
      subject,
      text: text || undefined,
      html: html || undefined,
      bcc,
      replyTo,
      headers,
      date: new Date(),
      textEncoding: 'quoted-printable',
      priority: priority || 'normal',
      envelope: RETURN_PATH ? { from: RETURN_PATH, to: toList } : undefined,
    };

    const info = await transporter.sendMail(mailOptions);
    return res.status(200).json({ ok: true, id: info.messageId });
  } catch (err) {
    console.error('SMTP relay error:', err);
    return res.status(500).json({ error: 'Relay send failed', details: String(err && err.message || err) });
  }
});

app.post('/forms/contact', async (req, res) => {
  try {
    const tenantDomain = resolveTenantDomain(req, req.body);
    if (!tenantDomain) {
      return res.status(400).json({ error: 'Missing tenant domain' });
    }
    const origin = req.get('Origin');
    if (origin && !originMatchesTenant(origin, tenantDomain)) {
      return res.status(403).json({ error: 'Origin does not match tenant domain' });
    }

    const { name, email, phone, subject, message, inquiryType } = req.body || {};
    if (!name || !validateEmail(email) || !subject || !message) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    const tenant = await fetchTenant(tenantDomain);
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    const priority = determinePriority(subject, message);
    const ipAddress = req.ip || null;
    const userAgent = req.get('User-Agent') || null;

    const [result] = await pool.execute(
      `INSERT INTO contact_submissions
        (tenant_id, name, email, phone, subject, message, inquiry_type, priority, status, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?)`,
      [
        tenant.id,
        name,
        email,
        phone || null,
        inquiryType ? `[${inquiryType}] ${subject}` : subject,
        message,
        inquiryType || null,
        priority,
        ipAddress,
        userAgent,
      ]
    );

    const submissionId = result?.insertId ? String(result.insertId) : 'N/A';
    const submittedAt = new Date().toLocaleString('fr-CA', { timeZone: 'America/Toronto' });

    const noreplyEmail = tenant.noreply_email || `noreply@${tenant.domain}`;
    const contactEmail = tenant.contact_email || `contact@${tenant.domain}`;
    const fromName = tenant.name || FROM_NAME;

    const asciiName = asciiSafe(name);
    const asciiSubject = asciiSafe(subject);
    const asciiMessage = asciiSafe(message);
    const asciiInquiry = asciiSafe(inquiryType || '');
    const asciiPriority = asciiSafe(priority.toUpperCase());

    const notificationText = `New contact submission (${tenant.domain})

REF: ${submissionId}
PRIORITY: ${asciiPriority}

Name: ${asciiName}
Email: ${email}
Phone: ${phone || 'Not provided'}
${inquiryType ? `Inquiry type: ${asciiInquiry}` : ''}
Subject: ${asciiSubject}

Message:
${asciiMessage}

Submitted at: ${submittedAt}`;

    const confirmationSubject = 'Confirmation de reception';
    const confirmationText = `Bonjour ${asciiName},

Nous avons bien recu votre message.

Reference: ${submissionId}
Date: ${submittedAt}
${inquiryType ? `Type de demande: ${asciiInquiry}` : ''}
Sujet: ${asciiSubject}

Resume:
${asciiMessage}

Nous vous repondrons sous 24 a 48 heures.

Merci,
${fromName}`;

    const confirmationHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${confirmationSubject}</title>
  <style>
    body { margin:0; padding:0; background:#f6f7f9; color:#1f2933; font-family: Arial, Helvetica, sans-serif; }
    .wrapper { width:100%; padding:24px 0; background:#f0f2f5; }
    .card { max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; padding:24px; }
    h2 { margin:0 0 12px; color:#1f3a5f; }
    .muted { color:#6b7280; font-size:13px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <h2>Confirmation de reception</h2>
      <p>Bonjour ${asciiName},</p>
      <p>Nous avons bien recu votre message.</p>
      <p class="muted">Reference: ${submissionId} | ${submittedAt}</p>
      ${inquiryType ? `<p><strong>Type:</strong> ${asciiInquiry}</p>` : ''}
      <p><strong>Sujet:</strong> ${asciiSubject}</p>
      <p><strong>Resume:</strong><br/>${asciiMessage.replace(/\n/g, '<br/>')}</p>
      <p>Nous vous repondrons sous 24 a 48 heures.</p>
      <p>${fromName}</p>
    </div>
  </div>
</body>
</html>`;

    const tenantTransporter = getTenantTransporter(tenant.domain, noreplyEmail);
    const [notificationResult, confirmationResult] = await Promise.allSettled([
      tenantTransporter.sendMail({
        from: { name: fromName, address: noreplyEmail },
        to: contactEmail,
        // Keep internal notification subjects neutral to reduce spam scoring.
        subject: `Contact form submission - Ref ${submissionId}`,
        text: notificationText,
        // Avoid cross-domain Reply-To on internal alerts; sender email is included in body.
        replyTo: contactEmail,
        headers: { 'Content-Language': 'fr-CA', 'X-Mailer': 'ProTechWeb SMTP Relay' },
        envelope: RETURN_PATH ? { from: RETURN_PATH, to: [contactEmail] } : undefined,
      }),
      tenantTransporter.sendMail({
        from: { name: fromName, address: noreplyEmail },
        to: email,
        subject: confirmationSubject,
        text: confirmationText,
        html: confirmationHtml,
        headers: { 'Content-Language': 'fr-CA', 'X-Mailer': 'ProTechWeb SMTP Relay' },
        priority: priority === 'urgent' ? 'high' : 'normal',
        envelope: RETURN_PATH ? { from: RETURN_PATH, to: [email] } : undefined,
      }),
    ]);

    const notificationSent = notificationResult.status === 'fulfilled';
    const confirmationSent = confirmationResult.status === 'fulfilled';

    if (!notificationSent) {
      console.error('Contact notification error:', notificationResult.reason);
    }
    if (!confirmationSent) {
      console.error('Contact confirmation error:', confirmationResult.reason);
    }

    return res.status(200).json({
      ok: true,
      submissionId,
      notificationSent,
      confirmationSent,
    });
  } catch (err) {
    console.error('Contact form error:', err);
    return res.status(500).json({ error: 'Contact form failed', details: String(err?.message || err) });
  }
});

app.post('/forms/newsletter', async (req, res) => {
  try {
    const tenantDomain = resolveTenantDomain(req, req.body);
    if (!tenantDomain) {
      return res.status(400).json({ error: 'Missing tenant domain' });
    }
    const origin = req.get('Origin');
    if (origin && !originMatchesTenant(origin, tenantDomain)) {
      return res.status(403).json({ error: 'Origin does not match tenant domain' });
    }

    const { email, name } = req.body || {};
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    const tenant = await fetchTenant(tenantDomain);
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    const ipAddress = req.ip || null;
    const userAgent = req.get('User-Agent') || null;

    await pool.execute(
      `INSERT INTO newsletter_subscribers
        (tenant_id, email, name, status, ip_address, user_agent)
       VALUES (?, ?, ?, 'subscribed', ?, ?)
       ON DUPLICATE KEY UPDATE status = 'subscribed', name = VALUES(name), ip_address = VALUES(ip_address), user_agent = VALUES(user_agent), updated_at = NOW()`,
      [tenant.id, email, name || null, ipAddress, userAgent]
    );

    const subscribedAt = new Date().toLocaleString('fr-CA', { timeZone: 'America/Toronto' });
    const noreplyEmail = tenant.noreply_email || `noreply@${tenant.domain}`;
    const contactEmail = tenant.contact_email || `contact@${tenant.domain}`;
    const fromName = tenant.name || FROM_NAME;
    const asciiName = asciiSafe(name || '');

    const confirmationSubject = 'Confirmation inscription infolettre';
    const confirmationText = `Bonjour ${asciiName || 'there'},

Merci pour votre inscription a notre infolettre (${tenant.domain}).

Date: ${subscribedAt}

Si vous n'etes pas a l'origine de cette inscription, ignorez ce message.

Merci,
${fromName}`;

    const confirmationHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${confirmationSubject}</title>
  <style>
    body { margin:0; padding:0; background:#f6f7f9; color:#1f2933; font-family: Arial, Helvetica, sans-serif; }
    .wrapper { width:100%; padding:24px 0; background:#f0f2f5; }
    .card { max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; padding:24px; }
    h2 { margin:0 0 12px; color:#1f3a5f; }
    .muted { color:#6b7280; font-size:13px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <h2>Merci pour votre inscription</h2>
      <p>Bonjour ${asciiName || 'there'},</p>
      <p>Votre inscription a notre infolettre est confirme.</p>
      <p class="muted">Date: ${subscribedAt}</p>
      <p>Merci,<br/>${fromName}</p>
    </div>
  </div>
</body>
</html>`;

    const notificationText = `New newsletter subscriber (${tenant.domain})

Email: ${email}
Name: ${asciiName || 'N/A'}
Date: ${subscribedAt}`;

    const tenantTransporter = getTenantTransporter(tenant.domain, noreplyEmail);
    const [notificationResult, confirmationResult] = await Promise.allSettled([
      tenantTransporter.sendMail({
        from: { name: fromName, address: noreplyEmail },
        to: contactEmail,
        // Keep internal notification subjects neutral to reduce spam scoring.
        subject: `Newsletter signup notification`,
        text: notificationText,
        // Keep Reply-To same-domain on internal alerts.
        replyTo: contactEmail,
        headers: { 'Content-Language': 'fr-CA', 'X-Mailer': 'ProTechWeb SMTP Relay' },
        envelope: RETURN_PATH ? { from: RETURN_PATH, to: [contactEmail] } : undefined,
      }),
      tenantTransporter.sendMail({
        from: { name: fromName, address: noreplyEmail },
        to: email,
        subject: confirmationSubject,
        text: confirmationText,
        html: confirmationHtml,
        headers: { 'Content-Language': 'fr-CA', 'X-Mailer': 'ProTechWeb SMTP Relay' },
        envelope: RETURN_PATH ? { from: RETURN_PATH, to: [email] } : undefined,
      }),
    ]);

    const notificationSent = notificationResult.status === 'fulfilled';
    const confirmationSent = confirmationResult.status === 'fulfilled';

    if (!notificationSent) {
      console.error('Newsletter notification error:', notificationResult.reason);
    }
    if (!confirmationSent) {
      console.error('Newsletter confirmation error:', confirmationResult.reason);
    }

    return res.status(200).json({
      ok: true,
      notificationSent,
      confirmationSent,
    });
  } catch (err) {
    console.error('Newsletter form error:', err);
    return res.status(500).json({ error: 'Newsletter form failed', details: String(err?.message || err) });
  }
});

app.get('/health', async (_req, res) => {
  try {
    await pool.execute('SELECT 1');
    return res.json({ ok: true });
  } catch (err) {
    console.error('Health check error:', err);
    return res.status(500).json({ ok: false });
  }
});

app.listen(Number(PORT), () => {
  console.log(`SMTP relay listening on :${PORT}`);
});
