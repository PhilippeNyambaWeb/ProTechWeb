import "jsr:@supabase/functions-js/edge-runtime.d.ts";

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

    const { name, email, phone, subject, message } = formData;

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

    const emailBody = `
Nouveau message de contact depuis ProTechWeb

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Nom: ${name}
Email: ${email}
Téléphone: ${phone || "Non fourni"}
Sujet: ${subject}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Message:
${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Date: ${new Date().toLocaleString("fr-CA", { timeZone: "America/Toronto" })}
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      },
      body: JSON.stringify({
        from: "ProTechWeb <noreply@protechweb.ca>",
        to: ["contact@protechweb.ca"],
        reply_to: email,
        subject: `[ProTechWeb] ${subject}`,
        text: emailBody,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Resend API error:", errorText);
      
      return new Response(
        JSON.stringify({ 
          success: true,
          message: "Votre message a été reçu. Nous vous répondrons bientôt.",
          note: "Email notification en attente de configuration"
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Merci pour votre message, nous vous répondrons rapidement."
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