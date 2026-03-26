import { useState, useEffect } from "react";

export interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  tools: string[];
  domain: string;
  country: string;
  highlight: string;
  challenges: string;
  results: string;
  images: string[];
}

export const defaultProjects: Project[] = [
  {
    id: "1",
    title: "AI Legal Assistant for Qatari Procurement Law",
    description: "Built an AI assistant using RAG + Knowledge Graph that answers questions on Qatari procurement law while correctly handling multi-year legal amendments (2015, 2019, 2024).",
    fullDescription: "Developed a sophisticated AI legal assistant that leverages Retrieval-Augmented Generation (RAG) combined with a custom Knowledge Graph to provide accurate answers about Qatari procurement law. The system intelligently handles multi-year legal amendments from 2015, 2019, and 2024, ensuring users always get the most current and contextually relevant legal information via Telegram.",
    tools: ["n8n", "Supabase", "pgvector", "LLM", "Telegram"],
    domain: "Legal Tech",
    country: "Qatar",
    highlight: "Semantic chunking + custom knowledge graph with amendment relations",
    challenges: "Handling overlapping legal amendments across different years while maintaining accuracy and context. Traditional RAG approaches failed to capture the temporal relationships between amendments.",
    results: "Delivered a production-ready legal assistant that correctly resolves amendment conflicts and provides cited, accurate legal guidance. Deployed on Telegram for easy access by legal professionals.",
    images: [],
  {
    id: "2",
    title: "Agentic GEO/SEO Optimization System",
    description: "Developed a deep technical agentic system for Zaher AI startup, reducing analysis time from hours to 15 minutes and cutting costs by 80%.",
    fullDescription: "Built a multi-agent system for Zaher AI (pre-seed funded startup, $150K) that automates Generative Engine Optimization analysis. The system uses multiple LLMs in a parallelized architecture to analyze content, generate recommendations, and produce comprehensive reports.",
    tools: ["n8n", "Multiple LLMs", "Parallelization"],
    domain: "GEO (Generative Engine Optimization)",
    country: "Egypt",
    highlight: "Pre-seed funded startup ($150K)",
    challenges: "Coordinating multiple LLMs for parallel analysis while maintaining consistency across outputs. Required custom orchestration patterns to handle concurrent processing efficiently.",
    results: "Reduced analysis time from hours to under 15 minutes. Cut operational costs by 80% while increasing output quality by 50%. System processes 10+ analysis units concurrently.",
    images: [],
  {
    id: "3",
    title: "Sales AI Automation for Marketing Agency",
    description: "Developed a full AI-driven system to automate the entire sales process — from lead generation to follow-ups, proposal, and contract creation.",
    fullDescription: "Created an end-to-end AI-powered sales automation system for a marketing agency in Bahrain. The system handles the complete sales lifecycle: lead generation, qualification, automated follow-ups, proposal generation, and contract creation — all orchestrated through intelligent AI workflows.",
    tools: ["Notion CRM", "n8n", "Google Sheets", "AI"],
    domain: "Marketing & Sales",
    country: "Bahrain",
    highlight: "End-to-end sales automation",
    challenges: "Integrating multiple platforms (Notion, Google Sheets, email) into a cohesive automated pipeline while maintaining personalization in AI-generated communications.",
    results: "Fully automated the sales pipeline, reducing manual work by 90%. The agency can now handle 3x more leads with the same team size.",
    images: [],
  {
    id: "4",
    title: "Sales Rep Reporting System",
    description: "Built an end-to-end reporting platform for 39 branches to record daily sales and generate daily, weekly, and monthly performance reports.",
    fullDescription: "Designed and built a comprehensive reporting platform that enables 39 branches to record daily sales data and automatically generates performance reports at daily, weekly, and monthly intervals. The system provides management with real-time visibility into sales performance across all locations.",
    tools: ["Lovable", "Supabase"],
    domain: "Sales Analytics",
    country: "Egypt",
    highlight: "39 branches reporting system",
    challenges: "Handling concurrent data entry from 39 branches while ensuring data integrity and generating accurate aggregated reports across multiple time periods.",
    results: "Deployed to 39 branches with real-time reporting. Management now has instant visibility into performance metrics, replacing manual Excel-based reporting.",
  },
  {
    id: "5",
    title: "AI Financial Analysis Platform",
    description: "Built a platform for finance professionals to analyze financial sheets like balance sheets and cash flows using AI, providing recommendations and performance evaluations.",
    fullDescription: "Created an AI-powered financial analysis platform that enables finance professionals to upload and analyze financial documents including balance sheets, income statements, and cash flow statements. The AI provides detailed recommendations, performance evaluations, and trend analysis.",
    tools: ["AI Models", "n8n", "Financial Tools"],
    domain: "Finance & AI",
    country: "Saudi Arabia",
    highlight: "AI-powered financial insights",
    challenges: "Accurately parsing diverse financial document formats and ensuring AI-generated financial advice meets professional standards and regulatory requirements.",
    results: "Platform processes financial documents in minutes instead of hours, providing actionable insights that financial professionals can immediately use in their decision-making.",
  },
  {
    id: "6",
    title: "Agentic LLM Orchestration Engine",
    description: "Built a multi-LLM agentic system reducing runtime for 10-unit jobs from ~7 minutes to ~3 minutes using custom nested parallelization pattern in n8n.",
    fullDescription: "Invented a novel nested parallelization pattern in n8n to orchestrate multiple LLMs concurrently. This custom architecture enables processing of complex multi-unit jobs by distributing work across LLM instances with intelligent batching and result aggregation.",
    tools: ["n8n", "Multiple LLMs", "Custom Batching"],
    domain: "AI Infrastructure",
    country: "Egypt",
    highlight: "Invented nested parallelization pattern",
    challenges: "n8n's native parallelization doesn't support nested concurrent processing. Required inventing a custom pattern to achieve true parallel execution across multiple LLM calls.",
    results: "Reduced runtime for 10-unit jobs from ~7 minutes to ~3 minutes (57% improvement). The pattern is now reusable across multiple projects and has been adopted by other engineers.",
  },
];

const STORAGE_KEY = "portfolio_projects";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultProjects;
    } catch {
      return defaultProjects;
    }
  });

  const saveProjects = (updated: Project[]) => {
    setProjects(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return { projects, saveProjects };
}
