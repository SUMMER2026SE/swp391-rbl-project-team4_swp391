# Requirement: Retire `/vocab-grammar`, consolidate vocabulary on Profile

## Background
There are currently **two** vocabulary experiences:

| | Legacy page | New page (keep) |
|---|---|---|
| Route | `/[locale]/(user)/vocab-grammar` | `/[locale]/(user)/profile` |
| Component | `vocab-grammar/page.tsx` (~955 lines) | `FlashcardApp.tsx` |
| API stack | `/api/student/vocabulary`, `/api/student/vocabulary/collections`, `/api/student/vocabulary/lookup` | `/api/notebook`, `/api/notebook/folders`, `/api/vocab-reviews`, `/api/system-vocab` |
| UI | Screenshot 1 ("Bộ sưu tập từ vựng cá nhân") | Screenshot 2 (notebook folders + flashcards) |

The Profile/`FlashcardApp` version is the one going forward (dictionary lookup, personal folders, flashcard study, streaks). The `/vocab-grammar` page is now redundant.

## Goal
Remove the `/vocab-grammar` route and redirect every entry point to `/profile`.

## Scope of change
1. **Delete** `src/app/[locale]/(user)/vocab-grammar/page.tsx` (and its now-empty folder).
2. **Repoint 4 inbound links** from `/vocab-grammar` → `/profile`:
   - `src/app/[locale]/page.tsx:81` — homepage "Vocab & Grammar" skill card.
   - `src/app/[locale]/(user)/layout.tsx:143` — sidebar nav item "Sổ từ vựng".
   - `src/app/[locale]/speaking/shadowing/[lessonId]/page.tsx:1260` — "Xem sổ" toast link.
   - `src/components/VocabSavePopup.tsx:262` — "Xem sổ" toast link.

## Out of scope (intentionally kept)
- The `/api/student/vocabulary*` API routes — **still used** by `exam/review/page.tsx` and `VocabSavePopup.tsx`. Do **not** delete them.
- `FlashcardApp.tsx` and all `/api/notebook`, `/api/vocab-reviews`, `/api/system-vocab` routes.

## Acceptance criteria
- Navigating to `/[locale]/vocab-grammar` returns 404 (route no longer exists).
- The homepage skill card, sidebar "Sổ từ vựng", and both "Xem sổ" toasts all open `/profile`.
- No remaining source references to the string `vocab-grammar` as a route href.
- App builds with no broken imports.
