# Movorca Skill — Knowledge Video Generator Design Spec

## Context

Movorca is a Claude Code plugin (skill) that generates professional knowledge explanation videos from natural language. User describes a topic, agent produces an animated MP4 with narration and subtitles.

Current state: MVP skill exists but produces slideshow-style output (text fading in). Need to rebuild for concept animation — objects moving, transforming, interacting to explain concepts visually, with TTS narration and bilingual subtitles.

Competitive gap: All competitors (Knowlify, Fogsight, etc.) are traditional SaaS black boxes. Movorca is agent-native — user collaborates with agent via chat, full creative control, zero SaaS cost.

## User Interaction Flow

```
User: "做一个 HTTPS 加密过程的讲解视频"
  │
  ▼
Agent generates detailed script:
  - Per-scene narration text + visual description
  - Estimated timing per scene
  - Total video duration
  │
  ▼
User reviews and modifies via chat:
  - "Scene 2 的比喻换成信封"
  - "加一个 scene 讲证书验证"
  - "旁白用英文，字幕中英双语"
  │
  ▼
User confirms script
  │
  ▼
Agent executes generation pipeline:
  1. Generate HTML compositions (concept animations)
  2. Generate TTS audio (MiniMax API)
  3. Generate subtitle clips
  4. Assemble full project with transitions
  5. Lint + render to MP4
```

## Architecture

```
movorca/
├── .claude-plugin/
│   ├── plugin.json
│   └── marketplace.json
├── skills/
│   └── movorca/
│       ├── SKILL.md                      # Workflow + content planning + animation guidance
│       └── references/
│           ├── hyperframes-contract.md   # HyperFrames spec (audio, subs, transitions included)
│           ├── animation-patterns.md     # 9 concept animation patterns
│           └── setup-guide.md            # Environment setup
├── scripts/
│   ├── tts.mjs                           # MiniMax TTS: narration → MP3 per scene
│   ├── subtitles.mjs                     # Narration → timed subtitle clip elements
│   └── assemble.mjs                      # Merge scenes + audio + subs + transitions → composition
├── package.json
└── README.md
```

### Responsibility Split

| Component | Responsibility |
|-----------|---------------|
| SKILL.md | Workflow orchestration, script planning, animation design guidance |
| animation-patterns.md | 9 concept animation patterns with examples |
| hyperframes-contract.md | Technical spec: HTML structure, audio, subtitles, transitions |
| scripts/tts.mjs | MiniMax TTS API call, outputs MP3 per scene |
| scripts/subtitles.mjs | Generates subtitle clip elements with timing |
| scripts/assemble.mjs | Merges scenes, audio, subtitles, transitions into final composition |
| Agent (Claude) | Creative work: script writing, animation code generation |

### Why This Split

Agent handles creative decisions (what to animate, how to visualize concepts). Scripts handle mechanical operations (API calls, file assembly, timing alignment). This keeps SKILL.md focused and makes TTS/subtitle logic reliable and testable.

## SKILL.md Workflow

### Step 1: Environment Check
- node 22+, ffmpeg, hyperframes CLI
- `npm install` in movorca plugin directory (for scripts dependencies)

### Step 2: Initialize HyperFrames Project
- `npx hyperframes init` in output directory

### Step 3: Generate Script
Agent produces a structured script:

```
Video Script: HTTPS 加密过程 (~90s, 5 scenes)
Language: 中文旁白, 中英双语字幕

Scene 1 (0-15s): 不安全的互联网
  旁白: "每次你在浏览器输入网址，你的数据就像一张明信片..."
  视觉: [Particle Flow] 浏览器发出明文数据包，飞向服务器，
        中间一个窃听者图标截获数据包并读取内容

Scene 2 (15-35s): TLS 握手
  旁白: "为了保护数据，客户端和服务器需要先建立安全通道..."
  视觉: [Chain Reaction] 客户端发送 ClientHello →
        服务器回复证书（信封动画）→ 客户端验证 →
        双方生成共享密钥（两把钥匙合并成一把）

Scene 3 (35-55s): 加密传输
  旁白: "握手完成后，所有数据都通过共享密钥加密..."
  视觉: [Transformation] 明文消息逐字符变成乱码，
        通过加密管道传输，窃听者只看到乱码

Scene 4 (55-75s): 证书验证
  旁白: "但你怎么知道服务器是真的..."
  视觉: [Accumulation] 证书链逐层展示：
        网站证书 → 中间 CA → 根 CA，每层验证打勾

Scene 5 (75-90s): 总结
  旁白: "所以 HTTPS 就是..."
  视觉: [Side-by-Side] HTTP vs HTTPS 对比，
        左边明文被截获，右边加密安全通过
```

User modifies via chat until satisfied, then confirms.

### Step 4: Generate Compositions
Agent writes HTML compositions per scene. Technology choice is automatic:
- SVG for diagrams, node-connection graphs, precise shapes
- HTML+CSS for text-heavy elements, cards, layouts
- Canvas for particle effects, complex visualizations
- Mix freely within a scene

### Step 5: Generate TTS
```bash
node scripts/tts.mjs --input script.json --lang zh --output audio/
```
- Reads confirmed script
- Calls MiniMax TTS API per scene
- Outputs MP3 files: `audio/scene-01.mp3`, `audio/scene-02.mp3`, ...
- Returns timing metadata (duration per scene)

### Step 6: Generate Subtitles
```bash
node scripts/subtitles.mjs --input script.json --lang zh,en --output subtitles/
```
- Generates subtitle clip elements for each scene
- Bilingual: primary language + translation
- Timed to match TTS audio duration
- Output: HTML fragments with clip elements

### Step 7: Assemble
```bash
node scripts/assemble.mjs --project ./video --scenes compositions/ --audio audio/ --subs subtitles/
```
- Merges scene compositions into index.html
- Embeds audio elements with timing
- Embeds subtitle clip elements
- Adds shader transitions between scenes
- Writes final index.html

### Step 8: Lint & Render
```bash
npx hyperframes lint
npx hyperframes render --output output.mp4
```

## Animation Patterns

9 patterns organized by what the concept DOES:

| Pattern | Concept Type | Core Motion |
|---------|-------------|-------------|
| Particle Flow | A→B transmission | Object travels along path, endpoints react |
| Transformation | State change | Object morphs, shakes, recolors |
| Reordering | Sorting/ranking | Elements physically swap positions |
| Zoom & Pan | System overview→detail | Camera moves through large canvas |
| Accumulation | Building structure | Pieces stack/connect with physics |
| Split & Merge | Decomposition/composition | Object breaks apart or combines |
| Chain Reaction | Cause and effect | Action triggers next action sequentially |
| Side-by-Side | Comparison | Two panels animate in parallel |
| Loop | Cyclic process | Elements cycle through states repeatedly |

Each pattern includes:
- Core animation principle
- One complete HTML+GSAP example (mixed tech: SVG/HTML/CSS as appropriate)
- Applicable scenarios
- Combination suggestions

## TTS Integration (scripts/tts.mjs)

- Provider: MiniMax TTS API
- Input: JSON script with per-scene narration text + language
- Output: MP3 files per scene + timing metadata JSON
- Environment: MINIMAX_API_KEY and MINIMAX_GROUP_ID from env vars
- Error handling: retry on transient failures, clear error message on auth failure

## Subtitle System (scripts/subtitles.mjs)

Subtitles are HyperFrames clip elements (not external SRT):

```html
<div class="clip subtitle" data-start="0" data-duration="3" data-track-index="10"
     style="position:absolute;bottom:80px;width:100%;text-align:center;">
  <span style="color:#f8fafc;font-size:28px;text-shadow:0 2px 8px rgba(0,0,0,0.8);">
    每次你在浏览器输入网址
  </span>
  <br/>
  <span style="color:#94a3b8;font-size:22px;">
    Every time you type a URL in your browser
  </span>
</div>
```

- Primary language: larger, white
- Secondary language: smaller, gray
- Positioned at bottom with text shadow for readability
- Timed to match TTS audio segments

## Shader Transitions (via HyperFrames)

Between scenes, use HyperFrames shader-transitions package:
- Agent selects transition type based on content rhythm
- Available: 3D, blur, cover, dissolve, distortion, grid, light, push, radial, scale, etc.
- Installed via `npx hyperframes add` from registry

## Output Structure

```
movorca-output/video/
├── index.html              # Final assembled composition
├── compositions/
│   ├── scene-01.html       # Individual scene compositions
│   ├── scene-02.html
│   └── ...
├── audio/
│   ├── scene-01.mp3        # TTS audio per scene
│   └── ...
├── subtitles/
│   ├── scene-01.html       # Subtitle fragments per scene
│   └── ...
├── meta.json
└── output.mp4              # Final rendered video
```

## Phase Plan

### Phase 1 — Core Pipeline (Current)
- Rewrite SKILL.md with full workflow
- Write animation-patterns.md (9 patterns)
- Implement scripts/tts.mjs (MiniMax)
- Implement scripts/subtitles.mjs
- Implement scripts/assemble.mjs
- Update hyperframes-contract.md (audio, subs, transitions)
- End-to-end test: one topic → MP4

### Phase 2 — Quality
- Shader transition integration
- Visual style system (color schemes, typography)
- More animation patterns and examples
- Subtitle styling refinement

### Phase 3 — Polish
- Background music support
- Multi-language TTS voice selection
- HyperFrames blocks integration (data charts, etc.)
- User-customizable styles

## Verification

1. Install plugin: `claude plugin update movorca`
2. New session: "做一个解释 DNS 的视频"
3. Agent should:
   - Present detailed script with per-scene narration + visual description
   - Allow chat-based modifications
   - After confirmation: generate animations, TTS, subtitles
   - Assemble and render MP4
4. Output MP4 should have:
   - Concept animations (objects moving/transforming, not text slides)
   - TTS narration in selected language
   - Bilingual subtitles
   - Smooth transitions between scenes
