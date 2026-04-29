# Lumen — Dev Log
**Project:** Lumen (tangible object for negotiated screen-work interruption)
**Repo:** github.com/fammad/lumen
**Author:** Fuad Mammadov, KTH IMT MSc

---

## April 5 — Concept

Started thinking about Lumen as a physical object. Brainstormed what the interaction should feel like, what problem it was actually solving, and whether it was worth building at all. No code yet.

## April 10 — Logic and structure

Started investigating the detection logic. Imported variables, mapped out what the system needed to track across frames. Still no working code — mostly understanding what MediaPipe gives you and what you have to compute yourself.

## April 15 — Environment, repo, first working detection

Set up the venv environment, created the GitHub repo, added dependencies. Python 3.12 pinned, mediapipe fixed at 0.10.14 because 3.13 breaks the `mp.solutions` API.

Built `test_facemesh.py` first to confirm MediaPipe face mesh was actually running before touching eye-specific logic. Once that worked, moved to `eye_landmarks.py` — isolated the 6 landmark indices per eye and drew them on the webcam feed. Then wrote `blink_detector.py` with the EAR calculation. By end of day, EAR was printing live to screen.

Hardware is still pending. Everything so far is software only.

## April 21 — Blink counter

Added blink event detection on top of the EAR values. Took three iterations.

First version triggered on average EAR across both eyes. Head turns caused false counts because the far eye's landmarks compress at angle and EAR drops without a real blink.

Second version required both eyes to be below threshold simultaneously. Fixed head-turn artifacts and filtered winks.

Third version added a minimum open duration — 3 consecutive above-threshold frames required before a reopen is confirmed. Squinting was oscillating below and above threshold repeatedly and counting each recovery as a blink. This stopped it.

Result: 10 deliberate blinks, count showed 10. Open-eye EAR baseline is 0.33 in evening home lighting. Threshold is set at 0.21. That gap will likely need re-tuning under conference fluorescents in Vaasa.

ESP32-S3 not yet ordered. No hardware built.

## April 22 - Blink Rate per 60 second.

Added blink counting functionality to the code that can be used to count how many blink occured in 60 seconds.

First created new constants(how many second has to count) and variables (dequeu four double ended queue). The code append every time it sees new blink. If the blink is out of given WINDOW_SECOND it drops thhe frist blink_times[0] one and add this one if this code true while blink_times and now - blink_times[0] > WINDOW_SECONDS

Result: 2 minute user test to count manual eye blink with the system. It was accurate. But I realized my blink rate is around 5-9 per minute which is not typical.

## April 23 — Range and lighting test

Tested blink detection accuracy across distance and lighting conditions.

MacBook Pro built-in camera, 1920×1080 at 60 FPS.

Low light: ~99% accurate up to 120 cm. Beyond that, landmark confidence 
drops and EAR values become unstable.

Normal / daylight: ~99% accurate up to 150 cm. Same degradation pattern 
past that threshold — not a gradual drop, more like a cliff.

This matters for the NordiCHI demo: attendees will be sitting ~60–80 cm 
from the screen. Both lighting conditions cover that range comfortably. 
The threshold cliff past 150 cm is not a concern for the demo setup, but 
I'll note the range limit in the abstract's limitations paragraph.

EAR threshold is still 0.21. Haven't re-tuned for conference fluorescents 
yet — that's the Sprint 4 lighting test.


## April 29 — Rolling baseline engine

Built `BaselineEngine` class - owns "what's the healthy blink rate reference for this user right now?" Returns reference, personal_baseline, floor_active, current_rate, samples_collected via get_state().

Hybrid design: deque pre-filled with PRIOR=15 (Rosenfield healthy at-rest rate) so the baseline is meaningful from sample 1, no warm-up dead time. Reference = max(personal_baseline, FLOOR) where FLOOR=7 (Rosenfield strain threshold). The floor catches drift — without it, sustained strain pulls the rolling mean down with the user, and the system silently agrees with the deteriorating state instead of pushing back.

Considered session-scale blending of calibration baseline with rolling rate. Rejected — any weighted average with a low recent rate pulls reference down, reintroducing the drift bug. Escalation over time belongs to the focus-clock in Task 2.2, not the baseline.

Smoke test (3 scenarios):
- Fresh start: reference=15.0, samples_collected=0 (deque full of priors)
- 30 healthy samples (~15): reference=15.0, floor_active=False
- 30 strained samples (~5): reference=7, personal_baseline=4.9, floor_active=True ← floor catching drift

What I learned: deque(iterable, maxlen=N) is the right structure for FIFO rolling windows. Pre-filling with a literature prior is Bayesian-style initialization. Always trace mechanically (sum=147, /30=4.9) before reaching for narrative ("the system decided"). And \n is a newline; /n is two characters.

Quick-cal mode deferred to Sprint 4 — same class, different constants.