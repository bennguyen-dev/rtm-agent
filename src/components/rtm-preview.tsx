"use client";

import React from "react";
import type { GenerateResponse } from "@/lib/types";

interface RtmPreviewProps {
  results: GenerateResponse[];
}

export function RtmPreview({ results }: RtmPreviewProps) {
  if (results.length === 0) return null;

  const languageLabel = (lang: string) =>
    lang === "en" ? "🇬🇧 English" : "🇻🇳 Tiếng Việt";

  return (
    <div className="space-y-8">
      {results.map((result) => {
        const grouped = result.test_cases.reduce<
          Record<string, typeof result.test_cases>
        >((acc, tc) => {
          const group = tc.Group || "Ungrouped";
          if (!acc[group]) acc[group] = [];
          acc[group].push(tc);
          return acc;
        }, {});

        let rowIndex = 0;

        return (
          <div key={result.language} className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              {languageLabel(result.language)}
              <span className="text-sm font-normal text-slate-500">
                ({result.test_cases.length} test cases)
              </span>
            </h3>

            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
              <table className="rtm-table w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <th className="w-12 px-3 py-4 text-center font-semibold uppercase tracking-wider text-[10px]">
                      #
                    </th>
                    <th className="px-4 py-4 text-left font-semibold uppercase tracking-wider text-[10px]">
                      Action
                    </th>
                    <th className="px-4 py-4 text-left font-semibold uppercase tracking-wider text-[10px]">
                      Input
                    </th>
                    <th className="px-4 py-4 text-left font-semibold uppercase tracking-wider text-[10px]">
                      Expected Result
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Object.entries(grouped).map(([group, cases]) => (
                    <React.Fragment key={`container-${group}`}>
                      <tr key={`group-${group}`} className="group-header">
                        <td
                          colSpan={4}
                          className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/5 border-y border-primary/10"
                        >
                          {group}
                        </td>
                      </tr>
                      {cases.map((tc) => {
                        rowIndex++;
                        return (
                          <tr
                            key={`${result.language}-${rowIndex}`}
                            className="hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="px-3 py-4 text-center text-slate-400 font-mono text-xs">
                              {rowIndex}
                            </td>
                            <td
                              className="px-4 py-4 text-slate-700 rtm-cell"
                              // biome-ignore lint/security/noDangerouslySetInnerHtml: AI provides safe HTML formatting (bold, lists)
                              dangerouslySetInnerHTML={{ __html: tc.Action }}
                            />
                            <td
                              className="px-4 py-4 text-slate-700 rtm-cell"
                              // biome-ignore lint/security/noDangerouslySetInnerHtml: AI provides safe HTML formatting (bold, lists)
                              dangerouslySetInnerHTML={{ __html: tc.Input }}
                            />
                            <td
                              className="px-4 py-4 text-slate-700 rtm-cell"
                              // biome-ignore lint/security/noDangerouslySetInnerHtml: AI provides safe HTML formatting (bold, lists)
                              dangerouslySetInnerHTML={{
                                __html: tc.Expected_result,
                              }}
                            />
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
