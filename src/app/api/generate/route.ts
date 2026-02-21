import { NextResponse } from "next/server";
import { generateTestCases } from "@/lib/gemini";
import type { GenerateRequest, GenerateResponse } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateRequest;

    if (!body.requirements?.trim()) {
      return NextResponse.json(
        { error: "Requirements are required" },
        { status: 400 },
      );
    }

    if (
      !process.env.GEMINI_API_KEY ||
      process.env.GEMINI_API_KEY === "your_api_key_here"
    ) {
      return NextResponse.json(
        {
          error:
            "GEMINI_API_KEY is not configured. Please add your API key to .env.local",
        },
        { status: 500 },
      );
    }

    const language = body.language || "en";
    const results: GenerateResponse[] = [];

    if (language === "both") {
      const [enCases, viCases] = await Promise.all([
        generateTestCases(body.requirements, "en"),
        generateTestCases(body.requirements, "vi"),
      ]);
      results.push(
        { test_cases: enCases, language: "en" },
        { test_cases: viCases, language: "vi" },
      );
    } else {
      const testCases = await generateTestCases(body.requirements, language);
      results.push({ test_cases: testCases, language });
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Generate error:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
