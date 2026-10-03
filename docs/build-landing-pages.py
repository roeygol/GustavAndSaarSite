#!/usr/bin/env python3
"""Generates the SEO landing pages: services/*.html and panels/*.html.

Run from the repo root:  python3 docs/build-landing-pages.py
Edit the PAGES data below, not the generated HTML. Also rewrites sitemap.xml.
Copy is draft and generic (no invented standards/claims); confirm with the owners.
"""
import json
import os
from html import escape

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://gustav-saar.co.il"
BRAND = "גוסטב את סער"
PHONE_TEL = "+97225328161"
PHONE_TXT = "02-5328161"
WA = ("https://wa.me/972523768088?text=%D7%94%D7%99%D7%99%2C%20%D7%A8%D7%90%D7%99%D7%AA%D7%99%20"
      "%D7%90%D7%AA%20%D7%94%D7%90%D7%AA%D7%A8%20%D7%A9%D7%9C%D7%9B%D7%9D%20%D7%95%D7%90%D7%A0%D7%99%20"
      "%D7%9E%D7%97%D7%A4%D7%A9%20%D7%9C%D7%95%D7%97%20%D7%97%D7%A9%D7%9E%D7%9C.%20%D7%90%D7%A9%D7%9E%D7%97%20"
      "%D7%A9%D7%A0%D7%93%D7%91%D7%A8%20%D7%A2%D7%9C%20%D7%94%D7%A4%D7%A8%D7%95%D7%99%D7%A7%D7%98%20%D7%95%D7%A2%D7%9C%20"
      "%D7%94%D7%A6%D7%A2%D7%AA%20%D7%9E%D7%97%D7%99%D7%A8.%20")
CSS_V = "63"

OFFER_NOTE = "ספרו לנו על הפרויקט ונחזור אליכם עם הצעת מחיר מסודרת."

# kind: "services" | "panels"
PAGES = [
    # ---------------------------------------------------------------- services
    dict(kind="services", slug="design", beacon="services-design",
         crumb="תכנון ושרטוט",
         title="תכנון ושרטוט לוחות חשמל | גוסטב את סער",
         desc="תכנון הנדסי ושרטוט לוחות חשמל: סכמות חד-קוויות, תוכניות פיקוד, שרטוטי ביצוע ותיעוד מלא לפי צורכי הפרויקט. קבלו הצעת מחיר מגוסטב את סער.",
         h1="תכנון ושרטוט לוחות חשמל",
         service="תכנון ושרטוט לוחות חשמל",
         intro=["תכנון נכון הוא הבסיס ללוח חשמל אמין. אנחנו מתכננים ומשרטטים לוחות חשמל לפי צורכי הפרויקט, המערכות המחוברות והתקנים הרלוונטיים, כך שהלוח שיוצא מהסדנה הוא בדיוק מה שהפרויקט צריך.",
                "התכנון מתבצע באותו צוות שמייצר ומתקין את הלוח, ולכן שרטוטי הביצוע מותאמים למציאות בסדנה ובאתר ואין פערים בין הנייר לשטח."],
         sections=[
             ("מה כולל התכנון", ["הבנת דרישות הפרויקט, העומסים והמערכות המחוברות", "סכמות חד-קוויות ותוכניות פיקוד", "שרטוטי ביצוע ופריסת הלוח", "רשימת רכיבים וחישובי הגנה", "תיעוד שמלווה את הלוח למסירה ולאישור"]),
             ("למי זה מתאים", ["יזמים וקבלנים שצריכים לוח מתוכנן לפרויקט", "מתכנני חשמל ומהנדסים שמחפשים שותף לביצוע", "בעלי מפעלים ומבנים שמשדרגים מערכת קיימת"]),
             ("איך מתחילים", "שולחים לנו תוכניות קיימות, מפרט או תיאור חופשי של המערכת. גם בלי תוכניות אפשר להתחיל בשיחה: נשאל את השאלות הנכונות ונחזור עם תכנון והצעת מחיר."),
         ],
         faq=[("האם אפשר להזמין תכנון בלבד, בלי ייצור?", "כן. אפשר להזמין תכנון ושרטוט כשירות נפרד, או כחלק מחבילה שכוללת גם ייצור, בדיקה והתקנה. פנו אלינו ונתאים את ההיקף."),
              ("אילו מסמכים מקבלים בסוף התכנון?", "סכמות חד-קוויות, תוכניות פיקוד, שרטוטי ביצוע ופריסה ורשימת רכיבים, לפי היקף הפרויקט."),
              ("אפשר לשדרג לוח קיים לפי תכנון חדש?", "כן. אנחנו בוחנים את הלוח הקיים, מתכננים את השדרוג ומבצעים אותו, ראו גם שירותי התקנה, תחזוקה ושיפוץ.")],
         related=["manufacturing", "testing", "installation-maintenance"]),
    dict(kind="services", slug="manufacturing", beacon="services-manufacturing",
         crumb="ייצור לוחות חשמל",
         title="ייצור לוחות חשמל בהתאמה אישית | גוסטב את סער",
         desc="ייצור לוחות חשמל בסדנה: הרכבה מסודרת, חיווט מדויק, תיוג מלא וחומרי גלם איכותיים. לוחות לתעשייה, למסחר ולתשתיות. בקשו הצעת מחיר.",
         h1="ייצור לוחות חשמל",
         service="ייצור לוחות חשמל",
         intro=["אנחנו מייצרים לוחות חשמל בסדנה שלנו, לפי התכנון והדרישות של כל פרויקט. אין לוח ״מהמדף״: כל לוח נבנה, מחווט ומתויג לפי הפרויקט.",
                "ייצור מסודר חוסך זמן באתר ומקל על התחזוקה בהמשך: חיווט נקי, תיוג מלא ותיעוד שמתאים ללוח שבפועל."],
         sections=[
             ("מה כולל הייצור", ["הרכבה מסודרת של רכיבים בלוח", "חיווט מדויק לפי שרטוטי הביצוע", "תיוג מלא של מעגלים וחוטים", "שימוש בחומרי גלם ורכיבים איכותיים", "בדיקה לפני יציאה מהסדנה"]),
             ("סוגי לוחות שאנחנו מייצרים", ["לוחות חשמל תעשייתיים", "לוחות פיקוד ובקרה", "לוחות למיזוג וקירור", "לוחות למפוחים ופינוי עשן", "לוחות למשאבות והגברת לחץ"]),
             ("לוחות זמנים", "לוח הזמנים נקבע לפי גודל הלוח ומורכבותו, ומופיע בהצעת המחיר. אנחנו מעדכנים לאורך הדרך, כדי שהלוח יגיע לאתר בזמן שמתאים ללוח העבודות."),
         ],
         faq=[("בכמה זמן מייצרים לוח חשמל?", "תלוי בגודל ובמורכבות. נותנים לוח זמנים מחייב בהצעת המחיר."),
              ("האם הלוח מגיע עם שרטוטים?", "כן. הלוח נמסר עם שרטוטים ותיעוד ועם דוח בדיקה."),
              ("אפשר להזמין ייצור לפי תוכניות של המתכנן?", "כן. אנחנו מייצרים גם לפי תוכניות שמגיעות מהמתכנן או מהלקוח, ויכולים להשלים תכנון ושרטוט במידת הצורך.")],
         related=["design", "testing", "installation-maintenance"]),
    dict(kind="services", slug="testing", beacon="services-testing",
         crumb="בדיקות ואישורים",
         title="בדיקות ואישורים ללוחות חשמל | גוסטב את סער",
         desc="בדיקה ותיעוד של לוחות חשמל לפני מסירה: בדיקת חיווט, בדיקת פעולה, דוח בדיקה ומסמכים להעברה לפיקוח ולאישור. גוסטב את סער.",
         h1="בדיקות ואישורים ללוחות חשמל",
         service="בדיקות ואישורים ללוחות חשמל",
         intro=["כל לוח שיוצא מאיתנו נבדק ומתועד לפני המסירה. הבדיקה והתיעוד הם חלק מהעבודה, כדי שהלוח יגיע לאתר מוכן לחיבור ולאישור.",
                "הבדיקה בסדנה מקצרת את זמן ההפעלה באתר ומאתרת תקלות כשעוד קל וזול לתקן אותן."],
         sections=[
             ("מה כוללת הבדיקה", ["בדיקת חיווט והתאמה לשרטוטים", "בדיקת פעולה של מעגלי הפיקוד וההגנה", "דוח בדיקה שנמסר עם הלוח"]),
             ("מסמכים שמלווים את הלוח", ["שרטוטים ותיעוד מעודכנים", "דוח בדיקה", "מסמכים מוכנים להעברה לפיקוח ולאישור"]),
             ("למי זה מתאים", "קבלנים, מתכננים, מנהלי פרויקטים ובעלי מפעלים שצריכים לוח מתועד, מוכן לאישור ולהפעלה."),
         ],
         faq=[("האם כל לוח נבדק לפני המסירה?", "כן. כל לוח עובר בדיקה ומתועד לפני שהוא יוצא מהסדנה."),
              ("מה כולל דוח הבדיקה?", "דוח בדיקה שנמסר עם הלוח יחד עם השרטוטים והתיעוד. פירוט הבדיקות נקבע לפי סוג הלוח והפרויקט."),
              ("אפשר להזמין בדיקה ללוח קיים?", "כן, בהתאם לסוג הלוח ולמצבו. פנו אלינו עם פרטי הלוח ונחזור אליכם.")],
         related=["design", "manufacturing", "installation-maintenance"]),
    dict(kind="services", slug="installation-maintenance", beacon="services-installation-maintenance",
         crumb="התקנה, תחזוקה ושיפוץ",
         title="התקנה, תחזוקה ושיפוץ לוחות חשמל | גוסטב את סער",
         desc="התקנת לוחות חשמל באתר, שדרוג ושיפוץ לוחות ישנים ותחזוקה שוטפת. שירות אחרי ההתקנה מאותו צוות שתכנן וייצר את הלוח. גוסטב את סער.",
         h1="התקנה, תחזוקה ושיפוץ לוחות חשמל",
         service="התקנה, תחזוקה ושיפוץ לוחות חשמל",
         intro=["אנחנו מתקינים את הלוחות שייצרנו, ומשדרגים ומתחזקים גם לוחות קיימים. אותו צוות שמכיר את הלוח מלווה אותו באתר ולאורך השנים.",
                "לוח חשמל ישן או לא מתאים יכול להפוך לצוואר בקבוק של המערכת כולה. שדרוג מתוכנן מאריך את חיי המערכת ומקל על התחזוקה."],
         sections=[
             ("מה כוללים השירותים", ["התקנת לוחות חדשים באתר וחיבור למערכות", "שדרוג ושיפוץ של לוחות קיימים", "תחזוקה שוטפת ותיקון תקלות", "עדכון שרטוטים ותיעוד לאחר שינויים"]),
             ("מתי כדאי לשדרג לוח", ["הלוח ישן והרכיבים בו כבר לא מתאימים לעומסים", "מוסיפים מערכות או מגדילים הספק", "תקלות חוזרות או קושי באיתור תקלות", "חיווט לא מתויג או תיעוד חסר"]),
             ("שירות אחרי ההתקנה", "אנחנו זמינים גם אחרי המסירה: תחזוקה, שדרוג ותיקון לוחות קיימים, בליווי אישי של איש מקצוע."),
         ],
         faq=[("אתם מתקינים גם לוחות שלא ייצרתם?", "בהתאם לסוג הלוח ולמצבו. פנו אלינו עם פרטים ונבדוק מה נדרש."),
              ("יש שירות אחרי ההתקנה?", "כן: תחזוקה, שדרוג ותיקון לוחות קיימים."),
              ("איך מתחילים פרויקט שדרוג?", "מעבירים לנו תיאור של הלוח הקיים ותמונות אם יש, ואנחנו חוזרים עם המלצה והצעת מחיר.")],
         related=["design", "manufacturing", "testing"]),
    # ------------------------------------------------------------------ panels
    dict(kind="panels", slug="industrial", beacon="panels-industrial",
         crumb="לוחות חשמל תעשייתיים",
         title="לוחות חשמל תעשייתיים – תכנון וייצור | גוסטב את סער",
         desc="לוחות חשמל תעשייתיים למפעלים, מחסנים ומרכזים לוגיסטיים: הזנה, הגנה ובקרה לקווי ייצור ולמערכות כבדות. תכנון, ייצור והתקנה. בקשו הצעת מחיר.",
         h1="לוחות חשמל תעשייתיים",
         service="לוחות חשמל תעשייתיים",
         intro=["לוח חשמל תעשייתי מזין, מגן ושולט במערכות של מפעל: קווי ייצור, מכונות וציוד כבד. אנחנו מתכננים, מייצרים ומתקינים לוחות חשמל תעשייתיים לפי הפרויקט, ומוסרים אותם בדוקים ומתועדים.",
                "בסביבה תעשייתית זמינות המערכת קריטית. לכן אנחנו שמים דגש על חיווט מסודר, תיוג מלא ותיעוד שמקל על תחזוקה ואיתור תקלות."],
         sections=[
             ("איפה משתמשים בלוחות תעשייתיים", ["מפעלים וקווי ייצור", "מחסנים ומרכזים לוגיסטיים", "מתקני תשתית", "מערכות ומכונות כבדות"]),
             ("מה אנחנו מספקים", ["הזנה והגנה לצרכנים ולמנועים", "פיקוד ובקרה ואינטגרציה עם מערכות קיימות", "שרטוטים, תיעוד ודוח בדיקה", "התקנה, הפעלה ושירות אחרי המסירה"]),
         ],
         faq=[("אילו פרטים צריך כדי לקבל הצעה ללוח תעשייתי?", "סוג המערכת, הספק או אמפר משוער, מקום ההתקנה, לוח זמנים ותוכניות קיימות אם יש. גם בלי כל זה אפשר להתחיל בשיחה."),
              ("אפשר לשדרג לוח תעשייתי קיים?", "כן. אנחנו משדרגים ומשפצים לוחות קיימים, ראו שירותי התקנה, תחזוקה ושיפוץ."),
              ("האם הלוח מגיע עם תיעוד?", "כן. שרטוטים, תיעוד ודוח בדיקה נמסרים עם הלוח.")],
         related=["control", "pumps", "hvac"]),
    dict(kind="panels", slug="control", beacon="panels-control",
         crumb="לוחות פיקוד ובקרה",
         title="לוחות פיקוד ובקרה – תכנון וייצור | גוסטב את סער",
         desc="לוחות פיקוד ובקרה: אוטומציה, ניטור נתונים והתראות על תקלות למעליות, חדרי משאבות, בריכות ובתי מלון. תכנון, ייצור והתקנה מגוסטב את סער.",
         h1="לוחות פיקוד ובקרה",
         service="לוחות פיקוד ובקרה",
         intro=["לוחות פיקוד ובקרה מפעילים מערכות באופן אוטומטי, מנטרים נתונים ומתריעים על תקלות. אנחנו מתכננים ומייצרים לוחות פיקוד ובקרה לפי צורכי המערכת והאתר.",
                "לוח פיקוד מתוכנן היטב מפשט את התפעול, מקצר זמן איתור תקלות ומאפשר להרחיב את המערכת בהמשך."],
         sections=[
             ("איפה משתמשים בלוחות פיקוד ובקרה", ["מעליות", "חדרי משאבות", "בריכות", "בתי מלון ומבנים גדולים"]),
             ("מה אנחנו מספקים", ["תכנון לוגיקת פיקוד לפי דרישות המערכת", "ניטור נתונים והתראות על תקלות", "שרטוטים ותיעוד מלאים", "בדיקה לפני מסירה והפעלה באתר"]),
         ],
         faq=[("מה ההבדל בין לוח חשמל ללוח פיקוד ובקרה?", "לוח חשמל מזין ומגן על צרכנים. לוח פיקוד ובקרה מוסיף אוטומציה: הפעלה לפי תנאים, ניטור והתראות. לעיתים שניהם בלוח אחד."),
              ("אפשר לחבר את הלוח למערכות קיימות?", "בדרך כלל כן. נבדוק את המערכת הקיימת בעת התכנון ונתאים את הלוח."),
              ("איך מקבלים הצעת מחיר?", "ממלאים את הטופס או מתקשרים, ומעבירים לנו תיאור של המערכת.")],
         related=["industrial", "pumps", "hvac"]),
    dict(kind="panels", slug="hvac", beacon="panels-hvac",
         crumb="לוחות חשמל למיזוג וקירור",
         title="לוחות חשמל למיזוג וקירור – צ'ילרים | גוסטב את סער",
         desc="לוחות חשמל למיזוג אוויר וקירור: ניהול צ'ילרים, יטאות ומגדלי קירור למשרדים ולבתי חולים. תכנון, ייצור והתקנה מגוסטב את סער.",
         h1="לוחות חשמל למיזוג וקירור",
         service="לוחות חשמל למיזוג וקירור",
         intro=["מערכות מיזוג וקירור גדולות דורשות לוח שמנהל את הציוד בצורה בטוחה ויעילה. אנחנו מתכננים ומייצרים לוחות לניהול צ'ילרים, מגדלי קירור ומערכות מיזוג אוויר.",
                "לוח מתוכנן לפי המערכת מאפשר הפעלה נכונה של הציוד, ניטור ותגובה מהירה לתקלות."],
         sections=[
             ("איפה משתמשים בלוחות מיזוג וקירור", ["צ'ילרים ויטאות", "מגדלי קירור", "משרדים ומבני מסחר", "בתי חולים ומוסדות"]),
             ("מה אנחנו מספקים", ["לוחות הזנה והגנה לציוד מיזוג", "פיקוד ובקרה לניהול המערכת", "שרטוטים, תיעוד ודוח בדיקה", "התקנה ושירות אחרי המסירה"]),
         ],
         faq=[("אתם מייצרים לוחות לצ'ילרים ולמגדלי קירור?", "כן. אנחנו מייצרים לוחות לניהול צ'ילרים, מגדלי קירור ומערכות מיזוג אוויר."),
              ("אפשר לשדרג לוח מיזוג קיים?", "כן, נבדוק את הלוח הקיים ונציע שדרוג מתאים."),
              ("מה צריך להכין לקבלת הצעה?", "סוג הציוד, ההספק המשוער ומקום ההתקנה. גם בלי פרטים אפשר להתחיל בשיחה.")],
         related=["industrial", "control", "pumps"]),
    dict(kind="panels", slug="smoke-extraction", beacon="panels-smoke-extraction",
         crumb="לוחות לפינוי עשן ומפוחים",
         title="לוחות חשמל למפוחים ופינוי עשן | גוסטב את סער",
         desc="לוחות חשמל למפוחים ולפינוי עשן: הפעלה אוטומטית של מפוחים בעת גילוי עשן בחניונים, במנהרות ובמבני ציבור. תכנון, ייצור והתקנה.",
         h1="לוחות חשמל למפוחים ופינוי עשן",
         service="לוחות חשמל למפוחים ופינוי עשן",
         intro=["במערכות פינוי עשן הלוח צריך לפעול בדיוק כשצריך. אנחנו מתכננים ומייצרים לוחות להפעלה אוטומטית של מפוחים בעת גילוי עשן, לצורכי בטיחות אש.",
                "בגלל אופי השימוש, הלוח נבנה בקפידה ונבדק היטב לפני המסירה, ומלווה בתיעוד מלא."],
         sections=[
             ("איפה משתמשים בלוחות פינוי עשן", ["חניונים", "מנהרות", "מבני ציבור", "מגדלי מגורים"]),
             ("מה אנחנו מספקים", ["לוחות להפעלת מפוחים לפי אירוע", "חיבור למערכות גילוי אש ועשן", "בדיקה ותיעוד לפני מסירה", "התקנה והפעלה באתר"]),
         ],
         faq=[("מה זה לוח לפינוי עשן?", "לוח שמפעיל מפוחים לשאיבת עשן ולאוורור באופן אוטומטי כשמתגלה עשן, כחלק ממערכת בטיחות האש של המבנה."),
              ("אפשר לקבל לוח שמתאים לדרישות הכבאות?", "אנחנו מתכננים לפי הדרישות והתקנים שהפרויקט מחייב. פנו אלינו עם המפרט ונחזור אליכם."),
              ("איך מתחילים?", "מעבירים לנו תוכניות או תיאור של המבנה והמערכת, ואנחנו חוזרים עם הצעה.")],
         related=["industrial", "control", "hvac"]),
    dict(kind="panels", slug="pumps", beacon="panels-pumps",
         crumb="לוחות משאבות והגברת לחץ",
         title="לוחות חשמל למשאבות והגברת לחץ מים | גוסטב את סער",
         desc="לוחות חשמל למשאבות ולמערכות הגברת לחץ מים לבנייני מגורים ומשרדים ולמתקני שאיבה. תכנון, ייצור והתקנה מגוסטב את סער.",
         h1="לוחות חשמל למשאבות והגברת לחץ",
         service="לוחות חשמל למשאבות והגברת לחץ",
         intro=["אנחנו מתכננים ומייצרים לוחות חשמל לאינסטלציה, למשאבות ולמערכות להגברת לחץ מים. הלוח מפעיל את המשאבות, מגן עליהן ומתריע על תקלות.",
                "לוח משאבות מותאם לאתר מבטיח אספקת מים יציבה ומונע נזקים לציוד."],
         sections=[
             ("איפה משתמשים בלוחות משאבות", ["בנייני מגורים ומשרדים", "מתקני שאיבה", "חדרי משאבות", "בריכות"]),
             ("מה אנחנו מספקים", ["הפעלה והגנה למשאבות", "בקרת לחץ ושליטה במספר משאבות", "התראות על תקלות", "שרטוטים, תיעוד, בדיקה והתקנה"]),
         ],
         faq=[("אתם מייצרים לוחות להגברת לחץ בבניינים?", "כן. אנחנו מייצרים לוחות לאינסטלציה, למשאבות ולמערכות הגברת לחץ מים לבנייני מגורים ומשרדים."),
              ("אפשר להחליף לוח משאבות ישן?", "כן, אנחנו משדרגים לוחות קיימים ומתאימים אותם למשאבות שבשטח."),
              ("איזה מידע צריך להכין?", "מספר המשאבות, הספק משוער ומקום ההתקנה. גם בלי פרטים אפשר להתחיל בשיחה.")],
         related=["industrial", "control", "hvac"]),
]

BY_SLUG = {p["slug"]: p for p in PAGES}


def url(p):
    return f"/{p['kind']}/{p['slug']}"


def render(p):
    full = SITE + url(p)
    parent_name = "שירותים" if p["kind"] == "services" else "סוגי לוחות"
    parent_item = f"{SITE}/#{'services' if p['kind'] == 'services' else 'panels'}"
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": BRAND, "item": SITE + "/"},
            {"@type": "ListItem", "position": 2, "name": parent_name, "item": parent_item},
            {"@type": "ListItem", "position": 3, "name": p["crumb"], "item": full}]},
        {"@type": "Service", "@id": full + "#service", "name": p["service"], "description": p["desc"], "url": full,
         "serviceType": p["service"], "areaServed": {"@type": "Country", "name": "ישראל"},
         "provider": {"@id": SITE + "/#business"}},
        {"@type": "FAQPage", "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in p["faq"]]},
    ]}
    ld_json = json.dumps(ld, ensure_ascii=False)

    body = []
    for para in p["intro"]:
        body.append(f"<p>{escape(para)}</p>")
    for h, content in p["sections"]:
        body.append(f"<h2>{escape(h)}</h2>")
        if isinstance(content, str):
            body.append(f"<p>{escape(content)}</p>")
        else:
            body.append("<ul>" + "".join(f"<li>{escape(i)}</li>" for i in content) + "</ul>")
    faq = "".join(f"<details><summary>{escape(q)}</summary><p>{escape(a)}</p></details>" for q, a in p["faq"])
    related = "".join(f'<li><a href="{url(BY_SLUG[s])}">{escape(BY_SLUG[s]["crumb"])}</a></li>' for s in p["related"])
    others = "services" if p["kind"] == "panels" else "panels"
    cross = [x for x in PAGES if x["kind"] == others][:3]
    cross_html = "".join(f'<li><a href="{url(x)}">{escape(x["crumb"])}</a></li>' for x in cross)

    return f"""<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{escape(p['title'])}</title>
<meta name="description" content="{escape(p['desc'], quote=True)}">
<meta name="theme-color" content="#ffffff">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="{full}">
<meta property="og:type" content="website">
<meta property="og:locale" content="he_IL">
<meta property="og:site_name" content="{BRAND}">
<meta property="og:title" content="{escape(p['title'], quote=True)}">
<meta property="og:description" content="{escape(p['desc'], quote=True)}">
<meta property="og:url" content="{full}">
<meta property="og:image" content="{SITE}/assets/images/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="{BRAND} – לוחות חשמל, מהתכנון עד ההתקנה">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/icons/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/assets/icons/favicon-48.png" sizes="48x48" type="image/png">
<link rel="apple-touch-icon" href="/assets/icons/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Hebrew:wght@300;400;500;600;700&display=swap" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Hebrew:wght@300;400;500;600;700&display=swap" rel="stylesheet"></noscript>
<script>(function(){{var t='light';try{{if(localStorage.getItem('theme')==='dark')t='dark'}}catch(e){{}}document.documentElement.setAttribute('data-theme',t)}})()</script>
<link rel="stylesheet" href="/css/styles.css?v={CSS_V}">
<script type="application/ld+json">
{ld_json}
</script>
</head>
<body>
<img src="/api/visit?page={p['beacon']}" alt="" width="1" height="1" style="position:absolute;width:1px;height:1px;opacity:0;pointer-events:none" aria-hidden="true">
<header class="nav"><div class="wrap nav-in">
<a class="brand" href="/" aria-label="{BRAND} – דף הבית"><img class="logo-lt" src="/assets/images/logo.png" alt="{BRAND}" width="192" height="75"><img class="logo-dk" aria-hidden="true" src="/assets/images/logo-dark.png" alt="" width="192" height="75"></a>
<a class="btn nav-cta" href="tel:{PHONE_TEL}">{PHONE_TXT}</a>
</div></header>
<main class="doc">
<nav aria-label="פירורי לחם" class="crumbs"><a href="/">דף הבית</a> › <a href="/#{'services' if p['kind'] == 'services' else 'panels'}">{parent_name}</a> › <span>{escape(p['crumb'])}</span></nav>
<h1>{escape(p['h1'])}</h1>
{chr(10).join(body)}
<div class="cta-box">
<h2>מעוניינים בהצעת מחיר?</h2>
<p>{OFFER_NOTE}</p>
<div class="cta-row"><a class="btn btn-g" href="/#contact">לטופס יצירת קשר</a><a class="btn btn-o" href="tel:{PHONE_TEL}">{PHONE_TXT}</a><a class="btn btn-o" href="{WA}">וואטסאפ</a></div>
</div>
<h2>שאלות נפוצות</h2>
<div class="faq">{faq}</div>
<h2>עוד אצלנו</h2>
<ul>{related}{cross_html}<li><a href="/">כל השירותים וסוגי הלוחות</a></li></ul>
</main>
<footer class="foot"><div class="wrap foot-bot">© {BRAND} · כל הזכויות שמורות · <a href="/privacy.html">מדיניות פרטיות</a> · <a href="/accessibility.html">הצהרת נגישות</a></div></footer>
<div class="m-bar">
<a class="btn btn-g" href="tel:{PHONE_TEL}">התקשרו</a>
<a class="btn btn-o" href="{WA}">וואטסאפ</a>
<a class="btn btn-o" href="/#contact">הצעת מחיר</a>
</div>
</body>
</html>
"""


def sitemap():
    rows = [f"  <url><loc>{SITE}/</loc><priority>1.0</priority></url>"]
    rows += [f"  <url><loc>{SITE}{url(p)}</loc><priority>0.8</priority></url>" for p in PAGES]
    return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "\n".join(rows) + "\n</urlset>\n"


if __name__ == "__main__":
    for p in PAGES:
        d = os.path.join(ROOT, p["kind"])
        os.makedirs(d, exist_ok=True)
        with open(os.path.join(d, p["slug"] + ".html"), "w", encoding="utf-8") as f:
            f.write(render(p))
    with open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8") as f:
        f.write(sitemap())
    print(f"wrote {len(PAGES)} pages + sitemap.xml")
