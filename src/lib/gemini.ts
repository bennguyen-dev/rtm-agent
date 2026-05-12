import {
  GoogleGenerativeAI,
  type ResponseSchema,
  SchemaType,
} from "@google/generative-ai";
import type { TestCase } from "./types";

function getClient(apiKey?: string): GoogleGenerativeAI {
  const key = apiKey?.trim() || process.env.GEMINI_API_KEY || "";
  return new GoogleGenerativeAI(key);
}

const responseSchema: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    test_cases: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          Action: { type: SchemaType.STRING },
          Input: { type: SchemaType.STRING },
          Expected_result: { type: SchemaType.STRING },
          Group: { type: SchemaType.STRING },
        },
        required: ["Action", "Input", "Expected_result", "Group"],
      },
    },
  },
  required: ["test_cases"],
};

function buildEnglishPrompt(requirements: string, maxTestCases: number): string {
  const now = new Date().toISOString();
  return `Now: ${now}
# Enhanced Test Case Generation Prompt

You are to act as a senior, meticulous QA Engineer. Your mission is to create a comprehensive set of test cases that directly validate the specific requirements outlined in the feature ticket provided below.

## MANDATORY RULES:

### 1. Output Format:
- The final output must be a **single, raw JSON object**.
- This JSON object must contain a single key: "test_cases".
- The value of "test_cases" must be an array of objects, where each object represents a single test step.

### 2. Test Step Object Structure:
Each object within the "test_cases" array must contain exactly these four key-value pairs:
- "Action": (String) The action the user performs.
- "Input": (String) The input data or preconditions for the action.
- "Expected result": (String) The expected outcome after the action.
- "Group": (String) The name of the test scenario or group.

### 3. Content and Formatting Guidelines:

**CRITICAL: Use HTML for Formatting**
- You must use simple HTML tags within the string values to format the text for readability.
- Use \`<p>\` for paragraphs, \`<ol>\` and \`<li>\` for ordered lists, and \`<strong>\` for emphasis.
- This is a mandatory requirement.

**Logical Grouping:**
- Use the "Group" key to categorize related steps.
- Use descriptive group names like:
  - "Initial Page Load & Default State"
  - "Section Display Logic"
  - "Modal Validation - [Type]"
  - "Data Input Validation - [Field Name]"
  - "Error Handling - [Specific Error]"
  - "Success Flow - [Action]"
  - "UI State Transitions"
  - "Default Values & Pre-population"
  - "Business Rule Validation"

### 4. COMPREHENSIVE REQUIREMENT COVERAGE:

**A. UI Display & Layout Testing:**
- Test initial page load with default states
- Verify section divisions and their contents
- Test empty state messages (exact text verification)
- Verify card ordering in both sections
- Test responsive behavior and mobile-specific elements

**B. Default Values & Pre-population:**
- Test all default values mentioned in requirements
- Verify pre-selected options and their behavior

**C. Modal Behavior Testing:**
- Test modal opening/closing
- Verify modal title and content accuracy
- Test all buttons functionality
- Test modal state persistence and data clearing

**D. Input Validation (Detailed):**
- Test each field's data type restrictions
- Test decimal place limitations
- Test minimum/maximum value constraints
- Test empty field validation
- Test special characters and invalid inputs

**E. Error Message Validation:**
- Test exact error message text for each validation rule
- Test error message positioning and timing
- Test error message clearing behavior

**F. Success Flow Testing:**
- Test successful data submission
- Test toast message display and auto-close timing
- Test UI state updates after success

**G. Business Logic Validation:**
- Test section movement logic
- Test calculation logic
- Test ordering requirements

### 5. Quality Standards:
- Each test case must be independently executable and verifiable
- Focus on testing specific requirements mentioned in the ticket
- Include exact text verification for all UI messages
- Test both positive and negative scenarios
- Prioritize test cases that would catch requirement violations
- Include boundary testing for all numerical inputs
- Maximum ${maxTestCases} test cases
- For date-related business logic, provide specific example dates, today is ${now}

## FEATURE REQUIREMENTS TO TEST:

${requirements}

**IMPORTANT:** Generate test cases that validate EVERY specific requirement, UI text, error message, default value, validation rule, and business logic mentioned in the feature description above.

Now: ${now}`;
}

function buildVietnamesePrompt(
  requirements: string,
  maxTestCases: number,
): string {
  const now = new Date().toISOString();
  return `Now: ${now}
# Prompt Tạo Test Case Nâng Cao

Bạn sẽ đóng vai một QA Engineer cấp cao, tỉ mỉ và có kinh nghiệm. Nhiệm vụ của bạn là tạo ra một bộ test case toàn diện để xác thực trực tiếp các yêu cầu cụ thể được nêu trong feature ticket bên dưới.

## LUẬT BẮT BUỘC:

### 1. Định Dạng Đầu Ra:
- Kết quả cuối cùng phải là một **object JSON thuần duy nhất**.
- Object JSON này phải chứa một key duy nhất: "test_cases".
- Giá trị của "test_cases" phải là một mảng các object, trong đó mỗi object đại diện cho một bước test.

### 2. Cấu Trúc Object Bước Test:
Mỗi object trong mảng "test_cases" phải chứa chính xác bốn cặp key-value sau:
- "Action": (String) Hành động mà người dùng thực hiện.
- "Input": (String) Dữ liệu đầu vào hoặc điều kiện tiên quyết cho hành động.
- "Expected result": (String) Kết quả mong đợi sau khi thực hiện hành động.
- "Group": (String) Tên của kịch bản test hoặc nhóm test.

### 3. Hướng Dẫn Nội Dung và Định Dạng:

**QUAN TRỌNG: Sử Dụng HTML Để Định Dạng**
- Bạn phải sử dụng các thẻ HTML đơn giản trong các giá trị string để định dạng văn bản cho dễ đọc.
- Sử dụng \`<p>\` cho đoạn văn, \`<ol>\` và \`<li>\` cho danh sách có thứ tự, và \`<strong>\` để nhấn mạnh.

**Nhóm Logic:**
- Sử dụng key "Group" để phân loại các bước liên quan.
- Sử dụng tên nhóm mô tả như:
  - "Tải Trang Ban Đầu & Trạng Thái Mặc Định"
  - "Logic Hiển Thị Section"
  - "Xác Thực Modal - [Loại]"
  - "Xác Thực Dữ Liệu Đầu Vào - [Tên Trường]"
  - "Xử Lý Lỗi - [Lỗi Cụ Thể]"
  - "Luồng Thành Công - [Hành Động]"
  - "Chuyển Đổi Trạng Thái UI"
  - "Giá Trị Mặc Định & Điền Sẵn"
  - "Xác Thực Quy Tắc Nghiệp Vụ"

### 4. BẢO ĐẢM YÊU CẦU TOÀN DIỆN:

**A. Test Hiển Thị UI & Layout:**
- Test tải trang ban đầu với trạng thái mặc định
- Xác thực phân chia section và nội dung của chúng
- Test thông báo trạng thái trống (xác thực văn bản chính xác)
- Xác thực thứ tự card trong cả hai section
- Test hành vi responsive và các phần tử dành riêng cho mobile

**B. Giá Trị Mặc Định & Điền Sẵn:**
- Test tất cả giá trị mặc định được đề cập trong yêu cầu
- Xác thực các option được chọn sẵn và hành vi của chúng

**C. Test Hành Vi Modal:**
- Test mở/đóng modal
- Xác thực tiêu đề và nội dung modal chính xác
- Test chức năng tất cả các nút
- Test sự bền vững trạng thái modal và việc xóa dữ liệu

**D. Xác Thực Đầu Vào (Chi Tiết):**
- Test hạn chế kiểu dữ liệu của từng trường
- Test giới hạn số thập phân
- Test ràng buộc giá trị tối thiểu/tối đa
- Test xác thực trường trống
- Test ký tự đặc biệt và đầu vào không hợp lệ

**E. Xác Thực Thông Báo Lỗi:**
- Test văn bản thông báo lỗi chính xác cho từng quy tắc xác thực
- Test vị trí và thời điểm hiển thị thông báo lỗi
- Test hành vi xóa thông báo lỗi

**F. Test Luồng Thành Công:**
- Test gửi dữ liệu thành công
- Test hiển thị toast message và thời gian tự động đóng
- Test cập nhật trạng thái UI sau khi thành công

**G. Xác Thực Logic Nghiệp Vụ:**
- Test logic di chuyển section
- Test logic tính toán
- Test yêu cầu thứ tự

### 5. Tiêu Chuẩn Chất Lượng:
- Mỗi test case phải có thể thực thi và xác thực độc lập
- Tập trung vào testing các yêu cầu cụ thể được đề cập trong ticket
- Bao gồm xác thực văn bản chính xác cho tất cả thông báo UI
- Test cả kịch bản tích cực và tiêu cực
- Ưu tiên các test case có thể phát hiện vi phạm yêu cầu
- Tối đa ${maxTestCases} test case
- Với những nghiệp vụ liên quan đến ngày tháng, hãy đưa ra ví dụ ngày tháng cụ thể, hôm nay là ${now}

## YÊU CẦU TÍNH NĂNG CẦN TEST:

${requirements}

**QUAN TRỌNG:** Tạo các test case xác thực MỌI yêu cầu cụ thể, văn bản UI, thông báo lỗi, giá trị mặc định, quy tắc xác thực, và logic nghiệp vụ được đề cập trong mô tả tính năng ở trên.

Now: ${now}`;
}

async function callWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const is429 = error instanceof Error && error.message.includes("429");
      if (!is429 || attempt === maxRetries) throw error;

      const delay = Math.min(15000 * 2 ** attempt, 60000);
      console.log(
        `Rate limited. Retrying in ${delay / 1000}s (attempt ${attempt + 1}/${maxRetries})...`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Max retries exceeded");
}

export async function generateTestCases(
  requirements: string,
  language: "en" | "vi",
  apiKey?: string,
  maxTestCases = 25,
): Promise<TestCase[]> {
  const model = getClient(apiKey).getGenerativeModel({
    model: "gemini-flash-latest",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  const prompt =
    language === "vi"
      ? buildVietnamesePrompt(requirements, maxTestCases)
      : buildEnglishPrompt(requirements, maxTestCases);

  return callWithRetry(async () => {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);
    return parsed.test_cases as TestCase[];
  });
}
