export interface TestCase {
  Action: string;
  Input: string;
  Expected_result: string;
  Group: string;
}

export interface GenerateRequest {
  requirements: string;
  language: "en" | "vi" | "both";
}

export interface GenerateResponse {
  test_cases: TestCase[];
  language: "en" | "vi";
}
