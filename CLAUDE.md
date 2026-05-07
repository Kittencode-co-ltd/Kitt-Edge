# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kitt-Edge (คิดเอส) is a mobile-first web app for measuring and evaluating student learning outcomes. The primary use case is **pre-lesson and post-lesson assessments** — students take a test before studying a chapter and again after, so teachers and the system can track learning development over time. The UI is entirely in Thai and targets young students (primary/secondary school), so the design must accommodate users who may not own an email address.

## Running the App

Open `index.html` directly in a browser. No server, no npm, no build step required. All external dependencies (Chart.js, Font Awesome, Google Fonts/Sarabun) are loaded from CDN.

## Product Concepts

### Authentication
- Login is **username + password only** — no email login. Young students often do not have email accounts.

### Post-Login Home Screen
After login, the student sees an overview of their **7 lesson chapters**, showing for each chapter:
- Whether assigned worksheets/tasks have been submitted
- Pre-lesson test score
- Post-lesson test score
- Overall learning progress/development

### Question Types
The exam engine must support all of the following formats:

| Type | Thai name | Description |
|---|---|---|
| Single-answer multiple choice | ช้อยส์ข้อเดียว | Standard A/B/C/D, one correct answer |
| Multi-answer multiple choice | ช้อยส์หลายข้อถูก | Multiple options may be correct |
| Passage + multiple choice | บทความ + ช้อยส์ | A reading passage is shown first; questions are choice-based |
| Passage + True/False table | ตาราง ใช่/ไม่ใช่ | A passage is shown; a table lists statements with "ใช่" / "ไม่ใช่" columns for the student to tick |
| Closed short answer | คำตอบสั้น (ปิด) | A text input; the answer is a single, unambiguous value (e.g., "วันพุธ"). Graded by exact/keyword match. |
| Open short answer | คำตอบสั้น (เปิด) | A text input; no single correct answer. Graded by a **rubric** with score bands (full marks / partial / zero) defined per question. |

### Results & Progress Page
There are two levels of result display:
1. **Home screen (overview)** — shows a quick summary of scores per chapter/lesson
2. **Detailed results page** — shows graphs of score history, learning development over time, and analysis of the student's strengths and weaknesses per topic

## Architecture

**Single Page Application** — `index.html` is the sole entry point. Pages are loaded dynamically via `fetch()` from `pages/*.html` into a single content container. Navigation is managed by the central `MobileApp` object in [js/mobile-app.js](js/mobile-app.js).

**Module pattern** — each feature is a singleton object (not a class) with functions defined on object literals:
- `MobileApp` ([js/mobile-app.js](js/mobile-app.js)) — app orchestrator, routing, navigation, state container (`MobileApp.data`)
- `ExamRoom` ([js/exam-room.js](js/exam-room.js)) — exam session logic, timer, answer tracking
- `AuthApp` ([js/auth.js](js/auth.js)) — login/register flows
- `CameraApp` ([js/camera.js](js/camera.js)) — device camera capture
- `SubscriptionApp` ([js/subscription.js](js/subscription.js)) — pricing and plan selection UI
- `ScanResult` ([js/scan-result.js](js/scan-result.js)) — display of AI-analyzed scanned problems
- `MockAPI` ([js/api.js](js/api.js)) — simulated async API (wraps mock-data.js with setTimeout delays)

**No real backend** — all data lives in [js/mock-data.js](js/mock-data.js). API calls are simulated with ~500ms setTimeout promises in [js/api.js](js/api.js).

**State** — `MobileApp.data` holds runtime state (current user, subjects, questions, activities). `ExamRoom` keeps its own exam session state. `sessionStorage` is used for cross-page ephemeral data (e.g., `scanCapturedImage`).

## Key Patterns

- Pages are HTML fragments in `pages/` loaded dynamically; after loading, the corresponding module's `init()` function is called to wire up interactivity
- Toast notifications via `utils.js` `showToast()`, loading overlays via `showLoading()`/`hideLoading()`
- All styling is in [css/mobile.css](css/mobile.css) (~2400 lines). The design targets 425px mobile width with CSS variables for theming, `100dvh`, and safe-area insets
- Exam questions can be standard Q&A or passage-based (group mode); `ExamRoom` handles both via `isPassageBased` flag on the exam object

## Planned Features (from asset/)

- Incorrect question bank review
- Daily AI-assigned study missions
- TCAS admission score simulator
- Dark mode
- Points/streaks gamification
- Smart inline notes
