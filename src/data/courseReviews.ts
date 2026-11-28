export type CourseReview = {
  id: string;
  name: string | null;
  quote: string;
  /** ISO 639-1 language of the quote for dir/lang attributes. */
  lang: "ar" | "en";
};

const agenticCourseReviewsRaw: CourseReview[] = [
  {
    id: "mohamed-mansour",
    name: "Mohamed Mansour",
    lang: "ar",
    quote:
      "من أجمل الكورسات اللي مريت بيها. أكتر حاجة مميزة في مهندس كريم إنه مش بيعلمك مجرد كود في Python أو استخدام Nodes في n8n، لكنه بيعلمك إزاي تفكر في المشكلة من أكتر من زاوية، وتختار الحل المناسب، وتحسن أداء الـ AI Agents وتقلل التكلفة، مع أمثلة حقيقية من واقع خبرته العملية. بالإضافة للكوميونيتي المحترم والخبرات اللي استفدت منها، وتواضعه واستعداده الدائم للإجابة على أي سؤال.",
  },
  {
    id: "mariam-elsioffy",
    name: "Mariam Elsioffy",
    lang: "ar",
    quote:
      "الكورس متميز على المستوى العلمي والإنساني. مهندس كريم بيهتم إنك تفهم العلم نفسه، بداية من طريقة عمل الـ LLMs وإزاي تستخدمها في Python وتبني تطبيقات عليها، وصولًا لمفاهيم Agentic AI Design Patterns زي Routing وParallelization وOrchestration، وكل ده بأسلوب سلس وبسيط. وبجانب القيمة العلمية، أكتر حاجة تستحق التقدير هي حسن الخلق والتواضع والاحترام في التعامل.",
  },
  {
    id: "george-yacoub",
    name: "George Yacoub",
    lang: "en",
    quote:
      "What I appreciated most about the Agentic AI Engineering course was how clearly and simply complex concepts were explained. The course took us from programming fundamentals to agentic design patterns, agent tools, RAG implementations, real-world HR use cases, and CrewAI. Seeing how the same engineering concepts can be implemented using both Python and n8n was particularly valuable. Thank you, Karim, for such a great learning experience.",
  },
  {
    id: "aya-habib",
    name: "Aya Habib",
    lang: "ar",
    quote:
      "كورس Agentic AI Engineering من أفضل الكورسات اللي أخدتها في المجال، لأنه قدملي معلومات قوية ومتقدمة على المستوى النظري والعملي. المحتوى ساعدني أبني أساس قوي أقدر أعتمد عليه في تنفيذ مشاريع وتطوير معرفتي بمفاهيم أكثر تقدمًا في المجال. شكرًا لمهندس كريم على الكورس الرائع.",
  },
  {
    id: "mohamed-salah",
    name: "Mohamed Salah",
    lang: "en",
    quote:
      'Completing the Agentic AI Engineering course was about much more than earning a certificate. I built several practical projects, including a multimodal Telegram Secretary Agent, automated report generation agents, car dealership and hotel reservation automations, RAG chatbots, and multi-agent systems across different messaging platforms. My biggest takeaway was understanding that an AI agent is not just a chatbot, but an engineered system with inputs, outputs, memory, and tools that must be designed for reliability. This course truly reflects the philosophy of "Less Hype. More Engineering." Thank you, Karim, for this valuable experience.',
  },
  {
    id: "anon-01",
    name: null,
    lang: "ar",
    quote:
      "الحقيقة تجربة جميلة جدًا، الشرح ممتع والأسلوب ممتاز. مهندس كريم إنسان خلوق وصدره رحب، ومبسوط جدًا إني اشتركت معاه في الكورس واتعرفت عليه. ربنا يباركله ويجازيه كل خير.",
  },
  {
    id: "anon-02",
    name: null,
    lang: "ar",
    quote:
      "بصراحة الكورس رائع ومفيد جدًا، سواء من ناحية جودة المحتوى أو طريقة الشرح. تجربة ممتازة، ومن تقدم لتقدم إن شاء الله.",
  },
  {
    id: "anon-03",
    name: null,
    lang: "ar",
    quote:
      "كنت في البداية خايفة من المجال، لكن طريقة الشرح والتوضيح وتبسيط المواضيع خلتني أحب المجال وأستمتع بتعلمه. كل الشكر لمهندس كريم على أسلوبه الرائع، جزاه الله خيرًا وجعله علمًا ينتفع به إلى يوم القيامة.",
  },
  {
    id: "anon-04",
    name: null,
    lang: "ar",
    quote:
      "مهندس كريم إنسان خلوق جدًا وقمة في الاحترام، والكورس تجربة جميلة أتمنى تكون بداية لحياة أفضل بمشيئة الله.",
  },
  {
    id: "anon-05",
    name: null,
    lang: "ar",
    quote:
      "صدقًا مهندس كريم من أفضل وأرقى الأشخاص اللي عندهم القدرة على شرح وتبسيط المعلومات بالشكل ده. استفدنا كثير من الكورس ومن أسلوبه المميز في توصيل المعلومة، وربنا يجزيه كل خير.",
  },
  {
    id: "anon-06",
    name: null,
    lang: "ar",
    quote:
      "الكورس كان مفيد جدًا، وطريقة الشرح سلسة وبعيدة عن التعقيد. مهندس كريم عنده قدرة ممتازة على توصيل المعلومة بكل سهولة ووضوح. ما شاء الله، بارك الله فيكم ونفع بكم.",
  },
  {
    id: "anon-07",
    name: null,
    lang: "ar",
    quote:
      "بصراحة مهندس كريم من الأشخاص اللي قليل تلاقي زيهم، عنده خبرة كبيرة ومش بيبخل بأي معلومة على الطلاب. ربنا يحفظه ويبارك في علمه وخبرته.",
  },
  {
    id: "anon-08",
    name: null,
    lang: "ar",
    quote:
      "رغم إني لسه مخلصتش الكورس بالكامل، لكن المحتوى جميل ومفيد جدًا والشرح رائع. أكتر حاجة مميزة هي احترام وتواضع مهندس كريم واهتمامه بالطلاب، وتفاعله المستمر مع أي سؤال على الجروب. مبسوط جدًا إني أخدت قرار الاشتراك في الكورس.",
  },
  {
    id: "anon-09",
    name: null,
    lang: "ar",
    quote:
      "استفدت جدًا من الكورس، طريقة الشرح سهلة وممتازة، والمعلومات بتتوصل بشكل بسيط وواضح. كمان سرعة الرد على الأسئلة والاهتمام المستمر بالطلاب من أكتر الحاجات اللي ميزت التجربة. ربنا يبارك فيه.",
  },
  {
    id: "anon-10",
    name: null,
    lang: "ar",
    quote:
      "تجربة ثرية جدًا، واضح فيها حجم المجهود والتفاني والإخلاص في تقديم المعلومة. كل الشكر والتقدير على المحتوى والمجهود المحترم.",
  },
];

/** Alternate named and anonymous reviews for a more natural carousel mix. */
export function interleaveNamedAndAnonymous(reviews: CourseReview[]): CourseReview[] {
  const named: CourseReview[] = [];
  const anonymous: CourseReview[] = [];
  for (const review of reviews) {
    if (review.name?.trim()) named.push(review);
    else anonymous.push(review);
  }

  const mixed: CourseReview[] = [];
  const max = Math.max(named.length, anonymous.length);
  for (let i = 0; i < max; i++) {
    if (i < named.length) mixed.push(named[i]);
    if (i < anonymous.length) mixed.push(anonymous[i]);
  }
  return mixed;
}

/** Edited student feedback for Agentic AI Engineering (not verbatim quotes). */
export const agenticCourseReviews: CourseReview[] = interleaveNamedAndAnonymous(agenticCourseReviewsRaw);

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export function reviewDisplayName(review: CourseReview, anonymousLabel: string): string {
  return review.name?.trim() || anonymousLabel;
}

export function reviewInitials(review: CourseReview, anonymousLabel: string): string {
  if (review.name?.trim()) return initialsFromName(review.name);
  return anonymousLabel.slice(0, 1).toUpperCase() || "S";
}

export function normalizeCourseReviews(value: unknown): CourseReview[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item, index): CourseReview | null => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const quote = typeof row.quote === "string" ? row.quote.trim() : "";
      if (!quote) return null;
      const nameRaw = typeof row.name === "string" ? row.name.trim() : "";
      const lang = row.lang === "en" ? "en" : "ar";
      const id =
        typeof row.id === "string" && row.id.trim()
          ? row.id.trim()
          : `review-${index}-${Date.now()}`;
      return {
        id,
        name: nameRaw || null,
        quote,
        lang,
      };
    })
    .filter((item): item is CourseReview => Boolean(item));
}
