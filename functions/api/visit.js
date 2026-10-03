// Cloudflare Pages Function: GET /api/visit — 1x1-pixel beacon that emails
// Saar once per visit (dedup by cookie + IP via Workers KV TTL). Email goes
// through Resend. Mirrors the AlonSite implementation.
import { buildVisitEmail, sendViaResend } from "../_lib/email.js";

const VISIT_WINDOW_SECONDS = 60;
const KNOWN_PAGES = new Set(["index", "privacy", "accessibility", "404", "services-design", "services-manufacturing", "services-testing", "services-installation-maintenance", "panels-industrial", "panels-control", "panels-hvac", "panels-smoke-extraction", "panels-pumps"]);
const TRANSPARENT_GIF = Uint8Array.from(
  atob("R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="),
  (c) => c.charCodeAt(0)
);

function cleanHeaderValue(value, maxLength) {
  return String(value).replace(/[\r\n]+/g, " ").trim().slice(0, maxLength);
}

// Workers run in UTC — without an explicit timeZone this showed up 2-3
// hours behind the actual time in Israel (UTC+2/+3 depending on DST).
// Israeli date convention is day.month.year, not ISO's year-month-day.
function formatTime(date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Jerusalem",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value])
  );
  return `${parts.day}.${parts.month}.${parts.year}, ${parts.hour}:${parts.minute}:${parts.second}`;
}

function gifResponse(extraHeaders) {
  return new Response(TRANSPARENT_GIF, {
    status: 200,
    headers: Object.assign(
      {
        "Content-Type": "image/gif",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
      extraHeaders || {}
    ),
  });
}

export async function onRequestGet(context) {
  const request = context.request;
  const url = new URL(request.url);
  // Only known page names reach the email; arbitrary ?page= values are attacker-controlled text.
  const rawPage = url.searchParams.get("page") || "";
  const page = KNOWN_PAGES.has(rawPage) ? rawPage : "unknown";
  const referrer = request.headers.get("referer") ? cleanHeaderValue(request.headers.get("referer"), 300) : "-";
  const userAgent = request.headers.get("user-agent") ? cleanHeaderValue(request.headers.get("user-agent"), 300) : "-";
  const ip = request.headers.get("CF-Connecting-IP") || "-";
  const acceptLanguage = request.headers.get("accept-language") || "";
  // Cloudflare attaches this to every request that passes through its edge
  // — geo, network, and connection info, all free (no extra API call).
  const cf = request.cf || {};
  const now = Date.now();
  const time = formatTime(new Date(now));

  const cookieHeader = request.headers.get("Cookie") || "";
  const cookieMatch = cookieHeader.match(/gs_visited=(\d+)/);
  const cookieLastVisit = cookieMatch ? parseInt(cookieMatch[1], 10) : 0;
  const recentByCookie = (now - cookieLastVisit) / 1000 < VISIT_WINDOW_SECONDS;

  const setCookie = `gs_visited=${now}; Path=/; Max-Age=${VISIT_WINDOW_SECONDS}`;

  let recentlySeen = false;
  const kv = context.env.VISITS_KV;
  if (ip !== "-" && kv) {
    const seen = await kv.get(`visit:${ip}`);
    recentlySeen = seen !== null;
    if (!recentlySeen) {
      await kv.put(`visit:${ip}`, "1", { expirationTtl: VISIT_WINDOW_SECONDS });
    }
  }

  if (!recentByCookie && !recentlySeen) {
    if (!context.env.RESEND_API_KEY || !context.env.CONTACT_TO) {
      console.log(`[visit] skipped: RESEND_API_KEY/CONTACT_TO not set (ip=${ip} page=${page})`);
    } else {
      const email = buildVisitEmail({
        page,
        time,
        referrer,
        userAgent,
        ip,
        acceptLanguage,
        city: cf.city,
        region: cf.region,
        country: cf.country,
        timezone: cf.timezone,
        latitude: cf.latitude,
        longitude: cf.longitude,
        asOrganization: cf.asOrganization,
        asn: cf.asn,
        colo: cf.colo,
        httpProtocol: cf.httpProtocol,
        tlsVersion: cf.tlsVersion,
        botCategory: cf.verifiedBotCategory,
      });
      try {
        const result = await sendViaResend(context.env, email);
        console.log(`[visit] resend ok=${result.ok} status=${result.status} body=${result.body} (ip=${ip} page=${page})`);
      } catch (e) {
        // The beacon must still return a valid image even if the mail send fails.
        console.log(`[visit] resend threw: ${e} (ip=${ip} page=${page})`);
      }
    }
  } else {
    console.log(`[visit] deduped: recentByCookie=${recentByCookie} recentlySeen=${recentlySeen} (ip=${ip} page=${page})`);
  }

  return gifResponse({ "Set-Cookie": setCookie });
}
