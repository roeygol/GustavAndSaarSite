// Cloudflare Pages Function: POST /api/contact
// Emails the contact form to Saar through Resend, using the same email
// layout/sender as the visit notification (functions/_lib/email.js).
// Required env vars (Pages > Settings > Variables and Secrets):
//   RESEND_API_KEY  – secret
//   CONTACT_TO      – Saar's address (comma-separated for several)
//   CONTACT_FROM    – verified sender, e.g. "אתר גוסטב את סער <noreply@your-domain>"
import { buildContactEmail, sendViaResend } from "../_lib/email.js";

const field = (form, key, max) => (form.get(key) || "").toString().trim().slice(0, max);

export async function onRequestPost({ request, env }) {
  const form = await request.formData();
  if (form.get("website")) return new Response("ok"); // honeypot

  const name = field(form, "name", 200);
  const phone = field(form, "phone", 50);
  const email = field(form, "email", 200);
  const type = field(form, "type", 100);
  const message = field(form, "message", 5000);
  if (!name || !phone || !message) return new Response("missing fields", { status: 400 });

  if (!env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) {
    return new Response("not configured", { status: 500 });
  }

  try {
    const result = await sendViaResend(env, buildContactEmail({ name, phone, email, type, message }), email);
    console.log(`[contact] resend ok=${result.ok} status=${result.status} body=${result.body}`);
    return new Response(result.ok ? "ok" : "send failed", { status: result.ok ? 200 : 502 });
  } catch (e) {
    console.log(`[contact] resend threw: ${e}`);
    return new Response("send failed", { status: 502 });
  }
}
