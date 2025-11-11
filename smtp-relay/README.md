SMTP Relay for Hostinger (HTTP → SMTP)

Overview
- This tiny service exposes an HTTP endpoint your Supabase Edge Function can call.
- It forwards the request to Hostinger SMTP so all outbound mail is sent from your Hostinger mailbox (e.g., noreply@protechweb.ca).
- Benefit: Outbound emails appear in your Hostinger mailbox (usually in Sent), letting you visualize both inbound and outbound in one place.

Deploy Steps
- Requirements: Node 18+, an environment where outbound SMTP (port 587) is allowed.
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
- RELAY_KEY: shared secret for authenticating requests from your Edge Function
- PORT: HTTP port (default 8080)

HTTP API
- POST /send
  - Headers: `Content-Type: application/json`, `X-API-Key: <RELAY_KEY>`
  - Body JSON:
    - fromEmail (optional; defaults to FROM_EMAIL)
    - fromName (optional; defaults to FROM_NAME)
    - to: array of recipient emails
    - subject: string
    - text: string
    - replyTo (optional): email address for replies
    - bcc (optional): array of emails

Example request
```
POST /send
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
- Hostinger typically stores SMTP-sent emails in the Sent folder. If you also want a guaranteed copy, you can include a BCC to your own mailbox.
- Keep RELAY_KEY secret. Only your Edge Function should know it.

