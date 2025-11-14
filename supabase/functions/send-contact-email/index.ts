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

function determinePriority(subject: string, message: string): "urgent" | "high" | "medium" {
  const urgentKeywords = ["urgent", "asap", "immediat", "critique", "probleme grave"];
  const highKeywords = ["important", "rapidement", "prioritaire", "bug", "erreur"];
  const combined = `${subject} ${message}`.toLowerCase();
  if (urgentKeywords.some(k => combined.includes(k))) return "urgent";
  if (highKeywords.some(k => combined.includes(k))) return "high";
  return "medium";
}

// ASCII-safe fallback for plain-text and subjects when some relays mis-handle UTF‑8
function asciiSafe(input: string): string {
  if (!input) return "";
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u00A0/g, " ");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const formData: ContactFormData = await req.json();
    const { name, email, phone, subject, message, inquiryType } = formData;

    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "Tous les champs obligatoires doivent etre remplis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const priority = determinePriority(subject, message);

    const { data: submission, error: dbError } = await supabase
      .from("contact_submissions")
      .insert({
        name,
        email,
        phone,
        subject: inquiryType ? `[${inquiryType}] ${subject}` : subject,
        message,
        priority,
        status: "new",
      })
      .select()
      .single();

    if (dbError) console.error("Database error:", dbError);

    const submissionId = submission?.id || "N/A";
    const submittedAt = new Date().toLocaleString("fr-CA", { timeZone: "America/Toronto" });

    // Build ASCII-safe versions for text/plain
    const nameAscii = asciiSafe(name);
    const subjectAscii = asciiSafe("Confirmation de reception - ProTechWeb");
    const inquiryAscii = asciiSafe(inquiryType || "");
    const userSubjectAscii = asciiSafe(subject);
    const messageAscii = asciiSafe(message);
    const priorityAscii = asciiSafe(priority.toUpperCase());

    const notificationEmailText = `Nouveau message de contact depuis ProTechWeb

----------------------------------------
REF: ${submissionId}
PRIORITE: ${priorityAscii}
----------------------------------------

Nom: ${nameAscii}
Email: ${email}
Telephone: ${phone || "Non fourni"}
${inquiryType ? `Type de demande: ${inquiryAscii}` : ""}
Sujet: ${userSubjectAscii}

----------------------------------------

Message:
${messageAscii}

----------------------------------------

Date: ${submittedAt}

Merci de repondre a ce message dans les 24-48 heures.`;

    // Branded confirmation email (HTML + ASCII text fallback)
    const confirmationEmailSubject = "Confirmation de r\u00E9ception \u2013 ProTechWeb";

    const confirmationEmailText = `Bonjour ${nameAscii},

Nous avons bien recu votre message et vous remercions de nous avoir contactes.

----------------------------------------
VOTRE DEMANDE
----------------------------------------

Numero de reference: ${submissionId}
Sujet: ${userSubjectAscii}
Date de soumission: ${submittedAt}
${inquiryType ? `Type de demande: ${inquiryAscii}` : ""}

----------------------------------------
RESUME DE VOTRE MESSAGE
----------------------------------------

${messageAscii}

Notre equipe vous contactera dans les 24 a 48 heures.
Si votre demande est urgente, appelez-nous au +1 (514) 994-4689.

Cordialement,
L'equipe ProTechWeb

----------------------------------------
ProTechWeb - Professionnels des Technologies du Web
+1 (514) 994-4689
contact@protechweb.ca`;

    const safeMessageHtml = (message || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const confirmationEmailHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${confirmationEmailSubject}</title>
  <style>
    body { margin:0; padding:0; background:#f8fafc; color:#212529; font-family: Arial, Helvetica, sans-serif; }
    .wrapper { width:100%; background:#f0f4f8; padding:20px 0; }
    .container { max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; }
    .header { background:#2372b6; padding:16px; display:flex; align-items:center; }
    .header .logo { height:48px; display:block; }
    .header .tagline { color:#e9f3fb; font-size:13px; margin-left:12px; font-style:italic; }
    .content { padding:24px; }
    h2 { margin:0 0 12px; color:#2372b6; font-size:22px; }
    h3 { color:#2372b6; font-size:16px; margin:20px 0 8px; }
    ul { padding-left:18px; }
    .cta { display:inline-block; margin-top:12px; background:#2372b6; color:#fff !important; padding:10px 16px; text-decoration:none; border-radius:4px; font-weight:600; }
    .note { font-size:14px; color:#0f4d82; margin-top:12px; }
    .footer { background:#ededed; padding:16px; font-size:13px; color:#333333; }
    a { color:#2372b6; }
    @media (max-width:620px){ .content { padding:16px; } }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <img class="logo" src="https://protechweb.ca/assets/Logo_ProtechWeb.png" alt="Logo ProTechWeb" />
        <span class="tagline">Professionnels des Technologies du Web</span>
      </div>
      <div class="content">
        <h2>Confirmation de r&eacute;ception</h2>
        <p>Bonjour ${name},</p>
        <p>Nous avons bien re&ccedil;u votre message concernant <strong>${subject}</strong>. Merci de nous avoir contact&eacute;s&nbsp;!</p>
        <h3>D&eacute;tails de votre demande</h3>
        <ul>
          <li><strong>Num&eacute;ro de r&eacute;f&eacute;rence:</strong> ${submissionId}</li>
          <li><strong>Date de soumission:</strong> ${submittedAt}</li>
          ${inquiryType ? `<li><strong>Type de demande:</strong> ${inquiryType}</li>` : ''}
          <li><strong>Sujet:</strong> ${subject}</li>
        </ul>
        <h3>R&eacute;sum&eacute; du message</h3>
        <p>${safeMessageHtml}</p>
        <p>Notre &eacute;quipe vous contactera dans les 24 &agrave; 48 heures.</p>
        <p>
          Pour toute question urgente, cliquez ici&nbsp;:
          <a href="tel:+15149944689" class="cta">Appeler ProTechWeb</a>
        </p>
        <p class="note">Si vous n'&ecirc;tes pas &agrave; l'origine de cette demande, veuillez nous en informer.</p>
      </div>
      <div class="footer">
        ProTechWeb &ndash; Professionnels des Technologies du Web<br/>
        <a href="tel:+15149944689">+1 (514) 994-4689</a> &ndash; <a href="mailto:contact@protechweb.ca">contact@protechweb.ca</a>
      </div>
    </div>
  </div>
  </body>
</html>`;

    const smtpRelayUrl = Deno.env.get("SMTP_RELAY_URL");
    const smtpRelayKey = Deno.env.get("SMTP_RELAY_KEY");
    let provider: "smtp-relay" | "none" = "none";
    let notificationSent = false;
    let confirmationSent = false;

    if (smtpRelayUrl && smtpRelayKey) {
      provider = "smtp-relay" as any;
      const relayHeaders = {
        "Content-Type": "application/json",
        "X-API-Key": smtpRelayKey,
      } as Record<string, string>;

      const relayEndpoint = smtpRelayUrl.endsWith("/send")
        ? smtpRelayUrl
        : `${smtpRelayUrl.replace(/\/+$/, "")}/send`;

      const notificationPromise = fetch(relayEndpoint, {
        method: "POST",
        headers: relayHeaders,
        body: JSON.stringify({
          fromName: "ProTechWeb",
          fromEmail: "noreply@protechweb.ca",
          to: ["contact@protechweb.ca"],
          subject: `[${priority.toUpperCase()}] ${subject} - Ref: ${submissionId.substring(0, 8)}`,
          text: notificationEmailText,
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
          subject: confirmationEmailSubject,
          html: confirmationEmailHtml,
          text: confirmationEmailText,
          headers: { "Content-Language": "fr-CA" },
          priority: priority === "urgent" ? "high" : "normal",
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

    return new Response(
      JSON.stringify({
        success: true,
        message: "Merci pour votre message, nous vous repondrons dans les 24 a 48 heures.",
        submissionId: submissionId.substring(0, 8),
        confirmationSent,
        notificationSent,
        provider,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error processing contact form:", error);
    return new Response(
      JSON.stringify({ error: "Une erreur est survenue, merci de reessayer.", details: error?.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

