import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  inquiryType?: string;
}

function determinePriority(subject: string, message: string): string {
  const urgentKeywords = ['urgent', 'asap', 'immédiat', 'critique', 'problème grave'];
  const highKeywords = ['important', 'rapidement', 'prioritaire', 'bug', 'erreur'];
  
  const combinedText = `${subject} ${message}`.toLowerCase();
  
  if (urgentKeywords.some(keyword => combinedText.includes(keyword))) {
    return 'urgent';
  }
  if (highKeywords.some(keyword => combinedText.includes(keyword))) {
    return 'high';
  }
  return 'medium';
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const formData: ContactFormData = await req.json();
    const { name, email, phone, subject, message, inquiryType } = formData;

    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "Tous les champs obligatoires doivent être remplis" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const priority = determinePriority(subject, message);

    const { data: submission, error: dbError } = await supabase
      .from('contact_submissions')
      .insert({
        name,
        email,
        phone,
        subject: inquiryType ? `[${inquiryType}] ${subject}` : subject,
        message,
        priority,
        status: 'new'
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
    }

    const submissionId = submission?.id || 'N/A';

    const notificationEmailBody = `
Nouveau message de contact depuis ProTechWeb

----------------------------------------
REF: ${submissionId}
PRIORITE: ${priority.toUpperCase()}
----------------------------------------

Nom: ${name}
Email: ${email}
Téléphone: ${phone || "Non fourni"}
${inquiryType ? ``Type de demande: ${inquiryType}`` : ''}
Sujet: ${subject}

----------------------------------------

Message:
${message}

----------------------------------------

Date: ${new Date().toLocaleString("fr-CA", { timeZone: "America/Toronto" })}

Merci de répondre à ce message dans les 24–48 heures.
`;

const confirmationEmailBody = `
Bonjour ${name},

Nous avons bien reçu votre message et vous remercions de nous avoir contactés.

----------------------------------------
VOTRE DEMANDE
----------------------------------------

Numéro de référence: ${submissionId}
Sujet: ${subject}
Date de soumission: ${new Date().toLocaleString("fr-CA", { timeZone: "America/Toronto" })}

----------------------------------------
RÉSUMÉ DE VOTRE MESSAGE
----------------------------------------

${message}

----------------------------------------

Notre équipe examinera votre demande et vous contactera dans les 24 à 48 heures.

Si votre demande est urgente, n'hésitez pas à nous appeler directement au +1 (514) 994-4689.

Cordialement,
L'équipe ProTechWeb

----------------------------------------
ProTechWeb - Professionnels des Technologies du Web
2-545 Rue Saint-Germain
Saint-Laurent, QC, H4L 3R3
+1 (514) 994-4689
contact@protechweb.ca
`;const confirmationEmailBody = `
Bonjour ${name},

Nous avons bien reçu votre message et vous remercions de nous avoir contactés.

â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”
VOTRE DEMANDE
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”

Numéro de référence: ${submissionId}
Sujet: ${subject}
Date de soumission: ${new Date().toLocaleString("fr-CA", { timeZone: "America/Toronto" })}

â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”
RÉSUMÉ DE VOTRE MESSAGE
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”

${message}

â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”

Notre équipe examinera votre demande et vous contactera dans les 24 à 48 heures.

Si votre demande est urgente, n'hésitez pas à nous appeler directement au +1 (514) 994-4689.

Cordialement,
L'équipe ProTechWeb

â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”
ProTechWeb - Professionnels des Technologies du Web
2-545 Rue Saint-Germain
Saint-Laurent, QC, H4L 3R3
+1 (514) 994-4689
contact@protechweb.ca
    `;

    const smtpRelayUrl = Deno.env.get("SMTP_RELAY_URL");
    const smtpRelayKey = Deno.env.get("SMTP_RELAY_KEY");
    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    let provider: "smtp-relay" | "brevo" | "resend" | "none" = "none";
    let notificationSent = false;
    let confirmationSent = false;

    // Try SMTP relay first if configured (Hostinger SMTP via HTTP relay)
    if (smtpRelayUrl && smtpRelayKey) {
      provider = "smtp-relay" as any;

      const relayHeaders = {
        "Content-Type": "application/json",
        "X-API-Key": smtpRelayKey,
      } as Record<string, string>;

      // Allow SMTP_RELAY_URL to be either the base origin or the full /send endpoint
      const relayEndpoint = smtpRelayUrl.endsWith('/send')
        ? smtpRelayUrl
        : `${smtpRelayUrl.replace(/\/+$/, '')}/send`;

      const notificationPromise = fetch(relayEndpoint, {
        method: "POST",
        headers: relayHeaders,
        body: JSON.stringify({
          fromName: "ProTechWeb",
          fromEmail: "noreply@protechweb.ca",
          to: ["contact@protechweb.ca"],
          subject: `[${priority.toUpperCase()}] ${subject} - Ref: ${submissionId.substring(0, 8)}`,
          text: notificationEmailBody,
          replyTo: email,
        }),
      });

      const confirmationPromise = fetch(relayEndpoint, {
        method: "POST",
        headers: relayHeaders,
        body: JSON.stringify({
          fromName: "ProTechWeb",
          fromEmail: "noreply@protechweb.ca",
          to: [email],
          subject: "Confirmation de réception - ProTechWeb",
          text: confirmationEmailBody,
        }),
      });

      const [notificationResponse, confirmationResponse] = await Promise.all([
        notificationPromise,
        confirmationPromise,
      ]);

      notificationSent = notificationResponse.ok;
      confirmationSent = confirmationResponse.ok;

      if (!notificationResponse.ok) {
        console.error("SMTP relay notification error:", notificationResponse.status, await notificationResponse.text());
      }
      if (!confirmationResponse.ok) {
        console.error("SMTP relay confirmation error:", confirmationResponse.status, await confirmationResponse.text());
      }
    }

    if (!(notificationSent && confirmationSent) && brevoApiKey) {
      const brevoHeaders = {
        "Content-Type": "application/json",
        "api-key": brevoApiKey,
      } as Record<string, string>;

      const notificationPromise = fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: brevoHeaders,
        body: JSON.stringify({
          sender: { name: "ProTechWeb", email: "noreply@protechweb.ca" },
          to: [{ email: "contact@protechweb.ca" }],
          replyTo: { email },
          subject: `[${priority.toUpperCase()}] ${subject} - Ref: ${submissionId.substring(0, 8)}`,
          textContent: notificationEmailBody,
        }),
      });

      const confirmationPromise = fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: brevoHeaders,
        body: JSON.stringify({
          sender: { name: "ProTechWeb", email: "noreply@protechweb.ca" },
          to: [{ email }],
          subject: "Confirmation de réception - ProTechWeb",
          textContent: confirmationEmailBody,
        }),
      });

      const [notificationResponse, confirmationResponse] = await Promise.all([
        notificationPromise,
        confirmationPromise
      ]);

      provider = "brevo";
      notificationSent = notificationResponse.ok;
      confirmationSent = confirmationResponse.ok;

      if (!notificationResponse.ok) {
        console.error("Brevo notification email error:", notificationResponse.status, await notificationResponse.text());
      }
      if (!confirmationResponse.ok) {
        console.error("Brevo confirmation email error:", confirmationResponse.status, await confirmationResponse.text());
      }
    }

    if (!(notificationSent && confirmationSent) && resendApiKey) {
      const notificationPromise = fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "ProTechWeb <onboarding@resend.dev>",
          to: ["contact@protechweb.ca"],
          reply_to: email,
          subject: `[${priority.toUpperCase()}] ${subject} - Ref: ${submissionId.substring(0, 8)}`,
          text: notificationEmailBody,
        }),
      });

      const confirmationPromise = fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "ProTechWeb <onboarding@resend.dev>",
          to: [email],
          subject: "Confirmation de réception - ProTechWeb",
          text: confirmationEmailBody,
        }),
      });

      const [notificationResponse, confirmationResponse] = await Promise.all([
        notificationPromise,
        confirmationPromise
      ]);

      const notificationResult = await notificationResponse.json();
      const confirmationResult = await confirmationResponse.json();

      if (!notificationResponse.ok) {
        console.error("Notification email error:", notificationResponse.status, notificationResult);
      } else {
        console.log("Notification email sent successfully:", notificationResult);
      }

      if (!confirmationResponse.ok) {
        console.error("Confirmation email error:", confirmationResponse.status, confirmationResult);
      } else {
        console.log("Confirmation email sent successfully:", confirmationResult);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Merci pour votre message, nous vous répondrons dans les 24 à 48 heures.",
        submissionId: submissionId.substring(0, 8),
        confirmationSent,
        notificationSent,
        provider
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Une erreur est survenue, merci de réessayer.",
        details: error.message 
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});







