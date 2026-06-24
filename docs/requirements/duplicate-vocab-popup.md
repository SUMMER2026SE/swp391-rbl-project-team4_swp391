# Requirement: Duplicate-word confirmation popup when adding vocab

## Background
When a user adds a word to their notebook (Profile → "Thêm từ mới"), the backend
already rejects duplicates:

- `POST /api/notebook` inserts the word and lets the DB raise a unique violation.
- The unique constraint is **`(user_id, word)`** — a word is unique across the
  user's *entire* notebook, **not per folder**.
- On a duplicate the API returns **HTTP 409 `{ error: "Word already exists" }`**.
- The API also accepts a **`force: true`** flag. When set, it takes the *upsert*
  path (`onConflict: 'user_id,word'`) and overwrites the existing row — including
  `folder_id`, `definition`, `example`, `pos` — effectively re-adding the word
  with the new data and moving it into the current folder.

### Current UX gap
- The "Thêm từ mới" bulk modal in `FlashcardApp.tsx` catches the 409 but only shows
  a quiet **inline label** `"Từ đã có trong sổ"` (see `_saveWordResults`, ~line 486).
  The user can miss it, and there is no way to proceed.
- This requirement replaces that quiet handling with an explicit **confirmation
  popup**.

## Decisions (confirmed with product owner)
1. **Duplicate scope = whole notebook** (keep current `(user_id, word)` constraint).
   No database/schema change.
2. **Popup behavior = inform, then confirm re-add.** When a duplicate is detected,
   show a popup that:
   - Informs the user the word already exists in their notebook.
   - Asks: **"Bạn có muốn add vào lại không?"** (Do you want to add it again?)
   - **Yes** → re-send the same add request with `force: true` (overwrites the
     existing entry and moves it to the current folder).
   - **No / Cancel** → close the popup, do not change anything.

## Functional requirements
- **FR1** — On add, if `POST /api/notebook` returns **409**, the client MUST show
  the duplicate-confirmation popup instead of silently marking the row.
- **FR2** — The popup MUST display the word in question and the message that it
  already exists in the notebook.
- **FR3** — The popup MUST present two actions: **"Add lại"** (confirm) and
  **"Hủy"** (cancel).
- **FR4** — On **confirm**, the client MUST re-issue `POST /api/notebook` with the
  same payload plus `force: true`, then on success show the normal saved state.
- **FR5** — On **cancel**, no request is sent and the word is left unsaved.
- **FR6** — During the bulk "Thêm từ mới" flow (multiple words at once), each
  duplicate word triggers its own decision; non-duplicate words save normally and
  are unaffected.

## Non-functional / constraints
- No DB migration. The `(user_id, word)` unique constraint and the existing
  `force` upsert path are reused as-is.
- Reuse the existing popup/modal styling in `FlashcardApp` for visual consistency.
- The confirm path is the only way `force: true` is sent from this flow — never
  overwrite silently.

## Out of scope
- Per-folder duplicates (allowing the same word in two folders) — explicitly NOT
  done; would require changing the constraint to `(user_id, word, folder_id)`.
- `VocabSavePopup.tsx` (the in-page selection popup) — it already shows
  "Từ này đã có trong sổ từ vựng" and uses the separate `/api/student/vocabulary`
  stack; unchanged by this requirement.

## Acceptance criteria
- Adding a word that already exists shows the confirmation popup (not just an
  inline label).
- Choosing "Add lại" overwrites the existing entry (verified: the word now sits in
  the current folder with the new definition/example) and shows a success state.
- Choosing "Hủy" leaves the notebook unchanged.
- Adding a brand-new word never shows the popup.
- No regression for the multi-word bulk add: mixed new + duplicate words each
  behave per FR6.

## Affected code (for implementation reference)
- `src/components/FlashcardApp.tsx` — `_saveWordResults` (~line 481–506): replace
  the inline `duplicate` label with the popup + force-retry logic.
- `src/app/api/notebook/route.ts` — POST handler already supports 409 + `force`;
  no change expected.
