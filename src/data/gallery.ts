import type { Locale } from "@/i18n/translations";
import speakingStage from "@/assets/gallery/speaking-stage.jpg";
import portraitSuit from "@/assets/gallery/portrait-suit.jpg";
import webSummit from "@/assets/gallery/web-summit-qatar.jpg";
import flutterForward from "@/assets/gallery/flutter-forward.jpg";
import nasaSpaceApps from "@/assets/gallery/nasa-space-apps.jpg";
import speakingPanel from "@/assets/gallery/speaking-panel.jpg";
import arabYouthAward from "@/assets/gallery/arab-youth-award.jpg";
import stagePresenter from "@/assets/gallery/stage-presenter.jpg";
import engineeringField from "@/assets/gallery/engineering-field.jpg";
import speakingStudio from "@/assets/karim-speaking.jpg";
import studio from "@/assets/karim-studio.jpg";

export interface GalleryItem {
  id: string;
  src: string;
  alt: { en: string; ar: string };
  caption: { en: string; ar: string };
  tag: { en: string; ar: string };
  /** CSS object-position when cropped in cards */
  objectPosition?: string;
}

export const galleryItems: GalleryItem[] = [
  {
    id: "moscow",
    src: portraitSuit,
    alt: {
      en: "Karim in Moscow in formal attire — international representation",
      ar: "كريم في موسكو ببدلة رسمية — تمثيل دولي",
    },
    caption: {
      en: "International representation, Russia",
      ar: "تمثيل دولي، روسيا",
    },
    tag: { en: "Russia", ar: "روسيا" },
  },
  {
    id: "nasa",
    src: nasaSpaceApps,
    alt: {
      en: "Karim speaking at NASA Space Apps with IEEE Young Professionals",
      ar: "كريم يتحدث في NASA Space Apps مع IEEE Young Professionals",
    },
    caption: {
      en: "Speaker at NASA Space Apps — IEEE Young Professionals",
      ar: "متحدث في NASA Space Apps — IEEE Young Professionals",
    },
    tag: { en: "NASA · IEEE", ar: "NASA · IEEE" },
  },
  {
    id: "web-summit",
    src: webSummit,
    alt: {
      en: "Karim at Web Summit Qatar 2024",
      ar: "كريم في Web Summit Qatar 2024",
    },
    caption: {
      en: "Web Summit Qatar 2024",
      ar: "Web Summit Qatar 2024",
    },
    tag: { en: "Global Tech", ar: "تقنية عالمية" },
  },
  {
    id: "arab-youth",
    src: arabYouthAward,
    alt: {
      en: "Karim receiving recognition at Arab Youth Year 2023 with UNICEF and League of Arab States",
      ar: "كريم يتسلم تكريمًا في عام الشباب العربي 2023 مع يونيسيف وجامعة الدول العربية",
    },
    caption: {
      en: "Arab Youth Year 2023 — UNICEF & League of Arab States",
      ar: "عام الشباب العربي 2023 — يونيسيف وجامعة الدول العربية",
    },
    tag: { en: "Recognition", ar: "تكريم" },
  },
  {
    id: "stage",
    src: speakingStage,
    alt: {
      en: "Karim presenting on stage with microphone",
      ar: "كريم يقدّم على المسرح بالميكروفون",
    },
    caption: {
      en: "Stage speaking — tech competitions & community events",
      ar: "تحدث على المسرح — مسابقات تقنية وفعاليات مجتمعية",
    },
    tag: { en: "Speaking", ar: "تحدث" },
  },
  {
    id: "flutter",
    src: flutterForward,
    alt: {
      en: "Karim speaking at Flutter Forward with Google Developer Student Clubs",
      ar: "كريم يتحدث في Flutter Forward مع Google Developer Student Clubs",
    },
    caption: {
      en: "Flutter Forward — Google Developer Student Clubs",
      ar: "Flutter Forward — أندية مطوري جوجل الطلابية",
    },
    tag: { en: "Community", ar: "مجتمع" },
  },
  {
    id: "panel",
    src: speakingPanel,
    alt: {
      en: "Karim on a conference panel with microphone",
      ar: "كريم في جلسة نقاش مؤتمرية بالميكروفون",
    },
    caption: {
      en: "Conference panels & live discussions",
      ar: "جلسات نقاش ومؤتمرات مباشرة",
    },
    tag: { en: "Panels", ar: "جلسات" },
  },
  {
    id: "presenter",
    src: stagePresenter,
    alt: {
      en: "Karim presenting with headset microphone on stage",
      ar: "كريم يقدّم على المسرح بسماعة رأس احترافية",
    },
    caption: {
      en: "Professional workshops & keynote-style sessions",
      ar: "ورش عمل وجلسات بأسلوب محاضرات احترافية",
    },
    tag: { en: "Workshops", ar: "ورش عمل" },
  },
  {
    id: "field",
    src: engineeringField,
    alt: {
      en: "Karim in engineering field gear at a technical console",
      ar: "كريم في معدات هندسية ميدانية أمام لوحة تقنية",
    },
    caption: {
      en: "Hands-on engineering roots — systems & field work",
      ar: "جذور هندسية عملية — أنظمة وعمل ميداني",
    },
    tag: { en: "Engineering", ar: "هندسة" },
    // Subject sits on the right; keep face in frame when cropped
    objectPosition: "78% 18%",
  },
];

export const portraits = {
  suit: portraitSuit,
  speakingStudio,
  studio,
} as const;

export function getGalleryItems(locale: Locale = "en") {
  return galleryItems.map((item) => ({
    id: item.id,
    src: item.src,
    alt: item.alt[locale],
    caption: item.caption[locale],
    tag: item.tag[locale],
    objectPosition: item.objectPosition,
  }));
}
