/** Digits-only phone for wa.me (country code, no +). */
export function whatsappDigits(phoneOrUrl?: string | null): string {
  if (!phoneOrUrl) return "";
  const trimmed = phoneOrUrl.trim();

  // wa.me/2012... or api.whatsapp.com/send?phone=2012...
  const meMatch = trimmed.match(/wa\.me\/(\d{8,15})/i);
  if (meMatch) return meMatch[1];

  const phoneParam = trimmed.match(/[?&]phone=(\d{8,15})/i);
  if (phoneParam) return phoneParam[1];

  // Raw phone like +201273091969
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length >= 8 && digits.length <= 15) return digits;

  return "";
}

/**
 * Build a WhatsApp chat URL. Prefers a real phone number so `text` prefill works.
 * Note: `wa.me/message/...` short links ignore `?text=` — they cannot carry a draft message.
 */
export function buildWhatsAppUrl(options: {
  phone?: string | null;
  whatsappUrl?: string | null;
  text?: string | null;
}): string {
  const digits =
    whatsappDigits(options.phone) ||
    whatsappDigits(options.whatsappUrl) ||
    "";

  if (digits) {
    const base = `https://wa.me/${digits}`;
    const text = options.text?.trim();
    return text ? `${base}?text=${encodeURIComponent(text)}` : base;
  }

  const fallback = (options.whatsappUrl || "https://wa.me/message/3J6SMTFRTNR7I1").split("?")[0];
  // Without a phone number, text cannot be reliably prefilled.
  return fallback;
}

export type WhatsAppLeadDetails = {
  name: string;
  email: string;
  whatsapp: string;
  interestLabel: string;
  courseTitle?: string;
  discountCode?: string;
  jobTitle?: string;
  companyName?: string;
  meetingDetails?: string;
  linkedin?: string;
  locale?: "en" | "ar";
};

export function buildLeadWhatsAppMessage(details: WhatsAppLeadDetails): string {
  const locale = details.locale || "en";

  if (locale === "ar") {
    const lines = [
      "السلام عليكم،",
      `أنا ${details.name}`,
      `مهتم بـ: ${details.interestLabel}`,
    ];
    if (details.courseTitle) lines.push(`الكورس: ${details.courseTitle}`);
    if (details.discountCode) lines.push(`كود الخصم: ${details.discountCode}`);
    if (details.jobTitle) lines.push(`التايتل: ${details.jobTitle}`);
    if (details.companyName) lines.push(`الشركة: ${details.companyName}`);
    if (details.meetingDetails) lines.push(`التفاصيل: ${details.meetingDetails}`);
    if (details.linkedin) lines.push(`لينكدإن: ${details.linkedin}`);
    lines.push(`الإيميل: ${details.email}`);
    lines.push(`واتساب: ${details.whatsapp}`);
    return lines.join("\n");
  }

  const lines = [
    "Hello,",
    `My name is ${details.name}`,
    `I'm interested in: ${details.interestLabel}`,
  ];
  if (details.courseTitle) lines.push(`Course: ${details.courseTitle}`);
  if (details.discountCode) lines.push(`Discount code: ${details.discountCode}`);
  if (details.jobTitle) lines.push(`Title: ${details.jobTitle}`);
  if (details.companyName) lines.push(`Company: ${details.companyName}`);
  if (details.meetingDetails) lines.push(`Details: ${details.meetingDetails}`);
  if (details.linkedin) lines.push(`LinkedIn: ${details.linkedin}`);
  lines.push(`Email: ${details.email}`);
  lines.push(`WhatsApp: ${details.whatsapp}`);
  return lines.join("\n");
}

export function buildFinancialAidWhatsAppMessage(options: {
  courseTitle: string;
  priceLabel?: string;
  locale?: "en" | "ar";
}): string {
  if (options.locale === "ar") {
    const lines = [
      "السلام عليكم،",
      `حابب أطلب دعم مالي لكورس: ${options.courseTitle}`,
    ];
    if (options.priceLabel) lines.push(`سعر الكورس: ${options.priceLabel}`);
    lines.push("سبب طلب الخصم:");
    lines.push("قيمة الخصم اللي محتاجها:");
    return lines.join("\n");
  }

  const lines = [
    "Hello,",
    `I’d like to request financial aid for: ${options.courseTitle}`,
  ];
  if (options.priceLabel) lines.push(`Course price: ${options.priceLabel}`);
  lines.push("Why I need the discount:");
  lines.push("Discount amount I’m hoping for:");
  return lines.join("\n");
}

export function buildGenericContactWhatsAppMessage(locale: "en" | "ar" = "en"): string {
  if (locale === "ar") {
    return ["السلام عليكم،", "حابب أتواصل معاك بخصوص خدماتك في الذكاء الاصطناعي والأتمتة."].join("\n");
  }
  return ["Hello,", "I’d like to get in touch about your AI engineering and automation services."].join("\n");
}

export const LATEST_WHATSAPP_MESSAGE_KEY = "latest_whatsapp_message";

export function rememberWhatsAppMessage(message: string) {
  try {
    sessionStorage.setItem(LATEST_WHATSAPP_MESSAGE_KEY, message);
  } catch {
    // ignore storage failures
  }
}

export function readRememberedWhatsAppMessage(): string {
  try {
    return sessionStorage.getItem(LATEST_WHATSAPP_MESSAGE_KEY) || "";
  } catch {
    return "";
  }
}
