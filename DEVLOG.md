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

Set up the conda environment, created the GitHub repo, added dependencies. Python 3.12 pinned, mediapipe fixed at 0.10.14 because 3.13 breaks the `mp.solutions` API.

Built `test_facemesh.py` first to confirm MediaPipe face mesh was actually running before touching eye-specific logic. Once that worked, moved to `eye_landmarks.py` — isolated the 6 landmark indices per eye and drew them on the webcam feed. Then wrote `blink_detector.py` with the EAR calculation. By end of day, EAR was printing live to screen.

Hardware is still pending. Everything so far is software only.

## April 22 — Blink counter

Added blink event detection on top of the EAR values. Took three iterations.

First version triggered on average EAR across both eyes. Head turns caused false counts because the far eye's landmarks compress at angle and EAR drops without a real blink.

Second version required both eyes to be below threshold simultaneously. Fixed head-turn artifacts and filtered winks.

Third version added a minimum open duration — 3 consecutive above-threshold frames required before a reopen is confirmed. Squinting was oscillating below and above threshold repeatedly and counting each recovery as a blink. This stopped it.

Result: 10 deliberate blinks, count showed 10. Open-eye EAR baseline is 0.33 in evening home lighting. Threshold is set at 0.21. That gap will likely need re-tuning under conference fluorescents in Vaasa.

ESP32-S3 not yet ordered. No hardware built.
