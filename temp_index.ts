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
  const urgentKeywords = ['urgent', 'asap', 'immÃ©diat', 'critique', 'problÃ¨me grave'];
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
        JSON.stringify({ error: "Tous les champs obligatoires doivent Ãªtre remplis" }),
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

â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”
RÃ‰FÃ‰RENCE: ${submissionId}
PRIORITÃ‰: ${priority.toUpperCase()}
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”

Nom: ${name}
Email: ${email}
TÃ©lÃ©phone: ${phone || "Non fourni"}
${inquiryType ? `Type de demande: ${inquiryType}` : ''}
Sujet: ${subject}

â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”

Message:
${message}

â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”

Date: ${new Date().toLocaleString("fr-CA", { timeZone: "America/Toronto" })}

RÃ©pondre Ã  ce message dans les 24-48 heures.
    `;

    const confirmationEmailBody = `
Bonjour ${name},

Nous avons bien reÃ§u votre message et vous remercions de nous avoir contactÃ©s.

â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”
VOTRE DEMANDE
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”

NumÃ©ro de rÃ©fÃ©rence: ${submissionId}
Sujet: ${subject}
Date de soumission: ${new Date().toLocaleString("fr-CA", { timeZone: "America/Toronto" })}

â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”
RÃ‰SUMÃ‰ DE VOTRE MESSAGE
â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”

${message}

â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”

Notre Ã©quipe examinera votre demande et vous contactera dans les 24 Ã  48 heures.

Si votre demande est urgente, n'hÃ©sitez pas Ã  nous appeler directement au +1 (514) 994-4689.

Cordialement,
L'Ã©quipe ProTechWeb

â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”
ProTechWeb - Professionnels des Technologies du Web
2-545 Rue Saint-Germain
Saint-Laurent, QC, H4L 3R3
+1 (514) 994-4689
contact@protechweb.ca
    `;

    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    let provider: "brevo" | "resend" | "none" = "none";
    let notificationSent = false;
    let confirmationSent = false;

    if (brevoApiKey) {
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
          subject: "Confirmation de rAcception - ProTechWeb",
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

    if (!brevoApiKey && resendApiKey) {
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
          subject: `[${priority.toUpperCase()}] ${subject} - RÃ©f: ${submissionId.substring(0, 8)}`,
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
          subject: "Confirmation de rÃ©ception - ProTechWeb",
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
        message: "Merci pour votre message, nous vous rÃ©pondrons dans les 24 Ã  48 heures.",
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
        error: "Une erreur est survenue, merci de rÃ©essayer.",
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
