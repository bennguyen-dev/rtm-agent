import { NextResponse } from "next/server";
import { generateTestCases } from "@/lib/gemini";
import { checkLimit } from "@/lib/rate-limit";
import {
  DEFAULT_GEMINI_MODEL,
  GEMINI_MODELS,
  type GeminiModel,
  type GenerateRequest,
  type GenerateResponse,
  MAX_TEST_CASES_OPTIONS,
  type MaxTestCases,
} from "@/lib/types";

const MAX_REQUIREMENTS_LENGTH = 50_000;

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const limit = checkLimit(ip);
    if (!limit.ok) {
      return NextResponse.json(
        { error: `Rate limit exceeded. Try again in ${limit.retryAfterSec}s.` },
        {
          status: 429,
          headers: { "Retry-After": String(limit.retryAfterSec) },
        },
      );
    }

    const body = (await request.json()) as GenerateRequest;

    if (!body.requirements?.trim()) {
      return NextResponse.json(
        { error: "Requirements are required" },
        { status: 400 },
      );
    }

    if (body.requirements.length > MAX_REQUIREMENTS_LENGTH) {
      return NextResponse.json(
        {
          error: `Requirements too long (max ${MAX_REQUIREMENTS_LENGTH} characters)`,
        },
        { status: 400 },
      );
    }

    const userApiKey = request.headers.get("x-gemini-key")?.trim() || "";
    const effectiveKey = userApiKey || process.env.GEMINI_API_KEY || "";

    if (!effectiveKey || effectiveKey === "your_api_key_here") {
      return NextResponse.json(
        {
          error:
            "No Gemini API key available. Add one in 'Use your own API key' or configure GEMINI_API_KEY on the server.",
        },
        { status: 400 },
      );
    }

    const language = body.language || "en";
    const maxTestCases: MaxTestCases = MAX_TEST_CASES_OPTIONS.includes(
      body.maxTestCases as MaxTestCases,
    )
      ? (body.maxTestCases as MaxTestCases)
      : 25;
    const model: GeminiModel = GEMINI_MODELS.some((m) => m.value === body.model)
      ? (body.model as GeminiModel)
      : DEFAULT_GEMINI_MODEL;
    const results: GenerateResponse[] = [];

    if (language === "both") {
      const [enCases, viCases] = await Promise.all([
        generateTestCases(
          body.requirements,
          "en",
          userApiKey,
          maxTestCases,
          model,
        ),
        generateTestCases(
          body.requirements,
          "vi",
          userApiKey,
          maxTestCases,
          model,
        ),
      ]);
      results.push(
        { test_cases: enCases, language: "en" },
        { test_cases: viCases, language: "vi" },
      );
    } else {
      const testCases = await generateTestCases(
        body.requirements,
        language,
        userApiKey,
        maxTestCases,
        model,
      );
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
