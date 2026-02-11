# Info Modal Redesign Plan

## Scope
Three modals: **RulesAndPointsModal**, **ChipStrategyModal**, **InsightDetailModal**

## Goals
1. **Reduce visual clutter** — Remove decorative gradient blobs, excessive shadows, and over-styled backgrounds
2. **Fix mobile UX** — Bottom sheet presentation on mobile, centered modal on desktop
3. **Match app design** — Use the same SectionCard / `font-dmSerif` heading pattern from Settings/Profile/Leagues

---

## Step 1: Create a shared `InfoSheet` wrapper component

**File**: `src/components/common/InfoSheet.jsx`

A new reusable shell that handles all modal chrome so individual modals focus only on content.

**Desktop behavior** (md+):
- Centered overlay modal with spring animation (scale 0.96→1, opacity, y)
- `max-w` prop (sm/md/lg/xl for different modal sizes)
- Rounded-2xl, backdrop-blur-sm overlay, shadow-2xl

**Mobile behavior** (<md):
- Slides up from bottom as a bottom sheet
- Rounded top corners only (`rounded-t-2xl`)
- `max-h-[85vh]`, drag-to-dismiss handle at top
- Animate: `y: "100%" → 0`

**Shared features**:
- Escape key + backdrop click to close
- Header: icon badge (accent color) + title (`font-dmSerif`) + optional subtitle (`font-outfit`) + close button
- Scrollable content area with responsive padding (`p-4 sm:p-6`)
- Body lock (prevent background scroll)
- Props: `isOpen, onClose, title, subtitle, icon, accentColor, maxWidth, children`

---

## Step 2: Rewrite `RulesAndPointsModal`

**Current**: 435 lines, gradient blobs, repeated inline colorMaps, p-8 sections cramped at p-3 on mobile
**Target**: ~200 lines using InfoSheet shell

### Structure:
- **InfoSheet** wrapper with `maxWidth="lg"`, icon=StarIcon, accentColor="blue"
- **Game Rules** section — SectionCard-style container, simple list with icon + title + description rows (no cards-in-cards)
- **Point Values** section — Clean table/list: colored point badge on left, name + description on right. No oversized icon boxes.
- **Bonus Points** section — Same pattern as point values, just one item
- **Scoring Example** section — Simple card with scenario/prediction/result in a clean grid, then line-item breakdown

### Key simplifications:
- Remove all `getThemeStyles()` inline color map repetition — use a small helper or just direct theme conditionals
- Remove decorative gradient blob divs (the `absolute` positioned `blur-3xl` circles)
- Remove `hover:shadow-lg` on static info items (they're not interactive)
- Use responsive padding from mobileScaleUtils (`p-4 sm:p-5 md:p-6`)

---

## Step 3: Rewrite `ChipStrategyModal`

**Current**: 485 lines, 60-line colorMap in ChipCard, sections with gradient blobs
**Target**: ~250 lines using InfoSheet shell

### Structure:
- **InfoSheet** wrapper with `maxWidth="lg"`, icon=RocketIcon, accentColor="teal"
- **Overview blurb** — Short intro paragraph (no separate card with decorative blob)
- **Match Chips** section — SectionCard header, then chip cards in a simpler format:
  - Chip icon (from CHIP_CONFIG) + name + cooldown badge
  - Description text
  - Strategy tip in a subtle callout (not a card-in-card with its own gradient)
- **Gameweek Chips** section — Same pattern
- **Strategic Guidelines** section — Simple bullet list, no 2-column grid

### Key simplifications:
- Replace the 60-line `colorMap` with a compact `getChipColor(chipColor, theme)` helper that returns `{ bg, text, border }` for a given color name
- Remove `whileHover={{ scale: 1.02, y: -2 }}` on chip cards (they're not interactive/clickable)
- Remove absolute positioned gradient blobs on every section
- Use chip's existing color from CHIP_CONFIG directly

---

## Step 4: Rewrite `InsightDetailModal`

**Current**: 185 lines, basic design, inconsistent with other modals
**Target**: ~100 lines using InfoSheet shell

### Structure:
- **InfoSheet** wrapper with `maxWidth="sm"`, icon=InfoCircledIcon, accentColor="blue"
- **Insight card** — Title + value badge + description in a clean SectionCard-style container
- **Tips list** — Simple bullet list with accent-colored dots
- Remove the separate "Got it" button (close button in header is sufficient, or keep as subtle text button)

---

## Step 5: Cleanup

- Delete unused imports from all three modals (they'll use InfoSheet instead of their own backdrop/animation code)
- Verify build passes
- Test both theme modes conceptually (all theme conditionals use the standard pattern)

---

## File Changes Summary

| Action | File |
|--------|------|
| **Create** | `src/components/common/InfoSheet.jsx` |
| **Rewrite** | `src/components/common/RulesAndPointsModal.jsx` |
| **Rewrite** | `src/components/predictions/ChipStrategyModal.jsx` |
| **Rewrite** | `src/components/common/InsightDetailModal.jsx` |

No import changes needed — all three modals keep the same exports and prop signatures.
