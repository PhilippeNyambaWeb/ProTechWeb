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

https://chatgpt.com/share/69800214-5854-8003-b97d-398527f08856


Skip to content
Chat history



You said:
Uploaded image
Uploaded image
Uploaded image
server.js
JavaScript
.env.example
File
package.json
File
README.md
File
I create this website on hostinger VPS, I added an A reccord to the domain name protechweb.ca and I enabled Let's Encrypt.

Can you help me setup and run the relay server ?
ChatGPT said:

Thought for 48s
Absolutely—let’s get your SMTP relay server running cleanly at https://api.protechweb.ca.

Below is a complete, copy-paste checklist tailored to your VPS + hPanel screenshots.

1) Create the .env
In /home/userapp/htdocs/api.protechweb.ca create a .env file (same folder as server.js):

cd /home/userapp/htdocs/api.protechweb.ca
nano .env
Put (adjust the mailbox & password you created in Hostinger):

# Hostinger SMTP
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@protechweb.ca
SMTP_PASS=<<APP_PASSWORD_OR_MAILBOX_PASSWORD>>

# Default From
FROM_EMAIL=noreply@protechweb.ca
FROM_NAME=ProTechWeb

# Simple shared secret (use a long random string)
RELAY_KEY=<<VERY_LONG_RANDOM_VALUE>>

# HTTP port for Node (match hPanel "App Port")
PORT=3000
Why: the server expects exactly these env vars and exposes /send and /health. 
server

 
README


2) Install dependencies
Still in that folder:

# If your shell has nvm, pick Node 22 LTS (as in hPanel)
node -v
npm -v

npm install
package.json defines the script and deps (express, nodemailer, dotenv). 
package


3) Run the app (PM2 recommended)
Install PM2 once, then keep the process alive:

sudo npm i -g pm2
pm2 start server.js --name relay --time
pm2 save
pm2 status
pm2 logs relay --lines 50
Quick local check:

curl -sS http://127.0.0.1:3000/health
# => {"ok":true}

cd /home/userapp/htdocs/api.protechweb.ca
# pull/upload this updated server.js
pm2 restart relay
pm2 logs relay --lines 50


4) Fix and simplify Nginx (reverse proxy)
Your earlier error no "ssl_certificate" is defined for the "listen ... quic" comes from enabling quic without certificates in that server block. Start simple: HTTP/2 only, no quic, and point to your Let’s Encrypt cert for api.protechweb.ca.

Create/replace /etc/nginx/sites-available/api.protechweb.ca.conf with:

# Redirect HTTP -> HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name api.protechweb.ca;
    return 301 https://$host$request_uri;
}

# HTTPS reverse proxy to Node on :3000
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.protechweb.ca;

    # Let’s Encrypt paths (adjust if different on your VPS)
    ssl_certificate     /etc/letsencrypt/live/api.protechweb.ca/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.protechweb.ca/privkey.pem;

    # (optional) Stapling is fine to leave off if your cert chain lacks OCSP
    # ssl_stapling on;
    # ssl_stapling_verify on;

    # Basic hardening
    client_max_body_size 10m;

    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
    }
}
Enable + reload:

sudo ln -sf /etc/nginx/sites-available/api.protechweb.ca.conf /etc/nginx/sites-enabled/api.protechweb.ca.conf
sudo nginx -t
sudo systemctl reload nginx
Now test from outside:

curl -I https://api.protechweb.ca/health
# Expect: 200 OK
If you still see 502:

pm2 status (the app must be online)

curl -sS http://127.0.0.1:3000/health (must be {"ok":true})

sudo journalctl -u nginx -n 100 --no-pager (proxy/cert issues)

5) hPanel settings that must match
Root Directory: /home/userapp/htdocs/api.protechweb.ca (as in your screenshot)

Node.js Version: Node 22 LTS

App Port: 3000 (must match your .env PORT and Nginx proxy_pass target)

6) Try a real send
Use your secret RELAY_KEY:

curl -sS https://api.protechweb.ca/send \
  -H 'Content-Type: application/json' \
  -H 'X-API-Key: <<RELAY_KEY>>' \
  -d '{
    "fromName":"ProTechWeb",
    "fromEmail":"noreply@protechweb.ca",
    "to":["contact@protechweb.ca"],
    "subject":"Relay smoke test",
    "text":"This is a test from api.protechweb.ca"
  }'
# Expect: {"ok":true,"id":"<...>"}
If it fails, check pm2 logs relay for “SMTP relay error”. The server uses nodemailer with the SMTP values you set. 
server


7) (Optional) Auto-start on reboot
pm2 startup systemd
# follow the PM2 instruction it prints (a sudo command)
pm2 save
Notes & small pitfalls
OCSP stapling warnings are harmless if your chain lacks an OCSP URL. You can turn stapling off or leave the warnings; they don’t cause 502s.

Don’t add quic until everything works on HTTP/2 and the ssl_certificate directives are present in the same server block.

If you change the hPanel App Port, update both .env PORT and the Nginx proxy_pass.

If you want, paste your current /etc/nginx/sites-enabled/api.protechweb.ca.conf and I’ll fix it line-by-line.


Sources



No file chosenNo file chosen
ChatGPT can make mistakes. Check important info. See Cookie Preferences.
