// Cloudflare Pages Function: POST /api/contact
// Emails the contact form to Saar through Resend, using the same email
// layout/sender as the visit notification (functions/_lib/email.js).
// Required env vars (Pages > Settings > Variables and Secrets):
//   RESEND_API_KEY  – secret
//   CONTACT_TO      – Saar's address (comma-separated for several)
//   CONTACT_FROM    – verified sender, e.g. "אתר גוסטב את סער <noreply@your-domain>"
import { buildContactEmail, sendViaResend } from "../_lib/email.js";

// Strip control chars (incl. CR/LF) so values can't smuggle line breaks into mail headers.
const field = (form, key, max) =>
  (form.get(key) || "").toString().replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim().slice(0, max);

const EMAIL_RE = /^[^\s@<>"'`,;]+@[^\s@<>"'`,;]+\.[^\s@<>"'`,;]+$/;
const PHONE_RE = /^[0-9+\-()\s]{7,25}$/;
const RATE_LIMIT = 5;            // submissions
const RATE_WINDOW_SECONDS = 600; // per IP per 10 minutes

// Reject cross-site POSTs: browsers always send Origin on fetch/form POSTs.
function sameOrigin(request) {
  const origin = request.headers.get("Origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch (e) {
    return false;
  }
}

export async function onRequestPost({ request, env }) {
  if (!sameOrigin(request)) return new Response("forbidden", { status: 403 });
  if (Number(request.headers.get("Content-Length") || 0) > 20000) return new Response("too large", { status: 413 });

  let form;
  try {
    form = await request.formData();
  } catch (e) {
    return new Response("bad request", { status: 400 });
  }
  if (form.get("website")) return new Response("ok"); // honeypot

  const name = field(form, "name", 200);
  const phone = field(form, "phone", 50);
  const email = field(form, "email", 200);
  const type = field(form, "type", 100);
  const message = field(form, "message", 5000);
  if (!name || !phone || !message) return new Response("missing fields", { status: 400 });
  if (!PHONE_RE.test(phone) || (email && !EMAIL_RE.test(email))) return new Response("invalid fields", { status: 400 });

  // Per-IP rate limit (needs the VISITS_KV binding; skipped if absent) to stop mail-bombing / Resend quota drain.
  const ip = request.headers.get("CF-Connecting-IP");
  if (env.VISITS_KV && ip) {
    const key = `contact:${ip}`;
    const count = parseInt((await env.VISITS_KV.get(key)) || "0", 10);
    if (count >= RATE_LIMIT) return new Response("too many requests", { status: 429 });
    await env.VISITS_KV.put(key, String(count + 1), { expirationTtl: RATE_WINDOW_SECONDS });
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) {
    return new Response("not configured", { status: 500 });
  }

  try {
    const result = await sendViaResend(env, buildContactEmail({ name, phone, email, type, message }), email);
    console.log(`[contact] resend ok=${result.ok} status=${result.status}`);
    return new Response(result.ok ? "ok" : "send failed", { status: result.ok ? 200 : 502 });
  } catch (e) {
    console.log(`[contact] resend threw: ${e}`);
    return new Response("send failed", { status: 502 });
  }
}
