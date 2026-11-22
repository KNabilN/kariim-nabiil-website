import { useQuery } from "@tanstack/react-query";
import type { Locale } from "@/i18n/translations";
import { getCatalogCourses, type CatalogCourse } from "@/data/courses";
import { getCv, type CvContent } from "@/data/cv";
import { getGalleryItems } from "@/data/gallery";
import { getProjects, type Project } from "@/data/projects";
import { getBrand } from "@/lib/brand";
import { getSiteContent } from "@/lib/siteCms";
import {
  defaultBrandCms,
  defaultCatalogCms,
  defaultCvCms,
  defaultGalleryCms,
  defaultHomeCms,
  defaultProjectsCms,
} from "@/lib/siteCmsDefaults";

type Localized<T> = { en: T; ar: T };

function pickLocale<T>(value: Localized<T> | undefined, locale: Locale, fallback: T): T {
  if (!value) return fallback;
  return value[locale] ?? value.en ?? fallback;
}

export function useCmsBrand(locale: Locale) {
  return useQuery({
    queryKey: ["cms", "brand", locale],
    queryFn: async () => {
      const defaults = defaultBrandCms();
      const remote = (await getSiteContent<ReturnType<typeof defaultBrandCms>>("brand")) || defaults;
      const localized = remote[locale] || remote.en || defaults[locale];
      const base = getBrand(locale);
      return {
        ...base,
        ...localized,
        // Team WhatsApp inbox is owned by brand.ts so lead messages never go to the visitor's number / stale CMS.
        phone: base.phone,
        youtube: remote.youtube || base.youtube,
        linkedin: remote.linkedin || base.linkedin,
        tiktok: remote.tiktok || base.tiktok,
        instagram: remote.instagram || base.instagram,
        whatsappUrl: base.whatsappUrl,
        coursePath: remote.coursePath || base.coursePath,
        salesCourseUrl: remote.salesCourseUrl || base.salesCourseUrl,
        n8nPlaylistUrl: remote.n8nPlaylistUrl || base.n8nPlaylistUrl,
        advancedN8nPlaylistUrl: remote.advancedN8nPlaylistUrl || base.advancedN8nPlaylistUrl,
      };
    },
    staleTime: 60_000,
  });
}

export function useCmsHome(locale: Locale) {
  return useQuery({
    queryKey: ["cms", "home", locale],
    queryFn: async () => {
      const remote = (await getSiteContent<ReturnType<typeof defaultHomeCms>>("home")) || defaultHomeCms();
      return pickLocale(remote, locale, defaultHomeCms()[locale]);
    },
    staleTime: 60_000,
  });
}

export function useCmsCatalog(locale: Locale) {
  return useQuery({
    queryKey: ["cms", "catalog", locale],
    queryFn: async () => {
      const fallback = getCatalogCourses(locale);
      const remote = await getSiteContent<ReturnType<typeof defaultCatalogCms>>("catalog");
      if (!remote || !Array.isArray(remote) || remote.length === 0) return fallback;

      return remote.map((item): CatalogCourse => {
        const staticCourse = fallback.find((c) => c.id === item.id);
        const brand = getBrand(locale);
        return {
          id: item.id,
          categoryId: item.categoryId || staticCourse?.categoryId || "All",
          category: staticCourse?.category || item.categoryId || "",
          title: item.title?.[locale] || item.title?.en || staticCourse?.title || "",
          description: item.description?.[locale] || item.description?.en || staticCourse?.description || "",
          href: item.href || staticCourse?.href || "#",
          external: item.external ?? staticCourse?.external,
          free: item.free ?? staticCourse?.free,
          featured: item.featured ?? staticCourse?.featured,
          price: staticCourse?.price,
          currency: staticCourse?.currency,
          priceIntl: staticCourse?.priceIntl,
          currencyIntl: staticCourse?.currencyIntl,
          instructor: brand.name,
          level: item.level?.[locale] || item.level?.en || staticCourse?.level || "",
          language: locale === "ar" ? "العربية" : "Arabic",
          image: item.imageUrl || staticCourse?.image || "",
          highlights: item.highlights?.[locale] || item.highlights?.en || staticCourse?.highlights,
          learnings: item.learnings?.[locale] || item.learnings?.en || staticCourse?.learnings,
          modules: item.modules?.[locale] || item.modules?.en || staticCourse?.modules,
        };
      });
    },
    staleTime: 60_000,
  });
}

export function useCmsProjects(locale: Locale) {
  return useQuery({
    queryKey: ["cms", "projects", locale],
    queryFn: async () => {
      const fallback = getProjects(locale);
      const remote = await getSiteContent<ReturnType<typeof defaultProjectsCms>>("projects");
      if (!remote) return fallback;
      return (pickLocale(remote, locale, fallback) as Project[]) || fallback;
    },
    staleTime: 60_000,
  });
}

export function useCmsCv(locale: Locale) {
  return useQuery({
    queryKey: ["cms", "cv", locale],
    queryFn: async () => {
      const fallback = getCv(locale);
      const remote = await getSiteContent<ReturnType<typeof defaultCvCms>>("cv");
      if (!remote) return fallback;
      return pickLocale(remote, locale, fallback) as CvContent;
    },
    staleTime: 60_000,
  });
}

export function useCmsGallery(locale: Locale) {
  return useQuery({
    queryKey: ["cms", "gallery", locale],
    queryFn: async () => {
      const fallback = getGalleryItems(locale);
      const remote = await getSiteContent<ReturnType<typeof defaultGalleryCms>>("gallery");
      if (!remote || !Array.isArray(remote) || remote.length === 0) return fallback;

      const mappedRemote = [...remote]
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((item) => {
          const staticItem = fallback.find((f) => f.id === item.id);
          return {
            id: item.id,
            src: item.imageUrl || item.src || staticItem?.src || "",
            alt: item.alt?.[locale] || item.alt?.en || staticItem?.alt || "",
            caption: item.caption?.[locale] || item.caption?.en || staticItem?.caption || "",
            tag: item.tag?.[locale] || item.tag?.en || staticItem?.tag || "",
            objectPosition: item.objectPosition || staticItem?.objectPosition,
          };
        })
        .filter((item) => !!item.src);

      const remoteIds = new Set(mappedRemote.map((item) => item.id));
      const missingDefaults = fallback.filter((item) => !remoteIds.has(item.id));
      return [...missingDefaults, ...mappedRemote];
    },
    staleTime: 60_000,
  });
}
