# EyeRest Roadmap v2 — Submission-Focused
**From:** Thursday, April 16, 2026
**To:** Submit by Saturday, May 16, 2026 (2-day buffer before May 18 deadline)
**Conference:** October 3-7, 2026 (5 months of post-submission polish time available)

---

## Strategic Reframe

NordiCHI runs in October. The ONLY urgent deadline is **May 16 submission**. Post-submission has 5 months for:
- Full dogfooding and bug polish
- Demo rehearsal and practice runs
- BlinkBuddy v2 (head tilt servo, cosmetic polish, battery)
- User study for a future venue (CHI LBW 2027, ETRA 2027)
- Documentation and portfolio write-up

Pre-submission focus is narrowed to **5 deliverables**:
1. Working prototype good enough for a 2-minute video
2. 2-page ACM-format extended abstract
3. 2-minute demo video
4. Demo still image (1500x1200px)
5. Setup description document

Everything else cuts or defers.

---

## Budget Reality Check

- **Days remaining:** 32 (Apr 16 to May 18)
- **Available hours:** ~35 (7/week × 5 weeks, compressed this first week)
- **Original spec budget:** 45 hours
- **Deficit:** 10 hours
- **How we close it:** cut head tilt servo (-1h), cut pre-submission rehearsal (-1h), lighter dogfooding (-2h), cut vote tally fanciness (-1h), accept tighter Mode A (-1h), accept LBW out of scope (already done), explicit weekly buffers absorb the rest.

---

## Course Load Check (FILL IN SUNDAY APR 19)

Before starting Week 2, map these deadlines:
- DM1590 ML — assignments due in P4: _______
- DM2624 Disabilities Tech — deliverables: _______
- DH2670 Haptics — deliverables: _______
- DH2632 Seminars — anything: _______

If any week has >4 hours of course load, reduce EyeRest target to 5 hours that week and cut the lowest-priority Tier 2 task.

---

## SPRINT 1 — Compressed Week 1 (Thu Apr 16 – Sun Apr 19, 4 days)
**Hours budget:** 6 hours
**Milestone:** Live blink rate in terminal by Sunday night

### Thu Apr 16 evening (1.5h)
- Task 1.2 — Eye landmark extraction
  - Create `eye_landmarks.py`, draw 12 eye points as circles
  - Verify landmarks track as head moves
  - Commit: "feat: isolated 12 eye landmarks"

### Fri Apr 17 evening (1.5h)
- Task 1.3 — EAR calculation
  - Write `calculate_ear()` using 6-point formula
  - Print EAR to terminal
  - Record YOUR open-eye EAR and closed-eye EAR (write in README)
  - Commit: "feat: EAR calculation working"

### Sat Apr 18 (2h)
- Task 1.4 — Blink counter (1h)
  - Threshold logic: EAR below X for Y frames = blink
  - Tune on yourself
  - Commit: "feat: blink counter with EAR threshold"
- Task 1.5 — Blinks per minute (45min)
  - Track time, calculate blinks/min
  - Display on screen with `cv2.putText`
  - Commit: "feat: live blink rate display"
- Task 1.9 — **Order hardware TODAY** (15min)
  - Arduino Nano + 2x SG90 (spare servo in case one fails) + NeoPixel WS2812B + jumper wires + USB cable
  - Electrokit or Kjell & Company, fastest shipping option

### Sun Apr 19 (1h)
- Task 1.10 — Iterative README (30min)
  - Problem statement (from spec Section 1)
  - Tech stack
  - Current status: "Week 1 — blink detection working"
  - Commit: "docs: initial README"
- Task 1.8 — Course deadline mapping (30min)
  - Fill in the section above
  - Save as `deadlines.md` in repo

### Deferred to Week 2 background (was Week 1)
- Task 1.6 — Robustness testing (glasses, lighting, angles) → moved to Week 2
- Task 1.7 — macOS brightness permissions test → moved to Week 2

### Sprint 1 Gate (Sun Apr 19, 9pm)
**CHECKPOINT:** Does my terminal show live blinks/minute? YES/NO
- If YES → Week 2 starts Monday
- If NO → Monday evening is 1.5h emergency fix session, cut Task 2.5 (Mode D) from Week 2 to compensate

---

## SPRINT 2 — Baseline + Modes A/B/D + F1 (Mon Apr 20 – Sun Apr 26)
**Hours budget:** 7 hours (1h buffer held back)
**Milestone:** First intervention triggers + F1 score measured

### Mon-Tue (2.5h)
- Task 2.1 — Rolling baseline engine (2h)
  - `baseline.py` with deque
  - 30-min real mode + 30-sec quick-cal demo mode
  - Commit: "feat: rolling baseline"
- Task 1.6 — Robustness testing (30min, deferred from Week 1)
  - Glasses on/off, dim lighting, head angles
  - Document in README under "Known Limitations"

### Wed (1h)
- Task 2.2 — Risk score (1h)
  - 0.4 blink + 0.4 focus + 0.2 distance
  - Display live
  - Commit: "feat: risk score calculation"

### Thu-Fri (3h, HARD CAP)
- Task 2.3 — Mode A ambient glow (3h max)
  - **Pre-decide the fallback NOW** so you don't decide under time pressure:
    - If tkinter transparent overlay fails: small frameless tkinter window 400×40px, positioned at top-center of screen, solid amber background, fades in/out by changing alpha attribute (macOS supports window-level alpha even when content transparency fails)
  - **Hard stop at 3h regardless of state.** Ship what works.
  - Commit: "feat: Mode A ambient glow"

### Sat (1.5h)
- Task 2.4 — Mode B notification (1h)
  - tkinter popup with blink rate + baseline
  - "Take a break" / "Remind me" buttons
  - Auto-dismiss 15s
  - Commit: "feat: Mode B notification"
- Task 2.5 — Mode D fixed timer (30min)
  - 20-min countdown with popup
  - Commit: "feat: Mode D control"

### Sun — F1 VALIDATION (1h, critical)
- Task 2.6 — **F1 score measurement** (was Week 6, moved here)
  - Record 5 minutes of webcam while doing normal work
  - Manually count blinks (ground truth)
  - Compare to system count: calculate precision, recall, F1
  - Document F1 in README
  - **If F1 < 0.7:** Week 3 includes threshold re-tuning (cut Task 3.5 blink pulse visualization)
  - **If F1 ≥ 0.7:** proceed to Week 3 as planned

### Sprint 2 Gate (Sun Apr 26)
Mode A glow appears, Mode B shows your data, F1 measured. YES/NO.

---

## SPRINT 3 — Mode C + Demo Mode + Dogfood Start (Mon Apr 27 – Sun May 3)
**Hours budget:** 7 hours (1h buffer)
**Milestone:** Full 5-mode demo cycle runs end-to-end

### Mon-Tue (3h)
- Task 3.1 — Mode C adaptive dim (2.5h, HARD CAP; was 3h)
  - Gradual dim (5s ramp)
  - Mouse pause 2min
  - Restore on look-away
  - **Fallback if native brightness blocked:** tkinter full-screen dark overlay with 40% alpha, same behavior
  - Commit: "feat: Mode C adaptive dim"
- Task 1.7 — macOS brightness permissions (30min, deferred from Week 1)

### Wed (1h)
- Task 3.2 — Face distance (1h)
  - Bbox size ratio tracking
  - >15% closer = warn
  - Commit: "feat: face distance"

### Thu (3h)
- Task 3.3 — Gaze direction (3h; increased from 2h)
  - Heuristic approach: iris displacement from eye center > threshold = off-screen
  - Calibrate the threshold on yourself looking at screen corners
  - Binary on/off only
  - Commit: "feat: gaze direction on/off"

### Fri-Sat (2h)
- Task 3.4 — Demo mode controller (1.5h)
  - Auto-cycle A→B→C→D at 15s intervals
  - Force-trigger regardless of risk
  - Commit: "feat: demo auto-cycle"
- Task 3.5 — Blink pulse visualization (30min, OR cut if F1 tuning needed)

### Sun (start dogfooding)
- Task 3.6 — **Dogfood session 1** (30min, was Week 5)
  - Run EyeRest during your own DM1590 study session
  - Note bugs/UX issues in `bugs.md`

### Sprint 3 Gate (Sun May 3)
**HARDWARE GATE + TIER DECISION**
- Arduino parts arrived? YES/NO
  - If NO and can't arrive by May 4: **switch to on-screen animated character fallback** now. 3h in Week 4 instead of physical build.
- Digital demo cycle works end-to-end in 2.5 min? YES/NO
  - If NO: BlinkBuddy is cut, Week 4 is digital polish only

---

## SPRINT 4 — BlinkBuddy Build (Mon May 4 – Sun May 10)
**Hours budget:** 7 hours (1h buffer)
**Milestone:** Physical companion responds to EyeRest OR animated fallback working

### Mon (1.5h)
- Task 4.1 — Arduino firmware
  - Servo + NeoPixel control
  - Serial command handler (B, H, A, S)
  - Test on breadboard
  - Commit: "hardware: BlinkBuddy firmware"

### Tue-Wed (3h, HARD CAP)
- Task 4.2 — Shell CAD + print submission (3h max)
  - Measure MacBook Pro top bezel FIRST
  - Fusion 360: body + monitor clip
  - Export STL, submit to KTH Middla
  - **If print queue >3 days:** assemble on bread-boarded version, print shell post-submission

### Thu (1.5h)
- Task 4.3 — Python serial integration
  - `BlinkBuddy` class wrapping pyserial
  - Graceful fallback if not connected (important — your demo video needs to record reliably)
  - Commit: "feat: BlinkBuddy Python interface"

### Fri (1h)
- Task 4.4 — Mode E integration
  - Wire behavioral states to risk score
  - Commit: "feat: Mode E BlinkBuddy"

### Sat-Sun (dogfood continues)
- Task 4.5 — **Dogfood session 2** (30min)
  - Note bugs, add to `bugs.md`
- ~~Task 4.5 — Head tilt servo~~ **CUT — move to summer v2**

### Sprint 4 Gate (Fri May 8, moved from May 3 in original)
BlinkBuddy (physical or animated) responds to commands? YES/NO
- If physical works → proceed
- If physical broken → spend Saturday building animated fallback (tkinter window with animated eye SVG), then proceed

---

## SPRINT 5 — Submission Materials (Mon May 11 – Sat May 16)
**Hours budget:** 8 hours
**Milestone:** SUBMITTED by Saturday May 16

### Mon (1.5h)
- Task 5.1 — Bug triage + fixes
  - Review `bugs.md`
  - Fix top 3 critical only (anything that would break the video)
  - Commit: "fix: critical demo bugs"

### Tue (2h)
- Task 5.2 — Demo video recording (1.5h)
  - 2-min screen capture + BlinkBuddy shots
  - Desk lamp on, quiet environment
  - Do 3 takes, pick best
  - Basic edit in iMovie, title card, no fancy transitions
- Task 5.3 — Demo still image (30min)
  - 1500×1200px: laptop + BlinkBuddy + Mode A glow visible
  - Good lighting, clean background

### Wed-Thu (5h, critical)
- Task 5.4 — Extended abstract (5h total; was 1.5h)
  - Wed (3h): Draft following spec Section 14 outline
    - P1 Problem + Pulse theme framing (150w)
    - P2 System + theoretical grounding (200w)
    - P3 BlinkBuddy rationale + mirror neurons (150w)
    - P4 Demo experience (150w)
    - Figure caption
    - References (use spec Section 18 list)
  - Thu (2h): Edit, tighten, verify ACM formatting, check 2-page limit
- Task 5.5 — Privacy-by-design paragraph (30min, explicit)
  - Half-paragraph in abstract P2
  - Emphasize: no video stored, offline-only, in-memory only

### Fri (1h)
- Task 5.6 — Setup description document (30min)
  - Equipment list + annotated photo
  - One paragraph per item
- Task 5.7 — Video finalize (30min)
  - Title card, trim to 2:00 exact, export MP4

### Sat May 16 — SUBMIT (30min)
- Task 5.8 — **Submit to PCS**
  - Upload: abstract, video, still image, setup doc
  - 2-day buffer before May 18 deadline in case of PCS bugs or re-uploads

### Sun May 17 — READ-ONLY
- Task 5.9 — Public GitHub README polish (1h)
  - Update with submission status, F1 score, link to video
  - Commit: "docs: submission-ready README"

---

## Post-Submission (May 18 onwards, 5-month runway)

Move to `POST_SUBMISSION.md` after May 17:
- Full dogfooding (2 weeks of daily use)
- Demo rehearsal (3-5 practice runs with timer)
- BlinkBuddy v2: head tilt servo, cosmetic polish, battery option
- User study for LBW/CHI 2027
- Vote tally display refinement
- Documentation polish
- fammad.com project page

None of this blocks May 18.

---

## Explicit Cut Triggers

| If this exceeds budget | Cut this |
|---|---|
| Task 2.3 (Mode A) > 3h | Task 3.5 (blink pulse visualization) |
| Task 3.1 (Mode C) > 2.5h | Task 3.5 (blink pulse visualization) + simpler Mode C (instant dim, no ramp) |
| Task 3.3 (Gaze) > 3h | Drop gaze entirely, use look-away = low EAR for 2+ sec |
| BlinkBuddy print delayed past May 4 | Physical → animated fallback |
| F1 < 0.7 on May 3 | Task 3.5 cut, Week 3 gets threshold re-tuning |
| Any week runs >1h over | Next week's buffer absorbs, no cascade |

---

## Daily Format (from spec, unchanged)

```
Today: Task X.Y [Xh estimate]
Blocker: [what might stop me]
Done signal: [what "done" looks like]
```

---

## Rules for This Sprint

1. **No new ideas until May 17.** If you think of a feature, add to `POST_SUBMISSION.md`. Don't touch it.
2. **No refactoring for elegance.** If code works, ship it. Refactor in summer.
3. **Commit per task.** If a task has no commit, it's not done.
4. **Hard caps are hard caps.** Timer on your phone. When it fires, ship or cut.
5. **Submit by May 16.** The 2-day buffer exists because PCS will have at least one weird bug.

---

## Version
v2 — replaces original ROADMAP.md
Author: Fuad Mammadov
Last updated: Apr 16, 2026
