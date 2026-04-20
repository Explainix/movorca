---
name: movorca
description: Use when the user wants to create a knowledge explanation video, animated explainer, or visual tutorial from a topic description. Triggers on "make a video about", "explain X as video", "create explainer video", "knowledge video", "animated explanation", "视频", "做个视频", "讲解视频".
allowed-tools: [Bash, Write, Read, Glob, Grep]
---

# Movorca — Knowledge Video Generator

Generate professional animated knowledge explanation videos from natural language. User describes a topic, you produce an MP4.

## Workflow

```
Topic → Analyze Scope → Plan Scenes → Generate Compositions → Assemble → Render MP4
```

### Step 1: Environment Check

```bash
node --version && ffmpeg -version && npx hyperframes --version
```

If anything is missing, read `references/setup-guide.md` and guide the user through installation.

### Step 2: Initialize Project

```bash
mkdir -p movorca-output && cd movorca-output
npx hyperframes init video --non-interactive --example blank
cd video
```

### Step 3: Analyze & Plan Scenes

Analyze the topic complexity and decide the video structure. The agent determines scene count based on content — NOT a fixed template.

**Planning process:**
1. Break the topic into core knowledge points
2. For each point, choose the best visual treatment (see Scene Types below)
3. Determine scene order for narrative flow
4. Allocate timing per scene (5-15s each, total adapts to content)
5. Plan transitions between scenes

**Present the plan to the user before generating.** Example:

```
Video Plan: "How DNS Works" (~60s, 5 scenes)

Scene 1 (0-8s): Title — "How DNS Works" with animated network icon
Scene 2 (8-25s): Diagram — browser → resolver → root → TLD → authoritative, arrows animate sequentially
Scene 3 (25-40s): Step-by-step — the 4 query steps with timing labels
Scene 4 (40-52s): Comparison — DNS cache hit vs miss, side-by-side
Scene 5 (52-60s): Summary — 3 key takeaways fade in

Transitions: cross-fade between scenes
```

Wait for user confirmation before proceeding.

### Step 4: Generate Compositions

**Multi-scene structure:**

```
video/
├── index.html                    # Root composition (assembles all scenes)
├── compositions/
│   ├── scene-01-title.html       # Each scene is a sub-composition
│   ├── scene-02-diagram.html
│   ├── scene-03-steps.html
│   └── scene-04-summary.html
└── meta.json
```

**Root composition (index.html)** references sub-compositions:

```html
<div id="root" data-composition-id="video" data-width="1920" data-height="1080">
  <div class="clip" data-start="0" data-duration="8" data-track-index="0"
       data-composition-src="compositions/scene-01-title.html"></div>
  <div class="clip" data-start="8" data-duration="17" data-track-index="0"
       data-composition-src="compositions/scene-02-diagram.html"></div>
  <!-- ... more scenes -->
</div>
```

**Each sub-composition** is a self-contained HTML file following the HyperFrames contract (see `references/hyperframes-contract.md`).

Generate scenes one at a time. After each scene, run lint:

```bash
npx hyperframes lint
```

Fix all errors before moving to the next scene.

### Step 5: Render

```bash
npx hyperframes render --output output.mp4
```

Report the output file path to the user.

## CRITICAL: This is Concept Animation, NOT Slides

**You are making an explanation animation, not a presentation.**

The animation IS the explanation. Objects move, transform, interact, and react to show how concepts work. Text is minimal — only labels and annotations.

Ask yourself: "If I muted the text, would the viewer still understand the concept from the motion alone?" If not, you're making a slideshow.

| WRONG (slideshow) | RIGHT (concept animation) |
|---|---|
| Text fades in line by line | Packet flies between servers |
| Bullet points appear | Bars swap positions to show sorting |
| Static diagram with labels | Data drops through network layers, each layer pulses |
| "Step 1: Client sends request" | Browser icon emits a glowing dot that travels to server |

## Animation Patterns

Choose based on what the concept DOES, not what it IS:

| Pattern | Use When | Motion |
|---------|----------|--------|
| Particle Flow | Something travels between entities | Object moves along path, endpoints react |
| Transformation | Something changes form | Object morphs, shakes, recolors |
| Sorting/Reorder | Things get rearranged | Elements physically swap positions |
| Zoom & Pan | Exploring a system | Camera moves through large canvas |
| Accumulation | Building up structure | Pieces stack/connect with physics |
| Split & Merge | Composition/decomposition | Object breaks apart or combines |
| Chain Reaction | Cause and effect | Action triggers next action in sequence |

See `references/scene-templates.md` for full SVG + GSAP examples of each pattern.

## Content Planning Guidelines

- Lead with "why this matters" — hook the viewer
- One concept per scene — don't overload
- Think in MOTIONS, not slides: what moves? what transforms? what reacts?
- Every scene needs a primary animation that carries the explanation
- Text is supporting — labels, annotations, not paragraphs
- Vary pacing — dense concepts need more time

## Visual Style

- All visuals in SVG — crisp at any resolution, precise animation control
- Background: dark (#0f172a)
- Entities: dark cards (#1e293b) with colored strokes
- Accents: blue (#3b82f6), green (#10b981), amber (#f59e0b), purple (#8b5cf6), red (#ef4444)
- Text: labels only (#94a3b8), emphasis (#f8fafc)
- Entities react on interaction (pulse, glow, color shift)
- Smooth easing (power2-3), 0.3-0.8s per animation

## Rules

- Resolution: 1920x1080 (16:9)
- All content self-contained (inline styles, no external assets beyond GSAP CDN)
- Follow HyperFrames contract strictly (see `references/hyperframes-contract.md`)
- Use scene templates as starting points (see `references/scene-templates.md`)
- Always lint after generating each scene
- Always present the plan and get user confirmation before generating
