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
    '<tr dir="rtl"><td dir="rtl" align="right" class="gs-mute" style="padding:8px 0;color:#6b7280;width:96px;vertical-align:top;">' +
    label +
    '</td><td dir="rtl" align="right" class="gs-ink" style="padding:8px 0;color:#15171A;vertical-align:top;line-height:1.6;">' +
    '<bdi dir="rtl" style="unicode-bidi:isolate;direction:rtl;">' +
    valueHtml +
    "</bdi></td></tr>"
  );
}

function chip(title, rowsHtml, extraHtml) {
  if (!rowsHtml) return "";
  return (
    '<tr><td style="padding:14px 40px 0;">' +
    '<table role="presentation" dir="rtl" width="100%" cellpadding="0" cellspacing="0" class="gs-card" style="background:#f7f8f4;border:1px solid #e3e7da;border-radius:14px;border-collapse:separate;">' +
    '<tr><td align="right" style="padding:22px 26px;">' +
    '<div class="gs-green" style="font-size:12px;font-weight:800;letter-spacing:0.08em;color:#4F7D12;margin:0 0 14px;padding-bottom:12px;border-bottom:1px solid #e3e7da;text-align:right;">' +
    title +
    "</div>" +
    '<table role="presentation" dir="rtl" width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;">' +
    rowsHtml +
    "</table>" +
    (extraHtml || "") +
    "</td></tr></table></td></tr>"
  );
}

function linkButton(href, label) {
  return (
    `<a href="${escapeHtml(href)}" class="gs-pill" style="display:inline-block;margin-inline-end:8px;margin-bottom:6px;` +
    'padding:10px 18px;background:#ffffff;border:1px solid #d5dbc8;color:#15171A;border-radius:999px;font-size:13px;font-weight:700;text-decoration:none;">' +
    escapeHtml(label) +
    "</a>"
  );
}

// Call-to-action button (solid brand green / dark / outline).
function ctaButton(href, label, kind, width) {
  const styles = {
    green: "background:#9BE33A;color:#15171A;border:1px solid #9BE33A;",
    dark: "background:#15171A;color:#ffffff;border:1px solid #15171A;",
    light: "background:#ffffff;color:#15171A;border:1px solid #cfd5c2;",
  }[kind || "green"];
  return (
    `<a href="${escapeHtml(href)}" style="display:block;text-align:center;padding:15px 20px;border-radius:10px;` +
    `font-size:16px;font-weight:800;text-decoration:none;${width ? "" : ""}${styles}">${label}</a>`
  );
}

// Israeli mobile/landline -> wa.me digits (972…); null if it doesn't look valid.
function waDigits(phone) {
  let d = String(phone || "").replace(/\D/g, "");
  if (d.startsWith("972")) d = d.slice(3);
  else if (d.startsWith("0")) d = d.slice(1);
  return d.length >= 8 && d.length <= 9 ? "972" + d : null;
}

const SITE_NAME = "גוסטב את סער";
const SITE_URL = "https://gustav-saar.co.il";
const LOGO_URL = SITE_URL + "/assets/images/logo-dark.png";
const SITE_PHONE = "02-5328161";

// A row of up to 3 equal summary tiles: [{label, value}]
function tiles(items) {
  const n = items.length;
  const cells = items
    .map(
      (t) =>
        `<td width="${Math.floor(100 / n)}%" valign="top" class="gs-card" style="background:#f7f8f4;border:1px solid #e3e7da;border-radius:12px;padding:14px 16px;" align="right">` +
        `<div style="font-size:11px;font-weight:700;letter-spacing:0.06em;color:#6b7280;margin:0 0 6px;text-align:right;">${t.label}</div>` +
        `<div class="gs-ink" style="font-size:15px;font-weight:800;color:#15171A;line-height:1.4;text-align:right;"><bdi dir="rtl" style="unicode-bidi:isolate;">${t.value}</bdi></div></td>`
    )
    .join('<td width="10" style="font-size:0;line-height:0;">&nbsp;</td>');
  return (
    '<tr><td style="padding:22px 40px 0;"><table role="presentation" dir="rtl" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;"><tr>' +
    cells +
    "</tr></table></td></tr>"
  );
}

const PAGE_NAMES = {
  index: "דף הבית",
  "services-design": "תכנון ושרטוט",
  "services-manufacturing": "ייצור לוחות חשמל",
  "services-testing": "בדיקות ואישורים",
  "services-installation-maintenance": "התקנה, תחזוקה ושיפוץ",
  "panels-industrial": "לוחות תעשייתיים",
  "panels-control": "פיקוד ובקרה",
  "panels-hvac": "מיזוג וקירור",
  "panels-smoke-extraction": "פינוי עשן",
  "panels-pumps": "משאבות והגברת לחץ",
};

function sourceName(referrer, host) {
  if (!referrer || referrer === "-" || !host) return "כניסה ישירה";
  if (/google\./i.test(host)) return "גוגל";
  if (/facebook|fb\.com|instagram/i.test(host)) return "פייסבוק / אינסטגרם";
  if (/whatsapp|wa\.me/i.test(host)) return "וואטסאפ";
  if (/bing\./i.test(host)) return "Bing";
  return host;
}

export function buildVisitEmail({
  page, time, referrer, userAgent, ip, acceptLanguage, city, region, country,
  timezone, latitude, longitude, asOrganization, asn, colo, httpProtocol, tlsVersion, botCategory,
}) {
  const subject = `התבצעה כניסה חדשה לאתר ${SITE_NAME} - ${time}` + (page !== "index" ? ` | דף: ${page}` : "");

  const referrerHost = hostnameOf(referrer);
  const language = primaryLanguage(acceptLanguage);
  const device = parseDevice(userAgent);
  const country_he = countryName(country);
  const pageName = PAGE_NAMES[page] || page;
  const source = sourceName(referrer, referrerHost);

  let visitRows = row("דף", `<b>${escapeHtml(pageName)}</b>` + (PAGE_NAMES[page] ? ` <span style="color:#9aa0a6;font-size:12px;">(${escapeHtml(page)})</span>` : "")) + row("זמן", escapeHtml(time));
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
  const visitChip = chip("פרטי הביקור", visitRows);

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
      linkButton(`https://www.google.com/maps?q=${latitude},${longitude}`, "📍 פתיחה במפה") +
      "</div>";
  }
  const locationChip = chip("מיקום משוער", locationRows, locationExtra);

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
    ? '<tr><td style="padding:14px 40px 0;">' +
      '<table role="presentation" dir="rtl" width="100%" cellpadding="0" cellspacing="0" style="background:#fdf3e7;border-radius:12px;border-collapse:separate;">' +
      `<tr><td align="right" style="padding:14px 20px;font-size:13px;color:#8a6a1f;text-align:right;">⚠️ זוהה כבוט: ${escapeHtml(botCategory)}</td></tr>` +
      "</table></td></tr>"
    : "";

  const summary = tiles([
    { label: "מקור", value: escapeHtml(source) },
    { label: "מיקום", value: escapeHtml(city || country_he || "לא ידוע") },
    { label: "מכשיר", value: escapeHtml(device || "לא ידוע") },
  ]);

  const html = shell("כניסה חדשה לאתר", summary + visitChip + locationChip + deviceChip + botChip, {
    badge: "ביקור באתר",
    sub: `הנכנס/ת צפה בדף: ${escapeHtml(pageName)}`,
    preheader: `${pageName}${city ? " · " + city : ""} · ${source} · ${time}`,
  });

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

// Contact-form submission: dark hero with the lead, summary tiles, message, quick actions.
export function buildContactEmail({ name, phone, email, type, message }) {
  const subject = `פנייה חדשה מהאתר – ${name}`;
  const received = new Intl.DateTimeFormat("he-IL", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jerusalem" }).format(new Date());
  const initial = escapeHtml(Array.from(String(name).trim())[0] || "?");

  const hero =
    '<tr><td style="padding:0 40px;">' +
    '<table role="presentation" dir="rtl" width="100%" cellpadding="0" cellspacing="0"><tr>' +
    `<td width="68" valign="middle" align="center" style="padding-left:16px;"><div style="width:60px;height:60px;line-height:60px;border-radius:30px;background:#9BE33A;color:#15171A;font-size:28px;font-weight:800;text-align:center;">${initial}</div></td>` +
    '<td valign="middle" align="right">' +
    `<div class="gs-ink" style="font-size:24px;font-weight:800;color:#15171A;line-height:1.3;text-align:right;"><bdi dir="rtl" style="unicode-bidi:isolate;">${escapeHtml(name)}</bdi></div>` +
    `<div style="font-size:18px;margin-top:4px;text-align:right;"><a href="tel:${escapeHtml(phone)}" class="gs-ink" style="color:#15171A;font-weight:700;text-decoration:none;direction:ltr;unicode-bidi:isolate;">${escapeHtml(phone)}</a></div>` +
    "</td></tr></table></td></tr>";

  const summary = tiles([
    { label: "סוג פרויקט", value: escapeHtml(type || "לא צוין") },
    { label: "התקבל", value: escapeHtml(received) },
    { label: "אימייל", value: email ? `<a href="mailto:${escapeHtml(email)}" class="gs-ink" style="color:#15171A;text-decoration:none;word-break:break-all;font-size:13px;">${escapeHtml(email)}</a>` : "לא צוין" },
  ]);

  const msgHtml =
    '<tr><td style="padding:14px 40px 0;">' +
    '<table role="presentation" dir="rtl" width="100%" cellpadding="0" cellspacing="0" class="gs-card" style="background:#ffffff;border:1px solid #e3e7da;border-radius:14px;border-collapse:separate;">' +
    '<tr><td align="right" style="padding:22px 26px;border-right:4px solid #9BE33A;border-radius:14px;">' +
    '<div class="gs-green" style="font-size:12px;font-weight:800;letter-spacing:0.08em;color:#4F7D12;margin:0 0 12px;text-align:right;">ההודעה</div>' +
    `<div dir="rtl" class="gs-ink" style="font-size:17px;line-height:1.85;color:#15171A;text-align:right;"><bdi dir="rtl" style="unicode-bidi:isolate;direction:rtl;">${escapeHtml(message).replace(/\n/g, "<br/>")}</bdi></div>` +
    "</td></tr></table></td></tr>";

  const wa = waDigits(phone);
  const waText = encodeURIComponent(`שלום ${name}, כאן ${SITE_NAME}. קיבלנו את פנייתך באתר ונשמח לדבר על הפרויקט.`);
  const mailSubject = encodeURIComponent("הצעת מחיר – " + SITE_NAME);
  const mailBody = encodeURIComponent(`שלום ${name},\n\nתודה שפנית אלינו. נשמח לשמוע עוד פרטים על הפרויקט ולחזור אליך עם הצעה.\n\nבברכה,\n${SITE_NAME}\n${SITE_PHONE}`);
  const secondary = [
    wa ? ctaButton(`https://wa.me/${wa}?text=${waText}`, "💬 וואטסאפ", "dark") : "",
    email ? ctaButton(`mailto:${email}?subject=${mailSubject}&body=${mailBody}`, "✉️ השיבו במייל", "light") : "",
  ].filter(Boolean);
  const secRow = secondary.length
    ? '<table role="presentation" dir="rtl" width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px;"><tr>' +
      secondary.map((b) => `<td width="${Math.floor(100 / secondary.length)}%" style="padding:0 0 0 ${secondary.length > 1 ? 5 : 0}px;">${b}</td>`).join("") +
      "</tr></table>"
    : "";
  const actions =
    '<tr><td align="right" style="padding:26px 40px 0;" dir="rtl">' +
    '<div class="gs-mute" style="font-size:13px;color:#6b7280;margin:0 0 12px;text-align:right;">⚡ מומלץ לחזור ללקוח בהקדם, פנייה מהירה מגדילה את סיכויי הסגירה</div>' +
    ctaButton(`tel:${phone}`, `📞 התקשרו עכשיו · ${escapeHtml(phone)}`, "green") +
    secRow +
    "</td></tr>";

  const html = shell("פנייה חדשה מהאתר", `<tr><td style="height:22px;font-size:0;line-height:0;">&nbsp;</td></tr>` + hero + summary + msgHtml + actions, {
    badge: "ליד חדש",
    sub: "מישהו השאיר פרטים בטופס יצירת הקשר באתר",
    preheader: `${name} · ${phone}${type ? " · " + type : ""}`,
  });
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

function shell(title, bodyRows, opts) {
  const { badge, sub, preheader } = opts || {};
  const fontStack = "'IBM Plex Sans Hebrew',Arial,Helvetica,sans-serif";
  return (
    `<!DOCTYPE html><html dir="rtl" lang="he"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="color-scheme" content="only light"/><meta name="supported-color-schemes" content="only light"/><style>:root{color-scheme:only light;supported-color-schemes:only light}</style></head>` +
    `<body dir="rtl" class="gs-outer" style="margin:0;padding:0;background:#e9ecef;font-family:${fontStack};direction:rtl;">` +
    (preheader
      ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;color:#e9ecef;">${escapeHtml(preheader)}</div>`
      : "") +
    `<table role="presentation" dir="rtl" width="100%" cellpadding="0" cellspacing="0" class="gs-outer" style="background:#e9ecef;padding:36px 12px;"><tr><td align="center">` +
    `<table role="presentation" dir="rtl" width="640" cellpadding="0" cellspacing="0" class="gs-main" style="background:#ffffff;border-radius:18px;overflow:hidden;max-width:640px;width:100%;font-family:${fontStack};box-shadow:0 8px 30px rgba(21,23,26,.14);">` +
    // rich green hero: deep-to-vivid gradient with a lime glow, white text, light-on-dark logo
    '<tr><td bgcolor="#3f6f10" align="right" style="background:#3f6f10;background-image:radial-gradient(circle at 12% 18%,rgba(198,243,107,.75) 0%,rgba(198,243,107,0) 42%),radial-gradient(circle at 95% 110%,rgba(155,227,58,.55) 0%,rgba(155,227,58,0) 50%),linear-gradient(135deg,#17330a 0%,#2f5a0d 40%,#5d9a1a 75%,#8ABD36 100%);padding:30px 40px 38px;">' +
    '<table role="presentation" dir="rtl" width="100%" cellpadding="0" cellspacing="0"><tr>' +
    `<td align="right" valign="middle"><a href="${SITE_URL}" style="text-decoration:none;"><img src="${LOGO_URL}" width="176" height="69" alt="${SITE_NAME}" style="display:block;border:0;width:176px;height:auto;"/></a></td>` +
    (badge
      ? `<td align="left" valign="middle"><span style="display:inline-block;background:#C6F36B;color:#15210a;font-size:12px;font-weight:800;letter-spacing:0.06em;border-radius:999px;padding:7px 16px;box-shadow:0 0 0 4px rgba(198,243,107,.28);">● ${escapeHtml(badge)}</span></td>`
      : "") +
    "</tr></table>" +
    `<div style="font-size:34px;font-weight:800;color:#ffffff;line-height:1.25;margin-top:30px;text-align:right;text-shadow:0 2px 12px rgba(10,30,0,.35);">${title}</div>` +
    (sub ? `<div style="font-size:16px;color:#e3f7c0;margin-top:10px;line-height:1.6;text-align:right;">${sub}</div>` : "") +
    "</td></tr>" +
    '<tr><td style="height:5px;line-height:5px;font-size:0;background:#C6F36B;background-image:linear-gradient(90deg,#9BE33A,#E4FFB0,#9BE33A);">&nbsp;</td></tr>' +
    bodyRows +
    // footer
    '<tr><td style="padding:34px 40px 0;"><div style="border-top:1px solid #e3e7da;"></div></td></tr>' +
    '<tr><td align="right" style="padding:22px 40px 30px;">' +
    `<div class="gs-ink" style="font-size:14px;font-weight:700;color:#15171A;text-align:right;">${SITE_NAME} – תכנון, ייצור והתקנה של לוחות חשמל</div>` +
    `<div class="gs-mute" style="font-size:13px;color:#6b7280;margin-top:6px;text-align:right;"><a href="${SITE_URL}" class="gs-green" style="color:#4F7D12;text-decoration:none;font-weight:700;">gustav-saar.co.il</a> · <a href="tel:+97225328161" class="gs-mute" style="color:#6b7280;text-decoration:none;">${SITE_PHONE}</a></div>` +
    '<div style="font-size:11px;color:#a7adb3;margin-top:10px;text-align:right;">הודעה אוטומטית מהאתר. אין צורך להשיב למייל זה.</div>' +
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
