---
name: movorca
description: Use when the user wants to create a professional knowledge explanation video, concept animation, or visual tutorial with narration and subtitles. Triggers on "make a video about", "explain X as video", "create explainer video", "knowledge video", "animated explanation", "做个视频", "讲解视频", "解释视频", "concept animation".
allowed-tools: [Bash, Write, Read, Edit, Glob, Grep]
---

# Movorca — Knowledge Video Generator

Generate professional concept-animation explainer videos from natural language. The user describes a topic, you turn it into a scene script, animated HyperFrames compositions, TTS narration, bilingual subtitle overlays, and a rendered MP4.

## Workflow

```text
Topic → Environment Check → Script → Scene Compositions → TTS → Subtitles → Assemble → Render MP4
```

## Critical Rule: This Is Concept Animation, Not Slides

You are not building a slideshow. The motion itself should explain the idea.

| Wrong | Right |
|---|---|
| Text fades in line by line | Packets fly between nodes |
| Bullet points appear | Shapes split, merge, transform |
| Static diagram with labels | A chain of events visibly propagates |
| Paragraphs on screen | Minimal labels supporting the action |

If muting the video makes the scene confusing, the scene is still too slide-like.

## Step 1: Environment Check

```bash
node --version
ffmpeg -version
npx hyperframes --version
```

If anything is missing, read `references/setup-guide.md` and guide the user through installation.

Check for TTS credentials:

```bash
cat ~/.config/movorca/.env 2>/dev/null || echo "no config"
```

If the config file does not exist or is missing `MINIMAX_API_KEY`, ask the user for their MiniMax API key and group ID, then save them:

```bash
mkdir -p ~/.config/movorca
cat > ~/.config/movorca/.env << 'EOF'
MINIMAX_API_KEY=<key from user>
MINIMAX_GROUP_ID=<group id from user>
EOF
```

The TTS script reads `~/.config/movorca/.env` automatically. The user only needs to do this once.

## Step 2: Initialize Project

```bash
mkdir -p movorca-output && cd movorca-output
npx hyperframes init video --non-interactive --example blank
cd video
mkdir -p compositions audio subtitles
```

## Step 3: Confirm Language Preferences

Before drafting the script, confirm with the user:

1. Narration language — what language should the voiceover speak?
2. Subtitle languages — single language, bilingual, or none?

If the user already specified these in their prompt, skip this step.

## Step 4: Generate a Script for Review

Draft a structured script and show it to the user for review. The user can revise the script in chat until it feels right.

**Every scene MUST have all four elements:**

1. **Scene title + duration** — what this scene is about and how long it lasts
2. **Visual direction** — what the viewer sees on screen: objects, motion, spatial layout. Describe the animation, not a slide.
3. **Narration** — the full spoken text for the voiceover. Write the actual words, not a summary. This determines pacing and timing.
4. **Subtitle translation** — the narration translated into the secondary language (if bilingual)

A script missing any of these is incomplete. Do NOT present a table of patterns or a list of visual descriptions without narration.

Present each scene like this:

```text
SC.01  [Scene Title]  [Ns]

  Visual: Describe what happens on screen — which objects appear,
          how they move, how they interact. Use verbs, not static descriptions.

  Narration: "The full voiceover text goes here. This is what TTS will
             speak — not a summary, not a paraphrase, the actual words."

  Subtitle: "Translation in the secondary language,
            matching the narration sentence by sentence."
```

Use the user's narration language for the narration field and the secondary language for the subtitle field. Repeat for every scene. Present the full script at once, then wait for user confirmation.

After confirmation, write the JSON file (`script.json`) that feeds the pipeline scripts. The JSON `lang` and `subtitle_langs` fields should match what the user confirmed in Step 3.

```json
{
  "id": "https-explained",
  "title": "HTTPS 加密过程",
  "lang": "zh",
  "subtitle_langs": ["zh", "en"],
  "scenes": [
    {
      "id": "scene-01",
      "title": "不安全的互联网",
      "narration": "每次你在浏览器输入网址……",
      "narration_secondary": "Every time you type a URL...",
      "visual": "[Particle Flow] 浏览器发出明文数据包，中途被窃听者截获。",
      "pattern": "particle-flow",
      "start": 0,
      "duration": 15,
      "transition": "dissolve"  // reserved for Phase 2
    }
  ]
}
```

For the chat preview, present a readable version. The example below is illustrative — adapt the language and content to the user's request:

```text
Video Script: [Title] (~Ns, N scenes)
Language: [narration lang], [subtitle langs]

Scene 1 (0-Ns): [title] [Pattern]
  Narration: "[full spoken text — the actual words the voiceover will say]"
  Subtitle: "[translation in secondary language, if bilingual]"
  Visual: [what the viewer sees — objects moving, transforming, interacting]
```

Wait for user confirmation before generating compositions or running scripts.

## Step 5: Generate Scene Compositions

Write one scene per file in `compositions/`. Each scene is a standalone HyperFrames HTML composition that follows `references/hyperframes-contract.md`.

- use SVG for precise diagrams and physical motion
- use HTML/CSS for cards, panels, or UI metaphors
- mix SVG and HTML if that improves clarity
- keep text minimal and motion dominant
- lint after each scene with `npx hyperframes lint`

## Step 6: Generate TTS Narration

```bash
node scripts/tts.mjs --input script.json --lang zh --output audio
```

- reads the confirmed script
- generates one MP3 per scene
- writes `audio/timing.json` with per-scene metadata and durations when available
- use `--voice` to override the default voice

## Step 7: Generate Subtitle Overlays

```bash
node scripts/subtitles.mjs --input script.json --timing audio/timing.json --lang zh,en --output subtitles
```

- generates HyperFrames-compatible subtitle fragments
- primary language renders large and bright
- optional secondary language renders smaller beneath it
- subtitles are timed to narration duration when timing data exists

## Step 8: Assemble the Root Composition

```bash
node scripts/assemble.mjs --input script.json --project . --scenes compositions --audio audio --subs subtitles
```

- writes `index.html`
- references each scene sub-composition
- layers audio tracks and subtitle overlays on top
- preserves scene-level timing from the script or audio timing metadata

## Step 9: Lint and Render

```bash
npx hyperframes lint
npx hyperframes render --output output.mp4
```

Report the generated output path back to the user.

## Animation Guidance

Choose patterns by what the concept does, not by topic name. The main reference lives in `references/animation-patterns.md`.

- `Particle Flow`: something travels between entities
- `Transformation`: one state turns into another
- `Reordering`: items swap or re-rank
- `Zoom & Pan`: move through a larger system
- `Accumulation`: build a structure layer by layer
- `Split & Merge`: break apart or recombine
- `Chain Reaction`: show visible causality
- `Side-by-Side`: make contrast immediate
- `Loop`: show repeating cycles

Pattern selection rules:

- start with one dominant pattern per scene
- combine at most two patterns in a scene
- prefer action over explanation text
- let entities react to interaction: pulse, glow, deform, bounce, recolor
- use labels sparingly and only near the thing they annotate

## Audio and Subtitle Integration Notes

- keep scene HTML focused on visuals; narration and subtitles are handled in the root composition
- use `audio/timing.json` after TTS so subtitle timing can match the real generated audio
- if the user wants subtitles in one language only, omit `narration_secondary` and pass a single `--lang`
- if a scene has no narration, explicitly state that and skip TTS only for that scene if needed

## Visual Style

Default visual language:

- background: `#0f172a`
- surface cards: `#1e293b`
- text emphasis: `#f8fafc`
- secondary labels: `#94a3b8`
- accent palette: blue `#3b82f6`, green `#10b981`, amber `#f59e0b`, purple `#8b5cf6`, red `#ef4444`
- typography: clean sans for labels, monospace for code/data values
- easing: `power2` to `power3` for most movement, `back.out` for reveals, `none` for linear travel
- pacing: most micro actions should land in `0.3s` to `0.8s`; scene beats typically resolve in `5s` to `18s`

## Rules

- Resolution: 1920x1080 (16:9)
- All content self-contained except approved media files and the GSAP CDN
- Follow `references/hyperframes-contract.md` strictly
- Use `references/animation-patterns.md` as the creative starting point
- Always present the script and wait for confirmation before generation
- Always lint before render
