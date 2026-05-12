"use client";

import {
  AlertCircle,
  BookOpen,
  ClipboardCheck,
  Download,
  FileText,
  Sparkles,
} from "lucide-react";

export function Guide() {
  return (
    <aside className="space-y-8">
      <div className="flex items-center gap-3 text-primary">
        <BookOpen className="h-6 w-6" />
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          How to use
        </h2>
      </div>

      <div className="space-y-6">
        {/* Step 1 */}
        <div className="relative pl-8 before:absolute before:left-3 before:top-8 before:bottom-0 before:w-px before:bg-slate-200 last:before:hidden">
          <div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500 border border-slate-200">
            1
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-semibold text-slate-700 uppercase tracking-wider text-xs">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Prep Requirements
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Use Jira Rovo agent to rewrite your ticket as Markdown for AI.
            </p>
            <div className="rounded-lg overflow-hidden border border-slate-200 bg-white">
              {/* biome-ignore lint/performance/noImgElement: static screenshot in /public, no remote optimization needed */}
              <img
                  src="/img.png"
                  alt="Rovo agent example: paste the prompt into the chat to rewrite the ticket as Markdown."
                  width={441}
                  height={960}
                  className="w-full h-auto"
              />
            </div>
            <div className="group relative">
              <div className="rounded-lg bg-slate-50 p-3 border border-slate-200 group-hover:border-primary/30 transition-colors">
                <code className="text-xs text-primary font-mono break-words leading-relaxed">
                  "Rewrite this ticket as raw Markdown for LLM input. Return
                  the Markdown source only — do NOT render or preview it. If
                  the ticket links to external pages (Confluence, Google Docs,
                  etc.), open each link and inline the full linked content so
                  nothing is missing."
                </code>
                <button
                  type="button"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      "Rewrite this ticket as raw Markdown for LLM input. Return the Markdown source only — do NOT render or preview it. If the ticket links to external pages (Confluence, Google Docs, etc.), open each link and inline the full linked content so nothing is missing.",
                    )
                  }
                  className="absolute right-2 top-2 p-1.5 rounded-md bg-white text-slate-400 opacity-0 group-hover:opacity-100 hover:text-primary transition-all border border-slate-200 shadow-sm"
                  title="Copy prompt"
                >
                  <ClipboardCheck className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Step 2 */}
        <div className="relative pl-8 before:absolute before:left-3 before:top-8 before:bottom-0 before:w-px before:bg-slate-200 last:before:hidden">
          <div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500 border border-slate-200">
            2
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-700 uppercase tracking-wider text-xs">
              <FileText className="h-3.5 w-3.5 text-primary" />
              Generate
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Paste the Markdown into the generator. Select your language and
              hit <span className="text-primary font-medium">Generate RTM</span>
              .
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="relative pl-8">
          <div className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500 border border-slate-200">
            3
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-700 uppercase tracking-wider text-xs">
              <Download className="h-3.5 w-3.5 text-primary" />
              Import to Jira
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Download the{" "}
              <span className="text-slate-900 font-medium">.csv</span> file and
              upload it directly to your RTM on Jira.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-primary/10 bg-primary/5 p-4 flex gap-3">
        <AlertCircle className="h-5 w-5 text-primary shrink-0" />
        <p className="text-xs text-primary/80 leading-relaxed">
          System auto-detects Ticket ID (YR-XXXXX) for file naming.
        </p>
      </div>
    </aside>
  );
}
