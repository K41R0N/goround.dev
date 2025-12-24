# Go-Round UX Improvements Roadmap

## Vision

Transform Go-Round into a seamless **Figma ↔ Bulk Generation** workflow:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   DESIGN    │ ──▶ │   IMPORT    │ ──▶ │  GENERATE   │ ──▶ │   EXPORT    │
│  in Figma   │     │  to GoRound │     │  100 slides │     │  to Figma   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │                                                            │
       └────────────────────── POLISH ◀─────────────────────────────┘
```

**Core User Story:**
> "As a social media designer, I want to design one template in Figma, generate 100 variations with my data, export them as editable files, and polish any individual slide back in Figma."

---

## Current State Problems

### Problem 1: No Figma Export Path
- **Symptom:** Only PNG export exists
- **Impact:** Users can't edit exported slides in Figma
- **User quote:** "I can only download PNGs? I can't edit these in Figma..."

### Problem 2: No Figma Import Path
- **Symptom:** Custom layouts require HTML/CSS coding
- **Impact:** Designers can't use their Figma designs as templates
- **User quote:** "I have to CODE my design? I thought I could import from Figma..."

### Problem 3: Hidden Workflow
- **Symptom:** No onboarding or guidance for Figma integration
- **Impact:** Users don't know the capability exists
- **User quote:** "How do I use my Figma designs here?"

### Problem 4: Confusing Export UI
- **Symptom:** "DOWNLOAD SLIDE" and "ALL (5)" buttons without format choice
- **Impact:** Users don't understand what they're getting
- **User quote:** "What format is this? Can I choose?"

### Problem 5: Tedious Bulk Generation
- **Symptom:** No "Template + CSV = 100 slides" wizard
- **Impact:** Manual process for each variation
- **User quote:** "I wish I could pick a template first, then apply my data..."

---

## Improvement Phases

### Phase 0: Critical Path (P0) - Make Figma Workflow Work
**Goal:** Users can complete one full Figma round-trip

| # | Feature | Why It Matters | File(s) to Change |
|---|---------|---------------|-------------------|
| 0.1 | SVG Export button | Users can export slides Figma can edit | `Editor.tsx` |
| 0.2 | Export format toggle | Users choose PNG vs SVG | `Editor.tsx` |
| 0.3 | Figma Import button | Users can import Figma SVGs as templates | `Settings.tsx` |
| 0.4 | Connect desktop IPC | Desktop app can write files to folders | `Editor.tsx`, storage layer |

**Success Metric:** User can export slide as SVG → edit in Figma → re-import as template

---

### Phase 1: Polish Export Experience (P1)
**Goal:** Export is intuitive and organized

| # | Feature | Why It Matters |
|---|---------|---------------|
| 1.1 | Export Modal | Consolidate all export options in one place |
| 1.2 | Folder structure export | Organized output: `project/carousel/slide-001.svg` |
| 1.3 | "Open folder after export" | Desktop convenience |
| 1.4 | Export progress indicator | Feedback during bulk export |
| 1.5 | Filename customization | Let users control naming convention |

**Success Metric:** User exports 50 slides and immediately finds them organized

---

### Phase 2: Streamline Bulk Generation (P1)
**Goal:** Generate 100 slides in under 2 minutes

| # | Feature | Why It Matters |
|---|---------|---------------|
| 2.1 | Template + CSV wizard | Guided flow: pick template → upload data → generate |
| 2.2 | CSV preview before import | See what will be generated |
| 2.3 | Apply layout to all slides | One click to change all slides |
| 2.4 | CSV template download | Pre-filled template based on selected layout |
| 2.5 | Inline data editing | Edit CSV data without leaving app |

**Success Metric:** User generates 100 slides from CSV in under 2 minutes

---

### Phase 3: Improve Save & Feedback (P2)
**Goal:** Users always know the state of their work

| # | Feature | Why It Matters |
|---|---------|---------------|
| 3.1 | Live save status indicator | Replace "Saved 5m ago" with real-time status |
| 3.2 | Cmd+S manual save | Power user expectation |
| 3.3 | Unsaved changes warning | Prevent accidental data loss |
| 3.4 | Version history | Undo major mistakes |

**Success Metric:** User never loses work accidentally

---

### Phase 4: Desktop-Specific Features (P2)
**Goal:** Desktop app feels native

| # | Feature | Why It Matters |
|---|---------|---------------|
| 4.1 | Recent Projects menu | Quick access to past work |
| 4.2 | Native file dialogs | OS-integrated save/open |
| 4.3 | Menu bar shortcuts | Cmd+N, Cmd+O, Cmd+E, etc. |
| 4.4 | Drag files to import | Drop CSV or SVG onto app |

**Success Metric:** Desktop app feels like a native design tool

---

### Phase 5: Advanced Figma Integration (P3)
**Goal:** Seamless round-trip editing

| # | Feature | Why It Matters |
|---|---------|---------------|
| 5.1 | File watching | Detect when Figma modifies exported SVG |
| 5.2 | Auto re-import | Offer to update slide when SVG changes |
| 5.3 | Figma plugin | Import/export without leaving Figma |
| 5.4 | Design token sync | Share colors/fonts between tools |

**Success Metric:** Edit in Figma, see changes in Go-Round automatically

---

## Implementation Order

### Now: Phase 0 (This Session)
```
0.1 → 0.2 → 0.3 → 0.4
```

### Next Session: Phase 1 + 2
```
1.1 → 1.2 → 2.1 → 2.2
```

### Future: Phase 3 + 4 + 5
```
Prioritize based on user feedback
```

---

## Detailed Specifications

### 0.1 SVG Export Button

**Location:** Editor.tsx, bottom bar next to existing download buttons

**UI:**
```
[ DOWNLOAD SLIDE ▼ ]  [ DOWNLOAD ALL ]
         │
         └─ PNG (for posting)
            SVG (editable in Figma)  ← NEW
```

**Behavior:**
- Clicking "SVG" calls `slideToSvg()` from `svgExport.ts`
- Downloads as `{carousel}-slide-{number}.svg`
- Toast: "SVG exported - open in Figma to edit"

---

### 0.2 Export Format Toggle

**Location:** Editor.tsx, export preset area or new export section

**UI:**
```
Export Format:  [ PNG | SVG ]
                      ▲ selected
```

**Behavior:**
- Toggle persists during session
- Affects both single and bulk export
- SVG exports include Go-Round metadata for re-import

---

### 0.3 Figma Import Button

**Location:** Settings.tsx → Custom Layouts tab

**UI:**
```
┌─────────────────────────────────────────────────────────────┐
│  Custom Layouts                                              │
│                                                              │
│  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │  📥 Import from     │  │  ✏️ Create with     │          │
│  │     Figma           │  │     Code            │          │
│  └─────────────────────┘  └─────────────────────┘          │
│                                                              │
│  How to prepare your Figma design:                          │
│  1. Name text layers: {{title}}, {{body_text}}, etc.        │
│  2. Export frame as SVG                                      │
│  3. Import here                                              │
└─────────────────────────────────────────────────────────────┘
```

**Behavior:**
- Opens file picker (native on desktop, input on web)
- Parses SVG with `figmaParser.ts`
- Creates CustomLayout with detected variables
- Shows preview before saving
- Toast: "Layout imported from Figma!"

---

### 0.4 Connect Desktop IPC

**Changes:**
- Editor.tsx checks `isDesktop()` from storage abstraction
- If desktop: use `window.electronAPI.export.saveProjectFolder()`
- If web: use existing ZIP download

**Desktop Export Flow:**
1. User clicks "Download All"
2. Native folder picker opens
3. Files written directly to chosen folder
4. Folder opens in file manager
5. Toast: "Exported to ~/Documents/GoRound/Project Name"

---

## Design Principles

### 1. Progressive Disclosure
- Simple actions visible, advanced options in menus/modals
- Don't overwhelm new users

### 2. Familiar Patterns
- Cmd+S = Save
- Cmd+E = Export
- Dropdown for format selection

### 3. Immediate Feedback
- Show what will happen before it happens
- Progress during long operations
- Clear success/error messages

### 4. Reversible Actions
- Confirm destructive actions
- Provide undo where possible
- Auto-save frequently

### 5. Platform Consistency
- Desktop: Native dialogs, menu bar, keyboard shortcuts
- Web: Browser conventions, downloads folder

---

## Tracking Progress

### Phase 0 Checklist
- [ ] 0.1 SVG Export button added to Editor
- [ ] 0.2 Export format toggle working
- [ ] 0.3 Figma Import button in Settings
- [ ] 0.4 Desktop IPC connected for folder export

### Validation
After Phase 0, test this flow:
1. Open Go-Round desktop app
2. Create project, add slide
3. Export as SVG
4. Open SVG in Figma
5. Edit text, save
6. Import modified SVG as new layout
7. Apply layout to new slides
8. Bulk export as SVG to folder

If all steps work → Phase 0 complete!

---

## Notes

- Keep web and desktop as similar as possible
- Document any desktop-only features in DESKTOP_PLAN.md
- Test on both Fedora and Windows before release
- Get user feedback after Phase 0 before continuing
