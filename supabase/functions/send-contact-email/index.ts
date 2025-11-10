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

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RÉFÉRENCE: ${submissionId}
PRIORITÉ: ${priority.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Nom: ${name}
Email: ${email}
Téléphone: ${phone || "Non fourni"}
${inquiryType ? `Type de demande: ${inquiryType}` : ''}
Sujet: ${subject}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Message:
${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Date: ${new Date().toLocaleString("fr-CA", { timeZone: "America/Toronto" })}

Répondre à ce message dans les 24-48 heures.
    `;

    const confirmationEmailBody = `
Bonjour ${name},

Nous avons bien reçu votre message et vous remercions de nous avoir contactés.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VOTRE DEMANDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Numéro de référence: ${submissionId}
Sujet: ${subject}
Date de soumission: ${new Date().toLocaleString("fr-CA", { timeZone: "America/Toronto" })}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RÉSUMÉ DE VOTRE MESSAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Notre équipe examinera votre demande et vous contactera dans les 24 à 48 heures.

Si votre demande est urgente, n'hésitez pas à nous appeler directement au +1 (514) 994-4689.

Cordialement,
L'équipe ProTechWeb

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ProTechWeb - Professionnels des Technologies du Web
2-545 Rue Saint-Germain
Saint-Laurent, QC, H4L 3R3
+1 (514) 994-4689
contact@protechweb.ca
    `;

    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (resendApiKey) {
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
          subject: `[${priority.toUpperCase()}] ${subject} - Réf: ${submissionId.substring(0, 8)}`,
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

      if (!notificationResponse.ok) {
        console.error("Notification email error:", await notificationResponse.text());
      }
      if (!confirmationResponse.ok) {
        console.error("Confirmation email error:", await confirmationResponse.text());
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Merci pour votre message, nous vous répondrons dans les 24 à 48 heures.",
        submissionId: submissionId.substring(0, 8),
        confirmationSent: !!resendApiKey
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