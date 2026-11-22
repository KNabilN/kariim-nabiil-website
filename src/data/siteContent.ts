import { useState } from "react";

export interface HeroContent {
  name: string;
  headline1: string;
  headlineHighlight: string;
  headline2: string;
  subtitle: string;
  description: string;
  badgeText: string;
  cta1Text: string;
  cta1Link: string;
  cta2Text: string;
  cta2Link: string;
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  description: string;
  link?: string;
}

export interface CourseItem {
  id: string;
  title: string;
  platform: string;
  description: string;
  link: string;
  features: string[];
  isFree: boolean;
}

export const defaultHeroContent: HeroContent = {
  name: "Karim Nabil",
  headline1: "I BUILD ",
  headlineHighlight: "INTELLIGENT",
  headline2: "AI SOLUTIONS",
  subtitle: "Agentic AI Engineer • AI Automation Expert • AI Product Manager",
  description: "Transforming businesses with cutting-edge AI agents, automation workflows, and intelligent systems. 300K+ YouTube views • 200+ students worldwide.",
  badgeText: "Available for AI Projects",
  cta1Text: "Explore Courses",
  cta1Link: "#courses",
  cta2Text: "Get in Touch",
  cta2Link: "#contact",
};

export const defaultStats: StatItem[] = [
  { id: "1", value: "550K+", label: "YouTube Views", description: "n8n_with_karim course", link: "https://www.youtube.com/@kariimnabiil" },
  { id: "2", value: "200+", label: "Students", description: "Across 7 countries" },
  { id: "3", value: "6+", label: "Countries", description: "Projects delivered globally" },
  { id: "4", value: "2x", label: "NASA Winner", description: "Space Apps Cairo & Global Nominee" },
];

export const defaultCourses: CourseItem[] = [
  {
    id: "1",
    title: "Agentic AI Masterclass",
    platform: "Website",
    description: "Master the art of building autonomous AI agents that can reason, plan, and execute complex tasks.",
    link: "/courses/agentic-ai-engineering",
    features: ["Agent Architecture", "LLM Integration", "Tool Building", "Production Deployment"],
    isFree: false,
  },
  {
    id: "2",
    title: "AI Sales Automation with n8n",
    platform: "Udemy",
    description: "Learn to automate your entire sales pipeline using AI and n8n workflow automation.",
    link: "https://www.udemy.com/course/ai-sales-automation-using-n8n/",
    features: ["n8n Workflows", "AI Integration", "Lead Scoring", "CRM Automation"],
    isFree: false,
  },
  {
    id: "3",
    title: "n8n with Karim",
    platform: "YouTube (Free)",
    description: "A free comprehensive course on mastering n8n workflow automation from basics to advanced integrations.",
    link: "https://www.youtube.com/playlist?list=PLLHIYYlcgk6KN58UnPm8q1btNHLDJlYto",
    features: ["Workflow Basics", "Automation", "Integrations", "Hands-on Projects"],
    isFree: true,
  },
];

function useLocalStorage<T>(key: string, defaults: T): { data: T; save: (val: T) => void } {
  const [data, setData] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaults;
    } catch {
      return defaults;
    }
  });

  const save = (val: T) => {
    setData(val);
    localStorage.setItem(key, JSON.stringify(val));
  };

  return { data, save };
}

export function useHeroContent() {
  return useLocalStorage<HeroContent>("portfolio_hero", defaultHeroContent);
}

export function useStats() {
  return useLocalStorage<StatItem[]>("portfolio_stats", defaultStats);
}

export function useCourses() {
  return useLocalStorage<CourseItem[]>("portfolio_courses", defaultCourses);
}
