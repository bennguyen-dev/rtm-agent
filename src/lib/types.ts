export interface TestCase {
  Action: string;
  Input: string;
  Expected_result: string;
  Group: string;
}

export const MAX_TEST_CASES_OPTIONS = [15, 25, 50] as const;
export type MaxTestCases = (typeof MAX_TEST_CASES_OPTIONS)[number];

export interface GenerateRequest {
  requirements: string;
  language: "en" | "vi" | "both";
  maxTestCases?: MaxTestCases;
}

export interface GenerateResponse {
  test_cases: TestCase[];
  language: "en" | "vi";
}
