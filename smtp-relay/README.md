SMTP Relay for Hostinger (HTTP → SMTP)

Overview
- This tiny service exposes an HTTP endpoint your Supabase Edge Function can call.
- It forwards the request to Hostinger SMTP so all outbound mail is sent from your Hostinger mailbox (e.g., noreply@protechweb.ca).
- Benefit: Outbound emails appear in your Hostinger mailbox (usually in Sent), letting you visualize both inbound and outbound in one place.

Deploy Steps
- Requirements: Node 18+, an environment where outbound SMTP (port 587) is allowed.
- Recommended: run behind HTTPS at your domain, e.g. `https://api.protechweb.ca/`.
- Clone this folder to your server or deploy to a service (Render, Fly.io, Railway, a VPS, etc.).
- Create `.env` from `.env.example` and fill values.
- Install and run:

```
npm install
npm start
```

Environment Variables
- SMTP_HOST: smtp.hostinger.com
- SMTP_PORT: 587
- SMTP_SECURE: false
- SMTP_USER: noreply@protechweb.ca (your Hostinger mailbox)
- SMTP_PASS: app password or mailbox password
- FROM_EMAIL: noreply@protechweb.ca
- FROM_NAME: ProTechWeb
- RETURN_PATH (optional): bounce@protechweb.ca used as SMTP envelope sender
- RELAY_KEY: shared secret for authenticating requests from your Edge Function
- PORT: HTTP port (default 8080)

HTTP API (HTTPS in production)
- POST https://api.protechweb.ca/send
  - Headers: `Content-Type: application/json`, `X-API-Key: <RELAY_KEY>`
  - Body JSON:
    - fromEmail (optional; defaults to FROM_EMAIL)
    - fromName (optional; defaults to FROM_NAME)
    - to: array of recipient emails
    - subject: string (UTF‑8 supported)
    - text: string (plain text fallback)
    - html: string (HTML body; when provided, a multipart/alternative is sent)
    - replyTo (optional): email address for replies
    - bcc (optional): array of emails
    - headers (optional): object of additional headers; `Content-Language: fr-CA` and `X-Mailer` are set by default
    - priority (optional): `high` | `normal` | `low`

Example request
```
POST https://api.protechweb.ca/send
X-API-Key: <RELAY_KEY>
{
  "fromName": "ProTechWeb",
  "fromEmail": "noreply@protechweb.ca",
  "to": ["contact@protechweb.ca"],
  "subject": "[URGENT] Site Down - Ref: 1234abcd",
  "text": "Details...",
  "replyTo": "client@example.com"
}
```

Notes
- MIME: Nodemailer sends UTF‑8 with correct `Content-Type` and boundaries. When `html` and `text` are both present, a standards‑compliant multipart/alternative message is sent. `textEncoding` is set to quoted‑printable for best compatibility.
- Return-Path: If `RETURN_PATH` is provided, it is used as the SMTP envelope sender so bounces are routed correctly.
- Sent folder: Hostinger typically stores SMTP-sent emails in the Sent folder. If you also want a guaranteed copy, include a BCC to your own mailbox.
- Security: Keep `RELAY_KEY` secret. Only your Edge Function should know it.

Reverse proxy/HTTPS
- Place this Node app behind your HTTPS terminator (e.g. Nginx/Traefik) serving `https://api.protechweb.ca/`.
- Forward `/*` or at minimum `/send` and `/health` to the Node process on the configured `PORT` (default 8080).
- The Supabase edge function calls the relay server-to-server over HTTPS; CORS is not required.

