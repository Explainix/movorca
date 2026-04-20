---
name: movorca
description: Use when the user wants to create a knowledge explanation video, animated explainer, or visual tutorial from a topic description. Triggers on "make a video about", "explain X as video", "create explainer video", "knowledge video", "animated explanation", "视频", "做个视频", "讲解视频".
allowed-tools: [Bash, Write, Read, Glob, Grep]
---

# Movorca — Knowledge Video Generator

Generate animated knowledge explanation videos from natural language. User describes a topic, you produce an MP4.

## Workflow

```
Topic → Plan Beats → Generate HTML → Render MP4
```

### Step 1: Environment Check

Verify prerequisites before starting:

```bash
node --version    # Need 22+
ffmpeg -version   # Need FFmpeg
npx hyperframes --version  # Check availability
```

If anything is missing, read `references/setup-guide.md` and guide the user through installation. Do NOT proceed until the environment is ready.

### Step 2: Initialize Project

```bash
mkdir -p movorca-output && cd movorca-output
npx hyperframes init video --non-interactive --example blank
cd video
```

### Step 3: Plan Content Beats

Before writing any HTML, plan the video structure. Break the topic into 3-5 visual beats:

For a 30-second video, use this structure:
- Beat 1 (0-5s): Title card — topic name + one-line hook
- Beat 2 (5-17s): Core explanation — diagram or visual metaphor showing the concept
- Beat 3 (17-27s): Step-by-step — key points revealed sequentially
- Beat 4 (27-30s): Summary — 2-3 takeaway points

For each beat, decide:
1. What knowledge point does this convey?
2. What visual metaphor makes it intuitive? (diagram, flowchart, comparison, timeline)
3. What elements animate in, and in what order?

### Step 4: Generate Composition

Write `index.html` following the HyperFrames contract (see `references/hyperframes-contract.md`).

Key rules:
- Root: `<div id="root" data-composition-id="video" data-width="1920" data-height="1080">`
- Every visible element: `class="clip"` + `data-start` + `data-duration` + `data-track-index`
- GSAP: Create `const tl = gsap.timeline({ paused: true })`, register to `window.__timelines`
- Use absolute time positions in GSAP (3rd argument = seconds from video start)
- NO setTimeout, setInterval, requestAnimationFrame, Math.random, CSS transitions

Use patterns from `references/scene-templates.md` as building blocks.

### Step 5: Render

```bash
npx hyperframes render --output output.mp4
```

Report the output file path to the user when complete.

## Content Planning Guidelines

When breaking a topic into visual beats:

- Lead with the "why" — hook the viewer with why this matters
- One concept per beat — don't overload
- Use spatial metaphors — left-to-right for sequences, top-to-bottom for hierarchies
- Animate to reveal — don't show everything at once
- End with actionable takeaway

## Visual Style

- Background: dark (#0f172a, #1e1b4b)
- Text: high contrast (#f8fafc primary, #94a3b8 secondary)
- Accents: blue (#3b82f6), green (#10b981), purple (#8b5cf6), amber (#f59e0b)
- Font: system-ui, clean and readable at video resolution
- Animation: smooth easing (power2-3), 0.3-0.8s duration
- Layout: generous whitespace, centered compositions

## Constraints

- MVP: single composition, text + shapes only (no images, no audio)
- Duration: 10-30 seconds
- Resolution: 1920x1080 (16:9)
- All content must be self-contained in index.html (inline styles, no external assets)
