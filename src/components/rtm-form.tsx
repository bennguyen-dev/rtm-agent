"use client";

import { useState } from "react";
import type { GenerateResponse } from "@/lib/types";

interface RtmFormProps {
  onGenerated: (results: GenerateResponse[]) => void;
  onTicketIdChange: (ticketId: string) => void;
}

export function RtmForm({ onGenerated, onTicketIdChange }: RtmFormProps) {
  const [requirements, setRequirements] = useState("");
  const [_ticketId, setTicketId] = useState("");
  const [language, setLanguage] = useState<"en" | "vi" | "both">("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!requirements.trim()) {
      setError("Please enter your requirements");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requirements, language }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate test cases");
      }

      onGenerated(data.results);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setLoading(false);
    }
  }

  const languages = [
    { value: "en", label: "English", emoji: "🇬🇧" },
    { value: "vi", label: "Tiếng Việt", emoji: "🇻🇳" },
  ] as const;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="requirements"
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          Requirements / Feature Description
        </label>
        <textarea
          id="requirements"
          value={requirements}
          onChange={(e) => {
            const val = e.target.value;
            setRequirements(val);
            // Auto-detect Ticket ID (YR- followed by digits)
            const match = val.match(/YR-\d+/i);
            if (match) {
              const detected = match[0].toUpperCase();
              setTicketId(detected);
              onTicketIdChange(detected);
            }
          }}
          placeholder="Paste your feature ticket description, user story, or requirements here..."
          rows={10}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm resize-y transition-all font-mono text-sm leading-relaxed"
        />
      </div>

      <fieldset>
        <legend className="block text-sm font-medium text-slate-700 mb-3">
          Language
        </legend>
        <div className="flex gap-3">
          {languages.map((lang) => (
            <button
              key={lang.value}
              type="button"
              onClick={() => setLanguage(lang.value)}
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all cursor-pointer border-2 ${
                language === lang.value
                  ? "bg-primary/5 border-primary text-primary shadow-md shadow-primary/10"
                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
              }`}
            >
              <span className="text-lg" aria-hidden="true">
                {lang.emoji}
              </span>
              {lang.label}
            </button>
          ))}
        </div>
      </fieldset>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !requirements.trim()}
        className="w-full rounded-xl bg-primary px-6 py-4 text-base font-semibold text-white transition-all hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98]"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-3">
            <svg
              className="animate-spin h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <title>Loading</title>
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Generating test cases...
          </span>
        ) : (
          "🚀 Generate RTM"
        )}
      </button>
    </form>
  );
}
