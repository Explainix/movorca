---
name: movorca
description: Use when the user wants to create a professional knowledge explanation video, concept animation, or visual tutorial with narration and subtitles. Triggers on "make a video about", "explain X as video", "create explainer video", "knowledge video", "animated explanation", "做个视频", "讲解视频", "解释视频", "concept animation".
allowed-tools: [Bash, Write, Read, Edit, Glob, Grep]
---

# Movorca — Knowledge Video Generator

Education-focused layer on top of HyperFrames. You handle script writing, voice selection, and concept-to-animation mapping. HyperFrames handles everything else — composition authoring, TTS, captions, transitions, rendering.

## Prerequisites

Before starting, read the HyperFrames skill at `.agents/skills/hyperframes/SKILL.md`. It is the authoritative reference for composition structure, timeline rules, visual identity, layout, and animation. This skill only adds education-specific guidance on top.

## Workflow

```text
Topic → Environment Check → DESIGN.md → Script → Scenes → TTS → Captions → Assemble → QA → Render
```

## Step 1: Environment Check

```bash
node --version        # 22+
ffmpeg -version
npx hyperframes --version
python3 -c "import kokoro_onnx; print('ok')"  # TTS dependency
```

If `kokoro_onnx` is missing: `pip install kokoro-onnx soundfile`
If `espeak-ng` is missing (needed for Chinese TTS): `brew install espeak-ng`

## Step 2: Initialize Project

```bash
mkdir -p movorca-output && cd movorca-output
npx hyperframes init video --non-interactive --example blank
cd video
mkdir -p compositions audio
```

### Visual Identity (HARD GATE)

Follow the Visual Identity Gate in `.agents/skills/hyperframes/SKILL.md`. Do NOT write any composition HTML until a DESIGN.md exists.

For education videos, default to asking:
1. What's the mood? (technical / storytelling / energetic)
2. Light or dark canvas?
3. Any brand colors?

Then generate a minimal DESIGN.md. If the user doesn't care, use the "dark-premium" palette from `.agents/skills/hyperframes/palettes/dark-premium.md`.

## Step 3: Confirm Language and Voice

Before drafting the script, confirm:

1. Narration language — Chinese or English?
2. Subtitle languages — single, bilingual, or none?

### Voice Selection

| Language | Voice | Character |
|---|---|---|
| Chinese (default) | `zf_xiaobei` | Clear female, tutorial-friendly |
| Chinese (alt) | `zm_yunjian` | Authoritative male |
| English (default) | `bf_emma` | Neutral, easy to follow |
| English (alt) | `am_adam` | Warm male |

Run `npx hyperframes tts --list` to see all 54 voices. Voice ID prefix encodes language: `z`=Mandarin, `a`=American English, `b`=British English.

## Step 4: Draft Script for Review

Draft a structured script. The user revises until satisfied. Do NOT proceed to composition generation without explicit confirmation.

### Education Script Structure

Every scene MUST have all four elements:

1. **Scene title + duration** — what concept this scene explains
2. **Visual direction** — what the viewer SEES: objects, motion, spatial relationships. Describe animation, not slides. Use verbs.
3. **Narration** — the full spoken text. Write the actual words TTS will speak, not a summary.
4. **Subtitle translation** — narration in the secondary language (if bilingual)

### Script Quality Rules

- **Hook in 5 seconds** — the first scene must create curiosity or tension
- **One concept per scene** — if you need "and" to describe the scene, split it
- **Narration drives pacing** — scene duration = how long the narration takes to speak
- **Visual explains, narration reinforces** — if muting the video makes the scene confusing, it's too slide-like
- **Build on prior scenes** — each scene should reference or transform elements from the previous one

### Concept-to-Animation Mapping

Choose animation patterns by what the concept DOES, not by topic name. See `references/education-patterns.md` for the full pattern library.

Quick reference:

| Concept behavior | Pattern | Example |
|---|---|---|
| Something travels between entities | Particle Flow | Network packets, blood circulation, data pipeline |
| One state becomes another | Transformation | Encryption, compilation, chemical reaction |
| Items reorder or re-rank | Reordering | Sorting algorithms, priority changes |
| Navigating a larger system | Zoom & Pan | Cell → organelle, city → building |
| Building layer by layer | Accumulation | Stack growth, neural network layers |
| Breaking apart or combining | Split & Merge | Parsing, protein folding |
| Visible cause → effect | Chain Reaction | Domino logic, event propagation |
| Comparing two things | Side-by-Side | Before/after, HTTP vs HTTPS |
| Repeating process | Loop | CPU fetch-decode-execute, heartbeat |

Pattern rules:
- One dominant pattern per scene, two max
- Prefer action over text on screen
- Let entities react: pulse, glow, deform, bounce, recolor
- Labels are sparse and always near the thing they annotate

### Script Format

Present for review:

```text
Video Script: [Title] (~Ns, N scenes)
Language: [narration lang], Subtitles: [subtitle langs]

SC.01  [Scene Title]  [Ns]

  Visual: Describe what happens on screen — objects, motion, interaction.

  Narration: "The full voiceover text. Actual words, not a summary."

  Subtitle: "Translation in secondary language."
```

After user confirms, write `script.json`:

```json
{
  "id": "video-id",
  "title": "Video Title",
  "lang": "zh",
  "subtitle_langs": ["zh", "en"],
  "voice": "zf_xiaobei",
  "scenes": [
    {
      "id": "scene-01",
      "title": "Scene Title",
      "narration": "Full narration text...",
      "narration_secondary": "English translation...",
      "visual": "Visual direction description",
      "pattern": "particle-flow",
      "duration": 15
    }
  ]
}
```

## Step 5: Generate Scene Compositions

Write one HTML file per scene in `compositions/`. Follow `.agents/skills/hyperframes/SKILL.md` strictly for:

- Composition structure (`<template>` wrapper, `data-composition-id`, `data-width/height`)
- Timeline contract (`window.__timelines`, `paused: true`, absolute positions)
- Layout Before Animation (build end-state first, then add `gsap.from()` entrances)
- Scene Transitions (entrance animations only, NO exit animations except final scene)
- Deterministic rules (no `Math.random`, no `setTimeout`, no CSS animations)

Education-specific guidance:
- Use SVG for diagrams, physical motion, and spatial relationships
- Use HTML/CSS for cards, panels, UI metaphors, and text-heavy moments
- Mix SVG and HTML when it improves clarity
- Keep text minimal — motion carries the explanation
- Reference `references/education-patterns.md` for concept animation techniques

After each scene, lint:

```bash
npx hyperframes lint
```

## Step 6: Generate TTS Narration

For each scene, generate audio using HyperFrames native TTS:

```bash
npx hyperframes tts "narration text" --voice zf_xiaobei --speed 0.8 --output audio/scene-01.wav
```

Speed guidance for education:
- `0.7-0.8` — complex concepts, first explanation
- `0.9-1.0` — familiar concepts, recap
- `1.0-1.1` — intro/outro energy

## Step 7: Generate Captions

Transcribe each audio file to get word-level timestamps:

```bash
npx hyperframes transcribe audio/scene-01.wav --model small --language zh
```

This produces `transcript.json` with word-level timing. Then build caption compositions following `.agents/skills/hyperframes/references/captions.md`.

For bilingual subtitles: generate captions for the primary language from the transcript, and add secondary language text as a smaller line beneath each caption group.

## Step 8: Assemble Root Composition

Write `index.html` following the HyperFrames composition structure in `.agents/skills/hyperframes/SKILL.md`:

- Scene clips on track 0 via `data-composition-src`
- Audio clips on track 2
- Caption overlay composition on track 4
- Scene timing is absolute from video start
- Root `data-duration` = sum of all scene durations
- Add transitions between every scene pair — read `.agents/skills/hyperframes/references/transitions.md`

## Step 9: Quality Checks and Render

```bash
# Lint
npx hyperframes lint

# Contrast audit
npx hyperframes validate

# Key frame snapshots (visual verification)
npx hyperframes snapshot

# Animation choreography check
node .agents/skills/hyperframes/scripts/animation-map.mjs . --out .hyperframes/anim-map

# Render
npx hyperframes render --output output.mp4
```

Fix any lint/validate issues before rendering. Check snapshots for layout problems. Review animation-map for dead zones or collisions.

## Critical Rule: Concept Animation, Not Slides

| Wrong | Right |
|---|---|
| Text fades in line by line | Packets fly between nodes |
| Bullet points appear | Shapes split, merge, transform |
| Static diagram with labels | A chain of events visibly propagates |
| Paragraphs on screen | Minimal labels supporting the action |

If muting the video makes the scene confusing, the scene is still too slide-like.

## Resolution

1920x1080 (16:9). All content self-contained except GSAP CDN.
