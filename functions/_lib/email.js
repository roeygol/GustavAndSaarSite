// Shared HTML/text body builder for the visit-notification email. Pulls in
// whatever Cloudflare's `request.cf` object and the Accept-Language header
// already give us for free (no extra API calls) — geo, ISP, connection
// info, language, parsed device. Every extra field is optional: if the
// caller doesn't have it (e.g. local wrangler dev), the row is just
// skipped rather than showing a placeholder.
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function parseDevice(ua) {
  if (!ua || ua === "-") return null;
  let os = "";
  if (/iPad/i.test(ua)) os = "iPad";
  else if (/iPhone/i.test(ua)) os = "iPhone";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/Macintosh/i.test(ua)) os = "Mac";
  else if (/Windows/i.test(ua)) os = "Windows";
  else if (/Linux/i.test(ua)) os = "Linux";

  let browser = "";
  if (/EdgA?\//i.test(ua)) browser = "Edge";
  else if (/OPR\//i.test(ua)) browser = "Opera";
  else if (/CriOS\//i.test(ua)) browser = "Chrome";
  else if (/FxiOS\//i.test(ua)) browser = "Firefox";
  else if (/Chrome\//i.test(ua)) browser = "Chrome";
  else if (/Firefox\//i.test(ua)) browser = "Firefox";
  else if (/Version\/.*Safari\//i.test(ua)) browser = "Safari";

  const parts = [os, browser].filter(Boolean);
  return parts.length ? parts.join(" · ") : null;
}

function primaryLanguage(acceptLanguage) {
  if (!acceptLanguage) return null;
  const first = acceptLanguage.split(",")[0].split(";")[0].trim();
  return first || null;
}

function hostnameOf(url) {
  if (!url || url === "-") return null;
  try {
    return new URL(url).hostname;
  } catch (e) {
    return null;
  }
}

function countryName(code) {
  if (!code) return null;
  try {
    return new Intl.DisplayNames(["he"], { type: "region" }).of(code.toUpperCase());
  } catch (e) {
    return code;
  }
}

// Every row/table/cell below repeats "dir=rtl" (as an HTML attribute, not
// just CSS) and explicit text-align — Gmail's sanitizer strips <html>/<body>
// and re-wraps the content, which loses a dir="rtl" set only at the top, so
// RTL has to be nailed down at each nested table for it to survive.
function row(label, valueHtml) {
  // <bdi> isolates the value from the surrounding bidi context and forces
  // it to read as one RTL block, even when the value itself is mostly
  // Latin (an ISP name, an IP, "HTTP/2 · TLSv1.3") — without it, a value
  // that happens to start with a Latin character can flip the whole row
  // to render left-aligned in some clients, despite dir="rtl" elsewhere.
  return (
    '<tr dir="rtl"><td dir="rtl" align="right" style="padding:7px 0;color:#585f65;width:74px;vertical-align:top;">' +
    label +
    '</td><td dir="rtl" align="right" style="padding:7px 0;color:#15171A;vertical-align:top;line-height:1.6;">' +
    '<bdi dir="rtl" style="unicode-bidi:isolate;direction:rtl;">' +
    valueHtml +
    "</bdi></td></tr>"
  );
}

function chip(title, rowsHtml, extraHtml) {
  if (!rowsHtml) return "";
  return (
    '<tr><td style="padding:12px 32px 0;">' +
    '<table role="presentation" dir="rtl" width="100%" cellpadding="0" cellspacing="0" style="background:#eef1e6;border-radius:12px;border-collapse:separate;">' +
    '<tr><td align="right" style="padding:18px 20px;">' +
    '<div style="font-family:\'Heebo\',Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.06em;color:#4F7D12;margin:0 0 12px;text-align:right;">' +
    title +
    "</div>" +
    '<table role="presentation" dir="rtl" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">' +
    rowsHtml +
    "</table>" +
    (extraHtml || "") +
    "</td></tr></table></td></tr>"
  );
}

function linkButton(href, label) {
  return (
    `<a href="${escapeHtml(href)}" style="display:inline-block;margin-inline-end:8px;margin-bottom:6px;` +
    'padding:9px 16px;background:#ffffff;color:#15171A;border-radius:999px;font-size:12px;font-weight:700;text-decoration:none;">' +
    escapeHtml(label) +
    "</a>"
  );
}

const SITE_NAME = "גוסטב את סער";

export function buildVisitEmail({
  page, time, referrer, userAgent, ip, acceptLanguage, city, region, country,
  timezone, latitude, longitude, asOrganization, asn, colo, httpProtocol, tlsVersion, botCategory,
}) {
  const subject = `התבצעה כניסה חדשה לאתר ${SITE_NAME} - ${time}` + (page !== "index" ? ` | דף: ${page}` : "");

  const referrerHost = hostnameOf(referrer);
  const language = primaryLanguage(acceptLanguage);
  const device = parseDevice(userAgent);
  const country_he = countryName(country);

  let visitRows = (page !== "index" ? row("דף", `<b>${escapeHtml(page)}</b>`) : "") + row("זמן", escapeHtml(time));
  if (referrer && referrer !== "-") {
    visitRows += row(
      "מפנה",
      escapeHtml(referrerHost || referrer) +
        (referrerHost
          ? `<div style="font-size:12px;color:#7c828a;word-break:break-all;margin-top:2px;">${escapeHtml(referrer)}</div>`
          : "")
    );
  }
  if (language) visitRows += row("שפה", escapeHtml(language));
  const visitChip = chip("הביקור", visitRows);

  let locationRows = "";
  if (city) locationRows += row("עיר", escapeHtml(city));
  if (region || country_he) {
    locationRows += row("מחוז", escapeHtml([country_he, region].filter(Boolean).join(", ")));
  }
  if (timezone) locationRows += row("אזור זמן", escapeHtml(timezone));
  let locationExtra = "";
  if (latitude && longitude) {
    locationExtra =
      '<div dir="rtl" style="margin-top:12px;text-align:right;">' +
      linkButton(`https://www.google.com/maps?q=${latitude},${longitude}`, "פתיחה במפה") +
      "</div>";
  }
  const locationChip = chip("מיקום", locationRows, locationExtra);

  let deviceRows = row(
    "מכשיר",
    (device ? `${escapeHtml(device)}<br/>` : "") +
      `<span style="font-size:12px;color:#7c828a;word-break:break-all;">${escapeHtml(userAgent)}</span>`
  );
  deviceRows += row("IP", `<b>${escapeHtml(ip)}</b>`);
  if (asOrganization) {
    deviceRows += row("ספק", escapeHtml(asOrganization) + (asn ? ` (AS${escapeHtml(String(asn))})` : ""));
  }
  if (httpProtocol || tlsVersion || colo) {
    deviceRows += row(
      "חיבור",
      escapeHtml([httpProtocol, tlsVersion, colo ? `צומת ${colo}` : null].filter(Boolean).join(" · "))
    );
  }
  let deviceExtra = "";
  if (ip !== "-") {
    const ipForUrl = encodeURIComponent(ip);
    deviceExtra =
      '<div dir="rtl" style="margin-top:12px;text-align:right;">' +
      linkButton(`https://mxtoolbox.com/SuperTool.aspx?action=ptr%3a${ipForUrl}&run=toolpage`, "בדיקת IP") +
      linkButton(`https://ipinfo.io/${ipForUrl}`, "פרטי IP (ipinfo)") +
      "</div>";
  }
  const deviceChip = chip("מכשיר ורשת", deviceRows, deviceExtra);

  const botChip = botCategory
    ? '<tr><td style="padding:12px 32px 0;">' +
      '<table role="presentation" dir="rtl" width="100%" cellpadding="0" cellspacing="0" style="background:#fdf3e7;border-radius:12px;border-collapse:separate;">' +
      `<tr><td align="right" style="padding:14px 20px;font-size:13px;color:#8a6a1f;text-align:right;">זוהה כבוט: ${escapeHtml(botCategory)}</td></tr>` +
      "</table></td></tr>"
    : "";

  const html = shell("כניסה חדשה לאתר", visitChip + locationChip + deviceChip + botChip);

  const rlm = "‏";
  const textLine = (s) => rlm + s + "\n";
  const text =
    textLine(`כניסה חדשה לאתר ${SITE_NAME}`) +
    "\n" +
    (page !== "index" ? textLine(`דף: ${page}`) : "") +
    textLine(`זמן: ${time}`) +
    (referrer && referrer !== "-" ? textLine(`מפנה: ${referrer}`) : "") +
    (language ? textLine(`שפה: ${language}`) : "") +
    (city ? textLine(`עיר: ${city}`) : "") +
    (region || country_he ? textLine(`מחוז: ${[country_he, region].filter(Boolean).join(", ")}`) : "") +
    (timezone ? textLine(`אזור זמן: ${timezone}`) : "") +
    textLine(`מכשיר: ${device ? device + " — " : ""}${userAgent}`) +
    textLine(`IP: ${ip}`) +
    (asOrganization ? textLine(`ספק: ${asOrganization}${asn ? ` (AS${asn})` : ""}`) : "") +
    (botCategory ? textLine(`זוהה כבוט: ${botCategory}`) : "");

  return { subject, html, text };
}

// Contact-form submission, in the same card layout as the visit email.
export function buildContactEmail({ name, phone, email, type, message }) {
  const subject = `פנייה חדשה מהאתר – ${name}`;
  let rows = row("שם", `<b>${escapeHtml(name)}</b>`) + row("טלפון", `<a href="tel:${escapeHtml(phone)}" style="color:#15171A;">${escapeHtml(phone)}</a>`);
  if (email) rows += row("אימייל", `<a href="mailto:${escapeHtml(email)}" style="color:#15171A;">${escapeHtml(email)}</a>`);
  if (type) rows += row("סוג פרויקט", escapeHtml(type));
  const msgChip = chip("ההודעה", row("", escapeHtml(message).replace(/\n/g, "<br/>")));
  const html = shell("פנייה חדשה מהאתר", chip("פרטי הפונה", rows) + msgChip);
  const rlm = "‏";
  const text =
    [
      "פנייה חדשה מהאתר",
      `שם: ${name}`,
      `טלפון: ${phone}`,
      email ? `אימייל: ${email}` : null,
      type ? `סוג פרויקט: ${type}` : null,
      "",
      message,
    ]
      .filter((l) => l !== null)
      .map((l) => rlm + l)
      .join("\n") + "\n";
  return { subject, html, text };
}

function shell(title, bodyRows) {
  const fontStack = "'IBM Plex Sans Hebrew',Arial,Helvetica,sans-serif";
  return (
    '<!DOCTYPE html><html dir="rtl" lang="he"><head><meta charset="utf-8"/></head>' +
    `<body dir="rtl" style="margin:0;padding:0;background:#eef0f2;font-family:${fontStack};direction:rtl;">` +
    `<table role="presentation" dir="rtl" width="100%" cellpadding="0" cellspacing="0" style="background:#eef0f2;padding:40px 16px;"><tr><td align="center">` +
    `<table role="presentation" dir="rtl" width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;max-width:480px;font-family:${fontStack};">` +
    '<tr><td style="height:4px;line-height:4px;font-size:0;background:#7AB929;">&nbsp;</td></tr>' +
    '<tr><td align="right" style="padding:34px 32px 4px;">' +
    `<div style="font-size:12px;font-weight:700;letter-spacing:0.08em;color:#4F7D12;margin:0 0 10px;text-align:right;">${SITE_NAME} – הנדסת לוחות חשמל</div>` +
    `<div style="font-size:25px;font-weight:800;color:#15171A;line-height:1.4;text-align:right;">${title}</div>` +
    "</td></tr>" +
    bodyRows +
    '<tr><td style="padding:26px 32px 24px;" align="right">' +
    `<div style="font-size:12px;color:#a7adb3;text-align:right;">${SITE_NAME}</div>` +
    "</td></tr></table></td></tr></table></body></html>"
  );
}

// CONTACT_TO (the same recipient the contact form uses — Saar) may hold
// several comma-separated addresses. CONTACT_FROM must be on a domain
// verified in Resend; Resend's sandbox sender only delivers to the
// account owner, so set both before expecting real delivery.
export async function sendViaResend(env, { subject, html, text }, replyTo) {
  const from = env.CONTACT_FROM || "Gustav & Saar <onboarding@resend.dev>";
  const to = String(env.CONTACT_TO || "").split(",").map((s) => s.trim()).filter(Boolean);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject, html, text, reply_to: replyTo || undefined }),
  });
  return { ok: res.ok, status: res.status, body: await res.text() };
}
