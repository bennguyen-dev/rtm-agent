export interface TestCase {
  Action: string;
  Input: string;
  Expected_result: string;
  Group: string;
}

export const MAX_TEST_CASES_OPTIONS = [15, 25, 50] as const;
export type MaxTestCases = (typeof MAX_TEST_CASES_OPTIONS)[number];

export const GEMINI_MODELS = [
  {
    value: "gemini-flash-latest",
    label: "Flash",
    hint: "Cân bằng chất lượng & tốc độ (mặc định)",
  },
  {
    value: "gemini-flash-lite-latest",
    label: "Flash-Lite",
    hint: "Nhanh nhất, rẻ nhất — chất lượng thấp hơn một chút",
  },
] as const;
export type GeminiModel = (typeof GEMINI_MODELS)[number]["value"];
export const DEFAULT_GEMINI_MODEL: GeminiModel = "gemini-flash-latest";

export interface GenerateRequest {
  requirements: string;
  language: "en" | "vi" | "both";
  maxTestCases?: MaxTestCases;
  model?: GeminiModel;
}

export interface GenerateResponse {
  test_cases: TestCase[];
  language: "en" | "vi";
}
