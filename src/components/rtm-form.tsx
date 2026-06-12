"use client";

import { ChevronDown, KeyRound } from "lucide-react";
import { useEffect, useState } from "react";
import {
  DEFAULT_GEMINI_MODEL,
  GEMINI_MODELS,
  type GeminiModel,
  type GenerateResponse,
  MAX_TEST_CASES_OPTIONS,
  type MaxTestCases,
} from "@/lib/types";

const API_KEY_STORAGE = "rtm.gemini_api_key";

interface RtmFormProps {
  onGenerated: (results: GenerateResponse[]) => void;
  onTicketIdChange: (ticketId: string) => void;
}

export function RtmForm({ onGenerated, onTicketIdChange }: RtmFormProps) {
  const [requirements, setRequirements] = useState("");
  const [_ticketId, setTicketId] = useState("");
  const [language, setLanguage] = useState<"en" | "vi" | "both">("vi");
  const [maxTestCases, setMaxTestCases] = useState<MaxTestCases>(25);
  const [model, setModel] = useState<GeminiModel>(DEFAULT_GEMINI_MODEL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [rememberKey, setRememberKey] = useState(false);
  const [keyOpen, setKeyOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(API_KEY_STORAGE);
    if (saved) {
      setApiKey(saved);
      setRememberKey(true);
      setKeyOpen(true);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!requirements.trim()) {
      setError("Please enter your requirements");
      return;
    }

    setLoading(true);
    try {
      if (rememberKey && apiKey.trim()) {
        localStorage.setItem(API_KEY_STORAGE, apiKey.trim());
      } else if (!rememberKey) {
        localStorage.removeItem(API_KEY_STORAGE);
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (apiKey.trim()) headers["x-gemini-key"] = apiKey.trim();

      const res = await fetch("/api/generate", {
        method: "POST",
        headers,
        body: JSON.stringify({ requirements, language, maxTestCases, model }),
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
    { value: "vi", label: "Tiếng Việt", emoji: "🇻🇳" },
    { value: "en", label: "English", emoji: "🇬🇧" },
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

      <fieldset>
        <legend className="block text-sm font-medium text-slate-700 mb-3">
          Max test cases
        </legend>
        <div className="flex gap-3">
          {MAX_TEST_CASES_OPTIONS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setMaxTestCases(n)}
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition-all cursor-pointer border-2 ${
                maxTestCases === n
                  ? "bg-primary/5 border-primary text-primary shadow-md shadow-primary/10"
                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Higher = more coverage but slower and more token usage.
        </p>
      </fieldset>

      <fieldset>
        <legend className="block text-sm font-medium text-slate-700 mb-3">
          Model
        </legend>
        <div className="flex gap-3">
          {GEMINI_MODELS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setModel(m.value)}
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition-all cursor-pointer border-2 ${
                model === m.value
                  ? "bg-primary/5 border-primary text-primary shadow-md shadow-primary/10"
                  : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-500">
          {GEMINI_MODELS.find((m) => m.value === model)?.hint}
        </p>
      </fieldset>

      <div className="rounded-xl border border-slate-200 bg-slate-50/50">
        <button
          type="button"
          onClick={() => setKeyOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium text-slate-700 hover:text-slate-900 cursor-pointer"
          aria-expanded={keyOpen}
          aria-controls="api-key-section"
        >
          <span className="inline-flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-slate-500" aria-hidden="true" />
            Use your own Gemini API key
            <span className="text-xs font-normal text-slate-400">
              (optional)
            </span>
          </span>
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform ${
              keyOpen ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </button>

        {keyOpen && (
          <div
            id="api-key-section"
            className="space-y-3 border-t border-slate-200 px-4 py-4"
          >
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIza..."
              autoComplete="off"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberKey}
                onChange={(e) => setRememberKey(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-slate-300 text-primary focus:ring-primary"
              />
              Remember on this browser (stored in localStorage)
            </label>
            <p className="text-xs text-slate-500">
              Leave empty to use the shared team key. Get your own at{" "}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                Google AI Studio
              </a>
              .
            </p>
          </div>
        )}
      </div>

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
