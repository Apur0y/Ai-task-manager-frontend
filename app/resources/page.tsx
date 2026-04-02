"use client";
import { useState } from "react";
import { useRoadmap } from "@/lib/useRoadmap";
import type { Resource } from "@/lib/types";
import { TYPE_META } from "@/lib/utils";

interface ResourceGroup {
  topic: string;
  type: string;
  resources: (Resource & { taskTitle: string; taskRef: string; weekTheme: string })[];
}

const STATIC_RESOURCES = [
  {
    topic: "DSA",
    type: "dsa",
    links: [
      { label: "NeetCode.io — roadmap", url: "https://neetcode.io", note: "Use this as your single DSA source of truth" },
      { label: "NeetCode YouTube", url: "https://www.youtube.com/@NeetCode", note: "Watch before attempting any new pattern" },
      { label: "Leetcode", url: "https://leetcode.com", note: "Solve in TypeScript. Only Neetcode 150 list." },
    ],
  },
  {
    topic: "Docker & DevOps",
    type: "tech",
    links: [
      { label: "TechWorld with Nana — Docker full course", url: "https://www.youtube.com/watch?v=3c-iBn73dDE", note: "Best beginner-to-intermediate Docker content" },
      { label: "Fireship — Docker in 100 seconds", url: "https://www.youtube.com/watch?v=Gjnup-PuquQ", note: "Watch first for mental model" },
      { label: "Docker official docs", url: "https://docs.docker.com", note: "Use the Get Started guide alongside videos" },
      { label: "GitHub Actions docs", url: "https://docs.github.com/en/actions", note: "Official reference for CI/CD pipelines" },
    ],
  },
  {
    topic: "AWS",
    type: "tech",
    links: [
      { label: "FreeCodeCamp — AWS Full Course (YouTube)", url: "https://www.youtube.com/watch?v=SOTamWNgDKc", note: "5hr course. Free. Covers Cloud Practitioner cert." },
      { label: "AWS Skill Builder — free tier", url: "https://explore.skillbuilder.aws", note: "Official AWS learning. Cloud Practitioner Essentials is free." },
      { label: "Traversy Media — Deploy Node to AWS", url: "https://www.youtube.com/watch?v=T-Pum2TraX4", note: "Hands-on. Do this in week 3." },
    ],
  },
  {
    topic: "AI Engineering",
    type: "tech",
    links: [
      { label: "Vercel AI SDK docs", url: "https://sdk.vercel.ai/docs", note: "Best DX for AI apps with Next.js" },
      { label: "LangChain JS docs", url: "https://js.langchain.com/docs/introduction/", note: "Read Quickstart + RAG tutorial first" },
      { label: "Josh tried coding — YouTube", url: "https://www.youtube.com/@joshtriedcoding", note: "Builds real AI apps with your exact stack" },
      { label: "Fireship — LangChain in 100s", url: "https://www.youtube.com/watch?v=HSZ_uaif57o", note: "Mental model first, then go deep" },
      { label: "Anthropic docs", url: "https://docs.anthropic.com", note: "Official docs for Claude API" },
      { label: "OpenAI tokenizer", url: "https://platform.openai.com/tokenizer", note: "Understand tokens visually" },
    ],
  },
  {
    topic: "PostgreSQL",
    type: "tech",
    links: [
      { label: "Hussein Nasser — Postgres playlist", url: "https://www.youtube.com/@hnasr", note: "Deep dives: indexing, transactions, performance" },
      { label: "postgresqltutorial.com", url: "https://www.postgresqltutorial.com", note: "Free, structured, basics to advanced" },
      { label: "PlanetScale blog", url: "https://planetscale.com/blog", note: "Great articles on query optimization" },
    ],
  },
  {
    topic: "System Design",
    type: "concept",
    links: [
      { label: "ByteByteGo YouTube", url: "https://www.youtube.com/@ByteByteGo", note: "Watch 2 videos/week from month 3" },
      { label: "ByteByteGo blog", url: "https://blog.bytebytego.com", note: "Written versions. Subscribe to newsletter." },
    ],
  },
  {
    topic: "Resume & LinkedIn",
    type: "profile",
    links: [
      { label: "Clement Mihailescu — resume tips", url: "https://www.youtube.com/@clem", note: "Ex-Google engineer. Very practical for devs." },
      { label: "rxresu.me", url: "https://rxresu.me", note: "Free, clean, ATS-friendly resume builder" },
      { label: "Teal HQ blog", url: "https://www.tealhq.com/blog", note: "Resume bullets, LinkedIn optimization" },
    ],
  },
  {
    topic: "Stay updated (10 min/day)",
    type: "revision",
    links: [
      { label: "tldr.tech newsletter", url: "https://tldr.tech", note: "5-minute daily tech digest. Free." },
      { label: "bytes.dev newsletter", url: "https://bytes.dev", note: "JavaScript ecosystem. Weekly, funny, practical." },
      { label: "dev.to", url: "https://dev.to", note: "Write 1 article/month about what you built" },
    ],
  },
];

export default function ResourcesPage() {
  const { roadmap } = useRoadmap();
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filters = ["all", "dsa", "tech", "concept", "profile", "revision"];

  const filtered = STATIC_RESOURCES.filter(
    (g) => activeFilter === "all" || g.type === activeFilter
  );

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8">
        <div className="text-[11px] font-mono text-ink-500 tracking-widest uppercase mb-2">All links</div>
        <h1 className="font-display text-3xl font-semibold text-ink-50">Resources</h1>
        <p className="text-sm text-ink-400 mt-2">Curated for your stack. No rabbit holes — one source per topic.</p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {filters.map((f) => {
          const meta = TYPE_META[f];
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`text-[11px] px-3 py-1.5 rounded-full border font-mono transition-all
                ${activeFilter === f
                  ? meta ? `${meta.text} border-current bg-current/10` : "bg-ink-100 text-ink-900 border-ink-100"
                  : "text-ink-400 border-ink-700 hover:border-ink-500"
                }`}
            >
              {meta ? meta.label : "All"}
            </button>
          );
        })}
      </div>

      {/* Resource groups */}
      <div className="space-y-6">
        {filtered.map((group) => {
          const meta = TYPE_META[group.type];
          return (
            <div key={group.topic} className="bg-ink-800/50 border border-ink-700/50 rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-ink-700/40">
                <span className={`w-2 h-2 rounded-full ${meta?.dot || "bg-ink-400"}`} />
                <h2 className="font-display text-sm font-semibold text-ink-100">{group.topic}</h2>
                <span className={`ml-auto text-[10px] font-mono px-2 py-0.5 rounded border ${meta?.badge} ${meta?.text}`}>
                  {meta?.label || group.type}
                </span>
              </div>
              <div className="divide-y divide-ink-700/30">
                {group.links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-4 px-5 py-3.5 hover:bg-ink-700/30 transition-colors group"
                  >
                    <span className="text-ink-600 group-hover:text-sky-400 mt-0.5 transition-colors text-sm">→</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-sky-400 group-hover:text-sky-300 transition-colors">
                        {link.label}
                      </div>
                      <div className="text-[12px] text-ink-400 mt-0.5">{link.note}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task-level resources */}
      <div className="mt-10">
        <div className="text-[11px] font-mono text-ink-500 uppercase tracking-widest mb-4">
          Resources from your tasks
        </div>
        <div className="space-y-2">
          {roadmap.weeks.flatMap((week) =>
            week.days.flatMap((day) =>
              day.tasks
                .filter((t) => t.resources.length > 0 && (activeFilter === "all" || t.type === activeFilter))
                .flatMap((task) =>
                  task.resources.map((r, i) => (
                    <a
                      key={`${task.id}-${i}`}
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 px-4 py-3 bg-ink-800/40 border border-ink-700/40 rounded-lg hover:border-ink-600/60 hover:bg-ink-800/60 transition-all group"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${TYPE_META[task.type]?.dot}`} />
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-sky-400 group-hover:text-sky-300 transition-colors">{r.label}</span>
                        <span className="text-[11px] text-ink-500 ml-2 font-mono">{task.ref}</span>
                      </div>
                      <span className="text-[10px] text-ink-600 font-mono truncate max-w-[120px] hidden sm:block">
                        Wk{week.week}
                      </span>
                    </a>
                  ))
                )
            )
          )}
        </div>
      </div>
    </div>
  );
}
