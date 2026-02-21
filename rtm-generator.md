# RTM Generator App

## Goal

Chuyển workflow n8n "Automation RTM" thành web app. User nhập requirements → bấm Generate → Preview RTM dạng HTML table → Download. Sử dụng Google Gemini SDK trực tiếp (Option B).

## Project Type

**WEB** — Next.js 16 + React 19 + Tailwind v4

## Tech Stack

| Layer | Technology | Lý do |
|-------|-----------|-------|
| Framework | Next.js 16 (đã có) | Server components + API routes |
| Styling | Tailwind v4 (đã có) | Rapid UI development |
| AI Provider | `@google/generative-ai` | Gọi trực tiếp Gemini 2.0 Flash, free tier lớn, structured output |
| Font | Geist (đã có) | Clean, modern |
| Linter | Biome (đã có) | Fast lint + format |
| Download | Native Blob API | Tạo CSV/HTML file client-side, không cần thêm dep |

## File Structure

```
src/
├── app/
│   ├── layout.tsx          (MODIFY - update metadata)
│   ├── globals.css          (MODIFY - thêm design tokens, table styles)
│   ├── page.tsx             (MODIFY - main RTM generator page)
│   └── api/
│       └── generate/
│           └── route.ts     (NEW - API route gọi Gemini)
├── lib/
│   ├── gemini.ts            (NEW - Gemini client + prompt builder)
│   └── types.ts             (NEW - TypeScript interfaces)
└── components/
    ├── rtm-form.tsx         (NEW - Form nhập requirements)
    ├── rtm-preview.tsx      (NEW - HTML table preview)
    └── download-buttons.tsx (NEW - Download CSV/HTML)
```

## Tasks

- [ ] **Task 1: Install dependency + env setup** → `pnpm add @google/generative-ai` + tạo `.env.local` với `GEMINI_API_KEY`
  - Agent: `backend-specialist`
  - Verify: `pnpm ls @google/generative-ai` shows version, `.env.local` exists with placeholder

- [ ] **Task 2: Tạo types + Gemini client** → `src/lib/types.ts` (TestCase, GenerateRequest, GenerateResponse interfaces) + `src/lib/gemini.ts` (init client, build prompt from n8n workflow, call Gemini với structured output)
  - Agent: `backend-specialist`
  - Verify: TypeScript compiles (`npx tsc --noEmit`)

- [ ] **Task 3: Tạo API Route** → `src/app/api/generate/route.ts` - POST handler nhận `{ requirements, language }`, gọi Gemini, trả về `{ test_cases: TestCase[] }`
  - Agent: `backend-specialist`
  - Depends: Task 1, 2
  - Verify: `curl -X POST http://localhost:3000/api/generate -H 'Content-Type: application/json' -d '{"requirements":"test","language":"en"}'` trả về JSON hợp lệ

- [ ] **Task 4: UI - Form component** → `src/components/rtm-form.tsx` - Textarea cho requirements, language selector (EN/VN/Both), Generate button với loading state
  - Agent: `frontend-specialist`
  - Verify: Component render, form submit gọi API

- [ ] **Task 5: UI - RTM Preview component** → `src/components/rtm-preview.tsx` - HTML table grouped by `Group` field, render HTML content trong cells (Action, Input, Expected_result dùng `dangerouslySetInnerHTML`)
  - Agent: `frontend-specialist`
  - Depends: Task 4
  - Verify: Table hiển thị đúng data, grouped headers, HTML content rendered

- [ ] **Task 6: UI - Download buttons** → `src/components/download-buttons.tsx` - Download CSV + Download HTML sử dụng Blob API
  - Agent: `frontend-specialist`
  - Depends: Task 5
  - Verify: Click download → file tải về đúng format

- [ ] **Task 7: Assemble main page** → Update `src/app/page.tsx` + `layout.tsx` (metadata) + `globals.css` (design tokens, table styles). Wire form → API → preview → download
  - Agent: `frontend-specialist`
  - Depends: Task 3, 4, 5, 6
  - Verify: Full flow hoạt động end-to-end

## Done When

- [ ] User nhập requirements, bấm Generate, thấy RTM table
- [ ] Table grouped by Group, HTML content rendered đúng
- [ ] Download CSV và HTML hoạt động
- [ ] `pnpm build` thành công
- [ ] UI đẹp, responsive, có loading state

## Phase X: Verification

```bash
# 1. Type check
npx tsc --noEmit

# 2. Lint
pnpm lint

# 3. Build
pnpm build

# 4. Manual E2E test
pnpm dev
# → Mở http://localhost:3000
# → Nhập requirements test
# → Chọn language EN
# → Bấm Generate
# → Đợi loading → Xem RTM table
# → Bấm Download CSV → Kiểm tra file
# → Bấm Download HTML → Kiểm tra file
```

## Notes

- Prompt được port 1:1 từ n8n workflow (cả EN và VN prompt)
- Gemini structured output (JSON mode) loại bỏ nhu cầu parse/cleanup JSON
- Không cần DB, không lưu kết quả - mọi thứ client-side
- API key ẩn trong `.env.local`, chỉ accessible từ server-side Route Handler
