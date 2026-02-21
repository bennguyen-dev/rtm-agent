"use client";

import type { GenerateResponse } from "@/lib/types";

interface DownloadButtonsProps {
  results: GenerateResponse[];
  ticketId: string;
}

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function generateCsv(testCases: GenerateResponse["test_cases"]): string {
  const rows: string[] = ["Action,Input,Expected result,Group"];

  for (const tc of testCases) {
    rows.push(
      [
        escapeCsv(tc.Action),
        escapeCsv(tc.Input),
        escapeCsv(tc.Expected_result),
        escapeCsv(tc.Group),
      ].join(","),
    );
  }

  return rows.join("\n");
}

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function getLanguageLabel(lang: string): string {
  return lang === "en" ? "English" : "Vietnamese";
}

function getCsvFilename(ticketId: string, lang: string): string {
  const langLabel = getLanguageLabel(lang);
  if (ticketId) {
    return `Automation TCs - ${ticketId} (${langLabel}).csv`;
  }
  return `Automation TCs (${langLabel}).csv`;
}

export function DownloadButtons({ results, ticketId }: DownloadButtonsProps) {
  if (results.length === 0) return null;

  const handleDownloadCsv = () => {
    for (const result of results) {
      const csv = generateCsv(result.test_cases);
      const filename = getCsvFilename(ticketId, result.language);
      downloadBlob(csv, filename, "text/csv;charset=utf-8;");
    }
  };

  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={handleDownloadCsv}
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-all hover:border-primary hover:text-primary hover:bg-primary/5 cursor-pointer shadow-sm active:scale-[0.98]"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          role="img"
        >
          <title>Download CSV file</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        Download CSV
      </button>
    </div>
  );
}
