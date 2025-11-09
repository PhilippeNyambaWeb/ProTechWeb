# Email Configuration for Contact Form

## Current Status

The contact form is fully functional and saves all submissions to the Supabase database in the `contact_submissions` table. However, **email notifications are not being sent** because the Resend API key is not configured.

## Why You're Not Receiving Emails

The edge function `send-contact-email` uses [Resend](https://resend.com) to send emails. The function checks for a `RESEND_API_KEY` environment variable. If this key is not set, the function will:

1. ✅ Save the form submission to the database
2. ✅ Return a success message to the user
3. ❌ Skip sending email notifications (both to you and confirmation to the user)

## How to Enable Email Notifications

### Step 1: Get a Resend API Key

1. Go to [https://resend.com](https://resend.com) and create a free account
2. Verify your domain (protechweb.ca) or use their testing domain for development
3. Navigate to API Keys section
4. Create a new API key and copy it

### Step 2: Configure the Environment Variable

#### For Supabase (Production):

1. Go to your Supabase Dashboard
2. Navigate to **Project Settings** > **Edge Functions**
3. Add a new secret:
   - Name: `RESEND_API_KEY`
   - Value: Your Resend API key

#### For Local Development:

Create a `.env` file in the `supabase` directory:

```bash
RESEND_API_KEY=re_your_api_key_here
```

### Step 3: Verify Domain with Resend

For production emails to work properly, you need to verify your domain with Resend:

1. In Resend dashboard, go to **Domains**
2. Add `protechweb.ca`
3. Add the provided DNS records to your domain
4. Wait for verification (usually takes a few minutes)

## Testing Without Resend

If you want to test the contact form without setting up Resend:

1. Form submissions will still be saved to the database
2. You can view submissions in Supabase Dashboard:
   - Go to **Table Editor**
   - Select `contact_submissions` table
   - View all form submissions

## Email Features

Once configured, the system will send:

### 1. Notification Email (to contact@protechweb.ca)
- Contains all form details
- Includes submission reference ID
- Shows priority level (urgent/high/medium)
- Includes reply-to address of the sender

### 2. Confirmation Email (to the user)
- Thanks them for contacting
- Provides submission reference number
- Sets expectations for response time (24-48 hours)
- Includes your contact information

## Troubleshooting

### Check if email was attempted:
```bash
# View edge function logs in Supabase Dashboard
# Navigate to: Edge Functions > send-contact-email > Logs
```

### Common issues:
1. **API key not set**: Check environment variables in Supabase
2. **Domain not verified**: Verify protechweb.ca in Resend
3. **Invalid API key**: Regenerate key in Resend dashboard
4. **Rate limits**: Free Resend plan has 100 emails/day limit

## Alternative Email Solutions

If you prefer not to use Resend, you can modify the edge function to use:
- SendGrid
- Mailgun
- Amazon SES
- Any other email service with an HTTP API

The email sending code is located at:
```
/supabase/functions/send-contact-email/index.ts
```

Lines 150-190 contain the Resend API integration.

## Questions?

For more information about Resend, visit: [https://resend.com/docs](https://resend.com/docs)
