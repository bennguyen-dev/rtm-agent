"use client";

import { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "sonner";
import { DownloadButtons } from "@/components/download-buttons";
import { Guide } from "@/components/guide";
import { RtmForm } from "@/components/rtm-form";
import { RtmPreview } from "@/components/rtm-preview";
import type { GenerateResponse } from "@/lib/types";

export default function Home() {
  const [results, setResults] = useState<GenerateResponse[]>([]);
  const [ticketId, setTicketId] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to results when they are generated
  useEffect(() => {
    if (results.length > 0) {
      toast.success("RTM Generated Successfully!", {
        description: `Generated ${results.reduce((total, r) => total + r.test_cases.length, 0)} test case steps.`,
        duration: 5000,
      });

      // Small delay to ensure DOM is rendered
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [results]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-primary/10 selection:text-primary">
      <Toaster position="top-right" expand={false} richColors />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary mb-4 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Powered by Gemini Flash Latest
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-4">
            RTM Generator
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Transform feature descriptions into professional test matrices in
            seconds.
          </p>
        </header>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Side: Guide */}
          <div className="lg:col-span-4 sticky top-12">
            <div className="rounded-2xl border border-slate-200 bg-white/50 p-8 shadow-sm backdrop-blur-sm">
              <Guide />
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="lg:col-span-8">
            <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
              <RtmForm
                onGenerated={setResults}
                onTicketIdChange={setTicketId}
              />
            </section>
          </div>
        </div>

        {/* Results section */}
        {results.length > 0 && (
          <section
            ref={resultsRef}
            className="mt-16 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 scroll-mt-12"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                Generated Test Cases
                <span className="text-sm font-normal text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                  {results.reduce((total, r) => total + r.test_cases.length, 0)}{" "}
                  Steps
                </span>
              </h2>
              <DownloadButtons results={results} ticketId={ticketId} />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg overflow-hidden">
              <RtmPreview results={results} />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
